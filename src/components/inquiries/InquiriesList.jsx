import React, { useState, useEffect } from 'react';
import inquiryService from '../../services/inquiryService';
import InquiryDetailModal from './InquiryDetailModal';
import { Eye, Trash2, Search } from 'lucide-react';
import { formatDate } from '../../utils/helpers';
import '../../styles/InquiriesList.css';

const InquiriesList = () => {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState('');
  const [selectedInquiry, setSelectedInquiry] = useState(null);

  useEffect(() => {
    fetchInquiries();
  }, []);

  const fetchInquiries = async () => {
    try {
      setLoading(true);
      const response = await inquiryService.getAll();
      setInquiries(response.data);
      setError('');
    } catch (error) {
      setError(error.message || 'Failed to fetch inquiries');
      console.error('Error fetching inquiries:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredInquiries = inquiries.filter(inquiry => {
    const matchesSearch = inquiry.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          inquiry.subject.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || inquiry.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleView = async (inquiryId) => {
    try {
      const response = await inquiryService.getById(inquiryId);
      setSelectedInquiry(response.data);
    } catch (error) {
      alert('Failed to fetch inquiry details');
    }
  };

  const handleDelete = async (inquiryId) => {
    if (window.confirm('Are you sure you want to delete this inquiry?')) {
      try {
        await inquiryService.delete(inquiryId);
        fetchInquiries();
      } catch (error) {
        alert(error.message || 'Failed to delete inquiry');
      }
    }
  };

  const handleStatusChange = async (inquiryId, newStatus) => {
    try {
      await inquiryService.updateStatus(inquiryId, newStatus);
      fetchInquiries();
    } catch (error) {
      alert(error.message || 'Failed to update status');
    }
  };

  const getInitials = (name) => {
    if (!name) return '?';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return parts[0].substring(0, 2).toUpperCase();
  };

  const getAvatarColor = (name) => {
    const colors = [
      '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', 
      '#3b82f6', '#ef4444', '#6366f1', '#14b8a6'
    ];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };

  const getStatusClass = (status) => {
    const statusClasses = {
      'New': 'status-new',
      'In Progress': 'status-progress',
      'Completed': 'status-completed',
      'Cancelled': 'status-cancelled'
    };
    return statusClasses[status] || 'status-new';
  };

  if (loading) {
    return (
      <div className="inquiries-container">
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading inquiries...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="inquiries-container">
      <div className="inquiries-header">
        <div>
          <h1 className="inquiries-title">Inquiries</h1>
          <p className="inquiries-subtitle">Manage customer inquiries and requests</p>
        </div>
      </div>

      {error && (
        <div className="error-alert">
          <span>⚠️</span>
          <p>{error}</p>
        </div>
      )}

      <div className="inquiries-filters">
        <div className="search-box">
          <Search size={20} className="search-icon" />
          <input
            type="text"
            placeholder="Search inquiries..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        
        <select
          className="status-filter"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">All Status</option>
          <option value="New">New</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
        </select>
      </div>

      <div className="inquiries-table-card">
        <table className="inquiries-table">
          <thead>
            <tr>
              <th>NAME</th>
              <th>EMAIL</th>
              <th>SUBJECT</th>
              <th>DATE</th>
              <th>STATUS</th>
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {filteredInquiries.length === 0 ? (
              <tr>
                <td colSpan="6" className="empty-state">
                  <div className="empty-content">
                    <p>No inquiries found</p>
                  </div>
                </td>
              </tr>
            ) : (
              filteredInquiries.map((inquiry) => (
                <tr key={inquiry._id}>
                  <td>
                    <div className="name-cell-wrapper">
                      <div 
                        className="user-avatar"
                        style={{ backgroundColor: getAvatarColor(inquiry.name) }}
                      >
                        {getInitials(inquiry.name)}
                      </div>
                      <span className="user-name-text">{inquiry.name}</span>
                    </div>
                  </td>
                  <td className="email-cell">{inquiry.email}</td>
                  <td className="subject-cell">{inquiry.subject}</td>
                  <td className="date-cell">{formatDate(inquiry.date)}</td>
                  <td>
                    <select
                      value={inquiry.status}
                      onChange={(e) => handleStatusChange(inquiry._id, e.target.value)}
                      className={`status-dropdown ${getStatusClass(inquiry.status)}`}
                    >
                      <option value="New">New</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Completed">Completed</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button
                        className="action-btn view-btn"
                        title="View Details"
                        onClick={() => handleView(inquiry._id)}
                      >
                        <Eye size={18} />
                      </button>
                      <button
                        className="action-btn delete-btn"
                        title="Delete"
                        onClick={() => handleDelete(inquiry._id)}
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {selectedInquiry && (
        <InquiryDetailModal
          inquiry={selectedInquiry}
          onClose={() => setSelectedInquiry(null)}
        />
      )}
    </div>
  );
};

export default InquiriesList;

