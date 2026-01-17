import React from 'react';
import Button from '../components/Button';
import ServiceCard from '../components/ServiceCard';
import { servicesData } from '../data/servicesData';

const ServicesPage = ({ setCurrentPage, setSelectedService }) => {
  const handleLearnMore = (service) => {
    setSelectedService(service);
    setCurrentPage('service-detail');
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-purple-600 to-blue-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">Our Services</h1>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">
            Comprehensive IT solutions designed to accelerate your business growth
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {servicesData.map(service => (
              <ServiceCard key={service.id} service={service} onLearnMore={handleLearnMore} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-800">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Let's discuss how our services can help transform your business
          </p>
          <Button onClick={() => setCurrentPage('contact')}>
            Contact Us Today
          </Button>
        </div>
      </section>
    </div>
  );
};

export default ServicesPage;