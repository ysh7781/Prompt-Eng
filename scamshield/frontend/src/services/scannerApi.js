import api from './api.js'

export const scanMessage = (data) => api.post('/scanner/message', data)
export const scanUrl = (data) => api.post('/scanner/url', data)
export const demoScan = (data) => api.post('/scanner/demo', data)

