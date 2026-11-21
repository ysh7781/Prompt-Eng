import React from 'react'
import { AlertTriangle, AlertCircle, Info, ShieldAlert } from 'lucide-react'
import { cn } from '../../utils/cn.js'
import { getRiskBgColor } from '../../utils/riskColors.js'

const severityIcons = {
  low: Info,
  medium: AlertCircle,
  high: AlertTriangle,
  critical: ShieldAlert,
}

function FindingCard({ finding }) {
  const { rule_code, category, description, severity, score_contribution, evidence } = finding
  const Icon = severityIcons[severity] || AlertCircle

  return (
    <div className="rounded-xl border border-[#E8EFF6] bg-white p-4 shadow-sm space-y-2.5">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-lg bg-[#F8FAFC] border border-[#E8EFF6] flex items-center justify-center text-[#64748B]">
            <Icon className="h-4 w-4" />
          </div>
          <div>
            <span className="text-xs font-bold text-[#172B4D] capitalize">{category.replace('_', ' ')}</span>
            <span className="text-[10px] text-[#94A3B8] font-mono block">{rule_code}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={cn('text-[11px] font-semibold px-2 py-0.5 rounded-full border', getRiskBgColor(severity))}>
            {severity}
          </span>
          <span className="text-xs font-bold text-[#172B4D] font-mono">+{score_contribution} pts</span>
        </div>
      </div>

      <p className="text-xs text-[#2D3F5D] leading-relaxed pl-9">{description}</p>

      {evidence && (
        <div className="ml-9 rounded-lg bg-[#F4F8FD] border border-[#E8EFF6] p-2.5 text-xs">
          <span className="text-[10px] font-semibold text-[#64748B] block uppercase tracking-wider mb-0.5">Matched Indicator:</span>
          <p className="font-mono text-rose-700 font-medium break-all">{evidence}</p>
        </div>
      )}
    </div>
  )
}

export default FindingCard
