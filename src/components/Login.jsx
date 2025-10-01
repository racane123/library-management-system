import React, { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useNotification } from '../contexts/NotificationContext'
import { BookOpen, Lock, User, AlertCircle } from 'lucide-react'
import aisatLogo from "../assets/AISAT-logo.png"
import aisatLabel from "../assets/AISAT LABEL.png"
import "./Component.css"

const Login = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { login, error, setError } = useAuth()
  const { showError, showSuccess } = useNotification()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const success = await login(username, password)
      if (!success) {
        showError('Invalid username or password')
        setIsLoading(false)
      } else {
        showSuccess('Login successful!')
      }
    } catch (err) {
      showError('Login failed. Please try again.')
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-2 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center">
            <img src={aisatLogo} alt="" className='AISAT-logo'/>
            <img src={aisatLabel} alt="" className='AISAT-label'/>
          </div>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            School Library System
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Sign in to access your library account
          </p>
        </div>

        <div className="card bg-white shadow-lg rounded-lg p-6">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="flex items-center p-4 text-sm text-red-800 border border-red-200 rounded-lg bg-red-50">
                <AlertCircle className="h-4 w-4 mr-2" />
                {error}
              </div>
            )}

            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                Username
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="input-field pl-10"
                  placeholder="Enter your username"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-field pl-10"
                  placeholder="Enter your password"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="btn-primary w-full flex justify-center items-center"
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Signing in...
                  </div>
                ) : (
                  'Sign in'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Login 