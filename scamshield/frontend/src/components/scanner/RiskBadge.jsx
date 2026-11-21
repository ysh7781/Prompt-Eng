import React from 'react'
import { getRiskBgColor, getRiskLabel } from '../../utils/riskColors.js'
import { cn } from '../../utils/cn.js'

function RiskBadge({ level, className }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold capitalize',
        getRiskBgColor(level),
        className,
      )}
    >
      <span className="relative flex h-1.5 w-1.5 shrink-0">
        <span
          className={cn(
            'inline-flex rounded-full h-1.5 w-1.5',
            level === 'low' ? 'bg-emerald-600' :
            level === 'moderate' ? 'bg-amber-600' :
            level === 'high' ? 'bg-orange-600' :
            'bg-rose-600'
          )}
        />
      </span>
      {getRiskLabel(level)}
    </span>
  )
}

export default RiskBadge
