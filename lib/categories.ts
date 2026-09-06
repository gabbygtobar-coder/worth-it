import type {
  AnalysisResult,
  CategoryConfig,
  CategoryId,
  BreakdownSegment,
  WhatIfScenario,
} from './types'
import {
  ASSUMPTIONS,
  annualizedCost,
  breakEvenMonths,
  clamp,
  depreciatedValue,
  monthlyLoanPayment,
  opportunityCost,
  totalLoanInterest,
  verdictFromScore,
  workHours,
} from './economics'

const COLORS = {
  base: 'var(--chart-1)',
  opportunity: 'var(--chart-3)',
  interest: 'var(--chart-4)',
  operating: 'var(--chart-2)',
  other: 'var(--chart-5)',
}

/** Coerce a raw form value to a number. */
function n(v: number | string | undefined): number {
  const parsed = typeof v === 'string' ? Number.parseFloat(v) : v ?? 0
  return Number.isFinite(parsed) ? (parsed as number) : 0
}

function s(v: number | string | undefined, fallback = ''): string {
  return v === undefined || v === '' ? fallback : String(v)
}

function seg(key: string, label: string, amount: number, color: string): BreakdownSegment {
  return { key, label, amount: Math.max(0, Math.round(amount)), color }
}

// ---------------------------------------------------------------------------
// PURCHASE
// ---------------------------------------------------------------------------
const purchase: CategoryConfig = {
  id: 'purchase',
  label: 'Purchase',
  tagline: 'Gadgets, gear, and one-off buys',
  icon: 'shopping-bag',
  question: 'Should I buy this?',
  steps: [
    { title: 'What are you buying?', description: 'The basics of the purchase.' },
    { title: 'How long will it last?', description: 'We spread the cost over its useful life.' },
    { title: 'Your money', description: 'So we can measure the real tradeoff.' },
  ],
  fields: [
    { id: 'item', label: 'Item', type: 'text', step: 1, group: 0, defaultValue: 'MacBook Air', placeholder: 'e.g. MacBook Air' },
    { id: 'price', label: 'Price', type: 'currency', step: 50, group: 0, defaultValue: 1099 },
    {
      id: 'frequency', label: 'Payment', type: 'select', step: 1, group: 0, defaultValue: 'once',
      options: [
        { label: 'One-time', value: 'once' },
        { label: 'Monthly', value: 'monthly' },
        { label: 'Yearly', value: 'yearly' },
      ],
    },
    { id: 'usefulLife', label: 'Expected useful life', type: 'number', step: 1, group: 1, defaultValue: 4, suffix: 'years', help: 'How long before you replace it?' },
    { id: 'hourlyIncome', label: 'Your hourly income', type: 'currency', step: 1, group: 2, defaultValue: 28 },
    { id: 'currentSavings', label: 'Current savings', type: 'currency', step: 100, group: 2, defaultValue: 6500 },
    { id: 'alternative', label: 'Cheaper alternative', type: 'currency', step: 50, group: 2, defaultValue: 749, optional: true, help: 'Optional: a comparable cheaper option.' },
  ],
  buildTitle: (v) => `Should I buy this ${s(v.item, 'item')}?`,
  analyze: (v) => {
    const price = n(v.price)
    const life = Math.max(1, n(v.usefulLife))
    const hourly = n(v.hourlyIncome)
    const savings = n(v.currentSavings)
    const freq = s(v.frequency, 'once')
    const periods = freq === 'monthly' ? 12 * life : freq === 'yearly' ? life : 1
    const totalSpend = price * periods
    const oc = opportunityCost(totalSpend, freq === 'once' ? life : life / 2)
    const trueCost = totalSpend + oc
    const hrs = workHours(totalSpend, hourly)
    const annual = annualizedCost(trueCost, life)

    const savingsImpact = savings > 0 ? clamp(totalSpend / savings) : 1
    const timeImpact = clamp(hrs / 120)
    const strain = clamp(0.6 * savingsImpact + 0.4 * timeImpact)
    const verdict = verdictFromScore(strain)

    const breakdown = [
      seg('base', freq === 'once' ? 'Purchase price' : 'Total payments', totalSpend, COLORS.base),
      seg('opportunity', 'Opportunity cost', oc, COLORS.opportunity),
    ]

    const insights = [
      `Paying for this costs about ${Math.round(hrs)} hours of your working time.`,
      `Invested instead, ${fmt(totalSpend)} could grow to ${fmt(totalSpend + oc)} over ${life} years at ${pct(ASSUMPTIONS.investmentReturn)}.`,
      savingsImpact > 0.5
        ? `This uses roughly ${Math.round(savingsImpact * 100)}% of your current savings, a meaningful dent.`
        : `This is a comfortable share of your savings (${Math.round(savingsImpact * 100)}%).`,
    ]

    const whatIfs: WhatIfScenario[] = []
    const waitOc = opportunityCost(totalSpend, life + 0.25)
    whatIfs.push(makeWhatIf('wait', 'Wait 3 months', 'Delay and let the money keep earning first.', totalSpend + waitOc, trueCost, strain - 0.05))
    if (n(v.alternative) > 0) {
      const alt = n(v.alternative)
      const altOc = opportunityCost(alt, life)
      whatIfs.push(makeWhatIf('alt', 'Cheaper alternative', `Choose the ${fmt(alt)} option instead.`, alt + altOc, trueCost, strain - 0.2 * (1 - alt / price)))
    }
    const used = totalSpend * 0.7
    whatIfs.push(makeWhatIf('used', 'Buy used / refurbished', 'Assume ~30% off buying pre-owned.', used + opportunityCost(used, life), trueCost, strain - 0.18))

    return result({
      title: purchase.buildTitle(v),
      categoryId: 'purchase',
      trueCost,
      facePrice: totalSpend,
      costLabel: 'True cost',
      metrics: [
        { label: 'Purchase price', value: fmt(totalSpend) },
        { label: 'Opportunity cost', value: fmt(oc), hint: `${pct(ASSUMPTIONS.investmentReturn)} return over ${life}y` },
        { label: 'Work time', value: `${Math.round(hrs)} hrs` },
        { label: 'Annualized cost', value: fmt(annual), hint: 'per year of use' },
      ],
      breakdown,
      verdict,
      verdictReason:
        verdict === 'worth'
          ? 'This is well within your means and the opportunity cost is modest relative to the value you get.'
          : verdict === 'consider'
            ? 'This purchase is affordable, but the opportunity cost is significant compared with your savings goals.'
            : 'This would take a large bite out of your savings and carries a heavy opportunity cost.',
      insights,
      whatIfs,
    })
  },
}

