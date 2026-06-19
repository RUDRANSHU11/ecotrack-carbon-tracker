import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { Target, Edit3, Check, X, Trophy, Zap, Globe } from 'lucide-react'
import { DAILY_BUDGET_KG } from '../data/emissionFactors.js'
import { last7DaysSummary, formatKg, totalForDay } from '../utils/calculations.js'
import { AreaChart, Area, XAxis, YAxis, Tooltip, ReferenceLine, ResponsiveContainer } from 'recharts'

const PRESETS = [
  { label: 'Climate Hero', kg: 2.5, desc: 'Below Paris Agreement target', icon: '🌍', color: 'text-forest-700' },
  { label: '1.5°C Budget',  kg: 6.3, desc: 'Aligned with 1.5°C warming limit', icon: '🌡️', color: 'text-blue-700' },
  { label: 'Below Average', kg: 10,  desc: 'Better than global average (13.4 kg)', icon: '📉', color: 'text-amber-700' },
]

function GoalProgressRing({ current, target }) {
  const pct = target > 0 ? Math.min((current / target) * 100, 150) : 0
  const radius = 60
  const circ = 2 * Math.PI * radius
  const dash = (Math.min(pct, 100) / 100) * circ
  const over = pct > 100
  const color = over ? '#ef4444' : pct > 75 ? '#f59e0b' : '#22c55e'

  return (
    <div className="flex flex-col items-center">
      <svg width="160" height="160" className="transform -rotate-90">
        <circle cx="80" cy="80" r={radius} fill="none" stroke="#f3f4f6" strokeWidth="12" />
        <circle
          cx="80" cy="80" r={radius}
          fill="none"
          stroke={color}
          strokeWidth="12"
          strokeDasharray={`${dash} ${circ}`}
          strokeLinecap="round"
          style={{ transition: 'stroke-dasharray 0.6s ease' }}
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="text-3xl font-black" style={{ color }}>{Math.round(pct)}%</span>
        <span className="text-xs text-gray-500 mt-0.5">of goal</span>
      </div>
    </div>
  )
}

