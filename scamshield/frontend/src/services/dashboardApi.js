import api from './api.js'

export const getDashboardStats = () => api.get('/dashboard/stats')
export const getRecentScans = (limit) => api.get('/dashboard/recent-scans', { params: { limit } })
export const getRiskDistribution = () => api.get('/dashboard/risk-distribution')