// ---------------------------------------------------------------------------
// CAR
// ---------------------------------------------------------------------------
const car: CategoryConfig = {
  id: 'car',
  label: 'Car',
  tagline: 'Buying or financing a vehicle',
  icon: 'car',
  question: 'Should I buy this car?',
  steps: [
    { title: 'The vehicle', description: 'Price and financing.' },
    { title: 'Owning it', description: 'Running costs and how long you\'ll keep it.' },
    { title: 'Your money', description: 'Your wage powers the time cost.' },
  ],
  fields: [
    { id: 'item', label: 'Vehicle', type: 'text', step: 1, group: 0, defaultValue: 'Used Honda Civic', placeholder: 'e.g. 2020 Honda Civic' },
    { id: 'price', label: 'Sticker price', type: 'currency', step: 500, group: 0, defaultValue: 25000 },
    { id: 'down', label: 'Down payment', type: 'currency', step: 500, group: 0, defaultValue: 4000 },
    { id: 'rate', label: 'Loan APR', type: 'percent', step: 0.5, group: 0, defaultValue: 7, suffix: '%' },
    { id: 'term', label: 'Loan term', type: 'number', step: 6, group: 0, defaultValue: 60, suffix: 'months' },
    { id: 'depreciation', label: 'Annual depreciation', type: 'percent', step: 1, group: 1, defaultValue: 15, suffix: '%', help: 'New cars lose ~15–20% a year.' },
    { id: 'operatingMonthly', label: 'Insurance, fuel & upkeep', type: 'currency', step: 25, group: 1, defaultValue: 340, suffix: '/mo' },
    { id: 'ownYears', label: 'Years you\'ll own it', type: 'number', step: 1, group: 1, defaultValue: 5, suffix: 'years' },
    { id: 'hourlyIncome', label: 'Your hourly income', type: 'currency', step: 1, group: 2, defaultValue: 32 },
  ],
  buildTitle: (v) => `Should I buy this ${s(v.item, 'car')}?`,
  analyze: (v) => {
    const price = n(v.price)
    const down = Math.min(n(v.down), price)
    const rate = n(v.rate) / 100
    const term = Math.max(1, n(v.term))
    const dep = n(v.depreciation) / 100
    const opMonthly = n(v.operatingMonthly)
    const years = Math.max(1, n(v.ownYears))
    const hourly = n(v.hourlyIncome)

    const loan = Math.max(0, price - down)
    const monthsFinanced = Math.min(term, years * 12)
    const interest = totalLoanInterest(loan, rate, term) * (monthsFinanced / term)
    const operating = opMonthly * 12 * years
    const residual = depreciatedValue(price, dep, years)
    const depreciation = price - residual
    const oc = opportunityCost(down, years)

    // True cost = money gone by the end: depreciation + interest + operating + opportunity of down payment.
    const trueCost = depreciation + interest + operating + oc
    const hrs = workHours(price + interest, hourly)

    const strain = clamp(0.5 * clamp(trueCost / (price * 1.4)) + 0.3 * clamp(depreciation / price) + 0.2 * clamp(operating / (price)))
    const verdict = verdictFromScore(strain)

    return result({
      title: car.buildTitle(v),
      categoryId: 'car',
      trueCost,
      facePrice: price,
      costLabel: `True ${years}-year cost`,
      metrics: [
        { label: 'Depreciation', value: fmt(depreciation), hint: `worth ${fmt(residual)} after ${years}y` },
        { label: 'Financing interest', value: fmt(interest), hint: `${pct(rate)} APR` },
        { label: 'Running costs', value: fmt(operating), hint: `${fmt(opMonthly)}/mo` },
        { label: 'Opportunity cost', value: fmt(oc), hint: 'on your down payment' },
      ],
      breakdown: [
        seg('base', 'Depreciation', depreciation, COLORS.base),
        seg('operating', 'Running costs', operating, COLORS.operating),
        seg('interest', 'Interest', interest, COLORS.interest),
        seg('opportunity', 'Opportunity cost', oc, COLORS.opportunity),
      ],
      verdict,
      verdictReason:
        verdict === 'worth'
          ? 'The all-in cost of ownership is reasonable relative to the price and your income.'
          : verdict === 'consider'
            ? 'Depreciation and running costs add up. Make sure the convenience is worth the ongoing drain.'
            : 'This vehicle loses value fast and the total cost of ownership far exceeds the sticker price.',
      insights: [
        `The real cost of ownership is ${fmt(trueCost)}, about ${Math.round((trueCost / price) * 100)}% of the sticker price.`,
        `You'll lose ${fmt(depreciation)} to depreciation alone over ${years} years.`,
        `Between the price and interest, that's roughly ${Math.round(hrs)} hours of work.`,
      ],
      whatIfs: [
        makeWhatIf('bigger-down', 'Double the down payment', 'Finance less, pay less interest.', trueCost - interest * 0.4 + opportunityCost(down, years), trueCost, strain - 0.06),
        makeWhatIf('keep-longer', 'Keep it 8 years', 'Stretch depreciation over more time.', (price - depreciatedValue(price, dep, 8)) + opMonthly * 12 * 8 + interest + oc, trueCost, strain - 0.1),
        makeWhatIf('buy-cheaper', 'Buy 30% cheaper', 'A more modest vehicle.', trueCost * 0.68, trueCost, strain - 0.22),
      ],
    })
  },
}