export default function Goals({ logs, goal, setGoal }) {
  const [editing, setEditing] = useState(false)
  const [editVal, setEditVal] = useState(goal.targetKgPerDay)
  const [editName, setEditName] = useState(goal.name)

  const today = new Date().toISOString().slice(0, 10)
  const todayLogs = logs.filter(l => l.date === today)
  const todayKg = totalForDay(todayLogs)

  const weekData = last7DaysSummary(logs)
  const weekAvg = weekData.reduce((s, d) => s + d.total, 0) / 7

  const chartData = weekData.map(d => ({
    label: d.label,
    actual: d.total,
    goal: goal.targetKgPerDay,
    budget: DAILY_BUDGET_KG,
  }))

  const daysUnderGoal = weekData.filter(d => d.total > 0 && d.total <= goal.targetKgPerDay).length
  const daysOver = weekData.filter(d => d.total > goal.targetKgPerDay).length

  function saveGoal() {
    const kg = parseFloat(editVal)
    if (!kg || kg <= 0) return
    setGoal({ targetKgPerDay: kg, name: editName || 'My Goal' })
    setEditing(false)
  }

  const reductionNeeded = Math.max(0, weekAvg - goal.targetKgPerDay)
  const onTrack = weekAvg <= goal.targetKgPerDay

  return (
    <div className="space-y-6">
      {/* Goal card */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="font-bold text-gray-800 text-lg">{goal.name}</h2>
            <p className="text-sm text-gray-500">Daily carbon target</p>
          </div>
          <button
            onClick={() => { setEditing(!editing); setEditVal(goal.targetKgPerDay); setEditName(goal.name) }}
            className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          >
            {editing ? <X className="w-4 h-4" /> : <Edit3 className="w-4 h-4" />}
          </button>
        </div>

        {editing ? (
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">Goal Name</label>
              <input
                type="text"
                value={editName}
                onChange={e => setEditName(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-forest-400"
                placeholder="My Carbon Goal"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">Daily target (kg CO₂e)</label>
              <input
                type="number"
                min="0.5"
                max="20"
                step="0.5"
                value={editVal}
                onChange={e => setEditVal(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-forest-400"
              />
            </div>
            <div className="grid grid-cols-3 gap-2">
              {PRESETS.map(p => (
                <button
                  key={p.label}
                  onClick={() => { setEditVal(p.kg); setEditName(p.label) }}
                  className={`p-3 rounded-xl border text-center transition-colors text-sm ${
                    parseFloat(editVal) === p.kg ? 'border-forest-400 bg-forest-50' : 'border-gray-100 hover:border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <div className="text-lg">{p.icon}</div>
                  <div className={`font-semibold ${p.color} text-xs`}>{formatKg(p.kg)}/day</div>
                  <div className="text-xs text-gray-400 mt-0.5">{p.label}</div>
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <button
                onClick={saveGoal}
                className="flex-1 flex items-center justify-center gap-2 bg-forest-600 hover:bg-forest-700 text-white rounded-xl py-2.5 text-sm font-medium transition-colors"
              >
                <Check className="w-4 h-4" /> Save Goal
              </button>
              <button
                onClick={() => setEditing(false)}
                className="px-4 border border-gray-200 rounded-xl text-sm text-gray-500 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-6">
            <div className="relative flex items-center justify-center">
              <GoalProgressRing current={todayKg} target={goal.targetKgPerDay} />
            </div>
            <div className="flex-1 space-y-3">
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide">Today</p>
                <p className="text-2xl font-black text-gray-800">{formatKg(todayKg)}</p>
                <p className="text-sm text-gray-500">target: {formatKg(goal.targetKgPerDay)}/day</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide">7-day average</p>
                <p className={`text-xl font-bold ${onTrack ? 'text-forest-600' : 'text-red-600'}`}>
                  {formatKg(weekAvg)}/day
                </p>
                {onTrack
                  ? <p className="text-xs text-forest-600">✓ On track!</p>
                  : <p className="text-xs text-red-600">Need to reduce by {formatKg(reductionNeeded)}/day</p>
                }
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Progress chart */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="font-semibold text-gray-800 mb-4">Actual vs. Goal (7 days)</h3>
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={chartData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
            <XAxis dataKey="label" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip formatter={(v, n) => [formatKg(v), n === 'actual' ? 'Your emissions' : n === 'goal' ? 'Your goal' : '1.5°C budget']} />
            <ReferenceLine y={goal.targetKgPerDay} stroke="#22c55e" strokeDasharray="4 2" label={{ value: 'Goal', position: 'right', fontSize: 10, fill: '#22c55e' }} />
            <ReferenceLine y={DAILY_BUDGET_KG} stroke="#6b7280" strokeDasharray="4 2" label={{ value: '1.5°C', position: 'right', fontSize: 10, fill: '#6b7280' }} />
            <Area type="monotone" dataKey="actual" fill="#bbf7d0" stroke="#16a34a" strokeWidth={2} fillOpacity={0.6} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Weekly scorecard */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="font-semibold text-gray-800 mb-4">Weekly Scorecard</h3>
        <div className="grid grid-cols-3 gap-4 text-center">
          {[
            { icon: Trophy, val: daysUnderGoal, label: 'Days under goal', color: 'text-forest-600' },
            { icon: Zap, val: daysOver, label: 'Days over goal', color: 'text-amber-600' },
            { icon: Globe, val: Math.max(0, Math.round((weekAvg - goal.targetKgPerDay) * 7)), label: 'kg to offset this week', color: 'text-blue-600' },
          ].map(({ icon: Icon, val, label, color }) => (
            <div key={label} className="p-3 bg-gray-50 rounded-xl">
              <Icon className={`w-5 h-5 mx-auto mb-1 ${color}`} />
              <div className={`text-2xl font-black ${color}`}>{val < 0 ? 0 : val}</div>
              <div className="text-xs text-gray-500 mt-0.5">{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Offset inspiration */}
      <div className="bg-gradient-to-br from-forest-800 to-forest-900 rounded-xl p-6 text-white">
        <h3 className="font-bold text-lg mb-3">Offset & Compensate</h3>
        <p className="text-forest-200 text-sm mb-4">
          Even on good days, some emissions are unavoidable. Here are ways to compensate:
        </p>
        <div className="space-y-2">
          {[
            { icon: '🌳', text: 'Plant a tree — absorbs ~21 kg CO₂/year' },
            { icon: '🌱', text: 'Support certified reforestation projects' },
            { icon: '☀️', text: 'Switch to renewable energy tariff' },
            { icon: '♻️', text: 'Compost food waste — reduces methane emissions' },
          ].map(({ icon, text }) => (
            <div key={text} className="flex items-center gap-3 text-sm text-forest-100">
              <span className="text-lg">{icon}</span>
              {text}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

Goals.propTypes = {
  logs: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number,
    date: PropTypes.string.isRequired,
    category: PropTypes.string.isRequired,
    kg: PropTypes.number.isRequired,
  })).isRequired,
  goal: PropTypes.shape({
    targetKgPerDay: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
  }).isRequired,
  setGoal: PropTypes.func.isRequired,
}
