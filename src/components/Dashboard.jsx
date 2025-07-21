import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { libraryAPI } from '../services/api'
import { 
  BookOpen, 
  Clock, 
  AlertTriangle, 
  CheckCircle, 
  Search, 
  Plus,
  TrendingUp,
  Users,
  Calendar
} from 'lucide-react'
import LoadingSpinner from './LoadingSpinner'
import { useNotification } from '../contexts/NotificationContext'

const Dashboard = () => {
  const { user } = useAuth()
  const [stats, setStats] = useState(null)
  const [recentBorrowings, setRecentBorrowings] = useState([])
  const [loading, setLoading] = useState(true)
  const { showError } = useNotification()

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true)
        // Fetch user's borrowings
        const borrowings = await libraryAPI.getBorrowings()
        setRecentBorrowings(borrowings.slice(0, 5)) // Show last 5 borrowings
        // Fetch stats if user is admin/librarian
        if (user?.role === 'librarian' || user?.role === 'admin') {
          const statsData = await libraryAPI.getStats()
          setStats(statsData)
        }
      } catch (error) {
        showError('Error fetching dashboard data')
      } finally {
        setLoading(false)
      }
    }
    fetchDashboardData()
  }, [user, showError])

  if (loading) {
    return <LoadingSpinner text="Loading dashboard..." />
  }

  const getOverdueBooks = () => {
    return recentBorrowings.filter(borrowing => {
      const dueDate = new Date(borrowing.due_date)
      const today = new Date()
      return dueDate < today && borrowing.status === 'borrowed'
    })
  }

  const overdueBooks = getOverdueBooks()

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-library-blue to-blue-600 rounded-lg p-6 text-white">
        <h1 className="text-2xl font-bold">Welcome back, {user?.name || user?.username}!</h1>
        <p className="text-blue-100 mt-1">Manage your library experience</p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link
          to="/books"
          className="card hover:shadow-md transition-shadow duration-200 group"
        >
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
              <Search className="h-6 w-6 text-library-blue" />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-900">Browse Books</h3>
              <p className="text-sm text-gray-500">Find your next read</p>
            </div>
          </div>
        </Link>

        <Link
          to="/my-books"
          className="card hover:shadow-md transition-shadow duration-200 group"
        >
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg group-hover:bg-green-200 transition-colors">
              <BookOpen className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-900">My Books</h3>
              <p className="text-sm text-gray-500">View borrowed books</p>
            </div>
          </div>
        </Link>

        {(user?.role === 'librarian' || user?.role === 'admin') && (
          <Link
            to="/admin"
            className="card hover:shadow-md transition-shadow duration-200 group"
          >
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg group-hover:bg-purple-200 transition-colors">
                <Plus className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-900">Admin Panel</h3>
                <p className="text-sm text-gray-500">Manage library</p>
              </div>
            </div>
          </Link>
        )}

        <div className="card hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Clock className="h-6 w-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-900">Due Soon</h3>
              <p className="text-sm text-gray-500">{recentBorrowings.length} books</p>
            </div>
          </div>
        </div>
      </div>

      {/* Statistics */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="card">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <BookOpen className="h-6 w-6 text-library-blue" />
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-500">Total Books</h3>
                <p className="text-2xl font-bold text-gray-900">{stats.totalBooks}</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-500">Available</h3>
                <p className="text-2xl font-bold text-gray-900">{stats.availableCopies}</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Users className="h-6 w-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-500">Active Loans</h3>
                <p className="text-2xl font-bold text-gray-900">{stats.activeBorrowings}</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-lg">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-500">Overdue</h3>
                <p className="text-2xl font-bold text-gray-900">{stats.overdueBooks}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Borrowings */}
        <div className="card">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h3>
          {recentBorrowings.length > 0 ? (
            <div className="space-y-3">
              {recentBorrowings.map((borrowing) => (
                <div key={borrowing.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <BookOpen className="h-5 w-5 text-gray-400 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">{borrowing.title}</p>
                      <p className="text-xs text-gray-500">Due: {new Date(borrowing.due_date).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    {borrowing.status === 'borrowed' && (
                      <span className="badge badge-info">Borrowed</span>
                    )}
                    {borrowing.status === 'returned' && (
                      <span className="badge badge-success">Returned</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm">No recent activity</p>
          )}
        </div>

        {/* Overdue Books */}
        <div className="card">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Overdue Books</h3>
          {overdueBooks.length > 0 ? (
            <div className="space-y-3">
              {overdueBooks.map((borrowing) => (
                <div key={borrowing.id} className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-200">
                  <div className="flex items-center">
                    <AlertTriangle className="h-5 w-5 text-red-500 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">{borrowing.title}</p>
                      <p className="text-xs text-red-600">
                        Overdue since {new Date(borrowing.due_date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <span className="badge badge-danger">Overdue</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center py-8">
              <CheckCircle className="h-8 w-8 text-green-500 mr-3" />
              <p className="text-gray-500 text-sm">No overdue books!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Dashboard 