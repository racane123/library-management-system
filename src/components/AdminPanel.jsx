import React, { useState, useEffect } from 'react'
import { libraryAPI } from '../services/api'
import { 
  BookOpen, 
  Users, 
  TrendingUp, 
  Calendar,
  AlertTriangle,
  CheckCircle
} from 'lucide-react'
import LoadingSpinner from './LoadingSpinner'
import { useNotification } from '../contexts/NotificationContext'
import { useAuth } from '../contexts/AuthContext'
import BookManagement from './BookManagement'
import UserManagement from './UserManagement'
import ReservationManagement from './ReservationManagement'
import Circulation from './Circulation';

const AdminPanel = () => {
  const [stats, setStats] = useState(null)
  const [recentBorrowings, setRecentBorrowings] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')
  const { showError } = useNotification()
  const { user } = useAuth();

  useEffect(() => {
    fetchAdminData();
  }, [activeTab]);

  const fetchAdminData = async () => {
    if (activeTab !== 'overview' && activeTab !== 'borrowings') return;
    try {
      setLoading(true)
      const [statsData, borrowingsData] = await Promise.all([
        libraryAPI.getStats(),
        libraryAPI.getAllBorrowings({ limit: 10 })
      ])
      setStats(statsData)
      setRecentBorrowings(borrowingsData)
    } catch (error) {
      showError('Error fetching admin data')
    } finally {
      setLoading(false)
    }
  }

  const getBorrowingStatus = (borrowing) => {
    const dueDate = new Date(borrowing.due_date)
    const today = new Date()
    const isOverdue = dueDate < today && borrowing.status === 'borrowed'

    if (borrowing.status === 'returned') {
      return {
        status: 'returned',
        text: 'Returned',
        icon: CheckCircle,
        color: 'text-green-600',
        bgColor: 'bg-green-100'
      }
    }

    if (isOverdue) {
      return {
        status: 'overdue',
        text: 'Overdue',
        icon: AlertTriangle,
        color: 'text-red-600',
        bgColor: 'bg-red-100'
      }
    }

    return {
      status: 'borrowed',
      text: 'Borrowed',
      icon: Calendar,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    }
  }

  if (loading) {
    return <LoadingSpinner text="Loading admin panel..." />
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Admin Panel</h1>
        <p className="text-gray-600 mt-1">Manage your library system</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <BookOpen className="h-6 w-6 text-library-blue" />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">Total Books</h3>
              <p className="text-2xl font-bold text-gray-900">{stats?.totalBooks || 0}</p>
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
              <p className="text-2xl font-bold text-gray-900">{stats?.availableCopies || 0}</p>
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
              <p className="text-2xl font-bold text-gray-900">{stats?.activeBorrowings || 0}</p>
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
              <p className="text-2xl font-bold text-gray-900">{stats?.overdueBooks || 0}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          <button onClick={() => setActiveTab('overview')} className={`shrink-0 border-b-2 py-4 px-1 text-sm font-medium ${activeTab === 'overview' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>Overview</button>
          <button onClick={() => setActiveTab('borrowings')} className={`shrink-0 border-b-2 py-4 px-1 text-sm font-medium ${activeTab === 'borrowings' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>Recent Borrowings</button>
          <button onClick={() => setActiveTab('management')} className={`shrink-0 border-b-2 py-4 px-1 text-sm font-medium ${activeTab === 'management' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>Book Management</button>
          <button onClick={() => setActiveTab('reservations')} className={`shrink-0 border-b-2 py-4 px-1 text-sm font-medium ${activeTab === 'reservations' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>Reservations</button>
          <button onClick={() => setActiveTab('circulation')} className={`shrink-0 border-b-2 py-4 px-1 text-sm font-medium ${activeTab === 'circulation' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>Circulation</button>
          {user?.role === 'admin' && (
            <button onClick={() => setActiveTab('users')} className={`shrink-0 border-b-2 py-4 px-1 text-sm font-medium ${activeTab === 'users' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>User Management</button>
          )}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Recent Borrowings card */}
          <div className="card">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Library Overview</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Collection Statistics</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Books:</span>
                    <span className="font-medium">{stats?.totalBooks || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Copies:</span>
                    <span className="font-medium">{stats?.totalCopies || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Available Copies:</span>
                    <span className="font-medium">{stats?.availableCopies || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Users:</span>
                    <span className="font-medium">{stats?.totalUsers || 0}</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Borrowing Activity</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Active Loans:</span>
                    <span className="font-medium">{stats?.activeBorrowings || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Overdue Books:</span>
                    <span className="font-medium text-red-600">{stats?.overdueBooks || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Return Rate:</span>
                    <span className="font-medium">
                      {stats?.totalBooks && stats?.activeBorrowings 
                        ? Math.round(((stats.totalBooks - stats.activeBorrowings) / stats.totalBooks) * 100)
                        : 0}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'borrowings' && (
        <div className="card">
          {/* Recent Borrowings Table */}
          <h3 className="text-lg font-medium text-gray-900 mb-4">All Recent Borrowings</h3>
          
          {recentBorrowings.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Book
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Borrower
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Borrowed
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Due Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {recentBorrowings.map((borrowing) => {
                    const status = getBorrowingStatus(borrowing)
                    const StatusIcon = status.icon
                    
                    return (
                      <tr key={borrowing.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{borrowing.title}</div>
                            <div className="text-sm text-gray-500">{borrowing.author}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{borrowing.user_name}</div>
                          <div className="text-sm text-gray-500">{borrowing.user_email}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(borrowing.borrowed_at).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(borrowing.due_date).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className={`flex items-center px-2 py-1 rounded-full text-xs ${status.bgColor}`}>
                            <StatusIcon className={`h-3 w-3 mr-1 ${status.color}`} />
                            <span className={`font-medium ${status.color}`}>{status.text}</span>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8">
              <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No recent borrowings</h3>
              <p className="text-gray-500">No books have been borrowed recently.</p>
            </div>
          )}
        </div>
      )}

      {activeTab === 'management' && <BookManagement />}
      {activeTab === 'reservations' && <ReservationManagement />}
      {activeTab === 'circulation' && <Circulation />}
      {activeTab === 'users' && user?.role === 'admin' && <UserManagement />}
    </div>
  )
}

export default AdminPanel 