import React, { useState, useEffect } from 'react';
import { X, Save, Plus, Trash2 } from 'lucide-react';
import Button from '../common/Button';
import '../../styles/ServiceModal.css';


const ServiceModal = ({ service, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    features: [''],
    status: 'Active'
  });

  useEffect(() => {
    if (service) {
      setFormData({
        ...service,
        features: service.features && service.features.length > 0 ? service.features : ['']
      });
    }
  }, [service]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleFeatureChange = (index, value) => {
    const newFeatures = [...formData.features];
    newFeatures[index] = value;
    setFormData({ ...formData, features: newFeatures });
  };

  const addFeature = () => {
    setFormData({ ...formData, features: [...formData.features, ''] });
  };

  const removeFeature = (index) => {
    const newFeatures = formData.features.filter((_, i) => i !== index);
    setFormData({ ...formData, features: newFeatures.length > 0 ? newFeatures : [''] });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const cleanedData = {
      ...formData,
      features: formData.features.filter(f => f.trim() !== '')
    };
    onSave(cleanedData);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container modal-large" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{service ? 'Edit Service' : 'Add New Service'}</h2>
          <button className="modal-close" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <div className="modal-body">
          <div className="form-group">
            <label>Service Name <span className="required">*</span></label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Web Development"
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <label>Description <span className="required">*</span></label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe your service..."
              rows="3"
              className="form-input"
              required
            />
          </div>

          <div className="form-grid">
            <div className="form-group">
              <label>Price <span className="required">*</span></label>
              <input
                type="text"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="$5,000"
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label>Status <span className="required">*</span></label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="form-input"
                required
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
                <option value="Draft">Draft</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Features/Technologies</label>
            <div className="features-list">
              {formData.features.map((feature, index) => (
                <div key={index} className="feature-input-group">
                  <input
                    type="text"
                    value={feature}
                    onChange={(e) => handleFeatureChange(index, e.target.value)}
                    placeholder="e.g., React, Node.js"
                    className="form-input"
                  />
                  {formData.features.length > 1 && (
                    <button
                      type="button"
                      className="btn-icon-danger"
                      onClick={() => removeFeature(index)}
                      title="Remove feature"
                    >
                      <Trash2 size={18} />
                    </button>
                  )}
                </div>
              ))}
            </div>
            <button
              type="button"
              className="btn btn-secondary btn-small"
              onClick={addFeature}
            >
              <Plus size={16} />
              Add Feature
            </button>
          </div>
        </div>

        <div className="modal-footer">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="button" variant="primary" icon={<Save size={18} />} onClick={handleSubmit}>
            {service ? 'Update Service' : 'Add Service'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ServiceModal;