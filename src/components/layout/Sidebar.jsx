// admin-frontend/src/components/layout/Sidebar.jsx
import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  MessageSquare, 
  Briefcase, 
  FileText, 
  Settings, 
  LogOut,
  Menu,
  X,
  UserCog,
  Receipt  // ⭐ NEW ICON FOR QUOTATIONS
} from 'lucide-react';
import { APP_NAME } from '../../utils/constants';
import { useAuth } from '../../hooks/useAuth';

const Sidebar = ({ isOpen, currentPage, onPageChange, onToggle }) => {
  const { logout } = useAuth();

  const menuItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { id: 'users', icon: Users, label: 'User Management' },
    { id: 'employees', icon: UserCog, label: 'Employees' },
    { id: 'inquiries', icon: MessageSquare, label: 'Inquiries' },
    { id: 'services', icon: Briefcase, label: 'Services' },
    { id: 'quotations', icon: Receipt, label: 'Quotations' },  // ⭐⭐⭐ NEW ITEM ⭐⭐⭐
    { id: 'content', icon: FileText, label: 'Content Management' },
    { id: 'settings', icon: Settings, label: 'Settings' }
  ];

  return (
    <>
      <div className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-header">
          <h2>{isOpen ? APP_NAME : 'WH'}</h2>
          <button className="toggle-btn" onClick={onToggle}>
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        <nav className="sidebar-nav">
          {menuItems.map(item => (
            <button
              key={item.id}
              className={`nav-item ${currentPage === item.id ? 'active' : ''}`}
              onClick={() => onPageChange(item.id)}
              title={!isOpen ? item.label : ''}
            >
              <item.icon size={20} />
              {isOpen && <span>{item.label}</span>}
            </button>
          ))}
        </nav>

        <button className="nav-item logout" onClick={logout}>
          <LogOut size={20} />
          {isOpen && <span>Logout</span>}
        </button>
      </div>
      
      {isOpen && <div className="sidebar-overlay" onClick={onToggle} />}
    </>
  );
};

export default Sidebar;