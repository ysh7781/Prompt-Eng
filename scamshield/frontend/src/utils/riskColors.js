export const RISK_LEVELS = {
  low: 'low',
  moderate: 'moderate',
  high: 'high',
  critical: 'critical',
}

export function getRiskColor(level) {
  switch (level?.toLowerCase()) {
    case 'low':
      return 'text-emerald-700'
    case 'moderate':
      return 'text-amber-700'
    case 'high':
      return 'text-orange-700'
    case 'critical':
      return 'text-rose-700'
    default:
      return 'text-slate-600'
  }
}

export function getRiskBgColor(level) {
  switch (level?.toLowerCase()) {
    case 'low':
      return 'bg-emerald-50 border-emerald-200 text-emerald-800'
    case 'moderate':
      return 'bg-amber-50 border-amber-200 text-amber-800'
    case 'high':
      return 'bg-orange-50 border-orange-200 text-orange-800'
    case 'critical':
      return 'bg-rose-50 border-rose-200 text-rose-800'
    default:
      return 'bg-slate-50 border-slate-200 text-slate-700'
  }
}

export function getRiskBarColor(level) {
  switch (level?.toLowerCase()) {
    case 'low':
      return 'bg-emerald-500'
    case 'moderate':
      return 'bg-amber-500'
    case 'high':
      return 'bg-orange-500'
    case 'critical':
      return 'bg-rose-500'
    default:
      return 'bg-slate-400'
  }
}

export function getRiskLabel(level) {
  switch (level?.toLowerCase()) {
    case 'low':
      return 'Low Risk'
    case 'moderate':
      return 'Moderate Risk'
    case 'high':
      return 'High Risk'
    case 'critical':
      return 'Critical Risk'
    default:
      return 'Unknown'
  }
}

export const RISK_CHART_COLORS = {
  low: '#10B981',
  moderate: '#F59E0B',
  high: '#F97316',
  critical: '#EF4444',
}
