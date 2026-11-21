export const RISK_LEVELS = {
  low: 'low',
  moderate: 'moderate',
  high: 'high',
  critical: 'critical',
}

export function getRiskColor(level) {
  switch (level?.toLowerCase()) {
    case 'low':
      return 'text-green-500'
    case 'moderate':
      return 'text-yellow-500'
    case 'high':
      return 'text-orange-500'
    case 'critical':
      return 'text-red-500'
    default:
      return 'text-white/60'
  }
}

export function getRiskBgColor(level) {
  switch (level?.toLowerCase()) {
    case 'low':
      return 'bg-green-500/10 border-green-500/30 text-green-400'
    case 'moderate':
      return 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400'
    case 'high':
      return 'bg-orange-500/10 border-orange-500/30 text-orange-400'
    case 'critical':
      return 'bg-red-500/10 border-red-500/30 text-red-400'
    default:
      return 'bg-white/5 border-white/10 text-white/60'
  }
}

export function getRiskBarColor(level) {
  switch (level?.toLowerCase()) {
    case 'low':
      return 'bg-green-500'
    case 'moderate':
      return 'bg-yellow-500'
    case 'high':
      return 'bg-orange-500'
    case 'critical':
      return 'bg-red-500'
    default:
      return 'bg-blue-500'
  }
}

export function getRiskLabel(level) {
  if (!level) return 'Unknown'
  return level.charAt(0).toUpperCase() + level.slice(1)
}

export function getScoreToLevel(score) {
  if (score >= 75) return 'critical'
  if (score >= 50) return 'high'
  if (score >= 25) return 'moderate'
  return 'low'
}

export const RISK_CHART_COLORS = {
  low: '#22c55e',
  moderate: '#f59e0b',
  high: '#f97316',
  critical: '#ef4444',
}

