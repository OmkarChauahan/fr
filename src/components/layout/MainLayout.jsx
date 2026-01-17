import React, { useState } from 'react';
import { useSidebar } from '../../hooks/useSidebar';
import Sidebar from './Sidebar';
import Header from './Header';
import Dashboard from '../dashboard/Dashboard';
import UserManagement from '../users/UserManagement';
import EmployeeManagement from '../employees/EmployeeManagement';
import InquiriesList from '../inquiries/InquiriesList';
import ServicesList from '../services/ServicesList';
import QuotationManagement from '../quotations/QuotationManagement';  // ⭐ NEW
import ContentManagement from '../content/ContentManagement';
import Settings from '../settings/Settings';

const MainLayout = () => {
  const { isOpen, toggle } = useSidebar();
  const [currentPage, setCurrentPage] = useState('dashboard');

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'users':
        return <UserManagement />;
      case 'employees':
        return <EmployeeManagement />;
      case 'inquiries':
        return <InquiriesList />;
      case 'services':
        return <ServicesList />;
      case 'quotations':  // ⭐ NEW CASE
        return <QuotationManagement />;
      case 'content':
        return <ContentManagement />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="admin-layout">
      <Sidebar
        isOpen={isOpen}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        onToggle={toggle}
      />

      <div className={`main-content ${isOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
        <Header />
        <main>{renderPage()}</main>
      </div>
    </div>
  );
};

export default MainLayout;