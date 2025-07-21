import React, { useState, useEffect } from 'react'
import { libraryAPI } from '../services/api'
import { 
  BookOpen, 
  Users, 
  TrendingUp, 
  Plus, 
  Search,
  Edit,
  Trash2,
  Eye,
  AlertTriangle,
  CheckCircle,
  Calendar
} from 'lucide-react'
import LoadingSpinner from './LoadingSpinner'
import { useNotification } from '../contexts/NotificationContext'
import { useAuth } from '../contexts/AuthContext'
import { Modal } from './Modal'

const AdminPanel = () => {
  const [stats, setStats] = useState(null)
  const [recentBorrowings, setRecentBorrowings] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')
  const { showError } = useNotification()
  const { user } = useAuth();
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [addUserLoading, setAddUserLoading] = useState(false);
  const [addUserError, setAddUserError] = useState(null);
  const [addUserSuccess, setAddUserSuccess] = useState(null);
  const [newUser, setNewUser] = useState({
    username: '',
    name: '',
    email: '',
    password: '',
    role: 'student',
  });
  const [users, setUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [usersError, setUsersError] = useState(null);
  const [editUser, setEditUser] = useState(null);
  const [editUserLoading, setEditUserLoading] = useState(false);
  const [editUserError, setEditUserError] = useState(null);
  const [editUserSuccess, setEditUserSuccess] = useState(null);

  // Fetch users (admin only)
  const fetchUsers = async () => {
    setUsersLoading(true);
    setUsersError(null);
    try {
      const res = await libraryAPI.getUsers();
      setUsers(res.data || []);
    } catch (err) {
      setUsersError(err.message || 'Failed to fetch users');
    } finally {
      setUsersLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData()
    if (activeTab === 'users' && user?.role === 'admin') {
      fetchUsers();
    }
  }, [activeTab, user]);

  const fetchAdminData = async () => {
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

  const handleAddUser = async (e) => {
    e.preventDefault();
    setAddUserLoading(true);
    setAddUserError(null);
    setAddUserSuccess(null);
    try {
      await libraryAPI.createUser(newUser);
      setAddUserSuccess('User created successfully!');
      setNewUser({ username: '', name: '', email: '', password: '', role: 'student' });
    } catch (err) {
      setAddUserError(err.message || 'Failed to create user');
    } finally {
      setAddUserLoading(false);
    }
  };

  // Edit user handlers
  const handleEditUser = (user) => {
    setEditUser(user);
    setEditUserError(null);
    setEditUserSuccess(null);
  };
  const handleEditUserChange = (e) => {
    setEditUser({ ...editUser, [e.target.name]: e.target.value });
  };
  const handleEditUserSubmit = async (e) => {
    e.preventDefault();
    setEditUserLoading(true);
    setEditUserError(null);
    setEditUserSuccess(null);
    try {
      await libraryAPI.updateUser(editUser.id, editUser);
      setEditUserSuccess('User updated successfully!');
      fetchUsers();
      setTimeout(() => setEditUser(null), 1000);
    } catch (err) {
      setEditUserError(err.message || 'Failed to update user');
    } finally {
      setEditUserLoading(false);
    }
  };
  // Delete user
  const handleDeleteUser = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      await libraryAPI.deleteUser(id);
      fetchUsers();
      showError('User deleted successfully!');
    } catch (err) {
      showError(err.message || 'Failed to delete user');
    }
  };

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
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'overview'
                ? 'border-library-blue text-library-blue'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('borrowings')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'borrowings'
                ? 'border-library-blue text-library-blue'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Recent Borrowings
          </button>
          <button
            onClick={() => setActiveTab('management')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'management'
                ? 'border-library-blue text-library-blue'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Book Management
          </button>
          {user?.role === 'admin' && (
            <button
              onClick={() => setActiveTab('users')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'users'
                  ? 'border-library-blue text-library-blue'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              User Management
            </button>
          )}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
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
          {user?.role === 'admin' && (
            <button className="btn-primary mt-4" onClick={() => setIsAddUserOpen(true)}>
              + Add User
            </button>
          )}
          <Modal open={isAddUserOpen} onClose={() => setIsAddUserOpen(false)} title="Add New User">
            <form className="space-y-4" onSubmit={handleAddUser}>
              {addUserError && <div className="text-red-600">{addUserError}</div>}
              {addUserSuccess && <div className="text-green-600">{addUserSuccess}</div>}
              <div>
                <label className="block text-sm font-medium">Username</label>
                <input type="text" className="input-field" required value={newUser.username} onChange={e => setNewUser({ ...newUser, username: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-medium">Name</label>
                <input type="text" className="input-field" required value={newUser.name} onChange={e => setNewUser({ ...newUser, name: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-medium">Email</label>
                <input type="email" className="input-field" required value={newUser.email} onChange={e => setNewUser({ ...newUser, email: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-medium">Password</label>
                <input type="password" className="input-field" required value={newUser.password} onChange={e => setNewUser({ ...newUser, password: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-medium">Role</label>
                <select className="input-field" value={newUser.role} onChange={e => setNewUser({ ...newUser, role: e.target.value })}>
                  <option value="student">Student</option>
                  <option value="librarian">Librarian</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <button type="submit" className="btn-primary w-full" disabled={addUserLoading}>
                {addUserLoading ? 'Creating...' : 'Create User'}
              </button>
            </form>
          </Modal>
        </div>
      )}

      {activeTab === 'borrowings' && (
        <div className="card">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Borrowings</h3>
          
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

      {activeTab === 'management' && (
        <div className="space-y-6">
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">Book Management</h3>
              <button className="btn-primary flex items-center">
                <Plus className="h-4 w-4 mr-2" />
                Add New Book
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 border border-gray-200 rounded-lg">
                <BookOpen className="h-8 w-8 text-library-blue mx-auto mb-2" />
                <h4 className="font-medium text-gray-900">Add Books</h4>
                <p className="text-sm text-gray-500">Add new books to the collection</p>
              </div>
              
              <div className="text-center p-4 border border-gray-200 rounded-lg">
                <Edit className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                <h4 className="font-medium text-gray-900">Edit Books</h4>
                <p className="text-sm text-gray-500">Update book information</p>
              </div>
              
              <div className="text-center p-4 border border-gray-200 rounded-lg">
                <Trash2 className="h-8 w-8 text-red-600 mx-auto mb-2" />
                <h4 className="font-medium text-gray-900">Remove Books</h4>
                <p className="text-sm text-gray-500">Remove books from collection</p>
              </div>
            </div>
          </div>
          
          <div className="card">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button className="btn-secondary flex items-center justify-center">
                <Search className="h-4 w-4 mr-2" />
                Search Books
              </button>
              <button className="btn-secondary flex items-center justify-center">
                <Eye className="h-4 w-4 mr-2" />
                View All Borrowings
              </button>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'users' && user?.role === 'admin' && (
        <div className="card">
          <h3 className="text-lg font-medium text-gray-900 mb-4">User Management</h3>
          {usersLoading ? (
            <LoadingSpinner text="Loading users..." />
          ) : usersError ? (
            <div className="text-red-600">{usersError}</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Username</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                    <th className="px-6 py-3"></th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {users.map((u) => (
                    <tr key={u.id}>
                      <td className="px-6 py-4 whitespace-nowrap">{u.username}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{u.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap capitalize">{u.role}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{new Date(u.created_at).toLocaleDateString()}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <button className="btn-secondary mr-2" onClick={() => handleEditUser(u)}>Edit</button>
                        <button className="btn-danger" onClick={() => handleDeleteUser(u.id)}>Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          <Modal open={!!editUser} onClose={() => setEditUser(null)} title="Edit User">
            {editUser && (
              <form className="space-y-4" onSubmit={handleEditUserSubmit}>
                {editUserError && <div className="text-red-600">{editUserError}</div>}
                {editUserSuccess && <div className="text-green-600">{editUserSuccess}</div>}
                <div>
                  <label className="block text-sm font-medium">Username</label>
                  <input name="username" type="text" className="input-field" required value={editUser.username} onChange={handleEditUserChange} />
                </div>
                <div>
                  <label className="block text-sm font-medium">Email</label>
                  <input name="email" type="email" className="input-field" required value={editUser.email} onChange={handleEditUserChange} />
                </div>
                <div>
                  <label className="block text-sm font-medium">Role</label>
                  <select name="role" className="input-field" value={editUser.role} onChange={handleEditUserChange}>
                    <option value="student">Student</option>
                    <option value="librarian">Librarian</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                <button type="submit" className="btn-primary w-full" disabled={editUserLoading}>
                  {editUserLoading ? 'Saving...' : 'Save Changes'}
                </button>
              </form>
            )}
          </Modal>
        </div>
      )}
    </div>
  )
}

export default AdminPanel 