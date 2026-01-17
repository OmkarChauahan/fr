import React from 'react';
import { X, Mail, User, Calendar, MessageSquare, Tag } from 'lucide-react';
import Badge from '../common/Badge';
import { formatDate } from '../../utils/helpers';
import '../../styles/InquiriesView.css';

const InquiryDetailModal = ({ inquiry, onClose }) => {
  if (!inquiry) return null;

  return (
    <div className="inquiry-modal-overlay" onClick={onClose}>
      <div
        className="inquiry-detail-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="inquiry-modal-header">
          <h2>Inquiry Details</h2>
          <button className="inquiry-modal-close" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <div className="inquiry-detail-content">
          <div className="detail-status-section">
            <Badge status={inquiry.status}>{inquiry.status}</Badge>
            <span className="detail-date">
              <Calendar size={16} />
              {formatDate(inquiry.date)}
            </span>
          </div>

          <div className="detail-section">
            <h3>Contact Information</h3>
            <div className="detail-grid">
              <div className="detail-item">
                <User size={20} />
                <div>
                  <label>Name</label>
                  <p>{inquiry.name}</p>
                </div>
              </div>
              <div className="detail-item">
                <Mail size={20} />
                <div>
                  <label>Email</label>
                  <p>{inquiry.email}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="detail-section">
            <h3>Subject</h3>
            <div className="detail-item">
              <Tag size={20} />
              <p className="subject-text">{inquiry.subject}</p>
            </div>
          </div>

          <div className="detail-section">
            <h3>Message</h3>
            <div className="detail-item">
              <MessageSquare size={20} />
              <div className="message-content">
                <p>{inquiry.message}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="inquiry-modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default InquiryDetailModal;
