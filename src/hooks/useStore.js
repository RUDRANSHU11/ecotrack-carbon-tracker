import { useState, useEffect, useCallback } from 'react'

function load(key, fallback) {
  try {
    const v = localStorage.getItem(key)
    return v ? JSON.parse(v) : fallback
  } catch {
    return fallback
  }
}

function save(key, value) {
  localStorage.setItem(key, JSON.stringify(value))
}

const SEED_LOGS = (() => {
  const today = new Date()
  const logs = []
  const patterns = [
    // day offset, category, type, quantity
    [6, 'transport', 'car_petrol', 12],
    [6, 'food', 'beef', 1],
    [6, 'energy', 'electricity', 5],
    [5, 'transport', 'bus', 8],
    [5, 'food', 'chicken', 2],
    [5, 'shopping', 'online_order', 3],
    [4, 'transport', 'car_petrol', 20],
    [4, 'food', 'beef', 2],
    [4, 'energy', 'natural_gas', 1.5],
    [3, 'transport', 'train', 25],
    [3, 'food', 'vegetables', 3],
    [3, 'food', 'dairy', 2],
    [2, 'transport', 'car_petrol', 15],
    [2, 'food', 'pork', 1],
    [2, 'energy', 'electricity', 8],
    [2, 'shopping', 'clothing', 1],
    [1, 'transport', 'bicycle', 5],
    [1, 'food', 'vegan_meal', 2],
    [1, 'energy', 'electricity', 4],
    [0, 'transport', 'car_petrol', 10],
    [0, 'food', 'chicken', 1],
    [0, 'energy', 'electricity', 3],
  ]
  const FACTORS = {
    transport: { car_petrol: 0.21, bus: 0.089, train: 0.041, bicycle: 0 },
    food: { beef: 3.3, chicken: 0.69, vegetables: 0.06, dairy: 0.45, pork: 0.72, vegan_meal: 0.5 },
    energy: { electricity: 0.233, natural_gas: 2.04 },
    shopping: { online_order: 0.5, clothing: 10 },
  }
  let id = 1
  for (const [offset, cat, type, qty] of patterns) {
    const d = new Date(today)
    d.setDate(d.getDate() - offset)
    const date = d.toISOString().slice(0, 10)
    const kg = +((FACTORS[cat]?.[type] ?? 0) * qty).toFixed(3)
    logs.push({ id: id++, date, category: cat, type, quantity: qty, kg })
  }
  return logs
})()

export function useStore() {
  const [logs, setLogs] = useState(() => load('eco_logs', SEED_LOGS))
  const [goal, setGoal] = useState(() => load('eco_goal', { targetKgPerDay: 5, name: 'My Carbon Goal' }))
  const [profile, setProfile] = useState(() => load('eco_profile', { name: 'Explorer', joined: new Date().toISOString().slice(0, 10) }))

  useEffect(() => { save('eco_logs', logs) }, [logs])
  useEffect(() => { save('eco_goal', goal) }, [goal])
  useEffect(() => { save('eco_profile', profile) }, [profile])

  const addLog = useCallback((entry) => {
    setLogs(prev => [...prev, { ...entry, id: Date.now() }])
  }, [])

  const removeLog = useCallback((id) => {
    setLogs(prev => prev.filter(l => l.id !== id))
  }, [])

  const clearDay = useCallback((date) => {
    setLogs(prev => prev.filter(l => l.date !== date))
  }, [])

  return { logs, goal, setGoal, profile, setProfile, addLog, removeLog, clearDay }
}
