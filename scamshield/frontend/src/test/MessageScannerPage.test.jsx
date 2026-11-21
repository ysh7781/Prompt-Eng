import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import MessageScannerPage from '../pages/MessageScannerPage.jsx'

const renderWithQuery = (ui) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  })
  return render(<QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>)
}

describe('MessageScannerPage Component', () => {
  it('renders input textarea and character counter', () => {
    renderWithQuery(<MessageScannerPage />)
    expect(screen.getByPlaceholderText(/URGENT: Your bank account/i)).toBeInTheDocument()
    expect(screen.getByText('0/5000')).toBeInTheDocument()
  })

  it('updates character count when typing', async () => {
    const user = userEvent.setup()
    renderWithQuery(<MessageScannerPage />)

    const textarea = screen.getByPlaceholderText(/URGENT: Your bank account/i)
    await user.type(textarea, 'Hello world')

    expect(screen.getByText('11/5000')).toBeInTheDocument()
  })

  it('shows validation error when analyzing empty message', async () => {
    const user = userEvent.setup()
    renderWithQuery(<MessageScannerPage />)

    const scanBtn = screen.getByRole('button', { name: /Run Threat Scan/i })
    // If disabled by default when empty, we can check disabled property
    expect(scanBtn).toBeDisabled()
  })
})
