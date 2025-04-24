import React from 'react';
import { Link } from 'react-router-dom';
import { FiFacebook, FiTwitter, FiInstagram, FiLinkedin, FiMail, FiPhone, FiMapPin } from 'react-icons/fi';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-secondary-800 text-white">
      <div className="max-w-7xl mx-auto py-12 px-4 overflow-hidden sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h2 className="text-2xl font-bold text-white mb-4">CarHub</h2>
            <p className="text-secondary-300 text-balance">
              Experience premium car rentals with CarHub. We offer a diverse range of vehicles for your every need.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-secondary-300 hover:text-primary-400 transition-colors duration-200">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/cars" className="text-secondary-300 hover:text-primary-400 transition-colors duration-200">
                  Cars
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-secondary-300 hover:text-primary-400 transition-colors duration-200">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-secondary-300 hover:text-primary-400 transition-colors duration-200">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Support</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/faq" className="text-secondary-300 hover:text-primary-400 transition-colors duration-200">
                  FAQs
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-secondary-300 hover:text-primary-400 transition-colors duration-200">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-secondary-300 hover:text-primary-400 transition-colors duration-200">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <address className="not-italic text-secondary-300 space-y-2">
              <p>123 Rental Street</p>
              <p>Car City, CC 10001</p>
              <p>Email: info@carhub.com</p>
              <p>Phone: (123) 456-7890</p>
            </address>
            
            <div className="mt-4 flex space-x-4">
              <a 
                href="https://www.facebook.com/carhub" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-secondary-300 hover:text-primary-400 transition-colors duration-200"
                aria-label="Visit our Facebook page"
              >
                <FiFacebook className="h-6 w-6" />
              </a>
              <a 
                href="https://www.twitter.com/carhub" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-secondary-300 hover:text-primary-400 transition-colors duration-200"
                aria-label="Visit our Twitter page"
              >
                <FiTwitter className="h-6 w-6" />
              </a>
              <a 
                href="https://www.instagram.com/carhub" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-secondary-300 hover:text-primary-400 transition-colors duration-200"
                aria-label="Visit our Instagram page"
              >
                <FiInstagram className="h-6 w-6" />
              </a>
              <a 
                href="https://linkedin.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-secondary-300 hover:text-primary-400 transition-colors duration-200"
              >
                <FiLinkedin className="h-6 w-6" />
              </a>
            </div>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-secondary-700 text-secondary-300 text-center">
          <p>&copy; {currentYear} CarHub. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 