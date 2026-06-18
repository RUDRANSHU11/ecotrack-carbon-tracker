import React, { useState } from 'react'
import { PlusCircle, Trash2, CheckCircle2 } from 'lucide-react'
import { EMISSION_FACTORS, CATEGORIES } from '../data/emissionFactors.js'
import { calcEmission, formatKg, totalForDay } from '../utils/calculations.js'

function CategoryTab({ id, active, onClick }) {
  const cat = CATEGORIES[id]
  return (
    <button
      onClick={() => onClick(id)}
      className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
        active
          ? `${cat.bg} ${cat.text} border ${cat.border}`
          : 'text-gray-500 hover:bg-gray-100 border border-transparent'
      }`}
    >
      <span>{cat.icon}</span>
      {cat.label}
    </button>
  )
}

export default function LogActivity({ logs, addLog, removeLog }) {
  const today = new Date().toISOString().slice(0, 10)
  const [selectedCat, setSelectedCat] = useState('transport')
  const [selectedType, setSelectedType] = useState('')
  const [quantity, setQuantity] = useState('')
  const [added, setAdded] = useState(false)

  const todayLogs = logs.filter(l => l.date === today)
  const todayTotal = totalForDay(todayLogs)
  const currentFactor = selectedType ? EMISSION_FACTORS[selectedCat][selectedType] : null
  const preview = selectedType && quantity ? calcEmission(selectedCat, selectedType, parseFloat(quantity) || 0) : null

  function handleAdd() {
    if (!selectedType || !quantity || parseFloat(quantity) <= 0) return
    const kg = calcEmission(selectedCat, selectedType, parseFloat(quantity))
    addLog({ date: today, category: selectedCat, type: selectedType, quantity: parseFloat(quantity), kg })
    setQuantity('')
    setSelectedType('')
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  const cat = CATEGORIES[selectedCat]

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-bold text-gray-800 mb-1">Log an Activity</h2>
        <p className="text-sm text-gray-500 mb-5">
          {new Date(today).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          {' · '}Today: <strong className="text-gray-700">{formatKg(todayTotal)}</strong>
        </p>

        {/* Category tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          {Object.keys(CATEGORIES).map(id => (
            <CategoryTab
              key={id}
              id={id}
              active={selectedCat === id}
              onClick={(id) => { setSelectedCat(id); setSelectedType('') }}
            />
          ))}
        </div>

        {/* Activity type grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-6">
          {Object.entries(EMISSION_FACTORS[selectedCat]).map(([type, info]) => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={`flex items-center gap-2 p-3 rounded-xl text-sm text-left transition-all border ${
                selectedType === type
                  ? `${cat.bg} ${cat.border} ${cat.text} font-medium`
                  : 'border-gray-100 hover:border-gray-200 hover:bg-gray-50 text-gray-600'
              }`}
            >
              <span className="text-xl">{info.icon}</span>
              <div className="min-w-0">
                <div className="truncate font-medium text-sm">{info.label}</div>
                <div className="text-xs opacity-60">per {info.unit}</div>
              </div>
            </button>
          ))}
        </div>

        {/* Quantity + preview */}
        {selectedType && (
          <div className="space-y-4">
            <div className="flex gap-3 items-end">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {currentFactor.label} — how many {currentFactor.unit}?
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.1"
                  value={quantity}
                  onChange={e => setQuantity(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleAdd()}
                  placeholder={`Enter ${currentFactor.unit}`}
                  className={`w-full border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 ${cat.border} focus:ring-offset-1 focus:ring-forest-400`}
                />
              </div>
              <button
                onClick={handleAdd}
                disabled={!quantity || parseFloat(quantity) <= 0}
                className={`flex items-center gap-2 px-5 py-3 rounded-xl font-medium text-sm transition-all ${
                  added
                    ? 'bg-forest-600 text-white'
                    : 'bg-forest-600 hover:bg-forest-700 text-white disabled:opacity-40 disabled:cursor-not-allowed'
                }`}
              >
                {added ? <CheckCircle2 className="w-4 h-4" /> : <PlusCircle className="w-4 h-4" />}
                {added ? 'Added!' : 'Add'}
              </button>
            </div>

            {preview !== null && (
              <div className={`flex items-center gap-3 p-3 rounded-xl ${cat.bg} ${cat.text}`}>
                <span className="text-xl">{currentFactor.icon}</span>
                <div>
                  <span className="font-semibold">{formatKg(preview)}</span>
                  <span className="text-sm ml-1.5 opacity-70">CO₂e</span>
                </div>
                {preview === 0 && (
                  <span className="text-xs opacity-70 ml-auto">Zero emission — great choice!</span>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Today's log */}
      {todayLogs.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="font-semibold text-gray-800 mb-4">
            Today's Log
            <span className="ml-2 text-sm font-normal text-gray-400">
              {todayLogs.length} entries · {formatKg(todayTotal)} total
            </span>
          </h3>
          <div className="space-y-2">
            {[...todayLogs].reverse().map(entry => {
              const factor = EMISSION_FACTORS[entry.category]?.[entry.type]
              const cat = CATEGORIES[entry.category]
              return (
                <div key={entry.id} className={`flex items-center gap-3 p-3 rounded-xl border ${cat?.border} ${cat?.bg}`}>
                  <span className="text-xl">{factor?.icon ?? '📊'}</span>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium ${cat?.text}`}>{factor?.label ?? entry.type}</p>
                    <p className="text-xs text-gray-500">{entry.quantity} {factor?.unit}</p>
                  </div>
                  <span className={`text-sm font-bold ${cat?.text}`}>{formatKg(entry.kg)}</span>
                  <button
                    onClick={() => removeLog(entry.id)}
                    className="text-gray-300 hover:text-red-400 transition-colors ml-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
