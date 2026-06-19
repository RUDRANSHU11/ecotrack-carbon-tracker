import React from 'react'
import PropTypes from 'prop-types'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts'
import { Flame, TrendingDown, Calendar, Award } from 'lucide-react'
import { last7DaysSummary, groupByCategory, totalForDay, formatKg, budgetPercent, getStreak } from '../utils/calculations.js'
import { CATEGORIES, DAILY_BUDGET_KG } from '../data/emissionFactors.js'

const CATEGORY_COLORS = Object.fromEntries(
  Object.entries(CATEGORIES).map(([k, v]) => [k, v.color])
)

function StatCard({ icon: Icon, label, value, sub, color = 'forest' }) {
  const colors = {
    forest: 'bg-forest-50 border-forest-200 text-forest-700',
    amber: 'bg-amber-50 border-amber-200 text-amber-700',
    blue: 'bg-blue-50 border-blue-200 text-blue-700',
    purple: 'bg-purple-50 border-purple-200 text-purple-700',
  }
  return (
    <div className={`border rounded-xl p-4 ${colors[color]}`} role="region" aria-label={label}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium opacity-70 uppercase tracking-wide" id={`stat-${label}`}>{label}</p>
          <p className="text-2xl font-bold mt-1" aria-labelledby={`stat-${label}`}>{value}</p>
          {sub && <p className="text-xs mt-0.5 opacity-60">{sub}</p>}
        </div>
        <Icon className="w-5 h-5 opacity-60 mt-0.5" aria-hidden="true" />
      </div>
    </div>
  )
}

function BudgetGauge({ percent }) {
  const clamped = Math.min(percent, 100)
  const over = percent > 100
  const color = percent <= 60 ? 'bg-forest-500' : percent <= 100 ? 'bg-amber-500' : 'bg-red-500'
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs text-gray-500">
        <span>0</span>
        <span className={over ? 'font-bold text-red-300' : 'font-medium text-gray-200'}>
          {percent}% of daily budget
        </span>
        <span>{DAILY_BUDGET_KG} kg</span>
      </div>
      <div
        className="h-3 bg-white/20 rounded-full overflow-hidden"
        role="progressbar"
        aria-valuenow={percent}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`${percent}% of daily carbon budget used`}
      >
        <div
          className={`h-full rounded-full transition-all duration-700 ${color}`}
          style={{ width: `${clamped}%` }}
        />
      </div>
      {over && (
        <p className="text-xs text-red-300 font-medium" role="alert">
          {percent - 100}% over the 1.5°C compatible daily limit
        </p>
      )}
    </div>
  )
}

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-3 shadow-lg text-sm">
      <p className="font-semibold text-gray-700 mb-1">{label}</p>
      {payload.map(p => (
        <p key={p.dataKey} style={{ color: p.fill }} className="text-xs">
          {CATEGORIES[p.dataKey]?.label ?? p.dataKey}: {formatKg(p.value)}
        </p>
      ))}
      <p className="text-xs text-gray-500 mt-1 pt-1 border-t border-gray-100">
        Total: {formatKg(payload.reduce((s, p) => s + p.value, 0))}
      </p>
    </div>
  )
}

