import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api'

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// Library API functions
export const libraryAPI = {
  // Get all books with filters
  getBooks: async (params = {}) => {
    const response = await api.get('/library/books', { params })
    return response.data
  },

  // Get book by ID
  getBook: async (id) => {
    const response = await api.get(`/library/books/${id}`)
    return response.data
  },

  // Get user's borrowings
  getBorrowings: async () => {
    const response = await api.get('/library/borrowings')
    return response.data
  },

  // Borrow a book
  borrowBook: async (bookId) => {
    const response = await api.post('/library/borrow', { bookId })
    return response.data
  },

  // Return a book
  returnBook: async (borrowingId) => {
    const response = await api.post('/library/return', { borrowingId })
    return response.data
  },

  // Get available genres
  getGenres: async () => {
    const response = await api.get('/library/genres')
    return response.data
  },

  // Admin: Add new book
  addBook: async (bookData) => {
    const response = await api.post('/library/books', bookData)
    return response.data
  },

  // Admin: Update book
  updateBook: async (id, bookData) => {
    const response = await api.put(`/library/books/${id}`, bookData)
    return response.data
  },

  // Admin: Delete book
  deleteBook: async (id) => {
    const response = await api.delete(`/library/books/${id}`)
    return response.data
  },

  // Admin: Get all borrowings
  getAllBorrowings: async (params = {}) => {
    const response = await api.get('/library/admin/borrowings', { params })
    return response.data
  },

  // Admin: Get library statistics
  getStats: async () => {
    const response = await api.get('/library/admin/stats')
    return response.data
  },

  // Add user registration (admin only)
  createUser: async (userData) => {
    try {
      const res = await api.post('/auth/register', userData);
      return res.data;
    } catch (err) {
      throw new Error(err.response?.data?.message || 'Failed to create user');
    }
  },

  // User management (admin only)
  getUsers: async () => {
    try {
      const res = await api.get('/auth/users');
      return res.data;
    } catch (err) {
      throw new Error(err.response?.data?.error || 'Failed to fetch users');
    }
  },
  updateUser: async (id, userData) => {
    try {
      const res = await api.put(`/auth/users/${id}`, userData);
      return res.data;
    } catch (err) {
      throw new Error(err.response?.data?.error || 'Failed to update user');
    }
  },
  deleteUser: async (id) => {
    try {
      const res = await api.delete(`/auth/users/${id}`);
      return res.data;
    } catch (err) {
      throw new Error(err.response?.data?.error || 'Failed to delete user');
    }
  },
}

// Auth API functions
export const authAPI = {
  // Login
  login: async (username, password) => {
    const response = await api.post('/auth/login', { username, password })
    
    // Store token in localStorage
    if (response.data.data?.token) {
      localStorage.setItem('token', response.data.data.token)
    }
    //console.log(response.data)
    return response.data
  },

  // Logout
  logout: async () => {
    localStorage.removeItem('token')
    return Promise.resolve()
  },

  // Get current user profile
  getProfile: async () => {
    const response = await api.get('/auth/profile')
    return response.data
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    return !!localStorage.getItem('token')
  },
} 