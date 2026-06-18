import React from 'react'
import { Leaf, LayoutDashboard, PlusCircle, Lightbulb, Target } from 'lucide-react'

const TABS = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'log',       label: 'Log Activity', icon: PlusCircle },
  { id: 'insights',  label: 'Insights',     icon: Lightbulb },
  { id: 'goals',     label: 'Goals',        icon: Target },
]

export default function Header({ activeTab, setActiveTab }) {
  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-forest-600 rounded-lg flex items-center justify-center">
              <Leaf className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-lg text-forest-800">EcoTrack</span>
          </div>
          <nav className="hidden sm:flex items-center gap-1">
            {TABS.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === id
                    ? 'bg-forest-100 text-forest-700'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </button>
            ))}
          </nav>
        </div>
        {/* Mobile nav */}
        <div className="sm:hidden flex border-t border-gray-100">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex-1 flex flex-col items-center gap-0.5 py-2 text-xs font-medium transition-colors ${
                activeTab === id ? 'text-forest-600' : 'text-gray-400'
              }`}
            >
              <Icon className="w-5 h-5" />
              {label.split(' ')[0]}
            </button>
          ))}
        </div>
      </div>
    </header>
  )
}
