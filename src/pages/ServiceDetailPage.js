import React from 'react';
import Button from '../components/Button';

const ServiceDetailPage = ({ service, setCurrentPage }) => {
  if (!service) {
    return (
      <div className="py-16 text-center">
        <h1 className="text-3xl font-bold mb-4">Service Not Found</h1>
        <Button onClick={() => setCurrentPage('services')}>Back to Services</Button>
      </div>
    );
  }

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <button 
            onClick={() => setCurrentPage('services')}
            className="mb-6 text-blue-100 hover:text-white transition flex items-center gap-2"
          >
            ← Back to Services
          </button>
          <div className="text-6xl mb-6">{service.icon}</div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">{service.title}</h1>
          <p className="text-xl text-blue-100">{service.fullDesc}</p>
        </div>
      </section>

      {/* Key Features */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-8 text-gray-800">Key Features</h2>
          <div className="space-y-4">
            {service.features.map((feature, idx) => (
              <div key={idx} className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                  ✓
                </div>
                <p className="text-gray-700 text-lg">{feature}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-white p-10 rounded-2xl shadow-xl">
            <h3 className="text-2xl font-bold mb-4 text-gray-800">Ready to Get Started?</h3>
            <p className="text-gray-600 mb-6 text-lg">
              Let's discuss how we can help your business succeed with {service.title.toLowerCase()}.
            </p>
            <Button onClick={() => setCurrentPage('contact')}>
              Contact Us Today
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ServiceDetailPage;