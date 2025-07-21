import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { libraryAPI } from '../services/api'
import { 
  ArrowLeft, 
  BookOpen, 
  User, 
  Calendar, 
  MapPin, 
  Tag,
  CheckCircle,
  X,
  AlertTriangle,
  Clock
} from 'lucide-react'
import LoadingSpinner from './LoadingSpinner'
import { useNotification } from '../contexts/NotificationContext'

const BookDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [book, setBook] = useState(null)
  const [loading, setLoading] = useState(true)
  const [borrowing, setBorrowing] = useState(false)
  const [error, setError] = useState(null)
  const { showError, showSuccess } = useNotification()

  useEffect(() => {
    fetchBook()
  }, [id])

  const fetchBook = async () => {
    try {
      setLoading(true)
      const bookData = await libraryAPI.getBook(id)
      setBook(bookData)
    } catch (error) {
      showError('Book not found')
      setError('Book not found')
    } finally {
      setLoading(false)
    }
  }

  const handleBorrow = async () => {
    try {
      setBorrowing(true)
      setError(null)
      await libraryAPI.borrowBook(book.id)
      await fetchBook()
      showSuccess('Book borrowed successfully! Please return it within 14 days.')
    } catch (error) {
      showError(error.message || 'Failed to borrow book')
      setError(error.message || 'Failed to borrow book')
    } finally {
      setBorrowing(false)
    }
  }

  const getAvailabilityStatus = () => {
    if (book.available_copies > 0) {
      return {
        status: 'available',
        text: 'Available',
        icon: CheckCircle,
        color: 'text-green-600',
        bgColor: 'bg-green-100'
      }
    }
    return {
      status: 'unavailable',
      text: 'Unavailable',
      icon: X,
      color: 'text-red-600',
      bgColor: 'bg-red-100'
    }
  }

  if (loading) {
    return <LoadingSpinner text="Loading book details..." />
  }

  if (error || !book) {
    return (
      <div className="text-center py-12">
        <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Book not found</h3>
        <p className="text-gray-500 mb-4">{error || 'The book you are looking for does not exist.'}</p>
        <button
          onClick={() => navigate('/books')}
          className="btn-primary"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Books
        </button>
      </div>
    )
  }

  const availability = getAvailabilityStatus()
  const AvailabilityIcon = availability.icon

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/books')}
          className="btn-secondary"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Books
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Book Cover */}
        <div className="lg:col-span-1">
          <div className="card">
            <img
              src={book.cover_image_url || 'https://via.placeholder.com/400x600?text=No+Cover'}
              alt={book.title}
              className="w-full h-auto rounded-lg"
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/400x600?text=No+Cover'
              }}
            />
          </div>
        </div>

        {/* Book Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Title and Status */}
          <div className="card">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{book.title}</h1>
                <p className="text-xl text-gray-600 mb-4">by {book.author}</p>
              </div>
              <div className={`flex items-center px-3 py-1 rounded-full ${availability.bgColor}`}>
                <AvailabilityIcon className={`h-5 w-5 mr-2 ${availability.color}`} />
                <span className={`font-medium ${availability.color}`}>{availability.text}</span>
              </div>
            </div>

            {/* Book Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              {book.isbn && (
                <div className="flex items-center">
                  <Tag className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">ISBN</p>
                    <p className="text-sm text-gray-900">{book.isbn}</p>
                  </div>
                </div>
              )}

              {book.publisher && (
                <div className="flex items-center">
                  <BookOpen className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Publisher</p>
                    <p className="text-sm text-gray-900">{book.publisher}</p>
                  </div>
                </div>
              )}

              {book.published_year && (
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Published</p>
                    <p className="text-sm text-gray-900">{book.published_year}</p>
                  </div>
                </div>
              )}

              {book.genre && (
                <div className="flex items-center">
                  <Tag className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Genre</p>
                    <p className="text-sm text-gray-900">{book.genre}</p>
                  </div>
                </div>
              )}

              {book.location && (
                <div className="flex items-center">
                  <MapPin className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Location</p>
                    <p className="text-sm text-gray-900">{book.location}</p>
                  </div>
                </div>
              )}

              <div className="flex items-center">
                <BookOpen className="h-5 w-5 text-gray-400 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Copies</p>
                  <p className="text-sm text-gray-900">
                    {book.available_copies} of {book.total_copies} available
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          {book.description && (
            <div className="card">
              <h3 className="text-lg font-medium text-gray-900 mb-3">Description</h3>
              <p className="text-gray-700 leading-relaxed">{book.description}</p>
            </div>
          )}

          {/* Borrowing Section */}
          <div className="card">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Borrow This Book</h3>
            
            {error && (
              <div className="mb-4 p-4 text-sm text-red-800 border border-red-200 rounded-lg bg-red-50">
                <AlertTriangle className="h-4 w-4 mr-2 inline" />
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div className="flex items-center text-sm text-gray-600">
                <Clock className="h-4 w-4 mr-2" />
                <span>Loan period: 14 days</span>
              </div>

              {book.available_copies > 0 ? (
                <button
                  onClick={handleBorrow}
                  disabled={borrowing}
                  className="btn-primary w-full flex items-center justify-center"
                >
                  {borrowing ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Borrowing...
                    </>
                  ) : (
                    <>
                      <BookOpen className="h-4 w-4 mr-2" />
                      Borrow This Book
                    </>
                  )}
                </button>
              ) : (
                <div className="text-center py-4">
                  <X className="h-8 w-8 text-red-500 mx-auto mb-2" />
                  <p className="text-gray-600">This book is currently unavailable</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BookDetail 