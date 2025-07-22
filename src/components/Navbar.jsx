import React, { useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useNotification } from '../contexts/NotificationContext'
import { 
  BookOpen, 
  Home, 
  Search, 
  User, 
  Settings, 
  LogOut, 
  Menu, 
  X,
  Library,
  Clock
} from 'lucide-react'

const Navbar = () => {
  const { user, logout } = useAuth()
  const location = useLocation()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const { showSuccess, showError } = useNotification()

  const userRole = user?.role || user?.data?.role;

  const getNavLinks = () => {
    const baseLinks = [
      { name: 'Dashboard', href: '/dashboard', icon: Home, roles: ['student', 'teacher', 'librarian', 'admin'] },
      { name: 'Browse Books', href: '/books', icon: Search, roles: ['student', 'teacher', 'librarian', 'admin'] },
    ];

    if (user) {
      baseLinks.push(
        { name: 'My Books', href: '/my-books', icon: BookOpen, roles: ['student', 'teacher'] },
        { name: 'My Reservations', href: '/my-reservations', icon: Clock, roles: ['student', 'teacher'] }
      );
    }
    
    if (userRole === 'librarian' || userRole === 'admin') {
      baseLinks.push({ name: 'Admin Panel', href: '/admin', icon: Settings, roles: ['librarian', 'admin'] });
    }

    return baseLinks.filter(link => link.roles.includes(userRole));
  };

  const navigation = getNavLinks();

  const handleLogout = async () => {
    try {
      await logout()
      showSuccess('Signed out successfully!')
    } catch (err) {
      showError('Failed to sign out. Please try again.')
    }
  }

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and main nav */}
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/dashboard" className="flex items-center">
                <div className="h-8 w-8 bg-library-blue rounded-lg flex items-center justify-center">
                  <Library className="h-5 w-5 text-white" />
                </div>
                <span className="ml-2 text-xl font-bold text-gray-900">Library</span>
              </Link>
            </div>

            {/* Desktop navigation */}
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {navigation.map((item) => {
                const Icon = item.icon
                return (
                  <NavLink
                    key={item.name}
                    to={item.href}
                    className={({ isActive }) =>
                      `inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors duration-200 ${
                        isActive
                          ? 'border-library-blue text-gray-900'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`
                    }
                  >
                    <Icon className="h-4 w-4 mr-1" />
                    {item.name}
                  </NavLink>
                )
              })}
            </div>
          </div>

          {/* User menu */}
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            <div className="relative">
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-library-blue"
              >
                <div className="h-8 w-8 bg-library-blue rounded-full flex items-center justify-center">
                  <User className="h-4 w-4 text-white" />
                </div>
                <span className="ml-2 text-gray-700">{user?.username || 'User'}</span>
              </button>

              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                  <div className="px-4 py-2 text-sm text-gray-700 border-b border-gray-100">
                    <div className="font-medium">{user?.name || user?.username}</div>
                    <div className="text-gray-500 capitalize">{user?.role}</div>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign out
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center sm:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-library-blue"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="sm:hidden">
          <div className="pt-2 pb-3 space-y-1 border-t border-gray-200">
            {navigation.map((item) => {
              const Icon = item.icon
              return (
                <NavLink
                  key={item.name}
                  to={item.href}
                  className={({ isActive }) =>
                    `flex items-center px-4 py-2 text-base font-medium transition-colors duration-200 ${
                      isActive
                        ? 'bg-library-blue text-white'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`
                  }
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Icon className="h-5 w-5 mr-3" />
                  {item.name}
                </NavLink>
              )
            })}
          </div>
          
          <div className="pt-4 pb-3 border-t border-gray-200">
            <div className="px-4 py-2">
              <div className="text-base font-medium text-gray-800">{user?.name || user?.username}</div>
              <div className="text-sm text-gray-500 capitalize">{user?.role}</div>
            </div>
            <div className="mt-3">
              <button
                onClick={handleLogout}
                className="flex items-center w-full px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100"
              >
                <LogOut className="h-5 w-5 mr-3" />
                Sign out
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar 