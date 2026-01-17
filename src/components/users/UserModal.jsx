import React, { useState, useEffect } from 'react';
import { X, User, Mail, Shield } from 'lucide-react';
import Button from '../common/Button';
import Alert from '../common/Alert';
import '../../styles/UserModal.css';

const UserModal = ({ user, onSave, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'User',
    status: 'Active'
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
        password: ''
      });
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.name || !formData.email) {
      setError('Please fill in all required fields');
      return;
    }

    if (!user && !formData.password) {
      setError('Password is required for new user');
      return;
    }

    if (formData.password && formData.password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    setLoading(true);
    try {
      await onSave(formData);
    } catch (err) {
      setError(err.message || 'Failed to save user');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="user-modal-overlay" onClick={onClose}>
      <div
        className="user-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="user-modal-header">
          <h2>{user ? 'Edit User' : 'Add New User'}</h2>
          <button className="user-modal-close" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="user-modal-form">
          <Alert type="error" message={error} onClose={() => setError('')} />

          <div className="form-row">
            <div className="form-group">
              <label>Full Name *</label>
              <div className="input-with-icon">
                <User size={20} />
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="John Doe"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>Email *</label>
              <div className="input-with-icon">
                <Mail size={20} />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  placeholder="john@example.com"
                  required
                />
              </div>
            </div>
          </div>

          {!user && (
            <div className="form-group">
              <label>Password *</label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                placeholder="Min 8 characters"
                required
              />
            </div>
          )}

          <div className="form-row">
            <div className="form-group">
              <label>Role *</label>
              <div className="input-with-icon">
                <Shield size={20} />
                <select
                  value={formData.role}
                  onChange={(e) =>
                    setFormData({ ...formData, role: e.target.value })
                  }
                  required
                >
                  <option value="Admin">Admin</option>
                  <option value="Manager">Manager</option>
                  <option value="User">User</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label>Status *</label>
              <select
                value={formData.status}
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.value })
                }
                required
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
                <option value="Pending">Pending</option>
              </select>
            </div>
          </div>

          <div className="user-modal-actions">
            <Button type="button" variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" disabled={loading}>
              {loading ? 'Saving...' : user ? 'Update User' : 'Add User'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserModal;
