import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import Header from '../components/Header.jsx'
import LogActivity from '../components/LogActivity.jsx'
import Dashboard from '../components/Dashboard.jsx'
import Goals from '../components/Goals.jsx'
import ErrorBoundary from '../components/ErrorBoundary.jsx'

// ─── Header ──────────────────────────────────────────────────────────────────

describe('Header', () => {
  it('renders the EcoTrack brand name', () => {
    render(<Header activeTab="dashboard" setActiveTab={vi.fn()} />)
    expect(screen.getByText('EcoTrack')).toBeInTheDocument()
  })

  it('renders all four navigation tabs', () => {
    render(<Header activeTab="dashboard" setActiveTab={vi.fn()} />)
    expect(screen.getAllByText(/Dashboard/i).length).toBeGreaterThan(0)
    expect(screen.getAllByText(/Log/i).length).toBeGreaterThan(0)
    expect(screen.getAllByText(/Insights/i).length).toBeGreaterThan(0)
    expect(screen.getAllByText(/Goals/i).length).toBeGreaterThan(0)
  })

  it('calls setActiveTab when a tab is clicked', () => {
    const setActiveTab = vi.fn()
    render(<Header activeTab="dashboard" setActiveTab={setActiveTab} />)
    const insightsBtns = screen.getAllByText(/Insights/i)
    fireEvent.click(insightsBtns[0])
    expect(setActiveTab).toHaveBeenCalledWith('insights')
  })

  it('marks the active tab with aria-current="page"', () => {
    render(<Header activeTab="goals" setActiveTab={vi.fn()} />)
    const activeButtons = screen.getAllByRole('button', { current: 'page' })
    expect(activeButtons.length).toBeGreaterThan(0)
  })

  it('has a main navigation landmark', () => {
    render(<Header activeTab="dashboard" setActiveTab={vi.fn()} />)
    expect(screen.getAllByRole('navigation').length).toBeGreaterThan(0)
  })
})

// ─── LogActivity ─────────────────────────────────────────────────────────────

const mockLogs = []
const mockGoal = { targetKgPerDay: 6.3, name: 'Test Goal' }

describe('LogActivity', () => {
  it('renders the heading', () => {
    render(<LogActivity logs={mockLogs} addLog={vi.fn()} removeLog={vi.fn()} />)
    expect(screen.getByText('Log an Activity')).toBeInTheDocument()
  })

  it('renders all four category buttons', () => {
    render(<LogActivity logs={mockLogs} addLog={vi.fn()} removeLog={vi.fn()} />)
    expect(screen.getByText('Transport')).toBeInTheDocument()
    expect(screen.getByText('Food & Diet')).toBeInTheDocument()
    expect(screen.getByText('Home Energy')).toBeInTheDocument()
    expect(screen.getByText('Shopping')).toBeInTheDocument()
  })

  it('shows activity types for the default transport category', () => {
    render(<LogActivity logs={mockLogs} addLog={vi.fn()} removeLog={vi.fn()} />)
    expect(screen.getByText('Car (Petrol)')).toBeInTheDocument()
    expect(screen.getByText('Bus')).toBeInTheDocument()
  })

  it('shows quantity input when an activity type is selected', () => {
    render(<LogActivity logs={mockLogs} addLog={vi.fn()} removeLog={vi.fn()} />)
    fireEvent.click(screen.getByText('Car (Petrol)'))
    expect(screen.getByRole('spinbutton')).toBeInTheDocument()
  })

  it('calls addLog with correct data when Add is clicked', () => {
    const addLog = vi.fn()
    render(<LogActivity logs={mockLogs} addLog={addLog} removeLog={vi.fn()} />)
    fireEvent.click(screen.getByText('Car (Petrol)'))
    const input = screen.getByRole('spinbutton')
    fireEvent.change(input, { target: { value: '10' } })
    fireEvent.click(screen.getByRole('button', { name: /Add Car/i }))
    expect(addLog).toHaveBeenCalledWith(expect.objectContaining({
      category: 'transport',
      type: 'car_petrol',
      quantity: 10,
    }))
  })

  it('does not call addLog when quantity is zero', () => {
    const addLog = vi.fn()
    render(<LogActivity logs={mockLogs} addLog={addLog} removeLog={vi.fn()} />)
    fireEvent.click(screen.getByText('Car (Petrol)'))
    const input = screen.getByRole('spinbutton')
    fireEvent.change(input, { target: { value: '0' } })
    fireEvent.click(screen.getByRole('button', { name: /Add Car/i }))
    expect(addLog).not.toHaveBeenCalled()
  })

  it('shows today log entries when logs exist for today', () => {
    const today = new Date().toISOString().slice(0, 10)
    const logs = [{ id: 1, date: today, category: 'transport', type: 'car_petrol', quantity: 10, kg: 2.1 }]
    render(<LogActivity logs={logs} addLog={vi.fn()} removeLog={vi.fn()} />)
    expect(screen.getByText("Today's Log")).toBeInTheDocument()
    expect(screen.getAllByText('Car (Petrol)').length).toBeGreaterThanOrEqual(1)
  })

  it('calls removeLog when delete button is clicked', () => {
    const removeLog = vi.fn()
    const today = new Date().toISOString().slice(0, 10)
    const logs = [{ id: 42, date: today, category: 'transport', type: 'car_petrol', quantity: 10, kg: 2.1 }]
    render(<LogActivity logs={logs} addLog={vi.fn()} removeLog={removeLog} />)
    fireEvent.click(screen.getByRole('button', { name: /Remove Car \(Petrol\)/i }))
    expect(removeLog).toHaveBeenCalledWith(42)
  })
})

