import React from 'react'
import { cn } from '../../utils/cn.js'
import { Spinner } from '../ui/Spinner.jsx'

function StatsCard({ icon: Icon, label, value, sub, iconBg = 'bg-blue-600/10 border-blue-500/20', iconColor = 'text-blue-400', loading }) {
  return (
    <div className="rounded-xl border border-white/10 bg-[#0a1628] p-5 flex items-center gap-4">
      <div className={cn('flex-shrink-0 p-3 rounded-lg border', iconBg)}>
        {Icon && <Icon className={cn('h-5 w-5', iconColor)} />}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-white/50 font-medium uppercase tracking-wider">{label}</p>
        {loading ? (
          <Spinner size="sm" className="mt-1" />
        ) : (
          <p className="text-2xl font-bold text-white mt-0.5">{value ?? '—'}</p>
        )}
        {sub && <p className="text-xs text-white/40 mt-0.5">{sub}</p>}
      </div>
    </div>
  )
}

export default StatsCard

