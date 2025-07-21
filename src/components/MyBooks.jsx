import React, { useState, useEffect } from 'react'
import { libraryAPI } from '../services/api'
import { 
  BookOpen, 
  Calendar, 
  CheckCircle, 
  AlertTriangle, 
  RotateCcw,
  Clock,
  User
} from 'lucide-react'
import LoadingSpinner from './LoadingSpinner'
import { useNotification } from '../contexts/NotificationContext'

const MyBooks = () => {
  const [borrowings, setBorrowings] = useState([])
  const [loading, setLoading] = useState(true)
  const [returning, setReturning] = useState(null)
  const { showError, showSuccess } = useNotification()

  useEffect(() => {
    fetchBorrowings()
  }, [])

  const fetchBorrowings = async () => {
    try {
      setLoading(true)
      const data = await libraryAPI.getBorrowings()
      setBorrowings(data)
    } catch (error) {
      showError('Error fetching your borrowings')
    } finally {
      setLoading(false)
    }
  }

  const handleReturn = async (borrowingId) => {
    try {
      setReturning(borrowingId)
      await libraryAPI.returnBook(borrowingId)
      await fetchBorrowings()
      showSuccess('Book returned successfully!')
    } catch (error) {
      showError(error.message || 'Failed to return book')
    } finally {
      setReturning(null)
    }
  }

  const getBorrowingStatus = (borrowing) => {
    const dueDate = new Date(borrowing.due_date)
    const today = new Date()
    const isOverdue = dueDate < today && borrowing.status === 'borrowed'
    const isReturned = borrowing.status === 'returned'

    if (isReturned) {
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
      icon: Clock,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    }
  }

  const getDaysRemaining = (dueDate) => {
    const due = new Date(dueDate)
    const today = new Date()
    const diffTime = due - today
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays < 0) {
      return `${Math.abs(diffDays)} days overdue`
    } else if (diffDays === 0) {
      return 'Due today'
    } else if (diffDays === 1) {
      return 'Due tomorrow'
    } else {
      return `${diffDays} days remaining`
    }
  }

  if (loading) {
    return <LoadingSpinner text="Loading your books..." />
  }

  const activeBorrowings = borrowings.filter(b => b.status === 'borrowed')
  const returnedBorrowings = borrowings.filter(b => b.status === 'returned')

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">My Books</h1>
        <p className="text-gray-600 mt-1">Manage your borrowed books</p>
      </div>

      {/* Active Borrowings */}
      <div className="card">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Currently Borrowed ({activeBorrowings.length})</h2>
        
        {activeBorrowings.length > 0 ? (
          <div className="space-y-4">
            {activeBorrowings.map((borrowing) => {
              const status = getBorrowingStatus(borrowing)
              const StatusIcon = status.icon
              
              return (
                <div key={borrowing.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center mb-2">
                        <BookOpen className="h-5 w-5 text-gray-400 mr-2" />
                        <h3 className="font-medium text-gray-900">{borrowing.title}</h3>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center">
                          <User className="h-4 w-4 text-gray-400 mr-2" />
                          <span className="text-gray-600">{borrowing.author}</span>
                        </div>
                        
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                          <span className="text-gray-600">
                            Due: {new Date(borrowing.due_date).toLocaleDateString()}
                          </span>
                        </div>
                        
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 text-gray-400 mr-2" />
                          <span className={`font-medium ${
                            status.status === 'overdue' ? 'text-red-600' : 'text-gray-600'
                          }`}>
                            {getDaysRemaining(borrowing.due_date)}
                          </span>
                        </div>
                        
                        <div className="flex items-center">
                          <div className={`flex items-center px-2 py-1 rounded-full text-xs ${status.bgColor}`}>
                            <StatusIcon className={`h-3 w-3 mr-1 ${status.color}`} />
                            <span className={`font-medium ${status.color}`}>{status.text}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <button
                      onClick={() => handleReturn(borrowing.id)}
                      disabled={returning === borrowing.id}
                      className="btn-primary ml-4 flex items-center"
                    >
                      {returning === borrowing.id ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Returning...
                        </>
                      ) : (
                        <>
                          <RotateCcw className="h-4 w-4 mr-2" />
                          Return
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="text-center py-8">
            <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No books borrowed</h3>
            <p className="text-gray-500">You haven't borrowed any books yet.</p>
          </div>
        )}
      </div>

      {/* Returned Books */}
      {returnedBorrowings.length > 0 && (
        <div className="card">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Returned Books ({returnedBorrowings.length})</h2>
          
          <div className="space-y-4">
            {returnedBorrowings.slice(0, 5).map((borrowing) => (
              <div key={borrowing.id} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <BookOpen className="h-5 w-5 text-gray-400 mr-2" />
                      <h3 className="font-medium text-gray-900">{borrowing.title}</h3>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center">
                        <User className="h-4 w-4 text-gray-400 mr-2" />
                        <span className="text-gray-600">{borrowing.author}</span>
                      </div>
                      
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                        <span className="text-gray-600">
                          Returned: {borrowing.returned_at ? new Date(borrowing.returned_at).toLocaleDateString() : 'N/A'}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <div className="flex items-center px-2 py-1 rounded-full text-xs bg-green-100">
                      <CheckCircle className="h-3 w-3 mr-1 text-green-600" />
                      <span className="font-medium text-green-600">Returned</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {returnedBorrowings.length > 5 && (
            <p className="text-sm text-gray-500 mt-4 text-center">
              Showing last 5 returned books
            </p>
          )}
        </div>
      )}
    </div>
  )
}

export default MyBooks 