import React from 'react';
import { Eye, Edit, Trash2 } from 'lucide-react';
import Badge from '../common/Badge';
import { formatDate } from '../../utils/helpers';
import '../../styles/UserTable.css';

const UserTable = ({ users, onView, onEdit, onDelete }) => {
  return (
    <div className="user-table-card">
      <table className="user-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Status</th>
            <th>Join Date</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {users.length === 0 ? (
            <tr>
              <td colSpan="6" className="empty-state">
                No users found
              </td>
            </tr>
          ) : (
            users.map((user) => (
              <tr key={user._id}>
                <td>
                  <div className="user-cell">
                    <div className="user-avatar">
                      {user.name
                        ? user.name
                            .split(' ')
                            .map((n) => n[0])
                            .join('')
                            .toUpperCase()
                        : '?'}
                    </div>
                    <span className="user-name">{user.name}</span>
                  </div>
                </td>

                <td>{user.email}</td>

                <td>
                  <Badge status={user.role}>{user.role}</Badge>
                </td>

                <td>
                  <Badge status={user.status}>{user.status}</Badge>
                </td>

                <td>{formatDate(user.joinDate || user.createdAt)}</td>

                <td>
                  <div className="user-actions">
                    <button
                      className="user-action-btn view"
                      title="View"
                      onClick={() => onView(user._id)}
                    >
                      <Eye size={16} />
                    </button>

                    <button
                      className="user-action-btn edit"
                      title="Edit"
                      onClick={() => onEdit(user._id)}
                    >
                      <Edit size={16} />
                    </button>

                    <button
                      className="user-action-btn delete"
                      title="Delete"
                      onClick={() => onDelete(user._id)}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default UserTable;
