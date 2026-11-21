import { useQuery } from '@tanstack/react-query'
import { getDashboardStats, getRecentScans, getRiskDistribution } from '../services/dashboardApi.js'

export function useDashboardStats() {
  return useQuery({
    queryKey: ['dashboard', 'stats'],
    queryFn: () => getDashboardStats().then((r) => r.data),
  })
}

export function useRecentScans(limit = 10) {
  return useQuery({
    queryKey: ['dashboard', 'recent-scans', limit],
    queryFn: () => getRecentScans(limit).then((r) => r.data),
  })
}

export function useRiskDistribution() {
  return useQuery({
    queryKey: ['dashboard', 'risk-distribution'],
    queryFn: () => getRiskDistribution().then((r) => r.data),
  })
}

