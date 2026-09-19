import { describe, expect, it } from 'vitest'
import { getCategory } from './categories'
import { defaultValues, paramsFromValues, valuesFromParams } from './decision-params'

describe('valuesFromParams', () => {
  it('falls back to category defaults when params are empty', () => {
    const purchase = getCategory('purchase')
    if (!purchase) throw new Error('missing purchase category')
    expect(valuesFromParams(purchase, {})).toEqual(defaultValues(purchase))
  })

  it('clamps a negative purchase price to the field minimum (0)', () => {
    const purchase = getCategory('purchase')
    if (!purchase) throw new Error('missing purchase category')
    const values = valuesFromParams(purchase, { price: '-1099' })
    expect(values.price).toBe(0)
  })

  it('ignores unparseable numeric params and keeps the default', () => {
    const debt = getCategory('debt')
    if (!debt) throw new Error('missing debt category')
    const values = valuesFromParams(debt, { balance: 'not-a-number' })
    expect(values.balance).toBe(5200)
  })

  it('round-trips defaults through paramsFromValues', () => {
    const college = getCategory('college')
    if (!college) throw new Error('missing college category')
    const defaults = defaultValues(college)
    const search = new URLSearchParams(paramsFromValues(college, defaults))
    const restored = valuesFromParams(college, Object.fromEntries(search.entries()))
    expect(restored).toEqual(defaults)
  })
})
