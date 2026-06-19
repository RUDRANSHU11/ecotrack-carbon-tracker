import { describe, it, expect, vi, beforeEach } from 'vitest'
import {
  calcEmission,
  totalForDay,
  groupByCategory,
  budgetPercent,
  formatKg,
  getStreak,
  topEmissionCategory,
} from '../utils/calculations.js'

describe('calcEmission', () => {
  it('returns correct kg for car petrol', () => {
    expect(calcEmission('transport', 'car_petrol', 10)).toBeCloseTo(2.1, 2)
  })

  it('returns 0 for bicycle (zero-emission)', () => {
    expect(calcEmission('transport', 'bicycle', 100)).toBe(0)
  })

  it('returns 0 for unknown category', () => {
    expect(calcEmission('unknown', 'thing', 10)).toBe(0)
  })

  it('returns 0 for unknown type', () => {
    expect(calcEmission('transport', 'rocket', 10)).toBe(0)
  })

  it('returns correct kg for beef', () => {
    expect(calcEmission('food', 'beef', 2)).toBeCloseTo(6.6, 1)
  })

  it('returns correct kg for electricity', () => {
    expect(calcEmission('energy', 'electricity', 5)).toBeCloseTo(1.165, 2)
  })

  it('handles fractional quantities', () => {
    expect(calcEmission('energy', 'electricity', 0.5)).toBeCloseTo(0.117, 2)
  })

  it('handles zero quantity', () => {
    expect(calcEmission('transport', 'car_petrol', 0)).toBe(0)
  })
})

describe('totalForDay', () => {
  it('sums kg across all entries', () => {
    const entries = [
      { kg: 1.5 },
      { kg: 2.3 },
      { kg: 0.7 },
    ]
    expect(totalForDay(entries)).toBeCloseTo(4.5, 1)
  })

  it('returns 0 for empty array', () => {
    expect(totalForDay([])).toBe(0)
  })

  it('handles single entry', () => {
    expect(totalForDay([{ kg: 3.14 }])).toBeCloseTo(3.14, 2)
  })

  it('handles entries with zero kg', () => {
    expect(totalForDay([{ kg: 0 }, { kg: 2 }])).toBe(2)
  })
})

describe('groupByCategory', () => {
  it('groups entries by category and sums kg', () => {
    const entries = [
      { category: 'transport', kg: 2.1 },
      { category: 'food', kg: 3.3 },
      { category: 'transport', kg: 1.0 },
    ]
    const result = groupByCategory(entries)
    expect(result.transport).toBeCloseTo(3.1, 1)
    expect(result.food).toBeCloseTo(3.3, 1)
  })

  it('returns empty object for no entries', () => {
    expect(groupByCategory([])).toEqual({})
  })

  it('handles single category', () => {
    const entries = [{ category: 'energy', kg: 1.5 }, { category: 'energy', kg: 0.5 }]
    expect(groupByCategory(entries).energy).toBeCloseTo(2.0, 1)
  })
})

describe('budgetPercent', () => {
  it('returns 100 when exactly at budget', () => {
    expect(budgetPercent(6.3)).toBe(100)
  })

  it('returns 0 when kg is 0', () => {
    expect(budgetPercent(0)).toBe(0)
  })

  it('caps at 200 when far over budget', () => {
    expect(budgetPercent(1000)).toBe(200)
  })

  it('returns correct percent below budget', () => {
    expect(budgetPercent(3.15)).toBe(50)
  })

  it('returns over 100 when above budget', () => {
    expect(budgetPercent(12.6)).toBe(200)
  })
})

describe('formatKg', () => {
  it('formats grams for values under 1 kg', () => {
    expect(formatKg(0.5)).toBe('500 g')
  })

  it('formats kg for values between 1 and 999', () => {
    expect(formatKg(2.5)).toBe('2.5 kg')
    expect(formatKg(1)).toBe('1.0 kg')
  })

  it('formats tonnes for values 1000 kg and above', () => {
    expect(formatKg(1000)).toBe('1.0 t')
    expect(formatKg(2500)).toBe('2.5 t')
  })

  it('formats 0 as grams', () => {
    expect(formatKg(0)).toBe('0 g')
  })

  it('rounds grams correctly', () => {
    expect(formatKg(0.1234)).toBe('123 g')
  })
})

describe('getStreak', () => {
  it('returns 0 for empty logs', () => {
    expect(getStreak([])).toBe(0)
  })

  it('returns 1 for only today', () => {
    const today = new Date().toISOString().slice(0, 10)
    expect(getStreak([{ date: today }])).toBe(1)
  })

  it('counts consecutive days ending today', () => {
    const dates = []
    for (let i = 0; i < 3; i++) {
      const d = new Date()
      d.setDate(d.getDate() - i)
      dates.push({ date: d.toISOString().slice(0, 10) })
    }
    expect(getStreak(dates)).toBe(3)
  })

  it('breaks streak on missing day', () => {
    const today = new Date()
    const twoDaysAgo = new Date()
    twoDaysAgo.setDate(twoDaysAgo.getDate() - 2)
    const logs = [
      { date: today.toISOString().slice(0, 10) },
      { date: twoDaysAgo.toISOString().slice(0, 10) },
    ]
    expect(getStreak(logs)).toBe(1)
  })
})

describe('topEmissionCategory', () => {
  it('returns null for empty logs', () => {
    expect(topEmissionCategory([])).toBeNull()
  })

  it('returns the category with highest total kg', () => {
    const logs = [
      { category: 'transport', kg: 5.0 },
      { category: 'food', kg: 2.0 },
      { category: 'energy', kg: 1.0 },
    ]
    expect(topEmissionCategory(logs)).toBe('transport')
  })

  it('handles single category', () => {
    const logs = [{ category: 'food', kg: 3.3 }]
    expect(topEmissionCategory(logs)).toBe('food')
  })

  it('correctly identifies when food beats transport', () => {
    const logs = [
      { category: 'transport', kg: 1.0 },
      { category: 'food', kg: 10.0 },
    ]
    expect(topEmissionCategory(logs)).toBe('food')
  })
})