// ---------------------------------------------------------------------------
// HOUSING
// ---------------------------------------------------------------------------
const housing: CategoryConfig = {
  id: 'housing',
  label: 'Housing',
  tagline: 'Renting an apartment or room',
  icon: 'home',
  question: 'Can I afford this apartment?',
  steps: [
    { title: 'The place', description: 'Monthly rent and move-in costs.' },
    { title: 'Your income', description: 'The 30% rule benchmark.' },
  ],
  fields: [
    { id: 'item', label: 'Place', type: 'text', step: 1, group: 0, defaultValue: 'Downtown 1-bedroom', placeholder: 'e.g. 1BR near campus' },
    { id: 'rent', label: 'Monthly rent', type: 'currency', step: 50, group: 0, defaultValue: 1850 },
    { id: 'utilities', label: 'Utilities & fees', type: 'currency', step: 25, group: 0, defaultValue: 180, suffix: '/mo' },
    { id: 'upfront', label: 'Deposit & move-in', type: 'currency', step: 100, group: 0, defaultValue: 3700 },
    { id: 'leaseMonths', label: 'Lease length', type: 'number', step: 1, group: 0, defaultValue: 12, suffix: 'months' },
    { id: 'monthlyIncome', label: 'Gross monthly income', type: 'currency', step: 100, group: 1, defaultValue: 4200 },
  ],
  buildTitle: (v) => `Can I afford ${s(v.item, 'this place')}?`,
  analyze: (v) => {
    const rent = n(v.rent)
    const utilities = n(v.utilities)
    const upfront = n(v.upfront)
    const lease = Math.max(1, n(v.leaseMonths))
    const income = Math.max(1, n(v.monthlyIncome))

    const monthlyTotal = rent + utilities
    const rentToIncome = monthlyTotal / income
    const leaseTotal = monthlyTotal * lease + upfront
    const oc = opportunityCost(upfront, lease / 12)
    const trueCost = leaseTotal + oc

    const strain = clamp((rentToIncome - 0.2) / 0.35)
    const verdict = verdictFromScore(strain)

    return result({
      title: housing.buildTitle(v),
      categoryId: 'housing',
      trueCost,
      facePrice: leaseTotal,
      costLabel: `Full lease cost (${lease}mo)`,
      metrics: [
        { label: 'Rent-to-income', value: pct(rentToIncome), hint: 'aim for under 30%', emphasis: true },
        { label: 'All-in monthly', value: fmt(monthlyTotal) },
        { label: 'Move-in cost', value: fmt(upfront) },
        { label: 'Opportunity cost', value: fmt(oc), hint: 'on your deposit' },
      ],
      breakdown: [
        seg('base', 'Rent', rent * lease, COLORS.base),
        seg('operating', 'Utilities & fees', utilities * lease, COLORS.operating),
        seg('other', 'Move-in cost', upfront, COLORS.other),
        seg('opportunity', 'Opportunity cost', oc, COLORS.opportunity),
      ],
      verdict,
      verdictReason:
        verdict === 'worth'
          ? `At ${pct(rentToIncome)} of your income, this is comfortably within the healthy range.`
          : verdict === 'consider'
            ? `At ${pct(rentToIncome)} of income you're above the 30% guideline. Doable, but it will squeeze other goals.`
            : `At ${pct(rentToIncome)} of income this is well beyond the 30% rule and will strain your budget.`,
      insights: [
        `Financial guidelines suggest keeping housing under 30% of gross income. You're at ${pct(rentToIncome)}.`,
        `Over the ${lease}-month lease you'll pay ${fmt(monthlyTotal * lease)} in rent and utilities.`,
        `Your ${fmt(upfront)} deposit is money that can't earn for you while it's tied up.`,
      ],
      whatIfs: [
        makeWhatIf('roommate', 'Get a roommate', 'Split rent and utilities in half.', (monthlyTotal / 2) * lease + upfront / 2 + opportunityCost(upfront / 2, lease / 12), trueCost, (monthlyTotal / 2 / income - 0.2) / 0.35),
        makeWhatIf('cheaper', 'Spend 15% less', 'A slightly smaller or farther place.', monthlyTotal * 0.85 * lease + upfront * 0.85 + opportunityCost(upfront * 0.85, lease / 12), trueCost, (monthlyTotal * 0.85 / income - 0.2) / 0.35),
      ],
    })
  },
}

