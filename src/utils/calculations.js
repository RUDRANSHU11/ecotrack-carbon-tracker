import { EMISSION_FACTORS, DAILY_BUDGET_KG } from '../data/emissionFactors.js'

export function calcEmission(category, type, quantity) {
  const factor = EMISSION_FACTORS[category]?.[type]?.factor ?? 0
  return +(factor * quantity).toFixed(3)
}

export function totalForDay(entries) {
  return +entries.reduce((sum, e) => sum + e.kg, 0).toFixed(2)
}

export function groupByCategory(entries) {
  const out = {}
  for (const e of entries) {
    out[e.category] = +(( out[e.category] ?? 0) + e.kg).toFixed(3)
  }
  return out
}

export function budgetPercent(kg) {
  return Math.min(Math.round((kg / DAILY_BUDGET_KG) * 100), 200)
}

export function formatKg(kg) {
  if (kg >= 1000) return `${(kg / 1000).toFixed(1)} t`
  if (kg >= 1)    return `${kg.toFixed(1)} kg`
  return `${Math.round(kg * 1000)} g`
}

export function getStreak(logs) {
  const today = new Date().toISOString().slice(0, 10)
  const sortedDates = [...new Set(logs.map(l => l.date))].sort().reverse()
  if (!sortedDates.length) return 0
  let streak = 0
  let cursor = new Date(today)
  for (const d of sortedDates) {
    const expected = cursor.toISOString().slice(0, 10)
    if (d === expected) {
      streak++
      cursor.setDate(cursor.getDate() - 1)
    } else if (d < expected) {
      break
    }
  }
  return streak
}

export function last7DaysSummary(logs) {
  const days = []
  for (let i = 6; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    const dateStr = d.toISOString().slice(0, 10)
    const dayLogs = logs.filter(l => l.date === dateStr)
    days.push({
      date: dateStr,
      label: d.toLocaleDateString('en-US', { weekday: 'short' }),
      total: totalForDay(dayLogs),
      entries: dayLogs,
    })
  }
  return days
}

export function topEmissionCategory(logs) {
  const byCategory = groupByCategory(logs)
  return Object.entries(byCategory).sort((a, b) => b[1] - a[1])[0]?.[0] ?? null
}