// ─── Dashboard ───────────────────────────────────────────────────────────────

describe('Dashboard', () => {
  it("renders today's carbon footprint heading", () => {
    render(<Dashboard logs={[]} goal={mockGoal} setActiveTab={vi.fn()} />)
    expect(screen.getByText("Today's Carbon Footprint")).toBeInTheDocument()
  })

  it('renders the daily budget value', () => {
    render(<Dashboard logs={[]} goal={mockGoal} setActiveTab={vi.fn()} />)
    expect(screen.getByText('Daily Budget')).toBeInTheDocument()
  })

  it('shows the log prompt when no activities today', () => {
    render(<Dashboard logs={[]} goal={mockGoal} setActiveTab={vi.fn()} />)
    expect(screen.getByText(/Log your first activity today/i)).toBeInTheDocument()
  })

  it('renders the budget progressbar', () => {
    render(<Dashboard logs={[]} goal={mockGoal} setActiveTab={vi.fn()} />)
    expect(screen.getByRole('progressbar')).toBeInTheDocument()
  })

  it('navigates to log tab when CTA is clicked', () => {
    const setActiveTab = vi.fn()
    render(<Dashboard logs={[]} goal={mockGoal} setActiveTab={setActiveTab} />)
    fireEvent.click(screen.getByText(/Log your first activity today/i))
    expect(setActiveTab).toHaveBeenCalledWith('log')
  })
})

// ─── Goals ───────────────────────────────────────────────────────────────────

describe('Goals', () => {
  it('renders the goal name', () => {
    render(<Goals logs={[]} goal={mockGoal} setGoal={vi.fn()} />)
    expect(screen.getByText('Test Goal')).toBeInTheDocument()
  })

  it('renders the edit button', () => {
    render(<Goals logs={[]} goal={mockGoal} setGoal={vi.fn()} />)
    expect(screen.getByRole('button', { name: '' })).toBeInTheDocument()
  })

  it('shows preset options when editing', () => {
    render(<Goals logs={[]} goal={mockGoal} setGoal={vi.fn()} />)
    const buttons = screen.getAllByRole('button')
    fireEvent.click(buttons[0])
    expect(screen.getByText('Climate Hero')).toBeInTheDocument()
  })

  it('calls setGoal when saving a new target', () => {
    const setGoal = vi.fn()
    render(<Goals logs={[]} goal={mockGoal} setGoal={setGoal} />)
    const buttons = screen.getAllByRole('button')
    fireEvent.click(buttons[0])
    fireEvent.click(screen.getByText('Save Goal'))
    expect(setGoal).toHaveBeenCalled()
  })
})

// ─── ErrorBoundary ───────────────────────────────────────────────────────────

describe('ErrorBoundary', () => {
  const ThrowError = () => { throw new Error('Test error') }

  beforeEach(() => {
    vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  it('renders children when no error', () => {
    render(<ErrorBoundary><p>OK</p></ErrorBoundary>)
    expect(screen.getByText('OK')).toBeInTheDocument()
  })

  it('renders fallback UI when child throws', () => {
    render(<ErrorBoundary><ThrowError /></ErrorBoundary>)
    expect(screen.getByRole('alert')).toBeInTheDocument()
    expect(screen.getByText(/Something went wrong/i)).toBeInTheDocument()
  })

  it('shows a try again button in fallback', () => {
    render(<ErrorBoundary><ThrowError /></ErrorBoundary>)
    expect(screen.getByRole('button', { name: /Try again/i })).toBeInTheDocument()
  })
})
