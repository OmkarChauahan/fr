import React from 'react';
import { teamMembers, coreValues } from '../data/servicesData';

const AboutPage = () => {
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">About WorkHub Solutions</h1>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">
            Empowering businesses with innovative technology solutions since 2014
          </p>
        </div>
      </section>

      {/* Company Overview */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6 text-gray-800">Who We Are</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                WorkHub Solutions is a leading IT solutions provider dedicated to helping businesses thrive in the digital age. With over a decade of experience, we've successfully delivered 500+ projects across various industries.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Our team of passionate technologists, designers, and strategists work together to create innovative solutions that drive real business impact. We combine technical expertise with deep industry knowledge to deliver exceptional results.
              </p>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-8 rounded-2xl">
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-blue-600 rounded-lg flex items-center justify-center text-2xl">💼</div>
                  <div>
                    <div className="font-bold text-2xl text-gray-800">500+</div>
                    <div className="text-gray-600">Projects Completed</div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-purple-600 rounded-lg flex items-center justify-center text-2xl">⭐</div>
                  <div>
                    <div className="font-bold text-2xl text-gray-800">98%</div>
                    <div className="text-gray-600">Client Satisfaction</div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-green-600 rounded-lg flex items-center justify-center text-2xl">🚀</div>
                  <div>
                    <div className="font-bold text-2xl text-gray-800">10+</div>
                    <div className="text-gray-600">Years Experience</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-gradient-to-br from-blue-500 to-blue-700 text-white p-10 rounded-2xl shadow-xl">
              <div className="text-5xl mb-4">🎯</div>
              <h3 className="text-3xl font-bold mb-4">Our Mission</h3>
              <p className="text-lg leading-relaxed text-blue-50">
                To empower businesses with innovative technology solutions that drive growth, efficiency, and competitive advantage in the digital marketplace.
              </p>
            </div>
            <div className="bg-gradient-to-br from-purple-500 to-purple-700 text-white p-10 rounded-2xl shadow-xl">
              <div className="text-5xl mb-4">🚀</div>
              <h3 className="text-3xl font-bold mb-4">Our Vision</h3>
              <p className="text-lg leading-relaxed text-purple-50">
                To be the most trusted IT solutions partner, recognized for excellence, innovation, and transformative impact on businesses worldwide.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-800">
            Our Core Values
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {coreValues.map((value, idx) => (
              <div key={idx} className="text-center p-6 bg-gray-50 rounded-xl hover:shadow-lg transition">
                <div className="text-5xl mb-4">{value.icon}</div>
                <h3 className="text-xl font-bold mb-3 text-gray-800">{value.title}</h3>
                <p className="text-gray-600">{value.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-800">
            Meet Our Team
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, idx) => (
              <div key={idx} className="bg-white rounded-xl shadow-lg p-6 text-center hover:shadow-2xl transition transform hover:-translate-y-2">
                <div className="text-6xl mb-4">{member.image}</div>
                <h3 className="text-xl font-bold mb-2 text-gray-800">{member.name}</h3>
                <p className="text-blue-600 font-semibold">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;