// ---------------------------------------------------------------------------
// DEBT
// ---------------------------------------------------------------------------
const debt: CategoryConfig = {
  id: 'debt',
  label: 'Debt',
  tagline: 'Pay it off or invest instead?',
  icon: 'credit-card',
  question: 'Should I pay off my debt?',
  steps: [
    { title: 'The debt', description: 'Balance and interest rate.' },
    { title: 'Your options', description: 'Cash available and current payments.' },
  ],
  fields: [
    { id: 'item', label: 'Debt', type: 'text', step: 1, group: 0, defaultValue: 'Credit card', placeholder: 'e.g. Student loan' },
    { id: 'balance', label: 'Balance', type: 'currency', step: 100, group: 0, defaultValue: 5200 },
    { id: 'apr', label: 'Interest rate (APR)', type: 'percent', step: 0.5, group: 0, defaultValue: 22, suffix: '%' },
    { id: 'availableCash', label: 'Cash you could use', type: 'currency', step: 100, group: 1, defaultValue: 5200 },
    { id: 'minPayment', label: 'Minimum monthly payment', type: 'currency', step: 10, group: 1, defaultValue: 130 },
  ],
  buildTitle: (v) => `Should I pay off my ${s(v.item, 'debt').toLowerCase()}?`,
  analyze: (v) => {
    const balance = n(v.balance)
    const apr = n(v.apr) / 100
    const cash = Math.min(n(v.availableCash), balance)
    const minPay = Math.max(1, n(v.minPayment))

    // Interest if you keep paying only the minimum.
    const months = Math.min(600, estimatePayoffMonths(balance, apr, minPay))
    const interestIfMinimum = Math.max(0, minPay * months - balance)
    // Guaranteed "return" from paying off = the APR you stop paying.
    const investAlt = opportunityCost(cash, 1) // 1-year comparison of investing the cash
    const debtCostOneYear = cash * apr

    const trueCost = interestIfMinimum
    const strain = clamp(1 - (apr - ASSUMPTIONS.investmentReturn) / 0.15)
    const verdict = verdictFromScore(strain)

    return result({
      title: debt.buildTitle(v),
      categoryId: 'debt',
      trueCost,
      facePrice: balance,
      costLabel: 'Interest if you wait',
      metrics: [
        { label: 'Guaranteed return', value: pct(apr), hint: 'by paying it off', emphasis: true },
        { label: 'Interest (minimums only)', value: fmt(interestIfMinimum) },
        { label: 'Payoff time', value: `${Math.round(months)} mo`, hint: 'at minimum payments' },
        { label: 'If invested instead', value: fmt(investAlt), hint: `${pct(ASSUMPTIONS.investmentReturn)} for 1y` },
      ],
      breakdown: [
        seg('base', 'Principal', balance, COLORS.base),
        seg('interest', 'Interest avoided', interestIfMinimum, COLORS.interest),
      ],
      verdict,
      verdictReason:
        verdict === 'worth'
          ? `Paying this off is a guaranteed ${pct(apr)} return, far better than the ${pct(ASSUMPTIONS.investmentReturn)} you'd expect from investing.`
          : verdict === 'consider'
            ? `At ${pct(apr)}, paying down is close to what you'd earn investing. Either is defensible, so favor the debt for the certainty.`
            : `At ${pct(apr)} this debt is cheap. Investing the cash is likely to come out ahead over time.`,
      insights: [
        `Every dollar toward this debt "earns" a guaranteed ${pct(apr)}. Investing has no such guarantee.`,
        `Paying minimums only, you'd hand over ${fmt(interestIfMinimum)} in interest over ${Math.round(months)} months.`,
        `Paying it off frees up ${fmt(minPay)} a month for future goals.`,
      ],
      whatIfs: [
        makeWhatIf('half', 'Pay half now', 'Knock down the balance, invest the rest.', interestIfMinimum * 0.5, trueCost, strain + 0.05),
        makeWhatIf('invest', 'Invest it all instead', `Put the ${fmt(cash)} in an index fund.`, interestIfMinimum + debtCostOneYear - investAlt, trueCost, strain + 0.2),
      ],
    })
  },
}

