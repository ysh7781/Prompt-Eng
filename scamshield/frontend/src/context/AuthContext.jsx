import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { login as apiLogin, logout as apiLogout, register as apiRegister, getMe } from '../services/authApi.js'
import { setAccessToken, clearAccessToken } from '../services/api.js'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  const handleLogout = useCallback(async () => {
    try {
      await apiLogout()
    } catch {
      // best-effort
    } finally {
      clearAccessToken()
      setUser(null)
    }
  }, [])

  // Listen for auth:logout event from API interceptor
  useEffect(() => {
    window.addEventListener('auth:logout', handleLogout)
    return () => window.removeEventListener('auth:logout', handleLogout)
  }, [handleLogout])

  // On mount, try to restore session via /auth/me
  useEffect(() => {
    const restoreSession = async () => {
      try {
        const response = await getMe()
        setUser(response.data)
        // access_token may come back in response if server rotates it
        if (response.data.access_token) {
          setAccessToken(response.data.access_token)
        }
      } catch {
        // No valid session
        clearAccessToken()
        setUser(null)
      } finally {
        setLoading(false)
      }
    }
    restoreSession()
  }, [])

  const login = async (credentials) => {
    const response = await apiLogin(credentials)
    const { access_token, user: userData } = response.data
    setAccessToken(access_token)
    setUser(userData)
    return userData
  }

  const register = async (data) => {
    const response = await apiRegister(data)
    const { access_token, user: userData } = response.data
    setAccessToken(access_token)
    setUser(userData)
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

