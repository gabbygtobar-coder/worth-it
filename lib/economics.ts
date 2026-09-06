import type { Verdict } from './types'

/** Long-run assumptions used across the app. Kept in one place so they're easy to reason about. */
export const ASSUMPTIONS = {
  /** Expected annual real return of a diversified index fund. */
  investmentReturn: 0.07,
  /** Long-run average annual inflation. */
  inflation: 0.03,
}

/** Future value of a lump sum compounding annually. */
export function futureValue(principal: number, annualRate: number, years: number): number {
  return principal * Math.pow(1 + annualRate, years)
}

/**
 * Opportunity cost of spending money now instead of investing it.
 * Returns how much extra you'd have if the money kept compounding.
 */
export function opportunityCost(
  amount: number,
  years: number,
  annualRate = ASSUMPTIONS.investmentReturn,
): number {
  if (amount <= 0 || years <= 0) return 0
  return futureValue(amount, annualRate, years) - amount
}

/** Hours of work required to afford an amount at a given hourly wage. */
export function workHours(amount: number, hourlyIncome: number): number {
  if (hourlyIncome <= 0) return 0
  return amount / hourlyIncome
}

/** Straight-line annualized cost of something used over a number of years. */
export function annualizedCost(totalCost: number, usefulLifeYears: number): number {
  if (usefulLifeYears <= 0) return totalCost
  return totalCost / usefulLifeYears
}

/** Monthly payment for an amortizing loan. */
export function monthlyLoanPayment(
  principal: number,
  annualRate: number,
  termMonths: number,
): number {
  if (termMonths <= 0) return 0
  const r = annualRate / 12
  if (r === 0) return principal / termMonths
  return (principal * r) / (1 - Math.pow(1 + r, -termMonths))
}

/** Total interest paid over the life of a loan. */
export function totalLoanInterest(
  principal: number,
  annualRate: number,
  termMonths: number,
): number {
  return monthlyLoanPayment(principal, annualRate, termMonths) * termMonths - principal
}

/** Value remaining after declining-balance depreciation. */
export function depreciatedValue(
  initialValue: number,
  annualDepreciation: number,
  years: number,
): number {
  return initialValue * Math.pow(1 - annualDepreciation, years)
}

/** Months required to recover an upfront cost given a monthly benefit. */
export function breakEvenMonths(upfrontCost: number, monthlyBenefit: number): number {
  if (monthlyBenefit <= 0) return Infinity
  return upfrontCost / monthlyBenefit
}

/** Inflation-adjusted (today's dollars) value of a future amount. */
export function realValue(
  futureAmount: number,
  years: number,
  inflation = ASSUMPTIONS.inflation,
): number {
  return futureAmount / Math.pow(1 + inflation, years)
}

/**
 * Maps a normalized 0–1 "strain" score into a verdict.
 * Lower strain = more clearly worth it.
 */
export function verdictFromScore(score: number): Verdict {
  if (score <= 0.34) return 'worth'
  if (score <= 0.67) return 'consider'
  return 'avoid'
}

export function clamp(n: number, min = 0, max = 1): number {
  return Math.max(min, Math.min(max, n))
}