// ---------------------------------------------------------------------------
// JOB
// ---------------------------------------------------------------------------
const job: CategoryConfig = {
  id: 'job',
  label: 'Job',
  tagline: 'Compare two offers honestly',
  icon: 'briefcase',
  question: 'Is this job actually better?',
  steps: [
    { title: 'The pay', description: 'Salaries and benefits.' },
    { title: 'The real hours', description: 'Commute changes your effective wage.' },
  ],
  fields: [
    { id: 'item', label: 'New role', type: 'text', step: 1, group: 0, defaultValue: 'Product Analyst', placeholder: 'e.g. Product Analyst' },
    { id: 'newSalary', label: 'New salary', type: 'currency', step: 1000, group: 0, defaultValue: 78000 },
    { id: 'currentSalary', label: 'Current salary', type: 'currency', step: 1000, group: 0, defaultValue: 68000 },
    { id: 'newBenefits', label: 'New benefits value', type: 'currency', step: 500, group: 0, defaultValue: 8000, suffix: '/yr' },
    { id: 'currentBenefits', label: 'Current benefits value', type: 'currency', step: 500, group: 0, defaultValue: 11000, suffix: '/yr' },
    { id: 'newCommute', label: 'New weekly commute', type: 'hours', step: 1, group: 1, defaultValue: 8, suffix: 'hrs/wk' },
    { id: 'currentCommute', label: 'Current weekly commute', type: 'hours', step: 1, group: 1, defaultValue: 2, suffix: 'hrs/wk' },
    { id: 'relocation', label: 'Relocation / switching cost', type: 'currency', step: 250, group: 1, defaultValue: 3000, optional: true },
  ],
  buildTitle: (v) => `Is the ${s(v.item, 'new job')} actually better?`,
  analyze: (v) => {
    const newSalary = n(v.newSalary)
    const currentSalary = n(v.currentSalary)
    const newBen = n(v.newBenefits)
    const curBen = n(v.currentBenefits)
    const newCommute = n(v.newCommute)
    const curCommute = n(v.currentCommute)
    const relocation = n(v.relocation)

    const workHrs = 2080
    const newHours = workHrs + newCommute * 50
    const curHours = workHrs + curCommute * 50
    const newComp = newSalary + newBen
    const curComp = currentSalary + curBen
    const newEffective = newComp / newHours
    const curEffective = curComp / curHours

    const annualGain = newComp - curComp - relocation / 3 // amortize switching cost over 3 years
    const trueCost = Math.abs(annualGain)

    const effGain = (newEffective - curEffective) / curEffective
    const strain = clamp(0.5 - effGain * 2)
    const verdict = verdictFromScore(strain)

    return result({
      title: job.buildTitle(v),
      categoryId: 'job',
      trueCost,
      facePrice: newSalary - currentSalary,
      costLabel: annualGain >= 0 ? 'Real annual gain' : 'Real annual loss',
      metrics: [
        { label: 'New effective wage', value: `${fmt(newEffective)}/hr`, emphasis: true, hint: 'after commute' },
        { label: 'Current effective wage', value: `${fmt(curEffective)}/hr` },
        { label: 'Total comp change', value: fmt(newComp - curComp) },
        { label: 'Added commute', value: `${Math.round((newCommute - curCommute) * 50)} hrs/yr` },
      ],
      breakdown: [
        seg('base', 'Salary increase', Math.max(0, newSalary - currentSalary), COLORS.base),
        seg('operating', 'Benefits change', Math.max(0, newBen - curBen), COLORS.operating),
        seg('opportunity', 'Extra commute (time value)', Math.max(0, (newCommute - curCommute) * 50 * curEffective), COLORS.opportunity),
        seg('other', 'Switching cost', relocation, COLORS.other),
      ],
      verdict,
      verdictReason:
        verdict === 'worth'
          ? `Even after the longer commute, your effective wage rises to ${fmt(newEffective)}/hr. This is a real upgrade.`
          : verdict === 'consider'
            ? `The raise is real but a longer commute and weaker benefits eat into it. Your effective wage barely moves.`
            : `Once you count the extra commute and lost benefits, your effective hourly pay actually drops.`,
      insights: [
        `Your time matters: the new role adds ${Math.round((newCommute - curCommute) * 50)} commuting hours a year.`,
        `On an effective-wage basis you go from ${fmt(curEffective)}/hr to ${fmt(newEffective)}/hr.`,
        curBen > newBen
          ? `Watch the benefits: you'd give up ${fmt(curBen - newBen)}/yr in non-salary value.`
          : `Better benefits add ${fmt(newBen - curBen)}/yr of hidden value.`,
      ],
      whatIfs: [
        makeWhatIf('remote', 'Negotiate remote days', 'Cut the new commute in half.', Math.abs(newComp - curComp - relocation / 3), trueCost, strain - 0.15),
        makeWhatIf('counter', 'Counter for +$6k', 'Push the new salary higher.', Math.abs(newComp + 6000 - curComp - relocation / 3), trueCost, strain - 0.2),
      ],
    })
  },
}

