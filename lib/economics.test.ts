import { describe, expect, it } from 'vitest'
import {
  ASSUMPTIONS,
  annualizedCost,
  breakEvenMonths,
  clamp,
  depreciatedValue,
  futureValue,
  monthlyLoanPayment,
  opportunityCost,
  payoffProjection,
  realValue,
  totalLoanInterest,
  verdictFromScore,
  workHours,
} from './economics'

describe('economics primitives', () => {
  it('compounds a lump sum with futureValue', () => {
    expect(futureValue(1000, 0.07, 0)).toBe(1000)
    expect(futureValue(1000, 0.07, 1)).toBeCloseTo(1070)
    expect(futureValue(1000, 0.07, 10)).toBeCloseTo(1000 * Math.pow(1.07, 10))
  })

  it('treats opportunityCost as growth minus principal, and zeros invalid inputs', () => {
    expect(opportunityCost(1000, 1, 0.07)).toBeCloseTo(70)
    expect(opportunityCost(1000, 10)).toBeCloseTo(futureValue(1000, ASSUMPTIONS.investmentReturn, 10) - 1000)
    expect(opportunityCost(0, 10)).toBe(0)
    expect(opportunityCost(-500, 10)).toBe(0)
    expect(opportunityCost(1000, 0)).toBe(0)
  })

  it('converts spend into work hours and returns 0 without a wage', () => {
    expect(workHours(280, 28)).toBe(10)
    expect(workHours(100, 0)).toBe(0)
    expect(workHours(100, -20)).toBe(0)
  })

  it('annualizes cost over useful life and returns the full amount when life is not positive', () => {
    expect(annualizedCost(1000, 4)).toBe(250)
    expect(annualizedCost(1000, 0)).toBe(1000)
    expect(annualizedCost(1000, -2)).toBe(1000)
  })

  it('computes an amortizing monthly loan payment, including a 0% rate', () => {
    const r = 0.06 / 12
    const expected = (10_000 * r) / (1 - Math.pow(1 + r, -12))
    expect(monthlyLoanPayment(10_000, 0.06, 12)).toBeCloseTo(expected)
    expect(monthlyLoanPayment(12_000, 0, 12)).toBe(1000)
    expect(monthlyLoanPayment(12_000, 0.06, 0)).toBe(0)
  })

  it('computes total interest as payments minus principal', () => {
    const principal = 10_000
    const payment = monthlyLoanPayment(principal, 0.06, 36)
    expect(totalLoanInterest(principal, 0.06, 36)).toBeCloseTo(payment * 36 - principal)
  })

  it('projects payoff when the payment amortizes, and Never when it does not', () => {
    const paidOff = payoffProjection(1000, 0, 250)
    expect(paidOff.paysOff).toBe(true)
    expect(paidOff.months).toBe(4)
    expect(paidOff.interest).toBe(0)
    expect(paidOff.remaining).toBe(0)

    const alreadyClear = payoffProjection(0, 0.22, 50)
    expect(alreadyClear).toEqual({ months: 0, interest: 0, totalPaid: 0, remaining: 0, paysOff: true })

    const never = payoffProjection(5200, 0.22, 1)
    expect(never.paysOff).toBe(false)
    expect(never.months).toBe(Infinity)
    expect(never.remaining).toBeGreaterThan(0)

    const noPayment = payoffProjection(1000, 0.12, 0)
    expect(noPayment.paysOff).toBe(false)
    expect(noPayment.months).toBe(Infinity)
    expect(noPayment.totalPaid).toBe(0)
  })

  it('applies declining-balance depreciation', () => {
    expect(depreciatedValue(10_000, 0.15, 0)).toBe(10_000)
    expect(depreciatedValue(10_000, 0.15, 5)).toBeCloseTo(10_000 * Math.pow(0.85, 5))
  })

  it('returns Infinity payback when there is no monthly benefit', () => {
    expect(breakEvenMonths(1200, 100)).toBe(12)
    expect(breakEvenMonths(1200, 0)).toBe(Infinity)
    expect(breakEvenMonths(1200, -10)).toBe(Infinity)
  })

  it('deflates a future amount into today dollars', () => {
    expect(realValue(103, 1, 0.03)).toBeCloseTo(100)
    expect(realValue(100, 10)).toBeCloseTo(100 / Math.pow(1 + ASSUMPTIONS.inflation, 10))
  })

  it('maps strain scores onto worth / consider / avoid', () => {
    expect(verdictFromScore(0)).toBe('worth')
    expect(verdictFromScore(0.34)).toBe('worth')
    expect(verdictFromScore(0.35)).toBe('consider')
    expect(verdictFromScore(0.67)).toBe('consider')
    expect(verdictFromScore(0.68)).toBe('avoid')
  })

  it('clamps to the unit interval by default', () => {
    expect(clamp(-1)).toBe(0)
    expect(clamp(0.5)).toBe(0.5)
    expect(clamp(2)).toBe(1)
    expect(clamp(15, 10, 12)).toBe(12)
  })
})
