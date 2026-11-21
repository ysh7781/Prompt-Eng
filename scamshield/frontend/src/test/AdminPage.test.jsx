import { render, screen, waitFor } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import AdminPage from '../pages/AdminPage.jsx'

vi.mock('../services/adminApi.js', () => ({
  getRules: vi.fn().mockResolvedValue({
    data: [
      {
        id: 'rule-1',
        rule_code: 'URGENT_ACCOUNT_THREAT',
        category: 'urgency',
        name: 'Urgent Account Threat',
        description: 'Detects urgency words regarding account suspension',
        weight: 25,
        severity: 'high',
        pattern: 'suspended|locked',
        is_active: true,
      },
    ],
  }),
  getAdminStats: vi.fn().mockResolvedValue({
    data: {
      total_users: 42,
      total_scans: 350,
      active_rules: 15,
    },
  }),
  createRule: vi.fn().mockResolvedValue({ data: {} }),
  updateRule: vi.fn().mockResolvedValue({ data: {} }),
  deleteRule: vi.fn().mockResolvedValue({ data: {} }),
}))

const renderAdmin = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  })
  return render(
    <QueryClientProvider client={queryClient}>
      <AdminPage />
    </QueryClientProvider>
  )
}

describe('AdminPage Component', () => {
  it('renders admin heading and new rule action button', () => {
    renderAdmin()
    expect(screen.getByText('Detection Engine Administration')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Add Detection Rule/i })).toBeInTheDocument()
  })

  it('renders rules table header after loading', async () => {
    renderAdmin()
    await waitFor(() => {
      expect(screen.getByText('Code & Name')).toBeInTheDocument()
      expect(screen.getByText('Weight (Score)')).toBeInTheDocument()
      expect(screen.getByText('Status')).toBeInTheDocument()
    })
  })
})
