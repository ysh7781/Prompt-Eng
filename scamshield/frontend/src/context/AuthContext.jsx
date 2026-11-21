import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import {
  login as apiLogin,
  logout as apiLogout,
  register as apiRegister,
  getMe,
  refreshToken as apiRefreshToken,
} from '../services/authApi.js'
import {
  setAccessToken,
  setRefreshToken,
  clearAccessToken,
  getAccessToken,
  getRefreshToken,
} from '../services/api.js'

const getStoredUser = () => {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      const saved = window.localStorage.getItem('user')
      return saved ? JSON.parse(saved) : null
    }
  } catch {
    // ignore
  }
  return null
}

const setStoredUser = (user) => {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      if (user) {
        window.localStorage.setItem('user', JSON.stringify(user))
      } else {
        window.localStorage.removeItem('user')
      }
    }
  } catch {
    // ignore
  }
}

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => getStoredUser())
  const [loading, setLoading] = useState(true)

  const handleLogout = useCallback(async () => {
    try {
      await apiLogout()
    } catch {
      // best-effort
    } finally {
      clearAccessToken()
      setUser(null)
      setStoredUser(null)
    }
  }, [])

  // Listen for auth:logout event from API interceptor
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.addEventListener('auth:logout', handleLogout)
      return () => window.removeEventListener('auth:logout', handleLogout)
    }
  }, [handleLogout])

  // On mount, verify and restore session
  useEffect(() => {
    const restoreSession = async () => {
      const token = getAccessToken()
      const savedRefreshToken = getRefreshToken()

      if (!token && !savedRefreshToken) {
        setLoading(false)
        return
      }

      try {
        const response = await getMe()
        setUser(response.data)
        setStoredUser(response.data)
        if (response.data.access_token) {
          setAccessToken(response.data.access_token)
        }
      } catch {
        // If initial getMe failed, try refreshing access token using saved refresh token
        if (savedRefreshToken) {
          try {
            const refreshRes = await apiRefreshToken(savedRefreshToken)
            const newToken = refreshRes.data.access_token
            setAccessToken(newToken)
            if (refreshRes.data.refresh_token) {
              setRefreshToken(refreshRes.data.refresh_token)
            }
            const meRes = await getMe()
            setUser(meRes.data)
            setStoredUser(meRes.data)
          } catch {
            clearAccessToken()
            setUser(null)
            setStoredUser(null)
          }
        } else {
          clearAccessToken()
          setUser(null)
          setStoredUser(null)
        }
      } finally {
        setLoading(false)
      }
    }
    restoreSession()
  }, [])

  const login = async (credentials) => {
    const response = await apiLogin(credentials)
    const { access_token, refresh_token: rToken, user: userData } = response.data
    setAccessToken(access_token)
    if (rToken) {
      setRefreshToken(rToken)
    }
    setUser(userData)
    setStoredUser(userData)
    return userData
  }

  const register = async (data) => {
    const response = await apiRegister(data)
    const { access_token, refresh_token: rToken, user: userData } = response.data
    setAccessToken(access_token)
    if (rToken) {
      setRefreshToken(rToken)
    }
    setUser(userData)
    setStoredUser(userData)
    return userData
  }

  const logout = async () => {
    await handleLogout()
  }

  const value = {
    user,
    loading,
    login,
    logout,
    register,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export default AuthContext
