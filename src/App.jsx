import React, { useState } from 'react'
import Header from './components/Header.jsx'
import Dashboard from './components/Dashboard.jsx'
import LogActivity from './components/LogActivity.jsx'
import Insights from './components/Insights.jsx'
import Goals from './components/Goals.jsx'
import ErrorBoundary from './components/ErrorBoundary.jsx'
import { useStore } from './hooks/useStore.js'

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const { logs, goal, setGoal, addLog, removeLog } = useStore()

  return (
    <ErrorBoundary>
    <div className="min-h-screen bg-gray-50">
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />
      <main id="main-content" className="max-w-5xl mx-auto px-4 py-6 pb-24 sm:pb-6">
        {activeTab === 'dashboard' && (
          <Dashboard logs={logs} goal={goal} setActiveTab={setActiveTab} />
        )}
        {activeTab === 'log' && (
          <LogActivity logs={logs} addLog={addLog} removeLog={removeLog} />
        )}
        {activeTab === 'insights' && (
          <Insights logs={logs} setActiveTab={setActiveTab} />
        )}
        {activeTab === 'goals' && (
          <Goals logs={logs} goal={goal} setGoal={setGoal} />
        )}
      </main>
      <footer className="hidden sm:block border-t border-gray-200 bg-white py-3 text-center text-xs text-gray-400 mt-8">
        EcoTrack · Carbon Footprint Tracker · Emission factors from IPCC, EPA & Our World in Data
      </footer>
    </div>
    </ErrorBoundary>
  )
}
