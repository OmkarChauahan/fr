import React, { useState, useEffect, useRef } from 'react';
import { Bell } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { getInitials } from '../../utils/helpers';
import ProfileScreen from '../profile/ProfileScreen';
import NotificationPanel from './NotificationPanel';
import notificationService from '../../services/notificationService';
import '../../styles/Layout.css';

const Header = () => {
  const { user } = useAuth();
  const [showProfile, setShowProfile] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const notificationRef = useRef(null);

  useEffect(() => {
    fetchNotifications();
    // Poll for new notifications every 30 seconds
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await notificationService.getAll();
      setNotifications(response.data);
      const unread = response.data.filter(n => !n.isRead).length;
      setUnreadCount(unread);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const handleNotificationClick = () => {
    setShowNotifications(!showNotifications);
  };

  const handleMarkAsRead = async (notificationId) => {
    try {
      await notificationService.markAsRead(notificationId);
      fetchNotifications();
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead();
      fetchNotifications();
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };

  const handleDeleteNotification = async (notificationId) => {
    try {
      await notificationService.delete(notificationId);
      fetchNotifications();
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  // Direct profile click handler
  const handleProfileClick = () => {
    setShowProfile(true);
    setShowNotifications(false);
  };

  return (
    <>
      <header className="header">
        <div className="header-search">
          {/* Search can be added here if needed */}
        </div>

        <div className="header-actions">
          <div className="notification-wrapper" ref={notificationRef}>
            <button 
              className="icon-btn notification-btn" 
              title="Notifications"
              onClick={handleNotificationClick}
            >
              <Bell size={20} />
              {unreadCount > 0 && (
                <span className="notification-badge">{unreadCount}</span>
              )}
            </button>

            {showNotifications && (
              <NotificationPanel
                notifications={notifications}
                onMarkAsRead={handleMarkAsRead}
                onMarkAllAsRead={handleMarkAllAsRead}
                onDelete={handleDeleteNotification}
                onClose={() => setShowNotifications(false)}
              />
            )}
          </div>

          {/* Direct Profile Click - No Dropdown */}
          <button
            className="user-btn"
            onClick={handleProfileClick}
            title="View Profile"
          >
            <div className="avatar">
              {user ? getInitials(user.name) : 'AU'}
            </div>
            <span className="user-name">{user?.name || 'Admin User'}</span>
          </button>
        </div>
      </header>

      {showProfile && <ProfileScreen onClose={() => setShowProfile(false)} />}
    </>
  );
};

export default Header;