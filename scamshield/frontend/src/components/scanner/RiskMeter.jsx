import React from 'react'
import { cn } from '../../utils/cn.js'
import { getRiskBarColor } from '../../utils/riskColors.js'

function RiskMeter({ score, level, className }) {
  const percentage = Math.min(100, Math.max(0, score || 0))

  return (
    <div className={cn('space-y-2', className)}>
      <div className="flex items-center justify-between">
        <span className="text-sm text-white/60">Risk Score</span>
        <span className="text-2xl font-bold text-white">{percentage}<span className="text-sm text-white/40">/100</span></span>
      </div>
      <div className="relative h-3 w-full rounded-full bg-white/10 overflow-hidden">
        <div
          className={cn('h-full rounded-full transition-all duration-700 ease-out', getRiskBarColor(level))}
          style={{ width: `${percentage}%` }}
        />
      </div>
      <div className="flex justify-between text-xs text-white/30">
        <span>Safe</span>
        <span>Moderate</span>
        <span>High</span>
        <span>Critical</span>
      </div>
    </div>
  )
}

export default RiskMeter