// ---------------------------------------------------------------------------
// COLLEGE
// ---------------------------------------------------------------------------
const college: CategoryConfig = {
  id: 'college',
  label: 'College',
  tagline: 'Degrees, bootcamps & certs',
  icon: 'graduation-cap',
  question: 'Is this program worth it?',
  steps: [
    { title: 'The program', description: 'Net cost and length.' },
    { title: 'The payoff', description: 'Expected earnings boost.' },
  ],
  fields: [
    { id: 'item', label: 'Program', type: 'text', step: 1, group: 0, defaultValue: "Master's degree", placeholder: 'e.g. Coding bootcamp' },
    { id: 'cost', label: 'Total net cost', type: 'currency', step: 1000, group: 0, defaultValue: 42000, help: 'Tuition + living, minus aid.' },
    { id: 'years', label: 'Program length', type: 'number', step: 1, group: 0, defaultValue: 2, suffix: 'years' },
    { id: 'lostWages', label: 'Wages given up per year', type: 'currency', step: 1000, group: 0, defaultValue: 15000, optional: true, help: 'If you\'ll work less while studying.' },
    { id: 'salaryBump', label: 'Expected salary increase', type: 'currency', step: 1000, group: 1, defaultValue: 14000, suffix: '/yr' },
    { id: 'workingYears', label: 'Years you\'ll benefit', type: 'number', step: 1, group: 1, defaultValue: 20, suffix: 'years' },
  ],
  buildTitle: (v) => `Is the ${s(v.item, 'program')} worth it?`,
  analyze: (v) => {
    const cost = n(v.cost)
    const years = Math.max(0.5, n(v.years))
    const lostWages = n(v.lostWages) * years
    const bump = n(v.salaryBump)
    const workingYears = Math.max(1, n(v.workingYears))

    const totalInvestment = cost + lostWages
    const oc = opportunityCost(totalInvestment, workingYears / 2)
    const trueCost = totalInvestment + oc
    // Discount future salary bumps modestly.
    const grossReturn = bump * workingYears
    const paybackYears = bump > 0 ? totalInvestment / bump : Infinity
    const netReturn = grossReturn - totalInvestment

    const strain = clamp(paybackYears / 12)
    const verdict = verdictFromScore(strain)

    return result({
      title: college.buildTitle(v),
      categoryId: 'college',
      trueCost,
      facePrice: cost,
      costLabel: 'Total investment',
      metrics: [
        { label: 'Payback period', value: paybackYears === Infinity ? 'n/a' : `${paybackYears.toFixed(1)} yrs`, emphasis: true },
        { label: 'Lifetime salary gain', value: fmt(grossReturn), hint: `over ${workingYears}y` },
        { label: 'Wages given up', value: fmt(lostWages) },
        { label: 'Net lifetime return', value: fmt(netReturn) },
      ],
      breakdown: [
        seg('base', 'Tuition & living', cost, COLORS.base),
        seg('operating', 'Wages given up', lostWages, COLORS.operating),
        seg('opportunity', 'Opportunity cost', oc, COLORS.opportunity),
      ],
      verdict,
      verdictReason:
        verdict === 'worth'
          ? `You'd recoup the cost in about ${paybackYears.toFixed(1)} years, then earn ${fmt(bump)}/yr on top for decades.`
          : verdict === 'consider'
            ? `The payoff is real but slow, roughly ${paybackYears.toFixed(1)} years to break even. Make sure the salary bump is reliable.`
            : `The break-even is long (${paybackYears.toFixed(1)} years). The numbers only work if the salary increase is larger or the cost lower.`,
      insights: [
        `Counting wages you'd give up, the true investment is ${fmt(totalInvestment)}, not just tuition.`,
        `A ${fmt(bump)}/yr raise over ${workingYears} years is ${fmt(grossReturn)} before discounting.`,
        `Break-even lands around year ${Math.ceil(paybackYears)}.`,
      ],
      whatIfs: [
        makeWhatIf('scholarship', 'Land 30% in aid', 'Cut net tuition by a third.', (cost * 0.7 + lostWages) + opportunityCost(cost * 0.7 + lostWages, workingYears / 2), trueCost, (((cost * 0.7 + lostWages) / bump)) / 12),
        makeWhatIf('parttime', 'Study part-time', 'Keep working, no lost wages.', cost + opportunityCost(cost, workingYears / 2), trueCost, ((cost / bump)) / 12),
      ],
    })
  },
}

// ---------------------------------------------------------------------------
// SUBSCRIPTION
// ---------------------------------------------------------------------------
const subscription: CategoryConfig = {
  id: 'subscription',
  label: 'Subscription',
  tagline: 'Streaming, apps & memberships',
  icon: 'repeat',
  question: 'Is this subscription worth it?',
  steps: [
    { title: 'The plan', description: 'What it costs and how you use it.' },
    { title: 'The math', description: 'How long you\'ll keep it.' },
  ],
  fields: [
    { id: 'item', label: 'Subscription', type: 'text', step: 1, group: 0, defaultValue: 'Streaming bundle', placeholder: 'e.g. Gym membership' },
    { id: 'monthly', label: 'Monthly cost', type: 'currency', step: 1, group: 0, defaultValue: 24 },
    { id: 'usesPerMonth', label: 'Times used per month', type: 'number', step: 1, group: 0, defaultValue: 4 },
    { id: 'perUseAlternative', label: 'Pay-per-use price', type: 'currency', step: 1, group: 0, defaultValue: 12, optional: true, help: 'Cost to pay à la carte instead.' },
    { id: 'keepYears', label: 'Years you\'ll keep it', type: 'number', step: 1, group: 1, defaultValue: 3, suffix: 'years' },
  ],
  buildTitle: (v) => `Is ${s(v.item, 'this subscription')} worth it?`,
  analyze: (v) => {
    const monthly = n(v.monthly)
    const uses = Math.max(0, n(v.usesPerMonth))
    const alt = n(v.perUseAlternative)
    const years = Math.max(1, n(v.keepYears))

    const annual = monthly * 12
    const total = annual * years
    const oc = opportunityCost(total, years / 2)
    const trueCost = total + oc
    const costPerUse = uses > 0 ? monthly / uses : monthly
    const altMonthly = alt * uses

    let strain: number
    if (alt > 0) strain = clamp(0.5 + (costPerUse - alt) / (alt * 2 || 1))
    else strain = clamp(1 - uses / 8)
    const verdict = verdictFromScore(strain)

    return result({
      title: subscription.buildTitle(v),
      categoryId: 'subscription',
      trueCost,
      facePrice: total,
      costLabel: `True ${years}-year cost`,
      metrics: [
        { label: 'Cost per use', value: fmt(costPerUse), emphasis: true, hint: `${uses} uses/mo` },
        { label: 'Annual cost', value: fmt(annual) },
        { label: `${years}-year total`, value: fmt(total) },
        { label: 'Opportunity cost', value: fmt(oc), hint: 'if invested instead' },
      ],
      breakdown: [
        seg('base', `Payments (${years}y)`, total, COLORS.base),
        seg('opportunity', 'Opportunity cost', oc, COLORS.opportunity),
      ],
      verdict,
      verdictReason:
        verdict === 'worth'
          ? `At ${fmt(costPerUse)} per use you're getting clear value from how often you use it.`
          : verdict === 'consider'
            ? `At ${fmt(costPerUse)} per use it's borderline. If usage drops, this becomes dead weight.`
            : alt > 0
              ? `At ${fmt(costPerUse)} per use you'd save by paying the ${fmt(alt)} à la carte price instead.`
              : `You barely use this. At ${fmt(costPerUse)} per use it's hard to justify.`,
      insights: [
        `Small recurring costs compound: ${fmt(monthly)}/mo is ${fmt(total)} over ${years} years.`,
        alt > 0
          ? `Paying per use (${fmt(alt)}) would run about ${fmt(altMonthly)}/mo at your usage.`
          : `You'd need to use it about ${Math.ceil(monthly / (alt || 6))} times a month to feel like a deal.`,
        `Invested instead, those payments could be worth ${fmt(trueCost)}.`,
      ],
      whatIfs: [
        makeWhatIf('annual', 'Switch to annual plan', 'Assume ~2 months free.', (annual * 0.83 * years) + opportunityCost(annual * 0.83 * years, years / 2), trueCost, strain - 0.08),
        makeWhatIf('cancel', 'Cancel & pay per use', alt > 0 ? `Pay ${fmt(alt)} only when you use it.` : 'Drop it entirely.', alt > 0 ? altMonthly * 12 * years : 0, trueCost, strain - 0.25),
      ],
    })
  },
}

