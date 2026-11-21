import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import RiskBadge from '../components/scanner/RiskBadge.jsx'

describe('RiskBadge Component', () => {
  it('renders low risk correctly', () => {
    render(<RiskBadge level="low" />)
    const element = screen.getByText(/Low/i)
    expect(element).toBeInTheDocument()
  })

  it('renders moderate risk correctly', () => {
    render(<RiskBadge level="moderate" />)
    const element = screen.getByText(/Moderate/i)
    expect(element).toBeInTheDocument()
  })

  it('renders high risk correctly', () => {
    render(<RiskBadge level="high" />)
    const element = screen.getByText(/High/i)
    expect(element).toBeInTheDocument()
  })

  it('renders critical risk correctly', () => {
    render(<RiskBadge level="critical" />)
    const element = screen.getByText(/Critical/i)
    expect(element).toBeInTheDocument()
  })
})
