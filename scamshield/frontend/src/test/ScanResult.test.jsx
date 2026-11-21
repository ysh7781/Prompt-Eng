import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import ScanResult from '../components/scanner/ScanResult.jsx'

describe('ScanResult Component', () => {
  const mockResult = {
    id: 'test-scan-1',
    input_type: 'message',
    risk_score: 85,
    risk_level: 'critical',
    findings: [
      {
        id: 'f1',
        rule_code: 'MSG_URGENCY_01',
        category: 'Urgency & Pressure',
        description: 'Demands immediate action under threat of penalty',
        severity: 'critical',
        score_contribution: 40,
        evidence: 'Account will be terminated in 24 hours',
      },
    ],
    recommendations: [
      'Do not click any embedded links or provide credentials.',
      'Contact your bank directly via their official phone number.',
    ],
    analyzed_at: '2024-01-01T12:00:00Z',
  }

  it('renders scan verdict, score and findings', () => {
    render(<ScanResult result={mockResult} />)
    expect(screen.getByText(/Analysis Complete/i)).toBeInTheDocument()
    expect(screen.getByText(/85/i)).toBeInTheDocument()
    expect(screen.getByText(/Demands immediate action under threat of penalty/i)).toBeInTheDocument()
    expect(screen.getByText(/Account will be terminated in 24 hours/i)).toBeInTheDocument()
    expect(screen.getByText(/Do not click any embedded links/i)).toBeInTheDocument()
  })

  it('renders safe state when there are no findings', () => {
    const safeResult = {
      id: 'test-scan-2',
      input_type: 'url',
      risk_score: 5,
      risk_level: 'low',
      findings: [],
      recommendations: [],
      analyzed_at: '2024-01-01T12:00:00Z',
    }
    render(<ScanResult result={safeResult} />)
    expect(screen.getByText(/No threats detected/i)).toBeInTheDocument()
  })
})
