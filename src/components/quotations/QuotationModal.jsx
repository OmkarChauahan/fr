// admin-frontend/src/components/quotations/QuotationModal.jsx
import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2, Save, AlertCircle } from 'lucide-react';
import quotationService from '../../services/quotationService';
import serviceService from '../../services/serviceService';

const QuotationModal = ({ quotation, onClose, onSave }) => {
  const [loading, setLoading] = useState(false);
  const [services, setServices] = useState([]);
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState(''); // ⭐ NEW: API error state
  
  const [formData, setFormData] = useState({
    customer: {
      name: '',
      email: '',
      phone: '',
      company: '',
      address: '',
      gst: ''
    },
    items: [
      {
        service: '',
        serviceName: '',
        description: '',
        quantity: 1,
        unitPrice: 0,
        discount: 0,
        tax: 18,
        amount: 0
      }
    ],
    validUntil: '',
    notes: '',
    terms: 'Payment terms: 50% advance, 50% on completion.\nDelivery timeline as per project scope.\nPrices are exclusive of applicable taxes.'
  });

  const [totals, setTotals] = useState({
    subtotal: 0,
    totalDiscount: 0,
    totalTax: 0,
    grandTotal: 0
  });

  useEffect(() => {
    fetchServices();
    
    if (quotation) {
      setFormData({
        customer: quotation.customer,
        items: quotation.items.map(item => ({
          service: item.service._id || item.service,
          serviceName: item.serviceName,
          description: item.description,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          discount: item.discount,
          tax: item.tax,
          amount: item.amount
        })),
        validUntil: new Date(quotation.validUntil).toISOString().split('T')[0],
        notes: quotation.notes || '',
        terms: quotation.terms || formData.terms
      });
    } else {
      const defaultValidUntil = new Date();
      defaultValidUntil.setDate(defaultValidUntil.getDate() + 30);
      setFormData(prev => ({
        ...prev,
        validUntil: defaultValidUntil.toISOString().split('T')[0]
      }));
    }
  }, [quotation]);

  useEffect(() => {
    calculateTotals();
  }, [formData.items]);

  const fetchServices = async () => {
    try {
      const response = await serviceService.getAllServices();
      setServices(response.data || []);
    } catch (error) {
      console.error('Error fetching services:', error);
      setApiError('Failed to load services. Please refresh the page.');
    }
  };

  const calculateTotals = () => {
    let subtotal = 0;
    let totalDiscount = 0;
    let totalTax = 0;

    formData.items.forEach(item => {
      const itemSubtotal = item.quantity * item.unitPrice;
      const discountAmount = (itemSubtotal * item.discount) / 100;
      const taxableAmount = itemSubtotal - discountAmount;
      const taxAmount = (taxableAmount * item.tax) / 100;

      subtotal += itemSubtotal;
      totalDiscount += discountAmount;
      totalTax += taxAmount;
    });

    const grandTotal = subtotal - totalDiscount + totalTax;

    setTotals({
      subtotal,
      totalDiscount,
      totalTax,
      grandTotal
    });
  };

  const handleCustomerChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      customer: {
        ...prev.customer,
        [field]: value
      }
    }));
    
    if (errors[`customer.${field}`]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[`customer.${field}`];
        return newErrors;
      });
    }
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...formData.items];
    newItems[index] = {
      ...newItems[index],
      [field]: value
    };

    if (field === 'service') {
      const selectedService = services.find(s => s._id === value);
      if (selectedService) {
        newItems[index].serviceName = selectedService.name;
        newItems[index].description = selectedService.description;
        newItems[index].unitPrice = selectedService.price || 0;
      }
    }

    const item = newItems[index];
    const itemSubtotal = item.quantity * item.unitPrice;
    const discountAmount = (itemSubtotal * item.discount) / 100;
    const taxableAmount = itemSubtotal - discountAmount;
    const taxAmount = (taxableAmount * item.tax) / 100;
    newItems[index].amount = taxableAmount + taxAmount;

    setFormData(prev => ({
      ...prev,
      items: newItems
    }));
  };

  const addItem = () => {
    setFormData(prev => ({
      ...prev,
      items: [
        ...prev.items,
        {
          service: '',
          serviceName: '',
          description: '',
          quantity: 1,
          unitPrice: 0,
          discount: 0,
          tax: 18,
          amount: 0
        }
      ]
    }));
  };

  const removeItem = (index) => {
    if (formData.items.length === 1) {
      alert('At least one item is required');
      return;
    }
    
    setFormData(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index)
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.customer.name.trim()) {
      newErrors['customer.name'] = 'Customer name is required';
    }
    if (!formData.customer.email.trim()) {
      newErrors['customer.email'] = 'Customer email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.customer.email)) {
      newErrors['customer.email'] = 'Invalid email format';
    }
    if (!formData.customer.phone.trim()) {
      newErrors['customer.phone'] = 'Customer phone is required';
    }

    formData.items.forEach((item, index) => {
      if (!item.service) {
        newErrors[`item.${index}.service`] = 'Service is required';
      }
      if (item.quantity <= 0) {
        newErrors[`item.${index}.quantity`] = 'Quantity must be greater than 0';
      }
      if (item.unitPrice <= 0) {
        newErrors[`item.${index}.unitPrice`] = 'Unit price must be greater than 0';
      }
    });

    if (!formData.validUntil) {
      newErrors.validUntil = 'Valid until date is required';
    } else if (new Date(formData.validUntil) < new Date()) {
      newErrors.validUntil = 'Valid until date must be in the future';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Clear previous API errors
    setApiError('');

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      if (quotation) {
        await quotationService.updateQuotation(quotation._id, formData);
      } else {
        await quotationService.createQuotation(formData);
      }
      onSave();
    } catch (error) {
      console.error('Error saving quotation:', error);
      
      // ⭐⭐⭐ PROPER ERROR HANDLING ⭐⭐⭐
      if (error.type === 'permission') {
        setApiError('You do not have permission to create quotations. Please contact your administrator.');
      } else if (error.type === 'auth') {
        setApiError('Your session has expired. Please login again.');
        // Optionally redirect after showing message
        setTimeout(() => {
          window.location.href = '/';
        }, 2000);
      } else if (error.type === 'validation') {
        setApiError(error.message || 'Please check your input and try again.');
      } else if (error.type === 'network') {
        setApiError('Network error. Please check your internet connection.');
      } else {
        setApiError(error.message || 'Failed to save quotation. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container large" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{quotation ? 'Edit Quotation' : 'Create New Quotation'}</h2>
          <button className="close-btn" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-body quotation-form">
          {/* ⭐ API Error Alert */}
          {apiError && (
            <div className="alert alert-error" style={{
              padding: '12px 16px',
              marginBottom: '20px',
              backgroundColor: '#fee',
              border: '1px solid #fcc',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              color: '#c33'
            }}>
              <AlertCircle size={20} />
              <span>{apiError}</span>
              <button 
                type="button"
                onClick={() => setApiError('')}
                style={{
                  marginLeft: 'auto',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '18px',
                  color: '#c33'
                }}
              >
                ×
              </button>
            </div>
          )}

          {/* Customer Information */}
          <div className="form-section">
            <h3>Customer Information</h3>
            <div className="form-grid">
              <div className="form-group">
                <label>Customer Name *</label>
                <input
                  type="text"
                  value={formData.customer.name}
                  onChange={(e) => handleCustomerChange('name', e.target.value)}
                  className={errors['customer.name'] ? 'error' : ''}
                  placeholder="Enter customer name"
                />
                {errors['customer.name'] && (
                  <span className="error-message">{errors['customer.name']}</span>
                )}
              </div>

              <div className="form-group">
                <label>Email *</label>
                <input
                  type="email"
                  value={formData.customer.email}
                  onChange={(e) => handleCustomerChange('email', e.target.value)}
                  className={errors['customer.email'] ? 'error' : ''}
                  placeholder="customer@example.com"
                />
                {errors['customer.email'] && (
                  <span className="error-message">{errors['customer.email']}</span>
                )}
              </div>

              <div className="form-group">
                <label>Phone *</label>
                <input
                  type="tel"
                  value={formData.customer.phone}
                  onChange={(e) => handleCustomerChange('phone', e.target.value)}
                  className={errors['customer.phone'] ? 'error' : ''}
                  placeholder="+91 1234567890"
                />
                {errors['customer.phone'] && (
                  <span className="error-message">{errors['customer.phone']}</span>
                )}
              </div>

              <div className="form-group">
                <label>Company</label>
                <input
                  type="text"
                  value={formData.customer.company}
                  onChange={(e) => handleCustomerChange('company', e.target.value)}
                  placeholder="Company name (optional)"
                />
              </div>

              <div className="form-group full-width">
                <label>Address</label>
                <textarea
                  value={formData.customer.address}
                  onChange={(e) => handleCustomerChange('address', e.target.value)}
                  placeholder="Complete address (optional)"
                  rows="2"
                />
              </div>

              <div className="form-group">
                <label>GST Number</label>
                <input
                  type="text"
                  value={formData.customer.gst}
                  onChange={(e) => handleCustomerChange('gst', e.target.value)}
                  placeholder="GST number (optional)"
                />
              </div>

              <div className="form-group">
                <label>Valid Until *</label>
                <input
                  type="date"
                  value={formData.validUntil}
                  onChange={(e) => setFormData(prev => ({ ...prev, validUntil: e.target.value }))}
                  className={errors.validUntil ? 'error' : ''}
                  min={new Date().toISOString().split('T')[0]}
                />
                {errors.validUntil && (
                  <span className="error-message">{errors.validUntil}</span>
                )}
              </div>
            </div>
          </div>

          {/* Items Section */}
          <div className="form-section">
            <div className="section-header">
              <h3>Items / Services</h3>
              <button type="button" className="btn-secondary" onClick={addItem}>
                <Plus size={18} />
                Add Item
              </button>
            </div>

            <div className="items-container">
              {formData.items.map((item, index) => (
                <div key={index} className="item-row">
                  <div className="item-header">
                    <span className="item-number">Item #{index + 1}</span>
                    {formData.items.length > 1 && (
                      <button
                        type="button"
                        className="btn-icon delete"
                        onClick={() => removeItem(index)}
                        title="Remove Item"
                      >
                        <Trash2 size={18} />
                      </button>
                    )}
                  </div>

                  <div className="item-form">
                    <div className="form-group">
                      <label>Service *</label>
                      <select
                        value={item.service}
                        onChange={(e) => handleItemChange(index, 'service', e.target.value)}
                        className={errors[`item.${index}.service`] ? 'error' : ''}
                      >
                        <option value="">Select Service</option>
                        {services.map(service => (
                          <option key={service._id} value={service._id}>
                            {service.name} - {formatCurrency(service.price)}
                          </option>
                        ))}
                      </select>
                      {errors[`item.${index}.service`] && (
                        <span className="error-message">{errors[`item.${index}.service`]}</span>
                      )}
                    </div>

                    <div className="form-group full-width">
                      <label>Description</label>
                      <textarea
                        value={item.description}
                        onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                        placeholder="Additional details"
                        rows="2"
                      />
                    </div>

                    <div className="form-group">
                      <label>Quantity *</label>
                      <input
                        type="number"
                        value={item.quantity}
                        onChange={(e) => handleItemChange(index, 'quantity', parseInt(e.target.value) || 0)}
                        className={errors[`item.${index}.quantity`] ? 'error' : ''}
                        min="1"
                      />
                      {errors[`item.${index}.quantity`] && (
                        <span className="error-message">{errors[`item.${index}.quantity`]}</span>
                      )}
                    </div>

                    <div className="form-group">
                      <label>Unit Price (₹) *</label>
                      <input
                        type="number"
                        value={item.unitPrice}
                        onChange={(e) => handleItemChange(index, 'unitPrice', parseFloat(e.target.value) || 0)}
                        className={errors[`item.${index}.unitPrice`] ? 'error' : ''}
                        min="0"
                        step="0.01"
                      />
                      {errors[`item.${index}.unitPrice`] && (
                        <span className="error-message">{errors[`item.${index}.unitPrice`]}</span>
                      )}
                    </div>

                    <div className="form-group">
                      <label>Discount (%)</label>
                      <input
                        type="number"
                        value={item.discount}
                        onChange={(e) => handleItemChange(index, 'discount', parseFloat(e.target.value) || 0)}
                        min="0"
                        max="100"
                        step="0.01"
                      />
                    </div>

                    <div className="form-group">
                      <label>Tax (%)</label>
                      <input
                        type="number"
                        value={item.tax}
                        onChange={(e) => handleItemChange(index, 'tax', parseFloat(e.target.value) || 0)}
                        min="0"
                        max="100"
                        step="0.01"
                      />
                    </div>

                    <div className="form-group">
                      <label>Amount</label>
                      <input
                        type="text"
                        value={formatCurrency(item.amount)}
                        disabled
                        className="amount-display"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Totals */}
          <div className="totals-section">
            <div className="totals-grid">
              <div className="total-row">
                <span>Subtotal:</span>
                <strong>{formatCurrency(totals.subtotal)}</strong>
              </div>
              <div className="total-row discount">
                <span>Total Discount:</span>
                <strong>- {formatCurrency(totals.totalDiscount)}</strong>
              </div>
              <div className="total-row">
                <span>Total Tax:</span>
                <strong>{formatCurrency(totals.totalTax)}</strong>
              </div>
              <div className="total-row grand">
                <span>Grand Total:</span>
                <strong>{formatCurrency(totals.grandTotal)}</strong>
              </div>
            </div>
          </div>

          {/* Notes */}
          <div className="form-section">
            <div className="form-group full-width">
              <label>Notes</label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                placeholder="Additional notes"
                rows="3"
              />
            </div>

            <div className="form-group full-width">
              <label>Terms & Conditions</label>
              <textarea
                value={formData.terms}
                onChange={(e) => setFormData(prev => ({ ...prev, terms: e.target.value }))}
                placeholder="Terms and conditions"
                rows="4"
              />
            </div>
          </div>

          {/* Footer */}
          <div className="modal-footer">
            <button type="button" className="btn-secondary" onClick={onClose} disabled={loading}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={loading}>
              <Save size={18} />
              {loading ? 'Saving...' : quotation ? 'Update Quotation' : 'Create Quotation'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default QuotationModal;