// ---------------------------------------------------------------------------
// TRANSPORTATION
// ---------------------------------------------------------------------------
const transportation: CategoryConfig = {
  id: 'transportation',
  label: 'Transportation',
  tagline: 'Commute & getting-around costs',
  icon: 'bus',
  question: 'What\'s the smarter way to get around?',
  steps: [
    { title: 'Today', description: 'What you spend now.' },
    { title: 'The alternative', description: 'Cost and time of switching.' },
  ],
  fields: [
    { id: 'item', label: 'Current option', type: 'text', step: 1, group: 0, defaultValue: 'Driving to campus', placeholder: 'e.g. Daily rideshare' },
    { id: 'currentMonthly', label: 'Current monthly cost', type: 'currency', step: 10, group: 0, defaultValue: 420 },
    { id: 'altMonthly', label: 'Alternative monthly cost', type: 'currency', step: 10, group: 1, defaultValue: 96, help: 'e.g. a transit pass.' },
    { id: 'extraHoursWeekly', label: 'Extra time per week', type: 'hours', step: 0.5, group: 1, defaultValue: 3, suffix: 'hrs/wk' },
    { id: 'hourlyIncome', label: 'Your hourly income', type: 'currency', step: 1, group: 1, defaultValue: 24 },
    { id: 'years', label: 'Time horizon', type: 'number', step: 1, group: 1, defaultValue: 3, suffix: 'years' },
  ],
  buildTitle: (v) => `A smarter way than ${s(v.item, 'this commute').toLowerCase()}?`,
  analyze: (v) => {
    const current = n(v.currentMonthly)
    const altMonthly = n(v.altMonthly)
    const extraHours = n(v.extraHoursWeekly)
    const hourly = n(v.hourlyIncome)
    const years = Math.max(1, n(v.years))

    const cashSavings = (current - altMonthly) * 12 * years
    const timeCost = extraHours * 50 * years * hourly
    const netSavings = cashSavings - timeCost
    const oc = opportunityCost(Math.max(0, cashSavings), years / 2)
    const trueCost = current * 12 * years // true cost of the CURRENT option over the horizon

    // Worth = switching is a good idea.
    const strain = clamp(0.5 - netSavings / (Math.abs(cashSavings) + 1))
    const verdict = verdictFromScore(strain)

    return result({
      title: transportation.buildTitle(v),
      categoryId: 'transportation',
      trueCost,
      facePrice: current * 12,
      costLabel: `Current cost (${years}y)`,
      metrics: [
        { label: 'Cash saved by switching', value: fmt(cashSavings), emphasis: true },
        { label: 'Value of added time', value: fmt(timeCost), hint: `${extraHours} hrs/wk` },
        { label: 'Net benefit', value: fmt(netSavings) },
        { label: 'Plus growth if invested', value: fmt(oc) },
      ],
      breakdown: [
        seg('base', 'Current spend', current * 12 * years, COLORS.base),
        seg('operating', 'Alternative spend', altMonthly * 12 * years, COLORS.operating),
        seg('opportunity', 'Time cost of switching', timeCost, COLORS.opportunity),
      ],
      verdict,
      verdictReason:
        verdict === 'worth'
          ? `Switching saves ${fmt(cashSavings)} over ${years} years, well worth the extra ${extraHours} hrs/week.`
          : verdict === 'consider'
            ? `The cash savings (${fmt(cashSavings)}) and your time cost (${fmt(timeCost)}) roughly cancel out. It's a lifestyle call.`
            : `The extra time isn't worth it. The ${fmt(timeCost)} value of your hours outweighs the ${fmt(cashSavings)} you'd save.`,
      insights: [
        `Your current option costs ${fmt(current * 12)} a year, or ${fmt(current * 12 * years)} over ${years} years.`,
        `The alternative adds ${extraHours} hrs/week; at ${fmt(hourly)}/hr that's ${fmt(timeCost)} of your time.`,
        netSavings > 0
          ? `Even valuing your time, switching nets ${fmt(netSavings)}.`
          : `Once you value your time, the "cheaper" option actually costs you ${fmt(-netSavings)}.`,
      ],
      whatIfs: [
        makeWhatIf('hybrid', 'Do a hybrid mix', 'Alternative 3 days, current 2.', (current * 0.4 + altMonthly * 0.6) * 12 * years, trueCost, strain - 0.05),
        makeWhatIf('invest', 'Invest the savings', 'Bank the difference every month.', trueCost - cashSavings - oc, trueCost, strain - 0.15),
      ],
    })
  },
}

