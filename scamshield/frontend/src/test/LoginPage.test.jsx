import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { BrowserRouter } from 'react-router-dom'
import LoginPage from '../pages/LoginPage.jsx'
import AuthContext from '../context/AuthContext.jsx'

const renderWithContext = (authValues = {}) => {
  const defaultAuth = {
    user: null,
    loading: false,
    login: vi.fn(),
    logout: vi.fn(),
    register: vi.fn(),
    isAuthenticated: false,
    isAdmin: false,
    ...authValues,
  }

  return render(
    <AuthContext.Provider value={defaultAuth}>
      <BrowserRouter>
        <LoginPage />
      </BrowserRouter>
    </AuthContext.Provider>,
  )
}

describe('LoginPage Component', () => {
  it('renders login form with inputs and submit button', () => {
    renderWithContext()
    expect(screen.getByLabelText(/Email Address/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Sign In/i })).toBeInTheDocument()
  })

  it('validates email format on submission', async () => {
    const user = userEvent.setup()
    renderWithContext()

    const emailInput = screen.getByLabelText(/Email Address/i)
    const submitBtn = screen.getByRole('button', { name: /Sign In/i })

    await user.type(emailInput, 'invalid-email')
    await user.click(submitBtn)

    await waitFor(() => {
      expect(screen.getByText(/Please enter a valid email address/i)).toBeInTheDocument()
    })
  })

  it('calls login on valid form submission', async () => {
    const mockLogin = vi.fn().mockResolvedValue({ id: '1', name: 'Test' })
    const user = userEvent.setup()
    renderWithContext({ login: mockLogin })

    const emailInput = screen.getByLabelText(/Email Address/i)
    const passwordInput = screen.getByLabelText(/Password/i)
    const submitBtn = screen.getByRole('button', { name: /Sign In/i })

    await user.type(emailInput, 'test@example.com')
    await user.type(passwordInput, 'SecretPassword123')
    await user.click(submitBtn)

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'SecretPassword123',
      })
    })
  })
})
