import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { NotificationProvider } from './contexts/NotificationContext'
import Login from './components/Login'
import Dashboard from './components/Dashboard'
import BookList from './components/BookList'
import BookDetail from './components/BookDetail'
import MyBooks from './components/MyBooks'
import MyReservations from './components/MyReservations'
import AdminPanel from './components/AdminPanel'
import Navbar from './components/Navbar'
import LoadingSpinner from './components/LoadingSpinner'
import NotFound from './components/NotFound'

// Protected Route Component
const ProtectedRoute = ({ children, requiredRoles = null }) => {
  const { user, loading } = useAuth()
  if (loading) return <LoadingSpinner fullScreen={true} text="Loading your account..." />
  if (!user) return <Navigate to="/login" replace />


  const gettingRole = user


  console.log(gettingRole)
  if (requiredRoles && !requiredRoles.includes(gettingRole.role)) return <Navigate to="/dashboard" replace />
  return children
}

// Main App Layout
const AppLayout = () => {
  const { user } = useAuth()
  //console.log(user.user.role)  
  if (!user) {
    return <Login />
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        <div className="min-h-[calc(100vh-4rem)]">
          <Routes>
            <Route path="/" element={user ? <Navigate to="/dashboard" replace /> : <LandingPage />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/books" element={<BookList />} />
            <Route path="/books/:id" element={<BookDetail />} />
            <Route path="/my-books" element={<ProtectedRoute><MyBooks /></ProtectedRoute>} />
            <Route path="/my-reservations" element={<ProtectedRoute><MyReservations /></ProtectedRoute>} />
            <Route 
              path="/admin" 
              element={
                <ProtectedRoute requiredRoles={["admin", "librarian"]}>
                  <AdminPanel />
                </ProtectedRoute>
              } 
            />
            <Route path='/404' element={<NotFound/>}/>
          </Routes>
        </div>
      </div>
    </div>
  )
}

// Main App Component
const App = () => {
  return (
    <NotificationProvider>
      <AuthProvider>
        <Router>
          <AppLayout />
        </Router>
      </AuthProvider>
    </NotificationProvider>
  )
}

export default App 