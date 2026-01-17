// admin-frontend/src/components/quotations/QuotationManagement.jsx
import React, { useState, useEffect } from 'react';
import { 
  Plus, Search, Filter, Download, Send, Eye, Edit2, Trash2, 
  FileText, Share2, Printer, CheckCircle, XCircle, Clock, AlertCircle 
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth'; // ⭐ IMPORT AUTH HOOK
import quotationService from '../../services/quotationService';
import QuotationModal from './QuotationModal';
import QuotationViewModal from './QuotationViewModal';
import '../../styles/QuotationManagement.css';

const QuotationManagement = () => {
  const { user } = useAuth(); // ⭐ GET USER FROM AUTH
  const [quotations, setQuotations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedQuotation, setSelectedQuotation] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [stats, setStats] = useState(null);
  const [message, setMessage] = useState({ type: '', text: '' });

  // ⭐⭐⭐ ROLE-BASED PERMISSIONS ⭐⭐⭐
  const userRole = user?.role?.toLowerCase() || '';
  const canCreate = ['admin', 'manager'].includes(userRole);
  const canEdit = ['admin', 'manager'].includes(userRole);
  const canDelete = userRole === 'admin';
  const canSend = ['admin', 'manager'].includes(userRole);

  useEffect(() => {
    fetchQuotations();
    fetchStats();
  }, [filterStatus, searchTerm]);

  const fetchQuotations = async () => {
    try {
      setLoading(true);
      const response = await quotationService.getAllQuotations({
        status: filterStatus,
        search: searchTerm
      });
      setQuotations(response.data);
    } catch (error) {
      showMessage('error', 'Failed to fetch quotations');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await quotationService.getQuotationStats();
      setStats(response.data);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  };

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 3000);
  };

  const handleCreate = () => {
    // ⭐ CHECK PERMISSION BEFORE OPENING MODAL
    if (!canCreate) {
      showMessage('error', 'You do not have permission to create quotations');
      return;
    }
    setSelectedQuotation(null);
    setShowModal(true);
  };

  const handleEdit = (quotation) => {
    // ⭐ CHECK PERMISSION
    if (!canEdit) {
      showMessage('error', 'You do not have permission to edit quotations');
      return;
    }
    setSelectedQuotation(quotation);
    setShowModal(true);
  };

  const handleView = (quotation) => {
    setSelectedQuotation(quotation);
    setShowViewModal(true);
  };

  const handleDelete = async (id) => {
    // ⭐ CHECK PERMISSION
    if (!canDelete) {
      showMessage('error', 'You do not have permission to delete quotations');
      return;
    }

    if (!window.confirm('Are you sure you want to delete this quotation?')) {
      return;
    }

    try {
      await quotationService.deleteQuotation(id);
      showMessage('success', 'Quotation deleted successfully');
      fetchQuotations();
      fetchStats();
    } catch (error) {
      if (error.type === 'permission') {
        showMessage('error', 'You do not have permission to delete this quotation');
      } else {
        showMessage('error', error.message || 'Failed to delete quotation');
      }
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      await quotationService.updateQuotationStatus(id, status);
      showMessage('success', `Quotation ${status.toLowerCase()} successfully`);
      fetchQuotations();
      fetchStats();
    } catch (error) {
      if (error.type === 'permission') {
        showMessage('error', 'You do not have permission to update quotation status');
      } else {
        showMessage('error', error.message || 'Failed to update status');
      }
    }
  };

  const handleDownloadPDF = async (quotation) => {
    try {
      await quotationService.downloadPDF(quotation._id, quotation.quotationNumber);
      showMessage('success', 'PDF downloaded successfully');
    } catch (error) {
      showMessage('error', 'Failed to download PDF');
    }
  };

  const handlePrint = async (quotation) => {
    try {
      await quotationService.printQuotation(quotation._id);
      showMessage('success', 'Opening print dialog...');
    } catch (error) {
      showMessage('error', 'Failed to print quotation');
    }
  };

  const handleShare = async (quotation) => {
    try {
      await quotationService.shareQuotation(quotation._id);
      showMessage('success', 'Link copied to clipboard!');
    } catch (error) {
      showMessage('error', 'Failed to copy link');
    }
  };

  const handleSendEmail = async (quotation) => {
    // ⭐ CHECK PERMISSION
    if (!canSend) {
      showMessage('error', 'You do not have permission to send quotations');
      return;
    }

    if (!window.confirm(`Send quotation to ${quotation.customer.email}?`)) {
      return;
    }

    try {
      await quotationService.sendQuotationEmail(quotation._id);
      showMessage('success', 'Quotation sent successfully');
      fetchQuotations();
    } catch (error) {
      if (error.type === 'permission') {
        showMessage('error', 'You do not have permission to send quotations');
      } else {
        showMessage('error', error.message || 'Failed to send quotation');
      }
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      Draft: { icon: <FileText size={14} />, class: 'draft' },
      Sent: { icon: <Send size={14} />, class: 'sent' },
      Accepted: { icon: <CheckCircle size={14} />, class: 'accepted' },
      Rejected: { icon: <XCircle size={14} />, class: 'rejected' },
      Expired: { icon: <AlertCircle size={14} />, class: 'expired' }
    };

    const config = statusConfig[status] || statusConfig.Draft;
    
    return (
      <span className={`status-badge ${config.class}`}>
        {config.icon}
        {status}
      </span>
    );
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="quotation-management">
      {/* Header */}
      <div className="quotation-header">
        <div>
          <h1>Quotations & Billing</h1>
          <p>Manage quotations, generate invoices, and track billing</p>
        </div>
        {/* ⭐⭐⭐ CONDITIONAL BUTTON RENDERING ⭐⭐⭐ */}
        {canCreate && (
          <button className="btn-primary" onClick={handleCreate}>
            <Plus size={20} />
            Create Quotation
          </button>
        )}
      </div>

      {/* Statistics Cards */}
      {stats && (
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon total">
              <FileText size={24} />
            </div>
            <div className="stat-content">
              <p className="stat-label">Total Quotations</p>
              <h3>{stats.total}</h3>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon accepted">
              <CheckCircle size={24} />
            </div>
            <div className="stat-content">
              <p className="stat-label">Accepted</p>
              <h3>{stats.accepted}</h3>
              <span className="stat-meta">{stats.conversionRate}% conversion</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon sent">
              <Send size={24} />
            </div>
            <div className="stat-content">
              <p className="stat-label">Sent & Pending</p>
              <h3>{stats.sent}</h3>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon value">
              <span className="rupee-icon">₹</span>
            </div>
            <div className="stat-content">
              <p className="stat-label">Total Value</p>
              <h3>{formatCurrency(stats.totalValue)}</h3>
              <span className="stat-meta">Accepted: {formatCurrency(stats.acceptedValue)}</span>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="quotation-controls">
        <div className="search-box">
          <Search size={20} />
          <input
            type="text"
            placeholder="Search quotations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filter-group">
          <Filter size={18} />
          <select 
            value={filterStatus} 
            onChange={(e) => setFilterStatus(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Status</option>
            <option value="Draft">Draft</option>
            <option value="Sent">Sent</option>
            <option value="Accepted">Accepted</option>
            <option value="Rejected">Rejected</option>
            <option value="Expired">Expired</option>
          </select>
        </div>
      </div>

      {/* Messages */}
      {message.text && (
        <div className={`alert alert-${message.type}`}>
          {message.text}
        </div>
      )}

      {/* Table */}
      <div className="quotation-table-container">
        {loading ? (
          <div className="loading-state">
            <Clock className="spinner" size={40} />
            <p>Loading quotations...</p>
          </div>
        ) : quotations.length === 0 ? (
          <div className="empty-state">
            <FileText size={60} />
            <h3>No quotations found</h3>
            <p>Create your first quotation to get started</p>
            {canCreate && (
              <button className="btn-primary" onClick={handleCreate}>
                <Plus size={20} />
                Create Quotation
              </button>
            )}
          </div>
        ) : (
          <table className="quotation-table">
            <thead>
              <tr>
                <th>Quotation #</th>
                <th>Customer</th>
                <th>Date</th>
                <th>Valid Until</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {quotations.map((quotation) => (
                <tr key={quotation._id}>
                  <td>
                    <strong>{quotation.quotationNumber}</strong>
                  </td>
                  <td>
                    <div className="customer-info">
                      <div className="customer-name">{quotation.customer.name}</div>
                      <div className="customer-email">{quotation.customer.email}</div>
                    </div>
                  </td>
                  <td>{formatDate(quotation.createdAt)}</td>
                  <td>
                    <span className={new Date(quotation.validUntil) < new Date() ? 'expired-date' : ''}>
                      {formatDate(quotation.validUntil)}
                    </span>
                  </td>
                  <td>
                    <strong>{formatCurrency(quotation.grandTotal)}</strong>
                  </td>
                  <td>{getStatusBadge(quotation.status)}</td>
                  <td>
                    <div className="action-buttons">
                      <button
                        className="btn-icon"
                        onClick={() => handleView(quotation)}
                        title="View Details"
                      >
                        <Eye size={18} />
                      </button>

                      {/* ⭐ CONDITIONAL EDIT BUTTON */}
                      {canEdit && quotation.status !== 'Accepted' && quotation.status !== 'Rejected' && (
                        <button
                          className="btn-icon"
                          onClick={() => handleEdit(quotation)}
                          title="Edit"
                        >
                          <Edit2 size={18} />
                        </button>
                      )}

                      <button
                        className="btn-icon"
                        onClick={() => handleDownloadPDF(quotation)}
                        title="Download PDF"
                      >
                        <Download size={18} />
                      </button>

                      <button
                        className="btn-icon"
                        onClick={() => handlePrint(quotation)}
                        title="Print"
                      >
                        <Printer size={18} />
                      </button>

                      <button
                        className="btn-icon"
                        onClick={() => handleShare(quotation)}
                        title="Share Link"
                      >
                        <Share2 size={18} />
                      </button>

                      {/* ⭐ CONDITIONAL SEND BUTTON */}
                      {canSend && (quotation.status === 'Draft' || quotation.status === 'Sent') && (
                        <button
                          className="btn-icon send"
                          onClick={() => handleSendEmail(quotation)}
                          title="Send via Email"
                        >
                          <Send size={18} />
                        </button>
                      )}

                      {/* ⭐ CONDITIONAL DELETE BUTTON */}
                      {canDelete && quotation.status !== 'Accepted' && (
                        <button
                          className="btn-icon delete"
                          onClick={() => handleDelete(quotation._id)}
                          title="Delete"
                        >
                          <Trash2 size={18} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modals */}
      {showModal && (
        <QuotationModal
          quotation={selectedQuotation}
          onClose={() => {
            setShowModal(false);
            setSelectedQuotation(null);
          }}
          onSave={() => {
            fetchQuotations();
            fetchStats();
            setShowModal(false);
            setSelectedQuotation(null);
          }}
        />
      )}

      {showViewModal && (
        <QuotationViewModal
          quotation={selectedQuotation}
          onClose={() => {
            setShowViewModal(false);
            setSelectedQuotation(null);
          }}
          onStatusChange={handleStatusChange}
          onDownload={handleDownloadPDF}
          onPrint={handlePrint}
          onShare={handleShare}
          onSend={handleSendEmail}
        />
      )}
    </div>
  );
};

export default QuotationManagement;