import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import HistoryPage from '../pages/HistoryPage.jsx'

vi.mock('../services/historyApi.js', () => ({
  getHistory: vi.fn().mockResolvedValue({
    data: {
      items: [
        {
          id: 'test-scan-1',
          input_type: 'message',
          input_content: 'URGENT: Click here to verify your account',
          risk_score: 85,
          risk_level: 'critical',
          finding_count: 3,
          analyzed_at: new Date().toISOString(),
        },
      ],
      total: 1,
      page: 1,
      page_size: 10,
    },
  }),
  getScanDetail: vi.fn().mockResolvedValue({
    data: null,
  }),
  deleteScan: vi.fn().mockResolvedValue({
    data: { success: true },
  }),
}))

const renderHistory = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  })
  return render(
    <QueryClientProvider client={queryClient}>
      <HistoryPage />
    </QueryClientProvider>
  )
}

describe('HistoryPage Component', () => {
  it('renders search input and filter buttons', () => {
    renderHistory()
    expect(screen.getByPlaceholderText(/Search content or URLs/i)).toBeInTheDocument()
    expect(screen.getByText('Scan History')).toBeInTheDocument()
  })

  it('renders history table headers', () => {
    renderHistory()
    expect(screen.getByText('Input Preview')).toBeInTheDocument()
    expect(screen.getByText('Risk Level')).toBeInTheDocument()
  })
})
