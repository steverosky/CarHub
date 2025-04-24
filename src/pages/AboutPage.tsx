import React from 'react';
import { FiCheckCircle, FiUsers, FiThumbsUp, FiAward } from 'react-icons/fi';

const AboutPage: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
      {/* About Us */}
      <div className="mb-16">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">About CarHub</h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Experience the freedom of travel with our premium car rental service.
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-8">
          <p className="text-gray-600 mb-6">
            Founded in 2023, CarHub is a leading car rental service dedicated to providing exceptional vehicles and customer service to travelers and locals alike. Our mission is to make car rentals simple, affordable, and enjoyable.
          </p>
          
          <p className="text-gray-600 mb-6">
            With a diverse fleet of well-maintained vehicles ranging from economic options to luxury models, we have the perfect car for every occasion. Whether you're planning a family vacation, a business trip, or just need a temporary replacement vehicle, CarHub has you covered.
          </p>
          
          <p className="text-gray-600">
            We take pride in our transparent pricing, flexible rental options, and hassle-free booking process. Our dedicated team is committed to ensuring your satisfaction and making your journey memorable for all the right reasons.
          </p>
        </div>
      </div>
      
      {/* Why Choose Us */}
      <div className="mb-16">
        <div className="text-center mb-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Why Choose CarHub?</h2>
          <p className="text-gray-600 max-w-3xl mx-auto">
            We differentiate ourselves through exceptional service and attention to detail.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="flex justify-center mb-4">
              <FiCheckCircle className="h-12 w-12 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Quality Vehicles</h3>
            <p className="text-gray-600">
              Our well-maintained fleet ensures reliability and comfort throughout your journey.
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="flex justify-center mb-4">
              <FiUsers className="h-12 w-12 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Customer Service</h3>
            <p className="text-gray-600">
              Our friendly team is available to assist you throughout your rental experience.
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="flex justify-center mb-4">
              <FiThumbsUp className="h-12 w-12 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Easy Booking</h3>
            <p className="text-gray-600">
              Our streamlined online platform makes reserving your perfect car quick and simple.
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="flex justify-center mb-4">
              <FiAward className="h-12 w-12 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Competitive Pricing</h3>
            <p className="text-gray-600">
              Enjoy the best value with our transparent pricing and no hidden fees.
            </p>
          </div>
        </div>
      </div>
      
      {/* Our Team */}
      <div>
        <div className="text-center mb-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Our Team</h2>
          <p className="text-gray-600 max-w-3xl mx-auto">
            Meet the dedicated professionals behind CarHub.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <img 
              src="https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
              alt="CEO" 
              className="w-full h-64 object-cover"
            />
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-1">John Davis</h3>
              <p className="text-blue-600 font-medium mb-3">Chief Executive Officer</p>
              <p className="text-gray-600">
                John brings 15 years of experience in the transportation industry and a passion for customer satisfaction.
              </p>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <img 
              src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
              alt="Operations Manager" 
              className="w-full h-64 object-cover"
            />
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-1">Sarah Johnson</h3>
              <p className="text-blue-600 font-medium mb-3">Operations Manager</p>
              <p className="text-gray-600">
                Sarah oversees our daily operations, ensuring every rental goes smoothly from start to finish.
              </p>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <img 
              src="https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
              alt="Customer Service Lead" 
              className="w-full h-64 object-cover"
            />
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-1">Michael Robinson</h3>
              <p className="text-blue-600 font-medium mb-3">Customer Service Lead</p>
              <p className="text-gray-600">
                Michael leads our customer service team with a commitment to exceeding expectations at every opportunity.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage; 