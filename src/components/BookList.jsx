import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { libraryAPI } from '../services/api'
import { 
  Search, 
  Filter, 
  BookOpen, 
  Eye, 
  Calendar,
  User,
  MapPin,
  Star
} from 'lucide-react'
import LoadingSpinner, { SkeletonLoader } from './LoadingSpinner'
import { useNotification } from '../contexts/NotificationContext'

const BookList = () => {
  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedGenre, setSelectedGenre] = useState('')
  const [genres, setGenres] = useState([
    { id: 1, name: 'Fiction' },
    { id: 2, name: 'Non-Fiction' },
    { id: 3, name: 'Science Fiction' },
    { id: 4, name: 'Mystery' },
    { id: 5, name: 'Romance' },
    { id: 6, name: 'Biography' },
    { id: 7, name: 'History' },
    { id: 8, name: 'Science' },
    { id: 9, name: 'Mathematics' },
    { id: 10, name: 'Literature' },
    { id: 11, name: 'Children' },
    { id: 12, name: 'Reference' }
  ])
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 0
  })
  const { showError } = useNotification()

  useEffect(() => {
    fetchGenres()
  }, [])

  useEffect(() => {
    fetchBooks()
  }, [searchTerm, selectedGenre, pagination.page])

  const fetchGenres = async () => {
    try {
      const genresData = await libraryAPI.getGenres()
      setGenres(Array.isArray(genresData) ? genresData : [])
    } catch (error) {
      showError('Error fetching genres')
      setGenres([])
    }
  }

  const fetchBooks = async () => {
    try {
      setLoading(true)
      const params = {
        page: pagination.page,
        limit: pagination.limit,
        search: searchTerm,
        genre: selectedGenre
      }
      
      const response = await libraryAPI.getBooks(params)
      setBooks(response.books || [])
      setPagination(prev => ({
        ...prev,
        total: response.pagination?.total || 0,
        totalPages: response.pagination?.totalPages || 0
      }))
    } catch (error) {
      showError('Error fetching books')
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e) => {
    e.preventDefault()
    setPagination(prev => ({ ...prev, page: 1 }))
  }

  const handleGenreChange = (e) => {
    setSelectedGenre(e.target.value)
    setPagination(prev => ({ ...prev, page: 1 }))
  }

  const handlePageChange = (newPage) => {
    setPagination(prev => ({ ...prev, page: newPage }))
  }

  const getAvailabilityBadge = (availableCopies) => {
    if (availableCopies > 0) {
      return <span className="badge badge-success">Available</span>
    }
    return <span className="badge badge-danger">Unavailable</span>
  }

  if (loading && books.length === 0) {
    return <LoadingSpinner text="Loading books..." />
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Browse Books</h1>
          <p className="text-gray-600 mt-1">Discover our collection of {pagination.total} books</p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="card">
        <form onSubmit={handleSearch} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search books by title, author, or ISBN..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field pl-10"
              />
            </div>

            {/* Genre Filter */}
            <div>
              <select
                value={selectedGenre}
                onChange={handleGenreChange}
                className="input-field"
              >
                <option value="">All Genres</option>
                {Array.isArray(genres) && genres.map((genre) => (
                  <option key={genre.id} value={genre.name}>
                    {genre.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Search Button */}
            <button type="submit" className="btn-primary">
              Search
            </button>
          </div>
        </form>
      </div>

      {/* Books Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="card animate-pulse">
              <div className="h-48 bg-gray-200 rounded-lg mb-4"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      ) : books.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {books.map((book) => (
              <div key={book.id} className="card hover:shadow-lg transition-shadow duration-200">
                {/* Book Cover */}
                <div className="relative mb-4">
                  <img
                    src={book.cover_image_url || 'https://placehold.co/400'}
                    alt={book.title}
                    className="w-full h-48 object-cover rounded-lg"
                    onError={(e) => {
                      e.target.src = 'https://placehold.co/400'
                    }}
                  />
                  <div className="absolute top-2 right-2">
                    {getAvailabilityBadge(parseInt(book.available_copies))}
                  </div>
                </div>

                {/* Book Info */}
                <div className="space-y-2">
                  <h3 className="font-semibold text-gray-900 line-clamp-2">
                    {book.title}
                  </h3>
                  <p className="text-sm text-gray-600 flex items-center">
                    <User className="h-4 w-4 mr-1" />
                    {book.author}
                  </p>
                  
                  {book.published_year && (
                    <p className="text-sm text-gray-500 flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      {book.published_year}
                    </p>
                  )}
                  
                  {book.location && (
                    <p className="text-sm text-gray-500 flex items-center">
                      <MapPin className="h-4 w-4 mr-1" />
                      {book.location}
                    </p>
                  )}

                  <div className="flex items-center justify-between pt-2">
                    <span className="text-sm text-gray-500">
                      {book.available_copies} of {book.total_copies} available
                    </span>
                    <Link
                      to={`/books/${book.id}`}
                      className="btn-primary text-sm py-1 px-3"
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-center space-x-2">
              <button
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page === 1}
                className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              
              <span className="text-sm text-gray-600">
                Page {pagination.page} of {pagination.totalPages}
              </span>
              
              <button
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page === pagination.totalPages}
                className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-12">
          <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No books found</h3>
          <p className="text-gray-500">Try adjusting your search criteria</p>
        </div>
      )}
    </div>
  )
}

export default BookList 