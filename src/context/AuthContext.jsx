import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { apiService } from '../api/client'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('medrecall_user')
      return saved ? JSON.parse(saved) : null
    } catch {
      return null
    }
  })
  const [token, setToken] = useState(() => {
    return localStorage.getItem('medrecall_token') || null
  })
  const [isLoading, setIsLoading] = useState(true)

  // Verify session on app launch using /api/v1/auth/me
  const restoreSession = useCallback(async () => {
    if (typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('preview_profile') === 'true') {
      const mockUser = {
        id: '6af56e72b501b76cf943ee01',
        name: 'Dr. Aarav Sharma',
        email: 'aarav@gmail.com',
        role: 'aspirant',
        targetExam: 'NEET_PG',
      }
      setUser(mockUser)
      setToken('mock_preview_token')
      setIsLoading(false)
      return
    }

    const savedToken = localStorage.getItem('medrecall_token')
    if (!savedToken) {
      setUser(null)
      setToken(null)
      setIsLoading(false)
      return
    }

    try {
      const res = await apiService.getMe()
      if (res?.success && res.user) {
        setUser(res.user)
        setToken(savedToken)
        localStorage.setItem('medrecall_user', JSON.stringify(res.user))
      } else {
        throw new Error('Session invalid')
      }
    } catch (err) {
      console.warn('Session verification failed, logging out:', err?.response?.data?.message || err.message)
      localStorage.removeItem('medrecall_token')
      localStorage.removeItem('medrecall_user')
      setUser(null)
      setToken(null)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    restoreSession()
  }, [restoreSession])

  // Login or Instant Registration
  const login = async ({ name, email, targetExam = 'NEET_PG' }) => {
    try {
      const payload = {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        targetExam,
      }

      const res = await apiService.login(payload)
      if (res?.success && res.token && res.user) {
        localStorage.setItem('medrecall_token', res.token)
        localStorage.setItem('medrecall_user', JSON.stringify(res.user))
        setToken(res.token)
        setUser(res.user)
        return {
          success: true,
          isNewUser: Boolean(res.isNewUser),
          user: res.user,
          token: res.token,
        }
      }
      throw new Error(res?.message || 'Login failed')
    } catch (err) {
      const errorData = err.response?.data
      let message = errorData?.message || 'Unable to authenticate. Please try again.'
      if (errorData?.details) {
        const fieldErrors = Object.values(errorData.details).flat()
        if (fieldErrors.length > 0) {
          message = fieldErrors.join(', ')
        }
      }
      return {
        success: false,
        error: message,
        details: errorData?.details || null,
      }
    }
  }

  // Logout
  const logout = useCallback(() => {
    localStorage.removeItem('medrecall_token')
    localStorage.removeItem('medrecall_user')
    setUser(null)
    setToken(null)
  }, [])

  // Update target exam or profile
  const updateTargetExam = async (newExam) => {
    if (!user) return
    try {
      const res = await apiService.updateProfile({
        targetExam: newExam,
      })
      if (res?.success && res.user) {
        setUser(res.user)
        localStorage.setItem('medrecall_user', JSON.stringify(res.user))
        return { success: true, user: res.user }
      }
    } catch (err) {
      console.error('Failed to update target exam:', err)
      return { success: false, error: err.message }
    }
  }

  const value = {
    user,
    token,
    isAuthenticated: Boolean(user && token),
    isLoading,
    login,
    logout,
    restoreSession,
    updateTargetExam,
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
