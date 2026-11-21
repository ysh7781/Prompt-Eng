import React from 'react'
import { getRiskBgColor, getRiskLabel } from '../../utils/riskColors.js'
import { cn } from '../../utils/cn.js'

function RiskBadge({ level, className }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wider',
        getRiskBgColor(level),
        className,
      )}
    >
      <span className="relative flex h-1.5 w-1.5">
        <span className={cn(
          'inline-flex rounded-full h-1.5 w-1.5',
          level === 'low' ? 'bg-green-400' :
          level === 'moderate' ? 'bg-yellow-400' :
          level === 'high' ? 'bg-orange-400' :
          'bg-red-400'
        )} />
      </span>
      {getRiskLabel(level)}
    </span>
  )
}

export default RiskBadge

