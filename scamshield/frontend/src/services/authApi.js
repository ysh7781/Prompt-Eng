import api, { getRefreshToken } from './api.js'

export const register = (data) => api.post('/auth/register', data)
export const login = (data) => api.post('/auth/login', data)
export const logout = () => api.post('/auth/logout')
export const refreshToken = (token) => {
  const currentToken = token || getRefreshToken()
  return api.post('/auth/refresh', currentToken ? { refresh_token: currentToken } : {})
}
export const getMe = () => api.get('/auth/me')
