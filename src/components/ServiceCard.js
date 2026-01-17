import React from 'react';

const ServiceCard = ({ service, onLearnMore }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
      <div className="text-5xl mb-4">{service.icon}</div>
      <h3 className="text-xl font-bold mb-3 text-gray-800">{service.title}</h3>
      <p className="text-gray-600 mb-4">{service.shortDesc}</p>
      {onLearnMore && (
        <button 
          onClick={() => onLearnMore(service)}
          className="text-blue-600 font-semibold hover:text-blue-700 transition"
        >
          Learn More →
        </button>
      )}
    </div>
  );
};

export default ServiceCard;