import React from 'react';
import Button from '../components/Button';
import ServiceCard from '../components/ServiceCard';
import { servicesData } from '../data/servicesData';

const HomePage = ({ setCurrentPage, setSelectedService }) => {
  const whyChooseUsItems = [
    { icon: '👨‍💼', title: 'Experienced Professionals', desc: '10+ years of industry expertise' },
    { icon: '🎨', title: 'Custom Solutions', desc: 'Tailored to your unique needs' },
    { icon: '📈', title: 'Scalable Architecture', desc: 'Grow without limitations' },
    { icon: '💬', title: 'Transparent Communication', desc: 'Regular updates and clear reporting' },
    { icon: '🛠️', title: 'Dedicated Support', desc: '24/7 technical assistance' },
    { icon: '⚡', title: 'Fast Delivery', desc: 'On-time project completion' }
  ];

  const handleLearnMore = (service) => {
    setSelectedService(service);
    setCurrentPage('service-detail');
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-900 via-blue-700 to-blue-500 text-white py-32 overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-block mb-6 px-6 py-2 bg-white bg-opacity-20 rounded-full backdrop-blur-sm">
            <span className="text-sm font-semibold tracking-wide uppercase">🚀 Your Digital Partner</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold mb-8 leading-tight">
            <span className="block">Driving Digital Growth</span>
            <span className="block bg-clip-text text-transparent bg-gradient-to-r from-blue-200 to-white">
              with Intelligent IT Solutions
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl mb-12 text-blue-50 max-w-3xl mx-auto leading-relaxed">
            Transform your business with cutting-edge technology and expert guidance. 
            We deliver solutions that drive results.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <button 
              onClick={() => setCurrentPage('contact')}
              className="group px-8 py-4 bg-white text-blue-700 rounded-full font-bold text-lg shadow-2xl transition-all duration-300 transform hover:scale-110"
            >
              <span className="flex items-center gap-2">
                Get Started
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </span>
            </button>
            <button 
              onClick={() => setCurrentPage('contact')}
              className="px-8 py-4 border-2 border-white text-white rounded-full font-bold text-lg hover:bg-white hover:text-blue-700 transition-all duration-300"
            >
              Talk to an Expert
            </button>
          </div>
          
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">500+</div>
              <div className="text-blue-200 text-sm">Projects Delivered</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">10+</div>
              <div className="text-blue-200 text-sm">Years Experience</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">98%</div>
              <div className="text-blue-200 text-sm">Client Satisfaction</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">24/7</div>
              <div className="text-blue-200 text-sm">Support Available</div>
            </div>
          </div>
        </div>
        
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" className="w-full h-auto">
            <path fill="#f9fafb" d="M0,64L80,69.3C160,75,320,85,480,80C640,75,800,53,960,48C1120,43,1280,53,1360,58.7L1440,64L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z"></path>
          </svg>
        </div>
      </section>

      {/* Services Overview */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-800">
            Our Services
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {servicesData.map(service => (
              <ServiceCard key={service.id} service={service} onLearnMore={handleLearnMore} />
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-800">
            Why Choose Us
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {whyChooseUsItems.map((item, idx) => (
              <div key={idx} className="flex items-start space-x-4 p-6 bg-gray-50 rounded-lg shadow hover:shadow-lg transition">
                <div className="text-4xl">{item.icon}</div>
                <div>
                  <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                  <p className="text-gray-600">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Let's Build Something Powerful Together
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            Ready to transform your business? Let's discuss your project
          </p>
          <Button variant="secondary" onClick={() => setCurrentPage('contact')}>
            Request a Free Consultation
          </Button>
        </div>
      </section>
    </div>
  );
};

export default HomePage;