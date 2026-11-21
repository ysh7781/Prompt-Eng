import api from './api.js'

export const getHistory = (params) => api.get('/history', { params })
export const getScanDetail = (id) => api.get(`/history/${id}`)
export const deleteScan = (id) => api.delete(`/history/${id}`)

