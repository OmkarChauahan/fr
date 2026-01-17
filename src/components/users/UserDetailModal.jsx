import React from 'react';
import { X, User, Mail, Shield, Calendar } from 'lucide-react';
import Badge from '../common/Badge';
import { formatDate } from '../../utils/helpers';
import '../../styles/UserDetailView.css';

const UserDetailModal = ({ user, onClose }) => {
  if (!user) return null;

  return (
    <div className="user-detail-overlay" onClick={onClose}>
      <div
        className="user-detail-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="user-detail-header">
          <h2>User Details</h2>
          <button className="user-detail-close" onClick={onClose}>
            <X size={22} />
          </button>
        </div>

        <div className="user-detail-content">
          <div className="user-detail-section">
            <User size={20} />
            <div>
              <label>Name</label>
              <p>{user.name}</p>
            </div>
          </div>

          <div className="user-detail-section">
            <Mail size={20} />
            <div>
              <label>Email</label>
              <p>{user.email}</p>
            </div>
          </div>

          <div className="user-detail-section">
            <Shield size={20} />
            <div>
              <label>Role</label>
              <Badge status={user.role}>{user.role}</Badge>
            </div>
          </div>

          <div className="user-detail-section">
            <Calendar size={20} />
            <div>
              <label>Join Date</label>
              <p>{formatDate(user.joinDate || user.createdAt)}</p>
            </div>
          </div>

          <div className="user-detail-section">
            <Shield size={20} />
            <div>
              <label>Status</label>
              <Badge status={user.status}>{user.status}</Badge>
            </div>
          </div>
        </div>

        <div className="user-detail-footer">
          <button className="btn btn-secondary" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserDetailModal;