// ---------------------------------------------------------------------------
// INVESTING
// ---------------------------------------------------------------------------
const investing: CategoryConfig = {
  id: 'investing',
  label: 'Investing',
  tagline: 'See compounding work for you',
  icon: 'trending-up',
  question: 'What could investing this become?',
  steps: [
    { title: 'Your plan', description: 'What you\'ll put in.' },
    { title: 'The horizon', description: 'Time and expected return.' },
  ],
  fields: [
    { id: 'item', label: 'Goal', type: 'text', step: 1, group: 0, defaultValue: 'Index fund', placeholder: 'e.g. Retirement fund' },
    { id: 'initial', label: 'Starting amount', type: 'currency', step: 100, group: 0, defaultValue: 1000, optional: true },
    { id: 'monthly', label: 'Monthly contribution', type: 'currency', step: 25, group: 0, defaultValue: 250 },
    { id: 'years', label: 'Years invested', type: 'number', step: 1, group: 1, defaultValue: 25, suffix: 'years' },
    { id: 'annualReturn', label: 'Expected annual return', type: 'percent', step: 0.5, group: 1, defaultValue: 7, suffix: '%' },
  ],
  buildTitle: (v) => `What could my ${s(v.item, 'investment').toLowerCase()} become?`,
  analyze: (v) => {
    const initial = n(v.initial)
    const monthly = n(v.monthly)
    const years = Math.max(1, n(v.years))
    const rate = n(v.annualReturn) / 100

    const months = years * 12
    const r = rate / 12
    const fvInitial = initial * Math.pow(1 + r, months)
    const fvContrib = r === 0 ? monthly * months : monthly * ((Math.pow(1 + r, months) - 1) / r)
    const futureVal = fvInitial + fvContrib
    const contributed = initial + monthly * months
    const growth = futureVal - contributed

    // Investing is (almost always) worth it; strain reflects how much compounding does the work.
    const strain = clamp(0.34 - (growth / futureVal - 0.3))
    const verdict = verdictFromScore(strain)

    return result({
      title: investing.buildTitle(v),
      categoryId: 'investing',
      trueCost: futureVal,
      facePrice: contributed,
      costLabel: 'Projected value',
      metrics: [
        { label: 'You contribute', value: fmt(contributed), emphasis: true },
        { label: 'Growth from compounding', value: fmt(growth) },
        { label: 'Final value', value: fmt(futureVal) },
        { label: 'Growth multiple', value: `${(futureVal / (contributed || 1)).toFixed(1)}x` },
      ],
      breakdown: [
        seg('base', 'Your contributions', contributed, COLORS.base),
        seg('operating', 'Compound growth', growth, COLORS.operating),
      ],
      verdict,
      verdictReason:
        `Compounding turns ${fmt(contributed)} of contributions into ${fmt(futureVal)}. Of that, ${fmt(growth)} of that is growth you didn't work for.`,
      insights: [
        `At ${pct(rate)} for ${years} years, more than ${Math.round((growth / futureVal) * 100)}% of your ending balance is pure growth.`,
        `Every ${fmt(monthly)}/mo you add compounds, so starting earlier beats adding more later.`,
        `Waiting 5 years to start would cost you roughly ${fmt(futureVal - (fvInitial * Math.pow(1 + r, -60) + monthly * ((Math.pow(1 + r, months - 60) - 1) / (r || 1))))} in final value.`,
      ],
      whatIfs: [
        makeWhatIf('more', 'Add $100/mo more', 'Bump contributions up.', (fvInitial + (monthly + 100) * ((Math.pow(1 + r, months) - 1) / (r || 1))), futureVal, strain - 0.1),
        makeWhatIf('sooner', 'Start 5 years earlier', 'Give compounding more runway.', (initial * Math.pow(1 + r, months + 60) + monthly * ((Math.pow(1 + r, months + 60) - 1) / (r || 1))), futureVal, strain - 0.15),
      ],
    })
  },
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function fmt(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(Math.round(amount))
}

function pct(v: number): string {
  return `${(v * 100).toFixed(v * 100 % 1 === 0 ? 0 : 1)}%`
}

function estimatePayoffMonths(balance: number, apr: number, payment: number): number {
  const r = apr / 12
  let bal = balance
  let months = 0
  while (bal > 0 && months < 600) {
    bal = bal * (1 + r) - payment
    months++
  }
  return months
}

function makeWhatIf(
  id: string,
  label: string,
  description: string,
  trueCost: number,
  baseline: number,
  strain: number,
): WhatIfScenario {
  return {
    id,
    label,
    description,
    trueCost: Math.round(Math.max(0, trueCost)),
    delta: Math.round(trueCost - baseline),
    verdict: verdictFromScore(clamp(strain)),
  }
}

function result(r: AnalysisResult): AnalysisResult {
  return { ...r, trueCost: Math.round(r.trueCost), facePrice: Math.round(r.facePrice) }
}

export const CATEGORIES: CategoryConfig[] = [
  purchase,
  car,
  housing,
  debt,
  job,
  college,
  subscription,
  transportation,
  investing,
]

export const CATEGORY_MAP: Record<CategoryId, CategoryConfig> = Object.fromEntries(
  CATEGORIES.map((c) => [c.id, c]),
) as Record<CategoryId, CategoryConfig>

export function getCategory(id: string): CategoryConfig | undefined {
  return CATEGORY_MAP[id as CategoryId]
}
