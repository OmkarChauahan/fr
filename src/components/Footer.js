import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-12 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">WorkHub Solutions</h3>
            <p className="text-gray-400">Driving Digital Growth with Intelligent IT Solutions</p>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <div className="space-y-2 text-gray-400">
              <p>Home</p>
              <p>About</p>
              <p>Services</p>
              <p>Contact</p>
            </div>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact Info</h4>
            <p className="text-gray-400">📧 info@workhub.com</p>
            <p className="text-gray-400">📞 +91 1234567890</p>
            <p className="text-gray-400">📍 Mumbai, India</p>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2024 WorkHub Solutions. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;