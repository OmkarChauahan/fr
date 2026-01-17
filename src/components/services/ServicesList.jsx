import React, { useState, useEffect } from 'react';
import ServiceCard from './ServiceCard';
import ServiceModal from './ServiceModal';
import serviceService from '../../services/serviceService';
import { Plus } from 'lucide-react';
import Button from '../common/Button';

const ServicesList = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedService, setSelectedService] = useState(null);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const response = await serviceService.getAll();
      setServices(response.data);
      setError('');
    } catch (error) {
      setError(error.message || 'Failed to fetch services');
      console.error('Error fetching services:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddNew = () => {
    setSelectedService(null);
    setShowModal(true);
  };

  const handleEdit = (service) => {
    setSelectedService(service);
    setShowModal(true);
  };

  const handleDelete = async (serviceId) => {
    if (window.confirm('Are you sure you want to delete this service?')) {
      try {
        await serviceService.delete(serviceId);
        fetchServices();
        alert('Service deleted successfully');
      } catch (error) {
        alert(error.message || 'Failed to delete service');
      }
    }
  };

  const handleSave = async (formData) => {
    try {
      if (selectedService) {
        // Update existing service
        await serviceService.update(selectedService._id, formData);
        alert('Service updated successfully');
      } else {
        // Create new service
        await serviceService.create(formData);
        alert('Service added successfully');
      }
      setShowModal(false);
      fetchServices();
    } catch (error) {
      alert(error.message || 'Failed to save service');
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedService(null);
  };

  if (loading) {
    return (
      <div className="page-content">
        <div className="loading">Loading services...</div>
      </div>
    );
  }

  return (
    <div className="page-content">
      <div className="page-header-modern">
        <div>
          <h1 className="page-title">Services Management</h1>
          <p className="page-subtitle">Manage your service offerings and pricing</p>
        </div>
        <Button variant="primary" icon={<Plus size={20} />} onClick={handleAddNew}>
          Add New Service
        </Button>
      </div>

      {error && (
        <div className="alert alert-error">{error}</div>
      )}

      <div className="services-grid-modern">
        {services.map((service) => (
          <ServiceCard
            key={service._id}
            service={service}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ))}
      </div>

      {services.length === 0 && !loading && (
        <div className="empty-state">
          <p>No services found</p>
          <Button variant="primary" icon={<Plus size={20} />} onClick={handleAddNew}>
            Add Your First Service
          </Button>
        </div>
      )}

      {showModal && (
        <ServiceModal
          service={selectedService}
          onSave={handleSave}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};

export default ServicesList;