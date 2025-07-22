import React, { useState, useEffect } from 'react';
import { Users, Search } from 'lucide-react';
import { libraryAPI } from '../services/api';
import LoadingSpinner, { ButtonLoader, SkeletonLoader } from './LoadingSpinner';
import { useNotification } from '../contexts/NotificationContext';
import { Modal } from './Modal';
import EmptyState from './EmptyState';

// Create FormField component for consistent form styling
const FormField = ({ label, children, required }) => (
  <div className="mb-4">
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    {children}
  </div>
);

const UserManagement = () => {
  const { showError, showSuccess } = useNotification();

  // User List State
  const [users, setUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [usersError, setUsersError] = useState(null);

  // Add User State
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [addUserLoading, setAddUserLoading] = useState(false);
  const [addUserError, setAddUserError] = useState(null);
  const [newUser, setNewUser] = useState({
    username: '',
    name: '',
    email: '',
    password: '',
    role: 'student'
  });

  // Edit User State
  const [editUser, setEditUser] = useState(null);
  const [editUserLoading, setEditUserLoading] = useState(false);
  const [editUserError, setEditUserError] = useState(null);

  // User Search State
  const [userSearch, setUserSearch] = useState('');

  // Fetch users
  const fetchUsers = async (search = '') => {
    setUsersLoading(true);
    setUsersError(null);
    try {
      const res = await libraryAPI.getUsers({ search });
      setUsers(res.data || []);
    } catch (err) {
      setUsersError(err.message || 'Failed to fetch users');
    } finally {
      setUsersLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(userSearch);
  }, [userSearch]);

  // Add user handler
  const handleAddUser = async (e) => {
    e.preventDefault();
    setAddUserLoading(true);
    setAddUserError(null);
    try {
      console.log('Submitting new user:', newUser);
      await libraryAPI.createUser(newUser);
      showSuccess('User created successfully!');
      setNewUser({ username: '', name: '', email: '', password: '', role: 'student' });
      fetchUsers(userSearch);
      setIsAddUserOpen(false);
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
  };

  const handleEditUserChange = (e) => {
    setEditUser({ ...editUser, [e.target.name]: e.target.value });
  };

  const handleEditUserSubmit = async (e) => {
    e.preventDefault();
    setEditUserLoading(true);
    setEditUserError(null);
    try {
      await libraryAPI.updateUser(editUser.id, editUser);
      showSuccess('User updated successfully!');
      fetchUsers(userSearch);
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
      fetchUsers(userSearch);
      showSuccess('User deleted successfully!');
    } catch (err) {
      showError(err.message || 'Failed to delete user');
    }
  };

  return (
    <div className="card">
      <div className="flex flex-col sm:flex-row items-center justify-between mb-4 gap-4">
        <h3 className="text-lg font-medium text-gray-900">User Management</h3>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by username or email..."
              value={userSearch}
              onChange={(e) => setUserSearch(e.target.value)}
              className="input-field pl-9"
            />
          </div>
          <button onClick={() => setIsAddUserOpen(true)} className="btn-primary flex items-center">
            <Users className="h-4 w-4 mr-2" />
            Add User
          </button>
        </div>
      </div>

      {usersLoading ? (
        <SkeletonLoader lines={5} />
      ) : usersError ? (
        <div className="text-red-600">{usersError}</div>
      ) : users.length === 0 ? (
        <EmptyState
          icon={Users}
          title={userSearch ? "No Users Found" : "No Users Yet"}
          message={userSearch ? "No users match your search. Try different keywords." : "There are no users in the system yet."}
        />
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

      <Modal open={isAddUserOpen} onClose={() => setIsAddUserOpen(false)} title="Add New User">
        <form className="space-y-4" onSubmit={handleAddUser}>
          {addUserError && <div className="text-red-600 mb-4">{addUserError}</div>}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField label="Username" required>
              <input type="text" value={newUser.username} onChange={(e) => setNewUser({ ...newUser, username: e.target.value })} className="form-input" required />
            </FormField>
            <FormField label="Full Name" required>
              <input type="text" value={newUser.name} onChange={(e) => setNewUser({ ...newUser, name: e.target.value })} className="form-input" required />
            </FormField>
            <FormField label="Email" required>
              <input type="email" value={newUser.email} onChange={(e) => setNewUser({ ...newUser, email: e.target.value })} className="form-input" required />
            </FormField>
          </div>
          
          <FormField label="Password" required>
            <input type="password" className="input-field w-full" required value={newUser.password} onChange={e => setNewUser({ ...newUser, password: e.target.value })} />
          </FormField>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField label="Role" required>
              <select className="input-field w-full" value={newUser.role} onChange={e => setNewUser({ ...newUser, role: e.target.value })}>
                <option value="student">Student</option>
                <option value="librarian">Librarian</option>
                <option value="admin">Admin</option>
              </select>
            </FormField>
          </div>
          
          <div className="flex justify-end gap-2 mt-6 pt-4 border-t">
            <button
              type="button"
              onClick={() => setIsAddUserOpen(false)}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={addUserLoading}>
              {addUserLoading ? <ButtonLoader /> : 'Create User'}
            </button>
          </div>
        </form>
      </Modal>

      <Modal open={!!editUser} onClose={() => setEditUser(null)} title="Edit User">
        {editUser && (
          <form className="space-y-4" onSubmit={handleEditUserSubmit}>
            {editUserError && <div className="text-red-600 mb-4">{editUserError}</div>}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField label="Username" required>
                <input name="username" type="text" className="input-field w-full" required value={editUser.username} onChange={handleEditUserChange} />
              </FormField>
              <FormField label="Email" required>
                <input name="email" type="email" className="input-field w-full" required value={editUser.email} onChange={handleEditUserChange} />
              </FormField>
            </div>

            <FormField label="Role" required>
              <select name="role" className="input-field w-full" value={editUser.role} onChange={handleEditUserChange}>
                <option value="student">Student</option>
                <option value="librarian">Librarian</option>
                <option value="admin">Admin</option>
              </select>
            </FormField>
            
            <div className="flex justify-end gap-2 mt-6 pt-4 border-t">
              <button
                type="button"
                onClick={() => setEditUser(null)}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-primary"
                disabled={editUserLoading}
              >
                {editUserLoading ? <ButtonLoader /> : 'Save Changes'}
              </button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
};

export default UserManagement; 