export default function Dashboard({ logs, goal, setActiveTab }) {
  const today = new Date().toISOString().slice(0, 10)
  const todayLogs = logs.filter(l => l.date === today)
  const todayTotal = totalForDay(todayLogs)
  const percent = budgetPercent(todayTotal)
  const streak = getStreak(logs)
  const weekData = last7DaysSummary(logs)
  const weekTotal = weekData.reduce((s, d) => s + d.total, 0)
  const prevWeekAvg = weekTotal / 7

  // Category breakdown for pie
  const allLogs = logs.filter(l => {
    const d = new Date(today)
    d.setDate(d.getDate() - 6)
    return l.date >= d.toISOString().slice(0, 10)
  })
  const catBreakdown = groupByCategory(allLogs)
  const pieData = Object.entries(catBreakdown)
    .filter(([, v]) => v > 0)
    .map(([k, v]) => ({ name: CATEGORIES[k]?.label ?? k, value: +v.toFixed(2), key: k }))

  // Stacked bar data
  const barData = weekData.map(d => {
    const byCat = groupByCategory(d.entries)
    return { label: d.label, ...byCat }
  })

  return (
    <div className="space-y-6">
      {/* Hero today card */}
      <div className="bg-gradient-to-br from-forest-700 to-forest-900 rounded-2xl p-6 text-white">
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-forest-200 text-sm font-medium">Today's Carbon Footprint</p>
            <p className="text-5xl font-black mt-1">{formatKg(todayTotal)}</p>
            <p className="text-forest-300 text-sm mt-1">
              {todayLogs.length} {todayLogs.length === 1 ? 'activity' : 'activities'} logged
            </p>
          </div>
          <div className="text-right">
            <p className="text-forest-200 text-xs">Daily Budget</p>
            <p className="text-2xl font-bold">{formatKg(DAILY_BUDGET_KG)}</p>
          </div>
        </div>
        <BudgetGauge percent={percent} />
        {todayLogs.length === 0 && (
          <button
            onClick={() => setActiveTab('log')}
            aria-label="Go to Log Activity to add your first activity today"
            className="mt-4 w-full py-2 bg-forest-600 hover:bg-forest-500 rounded-xl text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-forest-700"
          >
            + Log your first activity today
          </button>
        )}
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatCard icon={Flame} label="7-day total" value={formatKg(weekTotal)} sub={`${formatKg(prevWeekAvg)}/day avg`} color="amber" />
        <StatCard icon={Calendar} label="Days logged" value={[...new Set(logs.map(l => l.date))].length} sub="unique days" color="blue" />
        <StatCard icon={Award} label="Streak" value={`${streak}d`} sub="consecutive days" color="purple" />
        <StatCard icon={TrendingDown} label="vs. budget" value={`${Math.abs(percent - 100)}%`} sub={percent <= 100 ? 'under budget' : 'over budget'} color={percent <= 100 ? 'forest' : 'amber'} />
      </div>

      {/* Charts */}
      <div className="grid sm:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="font-semibold text-gray-800 mb-4 text-sm uppercase tracking-wide">Last 7 Days</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={barData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <XAxis dataKey="label" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip content={<CustomTooltip />} />
              {Object.keys(CATEGORIES).map(cat => (
                <Bar key={cat} dataKey={cat} stackId="a" fill={CATEGORY_COLORS[cat]} radius={cat === 'shopping' ? [4, 4, 0, 0] : [0, 0, 0, 0]} />
              ))}
            </BarChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap gap-2 mt-3">
            {Object.entries(CATEGORIES).map(([k, v]) => (
              <span key={k} className="flex items-center gap-1 text-xs text-gray-500">
                <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ background: v.color }} />
                {v.label}
              </span>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="font-semibold text-gray-800 mb-4 text-sm uppercase tracking-wide">Category Breakdown (7d)</h3>
          {pieData.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {pieData.map(entry => (
                    <Cell key={entry.key} fill={CATEGORY_COLORS[entry.key] ?? '#6b7280'} />
                  ))}
                </Pie>
                <Tooltip formatter={(v) => formatKg(v)} />
                <Legend
                  formatter={(val) => <span className="text-xs text-gray-600">{val}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-48 flex items-center justify-center text-gray-400 text-sm">
              No data yet — start logging!
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

Dashboard.propTypes = {
  logs: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number,
    date: PropTypes.string.isRequired,
    category: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    quantity: PropTypes.number.isRequired,
    kg: PropTypes.number.isRequired,
  })).isRequired,
  goal: PropTypes.shape({
    targetKgPerDay: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
  }).isRequired,
  setActiveTab: PropTypes.func.isRequired,
}
