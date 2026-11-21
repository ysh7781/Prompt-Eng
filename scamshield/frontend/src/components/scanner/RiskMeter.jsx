import React from 'react'
import { cn } from '../../utils/cn.js'
import { getRiskBarColor } from '../../utils/riskColors.js'

function RiskMeter({ score, level, className }) {
  const percentage = Math.min(100, Math.max(0, score || 0))

  return (
    <div className={cn('space-y-2', className)}>
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-[#64748B]">Risk Score</span>
        <span className="text-2xl font-black text-[#172B4D]">
          {percentage}
          <span className="text-xs font-normal text-[#94A3B8]"> / 100</span>
        </span>
      </div>
      <div className="relative h-2.5 w-full rounded-full bg-[#E8EFF6] overflow-hidden">
        <div
          className={cn('h-full rounded-full transition-all duration-700 ease-out', getRiskBarColor(level))}
          style={{ width: `${percentage}%` }}
        />
      </div>
      <div className="flex justify-between text-[11px] font-medium text-[#94A3B8]">
        <span>0 (Safe)</span>
        <span>25 (Moderate)</span>
        <span>50 (High)</span>
        <span>75+ (Critical)</span>
      </div>
    </div>
  )
}

export default RiskMeter
