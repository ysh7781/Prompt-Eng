import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import DashboardPage from '../pages/DashboardPage.jsx'

vi.mock('../services/dashboardApi.js', () => ({
  getDashboardStats: vi.fn().mockResolvedValue({
    data: {
      total_scans: 120,
      high_risk_scans: 15,
      low_risk_scans: 95,
      scans_today: 4,
    },
  }),
  getRecentScans: vi.fn().mockResolvedValue({
    data: [],
  }),
  getRiskDistribution: vi.fn().mockResolvedValue({
    data: [
      { risk_level: 'low', count: 95, percentage: 79 },
      { risk_level: 'high', count: 15, percentage: 12 },
    ],
  }),
}))

const renderDashboard = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  })
  return render(
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <DashboardPage />
      </BrowserRouter>
    </QueryClientProvider>
  )
}

describe('DashboardPage Component', () => {
  it('renders overview header and action buttons', () => {
    renderDashboard()
    expect(screen.getByText('Your Security Overview')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Scan URL/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Scan a Message/i })).toBeInTheDocument()
  })

  it('renders quick security tips and recent scans card', () => {
    renderDashboard()
    expect(screen.getByText('Security Quick Tips')).toBeInTheDocument()
    expect(screen.getByText('Recent Scan Activity')).toBeInTheDocument()
  })
})
