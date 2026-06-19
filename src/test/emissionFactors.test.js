import { describe, it, expect } from 'vitest'
import { EMISSION_FACTORS, CATEGORIES, DAILY_BUDGET_KG, ANNUAL_BUDGET_KG } from '../data/emissionFactors.js'

describe('EMISSION_FACTORS structure', () => {
  it('has all four required categories', () => {
    expect(EMISSION_FACTORS).toHaveProperty('transport')
    expect(EMISSION_FACTORS).toHaveProperty('food')
    expect(EMISSION_FACTORS).toHaveProperty('energy')
    expect(EMISSION_FACTORS).toHaveProperty('shopping')
  })

  it('every entry has label, unit, factor, and icon', () => {
    for (const [cat, types] of Object.entries(EMISSION_FACTORS)) {
      for (const [type, info] of Object.entries(types)) {
        expect(info, `${cat}.${type} missing label`).toHaveProperty('label')
        expect(info, `${cat}.${type} missing unit`).toHaveProperty('unit')
        expect(info, `${cat}.${type} missing factor`).toHaveProperty('factor')
        expect(info, `${cat}.${type} missing icon`).toHaveProperty('icon')
      }
    }
  })

  it('all emission factors are non-negative numbers', () => {
    for (const types of Object.values(EMISSION_FACTORS)) {
      for (const info of Object.values(types)) {
        expect(typeof info.factor).toBe('number')
        expect(info.factor).toBeGreaterThanOrEqual(0)
      }
    }
  })

  it('bicycle has zero emission factor', () => {
    expect(EMISSION_FACTORS.transport.bicycle.factor).toBe(0)
  })

  it('car_petrol emits more than bus per km', () => {
    expect(EMISSION_FACTORS.transport.car_petrol.factor).toBeGreaterThan(
      EMISSION_FACTORS.transport.bus.factor
    )
  })

  it('beef emits more than vegetables per serving', () => {
    expect(EMISSION_FACTORS.food.beef.factor).toBeGreaterThan(
      EMISSION_FACTORS.food.vegetables.factor
    )
  })

  it('electric car emits less than petrol car', () => {
    expect(EMISSION_FACTORS.transport.car_electric.factor).toBeLessThan(
      EMISSION_FACTORS.transport.car_petrol.factor
    )
  })
})

describe('CATEGORIES', () => {
  it('has all four categories', () => {
    expect(Object.keys(CATEGORIES)).toEqual(['transport', 'food', 'energy', 'shopping'])
  })

  it('each category has label, color, and icon', () => {
    for (const [key, cat] of Object.entries(CATEGORIES)) {
      expect(cat, `${key} missing label`).toHaveProperty('label')
      expect(cat, `${key} missing color`).toHaveProperty('color')
      expect(cat, `${key} missing icon`).toHaveProperty('icon')
    }
  })
})

describe('Budget constants', () => {
  it('daily budget is 6.3 kg', () => {
    expect(DAILY_BUDGET_KG).toBe(6.3)
  })

  it('annual budget is 2300 kg', () => {
    expect(ANNUAL_BUDGET_KG).toBe(2300)
  })

  it('daily * 365 approximates annual budget', () => {
    expect(DAILY_BUDGET_KG * 365).toBeCloseTo(ANNUAL_BUDGET_KG, -2)
  })
})
