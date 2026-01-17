import React from 'react';
import { X, Check, Trash2, Bell, User, Mail, Calendar, AlertCircle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const NotificationPanel = ({ 
  notifications, 
  onMarkAsRead, 
  onMarkAllAsRead, 
  onDelete,
  onClose 
}) => {
  const getNotificationIcon = (type) => {
    switch (type) {
      case 'user':
        return <User size={20} />;
      case 'inquiry':
        return <Mail size={20} />;
      case 'appointment':
        return <Calendar size={20} />;
      case 'alert':
        return <AlertCircle size={20} />;
      default:
        return <Bell size={20} />;
    }
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case 'user':
        return 'blue';
      case 'inquiry':
        return 'green';
      case 'appointment':
        return 'purple';
      case 'alert':
        return 'orange';
      default:
        return 'gray';
    }
  };

  return (
    <div className="notification-panel">
      <div className="notification-header">
        <div className="notification-header-left">
          <h3>Notifications</h3>
          {notifications.filter(n => !n.isRead).length > 0 && (
            <span className="unread-count">
              {notifications.filter(n => !n.isRead).length}
            </span>
          )}
        </div>
        <div className="notification-header-actions">
          {notifications.filter(n => !n.isRead).length > 0 && (
            <button 
              className="mark-all-btn" 
              onClick={onMarkAllAsRead}
              title="Mark all as read"
            >
              <Check size={16} />
            </button>
          )}
          <button 
            className="close-btn" 
            onClick={onClose}
            title="Close"
          >
            <X size={18} />
          </button>
        </div>
      </div>

      <div className="notification-body">
        {notifications.length === 0 ? (
          <div className="notification-empty">
            <Bell size={48} />
            <p>No notifications yet</p>
            <span>You're all caught up!</span>
          </div>
        ) : (
          <div className="notification-list">
            {notifications.map((notification) => (
              <div 
                key={notification._id} 
                className={`notification-item ${!notification.isRead ? 'unread' : ''}`}
              >
                <div className={`notification-icon ${getNotificationColor(notification.type)}`}>
                  {getNotificationIcon(notification.type)}
                </div>
                
                <div className="notification-content">
                  <div className="notification-title">
                    {notification.title}
                    {!notification.isRead && <span className="unread-dot"></span>}
                  </div>
                  <p className="notification-message">{notification.message}</p>
                  <span className="notification-time">
                    {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                  </span>
                </div>

                <div className="notification-actions">
                  {!notification.isRead && (
                    <button
                      className="notification-action-btn read"
                      onClick={() => onMarkAsRead(notification._id)}
                      title="Mark as read"
                    >
                      <Check size={16} />
                    </button>
                  )}
                  <button
                    className="notification-action-btn delete"
                    onClick={() => onDelete(notification._id)}
                    title="Delete"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {notifications.length > 0 && (
        <div className="notification-footer">
          <button className="view-all-btn">
            View All Notifications
          </button>
        </div>
      )}
    </div>
  );
};

export default NotificationPanel;