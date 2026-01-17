// admin-frontend/src/components/quotations/QuotationViewModal.jsx
import React from 'react';
import { 
  X, Download, Send, Printer, Share2, CheckCircle, 
  XCircle, Calendar, Mail, Phone, Building2, MapPin, FileText 
} from 'lucide-react';

const QuotationViewModal = ({ 
  quotation, 
  onClose, 
  onStatusChange, 
  onDownload, 
  onPrint, 
  onShare, 
  onSend 
}) => {
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
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusColor = (status) => {
    const colors = {
      Draft: '#6c757d',
      Sent: '#0d6efd',
      Accepted: '#198754',
      Rejected: '#dc3545',
      Expired: '#ffc107'
    };
    return colors[status] || colors.Draft;
  };

  const isExpired = new Date(quotation.validUntil) < new Date();

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container xlarge quotation-view" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h2>Quotation Details</h2>
            <div className="quotation-meta">
              <span className="quotation-number">#{quotation.quotationNumber}</span>
              <span 
                className="status-badge-large" 
                style={{ backgroundColor: getStatusColor(quotation.status) }}
              >
                {quotation.status}
              </span>
            </div>
          </div>
          <button className="close-btn" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <div className="modal-body quotation-view-body">
          {/* Action Buttons */}
          <div className="action-bar">
            <button 
              className="btn-action"
              onClick={() => onDownload(quotation)}
              title="Download PDF"
            >
              <Download size={18} />
              Download PDF
            </button>

            <button 
              className="btn-action"
              onClick={() => onPrint(quotation)}
              title="Print"
            >
              <Printer size={18} />
              Print
            </button>

            <button 
              className="btn-action"
              onClick={() => onShare(quotation)}
              title="Share"
            >
              <Share2 size={18} />
              Share Link
            </button>

            {(quotation.status === 'Draft' || quotation.status === 'Sent') && (
              <button 
                className="btn-action primary"
                onClick={() => onSend(quotation)}
                title="Send via Email"
              >
                <Send size={18} />
                Send Email
              </button>
            )}
          </div>

          {/* Quotation Content */}
          <div className="quotation-content">
            {/* Header Section */}
            <div className="quotation-header-section">
              <div className="company-info">
                <h1>WorkHub Solutions</h1>
                <p>Professional IT Services & Solutions</p>
                <div className="company-details">
                  <p><Phone size={14} /> +91 1234567890</p>
                  <p><Mail size={14} /> info@workhub.com</p>
                  <p><MapPin size={14} /> Nagpur, Maharashtra, India</p>
                </div>
              </div>

              <div className="quotation-info">
                <h3>QUOTATION</h3>
                <table className="info-table">
                  <tbody>
                    <tr>
                      <td><strong>Quotation #:</strong></td>
                      <td>{quotation.quotationNumber}</td>
                    </tr>
                    <tr>
                      <td><strong>Date:</strong></td>
                      <td>{formatDate(quotation.createdAt)}</td>
                    </tr>
                    <tr>
                      <td><strong>Valid Until:</strong></td>
                      <td className={isExpired ? 'text-danger' : ''}>
                        {formatDate(quotation.validUntil)}
                        {isExpired && <span className="expired-label"> (Expired)</span>}
                      </td>
                    </tr>
                    <tr>
                      <td><strong>Status:</strong></td>
                      <td>
                        <span 
                          className="status-pill" 
                          style={{ backgroundColor: getStatusColor(quotation.status) }}
                        >
                          {quotation.status}
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Customer Information */}
            <div className="customer-section">
              <h3>Bill To:</h3>
              <div className="customer-details">
                <p className="customer-name">{quotation.customer.name}</p>
                {quotation.customer.company && (
                  <p className="customer-company">
                    <Building2 size={14} /> {quotation.customer.company}
                  </p>
                )}
                <p><Mail size={14} /> {quotation.customer.email}</p>
                <p><Phone size={14} /> {quotation.customer.phone}</p>
                {quotation.customer.address && (
                  <p><MapPin size={14} /> {quotation.customer.address}</p>
                )}
                {quotation.customer.gst && (
                  <p><FileText size={14} /> GST: {quotation.customer.gst}</p>
                )}
              </div>
            </div>

            {/* Items Table */}
            <div className="items-section">
              <table className="items-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Service / Item</th>
                    <th className="text-center">Qty</th>
                    <th className="text-right">Unit Price</th>
                    <th className="text-center">Discount</th>
                    <th className="text-center">Tax</th>
                    <th className="text-right">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {quotation.items.map((item, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>
                        <div className="item-details">
                          <strong>{item.serviceName}</strong>
                          {item.description && (
                            <p className="item-description">{item.description}</p>
                          )}
                        </div>
                      </td>
                      <td className="text-center">{item.quantity}</td>
                      <td className="text-right">{formatCurrency(item.unitPrice)}</td>
                      <td className="text-center">{item.discount}%</td>
                      <td className="text-center">{item.tax}%</td>
                      <td className="text-right"><strong>{formatCurrency(item.amount)}</strong></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Totals */}
            <div className="totals-section-view">
              <div className="totals-grid-view">
                <div className="total-row">
                  <span>Subtotal:</span>
                  <span>{formatCurrency(quotation.subtotal)}</span>
                </div>
                <div className="total-row discount-row">
                  <span>Total Discount:</span>
                  <span>- {formatCurrency(quotation.totalDiscount)}</span>
                </div>
                <div className="total-row">
                  <span>Total Tax:</span>
                  <span>{formatCurrency(quotation.totalTax)}</span>
                </div>
                <div className="total-row grand-total">
                  <span>Grand Total:</span>
                  <span>{formatCurrency(quotation.grandTotal)}</span>
                </div>
              </div>
            </div>

            {/* Notes and Terms */}
            {(quotation.notes || quotation.terms) && (
              <div className="notes-section">
                {quotation.notes && (
                  <div className="notes-block">
                    <h4>Notes:</h4>
                    <p>{quotation.notes}</p>
                  </div>
                )}

                {quotation.terms && (
                  <div className="terms-block">
                    <h4>Terms & Conditions:</h4>
                    <p className="terms-text">{quotation.terms}</p>
                  </div>
                )}
              </div>
            )}

            {/* Footer Info */}
            <div className="quotation-footer-info">
              <p className="created-by">
                Created by: <strong>{quotation.createdBy?.name || 'Admin'}</strong>
              </p>
              {quotation.sentAt && (
                <p>Sent on: {formatDate(quotation.sentAt)}</p>
              )}
              {quotation.acceptedAt && (
                <p className="text-success">Accepted on: {formatDate(quotation.acceptedAt)}</p>
              )}
              {quotation.rejectedAt && (
                <p className="text-danger">Rejected on: {formatDate(quotation.rejectedAt)}</p>
              )}
            </div>
          </div>

          {/* Status Change Actions */}
          {quotation.status !== 'Accepted' && quotation.status !== 'Rejected' && !isExpired && (
            <div className="status-actions">
              <h4>Update Status:</h4>
              <div className="status-buttons">
                {quotation.status === 'Draft' && (
                  <button
                    className="btn-status sent"
                    onClick={() => onStatusChange(quotation._id, 'Sent')}
                  >
                    <Send size={18} />
                    Mark as Sent
                  </button>
                )}

                {quotation.status === 'Sent' && (
                  <>
                    <button
                      className="btn-status accepted"
                      onClick={() => onStatusChange(quotation._id, 'Accepted')}
                    >
                      <CheckCircle size={18} />
                      Mark as Accepted
                    </button>
                    <button
                      className="btn-status rejected"
                      onClick={() => onStatusChange(quotation._id, 'Rejected')}
                    >
                      <XCircle size={18} />
                      Mark as Rejected
                    </button>
                  </>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button className="btn-secondary" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuotationViewModal;