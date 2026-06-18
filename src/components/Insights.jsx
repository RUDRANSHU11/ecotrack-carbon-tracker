import React, { useMemo } from 'react'
import { Lightbulb, TrendingUp, Leaf, AlertTriangle, CheckCircle } from 'lucide-react'
import { CATEGORIES, EMISSION_FACTORS, TIPS, DAILY_BUDGET_KG } from '../data/emissionFactors.js'
import { groupByCategory, formatKg, topEmissionCategory, last7DaysSummary } from '../utils/calculations.js'

function InsightCard({ icon: Icon, title, desc, accent = 'forest', action, onAction }) {
  const styles = {
    forest: { bg: 'bg-forest-50', border: 'border-forest-200', icon: 'text-forest-600', title: 'text-forest-800' },
    amber:  { bg: 'bg-amber-50',  border: 'border-amber-200',  icon: 'text-amber-600',  title: 'text-amber-800' },
    red:    { bg: 'bg-red-50',    border: 'border-red-200',    icon: 'text-red-600',    title: 'text-red-800' },
    blue:   { bg: 'bg-blue-50',   border: 'border-blue-200',   icon: 'text-blue-600',   title: 'text-blue-800' },
  }
  const s = styles[accent]
  return (
    <div className={`${s.bg} ${s.border} border rounded-xl p-4`}>
      <div className="flex gap-3">
        <Icon className={`w-5 h-5 mt-0.5 flex-shrink-0 ${s.icon}`} />
        <div className="flex-1">
          <p className={`font-semibold text-sm ${s.title}`}>{title}</p>
          <p className="text-sm text-gray-600 mt-0.5">{desc}</p>
          {action && onAction && (
            <button
              onClick={onAction}
              className={`mt-2 text-xs font-medium ${s.icon} underline underline-offset-2`}
            >
              {action}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

function ComparisonBar({ label, kg, max, color }) {
  const pct = Math.min((kg / max) * 100, 100)
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs text-gray-600">
        <span>{label}</span>
        <span className="font-medium">{formatKg(kg)}</span>
      </div>
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: color }} />
      </div>
    </div>
  )
}

export default function Insights({ logs, setActiveTab }) {
  const today = new Date().toISOString().slice(0, 10)
  const weekData = last7DaysSummary(logs)
  const weekTotal = weekData.reduce((s, d) => s + d.total, 0)
  const weekAvg = weekTotal / 7

  const recentLogs = logs.filter(l => {
    const cutoff = new Date()
    cutoff.setDate(cutoff.getDate() - 7)
    return l.date >= cutoff.toISOString().slice(0, 10)
  })

  const catBreakdown = groupByCategory(recentLogs)
  const topCat = topEmissionCategory(recentLogs)

  // Best / worst days
  const sortedDays = [...weekData].sort((a, b) => a.total - b.total)
  const bestDay = sortedDays[0]
  const worstDay = sortedDays[sortedDays.length - 1]

  // Relevant tips
  const relevantTips = useMemo(() => {
    const typeCounts = {}
    for (const log of recentLogs) {
      typeCounts[log.type] = (typeCounts[log.type] ?? 0) + 1
    }
    const seen = new Set()
    const tips = []
    for (const [type, count] of Object.entries(typeCounts).sort((a, b) => b[1] - a[1])) {
      for (const cat of Object.keys(TIPS)) {
        for (const t of TIPS[cat]) {
          if (t.trigger === type && !seen.has(t.tip)) {
            seen.add(t.tip)
            tips.push(t)
          }
        }
      }
      if (tips.length >= 4) break
    }
    // Fill with generic tips if needed
    if (tips.length === 0) {
      tips.push(...TIPS.transport.slice(0, 2), ...TIPS.food.slice(0, 2))
    }
    return tips.slice(0, 5)
  }, [recentLogs])

  const maxCatKg = Math.max(...Object.values(catBreakdown), 0.1)
  const comparisons = [
    { label: 'Your weekly avg/day', kg: weekAvg, color: weekAvg > DAILY_BUDGET_KG ? '#ef4444' : '#22c55e' },
    { label: 'Global 1.5°C daily budget', kg: DAILY_BUDGET_KG, color: '#6b7280' },
    { label: 'Global avg per capita/day', kg: 13.4, color: '#f59e0b' },
    { label: 'Zero-carbon target', kg: 0.5, color: '#3b82f6' },
  ]
  const maxComparison = Math.max(...comparisons.map(c => c.kg))

  return (
    <div className="space-y-6">
      {/* Performance summary */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="font-bold text-gray-800 mb-4">Your 7-Day Performance</h2>
        <div className="grid sm:grid-cols-2 gap-6">
          <div className="space-y-3">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Emissions by category</h3>
            {Object.entries(catBreakdown)
              .sort((a, b) => b[1] - a[1])
              .map(([cat, kg]) => (
                <ComparisonBar
                  key={cat}
                  label={CATEGORIES[cat]?.label ?? cat}
                  kg={kg}
                  max={maxCatKg}
                  color={CATEGORIES[cat]?.color}
                />
              ))}
            {Object.keys(catBreakdown).length === 0 && (
              <p className="text-sm text-gray-400">No data yet.</p>
            )}
          </div>
          <div className="space-y-3">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">vs. global benchmarks</h3>
            {comparisons.map(c => (
              <ComparisonBar key={c.label} label={c.label} kg={c.kg} max={maxComparison} color={c.color} />
            ))}
          </div>
        </div>
      </div>

      {/* Smart insights */}
      <div className="space-y-3">
        <h3 className="font-bold text-gray-800">Personalized Insights</h3>

        {weekAvg <= DAILY_BUDGET_KG && (
          <InsightCard
            icon={CheckCircle}
            accent="forest"
            title="You're within the 1.5°C budget!"
            desc={`Your 7-day average is ${formatKg(weekAvg)}/day — below the ${formatKg(DAILY_BUDGET_KG)}/day limit. Keep it up!`}
          />
        )}

        {weekAvg > DAILY_BUDGET_KG && (
          <InsightCard
            icon={AlertTriangle}
            accent="red"
            title="Over the climate budget"
            desc={`Your average is ${formatKg(weekAvg)}/day — ${formatKg(weekAvg - DAILY_BUDGET_KG)} above what's compatible with 1.5°C warming. Small changes add up fast.`}
            action="Log today's activities"
            onAction={() => setActiveTab('log')}
          />
        )}

        {topCat && (
          <InsightCard
            icon={TrendingUp}
            accent="amber"
            title={`${CATEGORIES[topCat]?.label} is your biggest source`}
            desc={`${formatKg(catBreakdown[topCat])} over 7 days (${Math.round((catBreakdown[topCat] / weekTotal) * 100)}% of total). Small changes here have the most impact.`}
          />
        )}

        {bestDay?.total > 0 && (
          <InsightCard
            icon={Leaf}
            accent="forest"
            title={`Best day: ${new Date(bestDay.date + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'long' })}`}
            desc={`You emitted only ${formatKg(bestDay.total)} — ${formatKg(worstDay.total - bestDay.total)} less than your worst day. What made it different?`}
          />
        )}

        {relevantTips.map((t, i) => (
          <InsightCard
            key={i}
            icon={Lightbulb}
            accent="blue"
            title="Tip to reduce your footprint"
            desc={t.tip}
          />
        ))}
      </div>

      {/* Equivalences */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="font-bold text-gray-800 mb-4">Your 7-day total is equivalent to…</h3>
        {weekTotal > 0 ? (
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              { emoji: '🌳', label: 'trees needed to offset it for a year', val: Math.ceil(weekTotal / 21.7) },
              { emoji: '🚗', label: 'km driven in an average petrol car', val: Math.round(weekTotal / 0.21) },
              { emoji: '📱', label: 'smartphone charges', val: Math.round(weekTotal / 0.008) },
            ].map(({ emoji, label, val }) => (
              <div key={label} className="text-center p-4 bg-gray-50 rounded-xl">
                <div className="text-3xl mb-1">{emoji}</div>
                <div className="text-2xl font-black text-gray-800">{val.toLocaleString()}</div>
                <div className="text-xs text-gray-500 mt-0.5">{label}</div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-400">Start logging to see your impact in perspective.</p>
        )}
      </div>
    </div>
  )
}
