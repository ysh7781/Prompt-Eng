import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import UrlScannerPage from '../pages/UrlScannerPage.jsx'

vi.mock('../services/scannerApi.js', () => ({
  scanUrl: vi.fn().mockResolvedValue({
    data: {
      id: 'test-scan-url',
      input_type: 'url',
      risk_score: 10,
      risk_level: 'low',
      findings: [],
      recommendations: [],
      analyzed_at: new Date().toISOString(),
    },
  }),
  scanMessage: vi.fn().mockResolvedValue({ data: {} }),
}))

const renderWithQuery = (ui) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  })
  return render(<QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>)
}

describe('UrlScannerPage Component', () => {
  it('renders URL input field and shows validation error on empty submission', async () => {
    const user = userEvent.setup()
    renderWithQuery(<UrlScannerPage />)

    expect(screen.getByPlaceholderText(/example\.com/i)).toBeInTheDocument()
    const scanBtn = screen.getByRole('button', { name: /Launch Security Scan/i })
    await user.click(scanBtn)

    expect(screen.getByText('Please enter a target web URL to inspect.')).toBeInTheDocument()
  })

  it('clears validation error when valid URL is typed and submitted', async () => {
    const user = userEvent.setup()
    renderWithQuery(<UrlScannerPage />)

    const input = screen.getByPlaceholderText(/example\.com/i)
    await user.type(input, 'https://example.com')

    const scanBtn = screen.getByRole('button', { name: /Launch Security Scan/i })
    await user.click(scanBtn)

    expect(screen.queryByText('Please enter a target web URL to inspect.')).not.toBeInTheDocument()
  })
})
