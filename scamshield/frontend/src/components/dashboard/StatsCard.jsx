import React from 'react'
import { cn } from '../../utils/cn.js'
import { Spinner } from '../ui/Spinner.jsx'

function StatsCard({ icon: Icon, label, value, badgeText, badgeColor = 'bg-emerald-50 text-emerald-800 border-emerald-200', loading }) {
  return (
    <div className="rounded-2xl border border-[#E8EFF6] bg-white p-5 shadow-[0_2px_10px_rgba(23,43,77,0.04)] hover:shadow-[0_4px_16px_rgba(23,43,77,0.07)] transition-all">
      <div className="flex items-center justify-between mb-3">
        <div className="h-10 w-10 rounded-xl bg-[#F8FAFC] border border-[#E8EFF6] flex items-center justify-center text-[#64748B]">
          {Icon && <Icon className="h-5 w-5" />}
        </div>
        {badgeText && (
          <span className={cn('text-[11px] font-semibold px-2 py-0.5 rounded-full border', badgeColor)}>
            {badgeText}
          </span>
        )}
      </div>

      <div>
        <p className="text-xs font-medium text-[#64748B]">{label}</p>
        {loading ? (
          <div className="py-2">
            <Spinner size="sm" />
          </div>
        ) : (
          <p className="text-2xl sm:text-3xl font-extrabold text-[#172B4D] tracking-tight mt-1">
            {value ?? '0'}
          </p>
        )}
      </div>
    </div>
  )
}

export default StatsCard
