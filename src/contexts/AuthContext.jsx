import React, { createContext, useContext, useState, useEffect } from 'react'
import { libraryAPI, authAPI } from '../services/api'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Check if user is already logged in on app start
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('token')
        if (token) {
          const userData = await authAPI.getProfile()
          console.log(userData.data)
          setUser(userData.data)
        }
      } catch (error) {
        console.error('Auth check failed:', error)
        localStorage.removeItem('token')
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [])

  const login = async (username, password) => {
    try {
      setError(null)
      setLoading(true)
      
      const response = await authAPI.login(username, password)
      const userData = response.data
      
      setUser(userData.user) // Revert to correct user object
      return true
    } catch (error) {
      setError(error.message || 'Login failed')
      return false
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    try {
      await authAPI.logout()
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      setUser(null)
      localStorage.removeItem('token')
    }
  }

  const value = {
    user,
    loading,
    error,
    login,
    logout,
    setError
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
} 