import React from 'react';
import { Link } from 'react-router-dom';
import { Vehicle } from '../../types';
import { FiCalendar, FiMap, FiUsers, FiSettings } from 'react-icons/fi';

interface CarCardProps {
  vehicle: Vehicle;
}

const CarCard: React.FC<CarCardProps> = ({ vehicle }) => {
  const { id, make, model, year, type, ratePerDay, images, availabilityStatus, seats, fuelType, transmission } = vehicle;

  // Color based on availability status
  const statusColor = 
    availabilityStatus === 'available' 
      ? 'bg-green-100 text-green-800' 
      : availabilityStatus === 'maintenance'
        ? 'bg-yellow-100 text-yellow-800'
        : 'bg-red-100 text-red-800';

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative">
        <img 
          src={images[0]} 
          alt={`${make} ${model}`} 
          className="w-full h-48 object-cover"
        />
        <span className={`absolute top-2 right-2 text-xs font-semibold px-2 py-1 rounded-full ${statusColor}`}>
          {availabilityStatus.charAt(0).toUpperCase() + availabilityStatus.slice(1)}
        </span>
      </div>
      
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800">
          {make} {model}
        </h3>
        
        <div className="mt-2 flex items-center text-sm text-gray-500">
          <FiCalendar className="mr-1" />
          <span>{year}</span>
          <span className="mx-2">•</span>
          <span className="capitalize">{type}</span>
        </div>
        
        <div className="mt-3 grid grid-cols-2 gap-2">
          {seats && (
            <div className="flex items-center text-sm text-gray-500">
              <FiUsers className="mr-1" />
              <span>{seats} seats</span>
            </div>
          )}
          
          {transmission && (
            <div className="flex items-center text-sm text-gray-500">
              <FiSettings className="mr-1" />
              <span className="capitalize">{transmission}</span>
            </div>
          )}
          
          {fuelType && (
            <div className="flex items-center text-sm text-gray-500">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span>{fuelType}</span>
            </div>
          )}
          
          <div className="flex items-center text-sm text-gray-500">
            <FiMap className="mr-1" />
            <span>{vehicle.location}</span>
          </div>
        </div>
        
        <div className="mt-4 flex items-center justify-between">
          <div>
            <span className="text-lg font-bold text-blue-600">${ratePerDay}</span>
            <span className="text-gray-500 text-sm"> / day</span>
          </div>
          
          <Link 
            to={`/cars/${id}`}
            className={`inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
              availabilityStatus !== 'available' ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            onClick={(e) => availabilityStatus !== 'available' && e.preventDefault()}
          >
            {availabilityStatus === 'available' ? 'Book Now' : 'Not Available'}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CarCard; 