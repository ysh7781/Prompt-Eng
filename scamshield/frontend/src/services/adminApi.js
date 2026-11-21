import api from './api.js'

export const getRules = () => api.get('/admin/rules')
export const createRule = (data) => api.post('/admin/rules', data)
export const updateRule = (id, data) => api.patch(`/admin/rules/${id}`, data)
export const deleteRule = (id) => api.delete(`/admin/rules/${id}`)
export const getAdminStats = () => api.get('/admin/stats')

