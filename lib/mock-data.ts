import type { SavedDecision, UserProfile } from './types'

export const USER: UserProfile = {
  name: 'Gabby',
  economicScore: 82,
  monthlyIncome: 4200,
  monthlySpending: 3050,
  savingsRate: 0.27,
  netWorth: 18400,
  hourlyIncome: 28,
  currentSavings: 6500,
}

export const SAVED_DECISIONS: SavedDecision[] = [
  {
    id: 'd1',
    title: 'Should I buy this $25,000 car?',
    categoryId: 'car',
    date: '2026-08-11',
    trueCost: 34820,
    facePrice: 25000,
    verdict: 'avoid',
    summary: 'Depreciation and running costs push the true 5-year cost far past the sticker price.',
  },
  {
    id: 'd2',
    title: 'Should I buy this MacBook Air?',
    categoryId: 'purchase',
    date: '2026-08-09',
    trueCost: 1441,
    facePrice: 1099,
    verdict: 'consider',
    summary: 'Affordable, but the opportunity cost is meaningful against your emergency fund goal.',
  },
  {
    id: 'd3',
    title: 'Can I afford the downtown 1-bedroom?',
    categoryId: 'housing',
    date: '2026-08-05',
    trueCost: 27140,
    facePrice: 25980,
    verdict: 'consider',
    summary: 'At 48% of income this is above the 30% guideline. A roommate would fix it.',
  },
  {
    id: 'd4',
    title: 'Should I pay off my credit card?',
    categoryId: 'debt',
    date: '2026-07-29',
    trueCost: 2380,
    facePrice: 5200,
    verdict: 'worth',
    summary: 'A guaranteed 22% return by paying it off beats any expected market return.',
  },
  {
    id: 'd5',
    title: 'Is the streaming bundle worth it?',
    categoryId: 'subscription',
    date: '2026-07-22',
    trueCost: 979,
    facePrice: 864,
    verdict: 'consider',
    summary: 'At $6 per use it is borderline, so watch your actual usage.',
  },
  {
    id: 'd6',
    title: 'What could my index fund become?',
    categoryId: 'investing',
    date: '2026-07-15',
    trueCost: 203500,
    facePrice: 76000,
    verdict: 'worth',
    summary: 'Compounding turns $76k of contributions into more than $200k over 25 years.',
  },
]

/** Daily "economic activity" for the weekly summary chart. */
export const WEEKLY_ACTIVITY = [
  { day: 'Mon', spending: 42, saved: 18 },
  { day: 'Tue', spending: 28, saved: 32 },
  { day: 'Wed', spending: 96, saved: 12 },
  { day: 'Thu', spending: 34, saved: 26 },
  { day: 'Fri', spending: 71, saved: 40 },
  { day: 'Sat', spending: 120, saved: 55 },
  { day: 'Sun', spending: 22, saved: 30 },
]

export const BIGGEST_OPPORTUNITY = {
  title: 'Redirect your $24/mo streaming bundle',
  detail:
    'You use it about 4 times a month. Cancelling and investing that $24 instead could grow to roughly $4,150 over 10 years at 7%.',
  impact: 4150,
  action: 'Analyze this subscription',
}

export const DASHBOARD_STATS = [
  { key: 'income', label: 'Monthly income', value: USER.monthlyIncome, kind: 'currency' as const, delta: 0.04, deltaLabel: 'vs last month' },
  { key: 'spending', label: 'Monthly spending', value: USER.monthlySpending, kind: 'currency' as const, delta: -0.06, deltaLabel: 'vs last month' },
  { key: 'savings', label: 'Savings rate', value: USER.savingsRate, kind: 'percent' as const, delta: 0.03, deltaLabel: 'vs last month' },
  { key: 'networth', label: 'Net worth', value: USER.netWorth, kind: 'currency' as const, delta: 0.11, deltaLabel: 'this quarter' },
]
