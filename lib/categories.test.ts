import { describe, expect, it } from 'vitest'
import { getCategory } from './categories'
import { valuesFromParams } from './decision-params'
import { ASSUMPTIONS } from './economics'
import type { AnalysisResult, CategoryId } from './types'

/** Same path the results page uses: URL params → valuesFromParams → analyze(). */
function analyzeFromParams(
  id: CategoryId,
  params: Record<string, string | string[] | undefined> = {},
) {
  const category = getCategory(id)
  if (!category) throw new Error(`unknown category: ${id}`)
  const values = valuesFromParams(category, params)
  return { values, result: category.analyze(values) }
}

function breakdownSum(result: AnalysisResult): number {
  return result.breakdown.reduce((acc, segment) => acc + segment.amount, 0)
}

function metric(result: AnalysisResult, label: string): string {
  const found = result.metrics.find((m) => m.label === label)
  if (!found) throw new Error(`missing metric "${label}"`)
  return found.value
}

function visibleText(result: AnalysisResult): string {
  return [
    result.title,
    result.costLabel,
    result.verdictReason,
    ...result.metrics.flatMap((m) => [m.label, m.value, m.hint ?? '']),
    ...result.insights,
    ...result.whatIfs.flatMap((w) => [w.label, w.description]),
  ].join('\n')
}

describe('Task 4 category identities', () => {
  it('debt defaults: breakdown segments sum to the hero trueCost (~$9,458)', () => {
    const { result } = analyzeFromParams('debt')
    expect(result.costLabel).toBe('Total if you pay minimums')
    expect(result.trueCost).toBe(9458)
    expect(breakdownSum(result)).toBe(result.trueCost)
    expect(metric(result, 'Payoff time')).toMatch(/^\d+ mo$/)
    expect(metric(result, 'Payoff time')).not.toBe('Never')
  })

  it('debt minPayment=1: never-pays-off uses year-1 interest and hero $6,344', () => {
    const { result } = analyzeFromParams('debt', { minPayment: '1' })
    expect(result.trueCost).toBe(6344)
    expect(breakdownSum(result)).toBe(result.trueCost)
    expect(metric(result, 'Payoff time')).toBe('Never')
    expect(result.metrics.find((m) => m.label === 'Payoff time')?.hint).toBe(
      'payment does not cover interest',
    )
    expect(result.breakdown.find((s) => s.key === 'interest')?.label).toMatch(/year 1/i)
    expect(result.insights.join('\n')).toMatch(/never pays off/i)
  })

  it('job defaults: loss framing and 50-week work-year (not the old 52-week commute)', () => {
    expect(ASSUMPTIONS.workWeeksPerYear).toBe(50)
    expect(ASSUMPTIONS.weeklyWorkHours).toBe(40)

    const { result, values } = analyzeFromParams('job')
    const extraWeekly = Number(values.newCommute) - Number(values.currentCommute)
    expect(extraWeekly).toBe(6)
    expect(extraWeekly * ASSUMPTIONS.workWeeksPerYear).toBe(300)
    expect(extraWeekly * 52).toBe(312)

    expect(result.costLabel).toBe('Real annual loss')
    expect(result.trueCost).toBe(5286)
    expect(metric(result, 'Added commute')).toBe('300 hrs/yr')
    expect(metric(result, 'Added commute')).not.toBe('312 hrs/yr')
    expect(result.verdictReason).toMatch(/commute and benefits eat into it/i)
  })

  it('transportation defaults: pie segments equal the $15,120 current-option trueCost', () => {
    const { result } = analyzeFromParams('transportation')
    expect(result.trueCost).toBe(15_120)
    expect(result.costLabel).toBe('Current cost (3y)')
    expect(result.breakdown).toHaveLength(1)
    expect(result.breakdown[0]?.label).toBe('Current spend')
    expect(breakdownSum(result)).toBe(result.trueCost)
    expect(Math.abs(breakdownSum(result) - result.trueCost)).toBeLessThanOrEqual(1)
  })

  it('college salaryBump=0: payback is never and no Infinity leaks into the result', () => {
    const { result } = analyzeFromParams('college', { salaryBump: '0' })
    expect(metric(result, 'Payback period')).toBe('never')
    expect(Number.isFinite(result.trueCost)).toBe(true)
    expect(result.trueCost).toBeGreaterThan(0)
    expect(visibleText(result)).not.toMatch(/Infinity/i)
    expect(result.verdictReason).toMatch(/never pays back/i)
  })

  it('purchase price=-1099: URL + analyze clamp to a $0 true cost', () => {
    const { values, result } = analyzeFromParams('purchase', { price: '-1099' })
    expect(values.price).toBe(0)
    expect(result.trueCost).toBe(0)
    expect(result.facePrice).toBe(0)
    expect(breakdownSum(result)).toBe(0)
    expect(Number.isFinite(result.trueCost)).toBe(true)
  })
})
