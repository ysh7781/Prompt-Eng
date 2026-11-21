import axios from 'axios'

const getStorageItem = (key) => {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      return window.localStorage.getItem(key)
    }
  } catch {
    // ignore
  }
  return null
}

const setStorageItem = (key, value) => {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      if (value) {
        window.localStorage.setItem(key, value)
      } else {
        window.localStorage.removeItem(key)
      }
    }
  } catch {
    // ignore
  }
}

const removeStorageItem = (key) => {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.removeItem(key)
    }
  } catch {
    // ignore
  }
}

// Access token and refresh token stored in module variable + localStorage for resilience across reloads
let accessToken = getStorageItem('access_token')
let refreshToken = getStorageItem('refresh_token')

export const setAccessToken = (token) => {
  accessToken = token
  setStorageItem('access_token', token)
}

export const getAccessToken = () => accessToken || getStorageItem('access_token')

export const setRefreshToken = (token) => {
  refreshToken = token
  setStorageItem('refresh_token', token)
}

export const getRefreshToken = () => refreshToken || getStorageItem('refresh_token')

export const clearAccessToken = () => {
  accessToken = null
  refreshToken = null
  removeStorageItem('access_token')
  removeStorageItem('refresh_token')
  removeStorageItem('user')
}

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api/v1',
  withCredentials: true, // send cookies (refresh token)
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor: attach Bearer token
api.interceptors.request.use((config) => {
  const token = getAccessToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Flag to prevent multiple simultaneous refresh attempts
let isRefreshing = false
let failedQueue = []

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error)
    } else {
      prom.resolve(token)
    }
  })
  failedQueue = []
}

// Response interceptor: handle 401, attempt refresh, retry once
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url?.includes('/auth/refresh') &&
      !originalRequest.url?.includes('/auth/login') &&
      !originalRequest.url?.includes('/scanner/demo')
    ) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`
            return api(originalRequest)
          })
          .catch((err) => Promise.reject(err))
      }

      originalRequest._retry = true
      isRefreshing = true

      try {
        const currentRefreshToken = getRefreshToken()
        const response = await api.post(
          '/auth/refresh',
          currentRefreshToken ? { refresh_token: currentRefreshToken } : {}
        )
        const newToken = response.data.access_token
        setAccessToken(newToken)
        if (response.data.refresh_token) {
          setRefreshToken(response.data.refresh_token)
        }
        processQueue(null, newToken)
        originalRequest.headers.Authorization = `Bearer ${newToken}`
        return api(originalRequest)
      } catch (refreshError) {
        processQueue(refreshError, null)
        clearAccessToken()
        // Dispatch logout event
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new Event('auth:logout'))
        }
        return Promise.reject(refreshError)
      } finally {
        isRefreshing = false
      }
    }

    return Promise.reject(error)
  },
)

export default api
