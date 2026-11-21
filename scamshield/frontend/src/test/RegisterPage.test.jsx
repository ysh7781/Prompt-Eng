import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { BrowserRouter } from 'react-router-dom'
import RegisterPage from '../pages/RegisterPage.jsx'
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
        <RegisterPage />
      </BrowserRouter>
    </AuthContext.Provider>,
  )
}

describe('RegisterPage Component', () => {
  it('renders registration form inputs', () => {
    renderWithContext()
    expect(screen.getByLabelText(/Full Name/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Email Address/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/^Password/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Confirm Password/i)).toBeInTheDocument()
  })

  it('validates password requirements and mismatch', async () => {
    const user = userEvent.setup()
    renderWithContext()

    await user.type(screen.getByLabelText(/Full Name/i), 'John Doe')
    await user.type(screen.getByLabelText(/Email Address/i), 'john@example.com')
    await user.type(screen.getByLabelText(/^Password/i), 'short')
    await user.type(screen.getByLabelText(/Confirm Password/i), 'different')
    await user.click(screen.getByRole('button', { name: /Create Account/i }))

    await waitFor(() => {
      expect(screen.getByText(/Password must be at least 8 characters/i)).toBeInTheDocument()
      expect(screen.getByText(/Passwords do not match/i)).toBeInTheDocument()
    })
  })
})
