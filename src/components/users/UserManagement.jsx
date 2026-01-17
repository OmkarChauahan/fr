import React, { useState, useEffect } from 'react';
import UserTable from './UserTable';
import UserModal from './UserModal';
import UserDetailModal from './UserDetailModal';
import userService from '../../services/userService';
import { Plus, Search } from 'lucide-react';
import Button from '../common/Button';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await userService.getAll();
      setUsers(response.data);
      setError('');
    } catch (error) {
      setError(error.message || 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRole =
      roleFilter === 'all' || user.role === roleFilter;

    return matchesSearch && matchesRole;
  });

  const handleView = async (userId) => {
    try {
      const response = await userService.getById(userId);
      setSelectedUser(response.data);
    } catch {
      alert('Failed to fetch user details');
    }
  };

  const handleEdit = async (userId) => {
    try {
      const response = await userService.getById(userId);
      setEditingUser(response.data);
      setShowModal(true);
    } catch {
      alert('Failed to fetch user details');
    }
  };

  const handleDelete = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;

    try {
      await userService.delete(userId);
      fetchUsers();
      alert('User deleted successfully');
    } catch (error) {
      alert(error.message || 'Failed to delete user');
    }
  };

  const handleAddNew = () => {
    setEditingUser(null);
    setShowModal(true);
  };

  const handleSaveUser = async (userData) => {
    try {
      if (editingUser) {
        await userService.update(editingUser._id, userData);
        alert('User updated successfully');
      } else {
        await userService.create(userData);
        alert('User created successfully');
      }
      setShowModal(false);
      setEditingUser(null);
      fetchUsers();
    } catch (error) {
      throw new Error(error.message || 'Failed to save user');
    }
  };

  if (loading) {
    return (
      <div className="page-content">
        <div className="loading">Loading users...</div>
      </div>
    );
  }

  return (
    <div className="page-content">
      <div className="page-header-modern">
        <div>
          <h1 className="page-title">User Management</h1>
          <p className="page-subtitle">Manage user accounts and permissions</p>
        </div>
        <Button variant="primary" icon={<Plus size={20} />} onClick={handleAddNew}>
          Add New User
        </Button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <div className="filters-bar">
        <div className="search-box-modern">
          <Search size={20} />
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <select
          className="filter-select-modern"
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
        >
          <option value="all">All Roles</option>
          <option value="Admin">Admin</option>
          <option value="User">User</option>
          <option value="Manager">Manager</option>
        </select>
      </div>

      <UserTable
        users={filteredUsers}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {showModal && (
        <UserModal
          user={editingUser}
          onSave={handleSaveUser}
          onClose={() => {
            setShowModal(false);
            setEditingUser(null);
          }}
        />
      )}

      {selectedUser && (
        <UserDetailModal
          user={selectedUser}
          onClose={() => setSelectedUser(null)}
        />
      )}
    </div>
  );
};

export default UserManagement;
