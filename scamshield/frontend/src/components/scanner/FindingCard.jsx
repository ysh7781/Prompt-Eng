import React from 'react'
import { AlertTriangle, AlertCircle, Info, Shield } from 'lucide-react'
import { cn } from '../../utils/cn.js'
import { getRiskBgColor } from '../../utils/riskColors.js'

const severityIcons = {
  low: Info,
  medium: AlertCircle,
  high: AlertTriangle,
  critical: Shield,
}

function FindingCard({ finding }) {
  const { rule_code, category, description, severity, score_contribution, evidence } = finding
  const Icon = severityIcons[severity] || AlertCircle

  return (
    <div className={cn('rounded-lg border p-4 space-y-2', getRiskBgColor(severity))}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-2">
          <Icon className="h-4 w-4 flex-shrink-0" />
          <span className="text-sm font-semibold">{category}</span>
        </div>
        <span className="text-xs font-mono opacity-70">+{score_contribution} pts</span>
      </div>
      <p className="text-sm opacity-90">{description}</p>
      {evidence && (
        <div className="rounded-md bg-black/20 px-3 py-2 mt-2">
          <p className="text-xs font-mono opacity-70 break-all">{evidence}</p>
        </div>
      )}
      <p className="text-xs opacity-50 font-mono">{rule_code}</p>
    </div>
  )
}

export default FindingCard

