import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import { Vehicle } from '../types';
import BookingForm from '../components/booking/BookingForm';
import { FiArrowLeft, FiCalendar, FiUsers, FiMap, FiDroplet, FiSettings } from 'react-icons/fi';

const CarDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [car, setCar] = useState<Vehicle | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  useEffect(() => {
    const fetchCarDetails = async () => {
      try {
        if (!id) {
          throw new Error('Car ID is missing');
        }

        const carDoc = await getDoc(doc(db, 'vehicles', id));
        
        if (carDoc.exists()) {
          setCar({ id: carDoc.id, ...carDoc.data() } as Vehicle);
        } else {
          setError('Car not found');
        }
      } catch (error) {
        console.error('Error fetching car details:', error);
        setError('Failed to load car details');
      } finally {
        setLoading(false);
      }
    };

    fetchCarDetails();
  }, [id]);

  const handleGoBack = () => {
    navigate(-1);
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-300 rounded w-1/3 mb-6"></div>
          <div className="h-96 bg-gray-300 rounded-lg mb-6"></div>
          <div className="flex flex-col md:flex-row gap-8">
            <div className="md:w-2/3">
              <div className="h-8 bg-gray-300 rounded w-1/2 mb-4"></div>
              <div className="h-4 bg-gray-300 rounded mb-2"></div>
              <div className="h-4 bg-gray-300 rounded mb-2"></div>
              <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
            </div>
            <div className="md:w-1/3">
              <div className="h-64 bg-gray-300 rounded-lg"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !car) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="text-center py-12 bg-white rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
          <p className="text-gray-700 mb-6">{error || 'Car not found'}</p>
          <button
            onClick={handleGoBack}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <FiArrowLeft className="mr-2" />
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      {/* Back button */}
      <button
        onClick={handleGoBack}
        className="flex items-center text-blue-600 hover:text-blue-800 mb-6"
      >
        <FiArrowLeft className="mr-2" />
        Back to cars
      </button>

      {/* Car Details */}
      <div className="flex flex-col md:flex-row gap-8">
        {/* Left Column - Car Images and Info */}
        <div className="md:w-2/3">
          {/* Main Image */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden mb-4">
            <img
              src={car.images[activeImageIndex]}
              alt={`${car.make} ${car.model}`}
              className="w-full h-96 object-cover"
            />
          </div>

          {/* Thumbnail Images */}
          {car.images.length > 1 && (
            <div className="flex space-x-2 mb-6 overflow-x-auto pb-2">
              {car.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setActiveImageIndex(index)}
                  className={`flex-shrink-0 w-24 h-16 rounded-md overflow-hidden border-2 ${
                    activeImageIndex === index ? 'border-blue-500' : 'border-transparent'
                  }`}
                >
                  <img
                    src={image}
                    alt={`${car.make} ${car.model} thumbnail ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}

          {/* Car Information */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-start mb-4">
              <h1 className="text-2xl font-bold text-gray-800">
                {car.make} {car.model} ({car.year})
              </h1>
              <div className="px-4 py-1 rounded-full bg-blue-100 text-blue-800 text-sm font-medium">
                ${car.ratePerDay}/day
              </div>
            </div>

            {/* Car Specifications */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
              <div className="flex items-center">
                <FiCalendar className="text-gray-500 mr-2" />
                <span>{car.year}</span>
              </div>
              <div className="flex items-center">
                <FiUsers className="text-gray-500 mr-2" />
                <span>{car.seats || 5} seats</span>
              </div>
              <div className="flex items-center">
                <FiSettings className="text-gray-500 mr-2" />
                <span className="capitalize">{car.transmission || 'automatic'}</span>
              </div>
              <div className="flex items-center">
                <FiDroplet className="text-gray-500 mr-2" />
                <span>{car.fuelType || 'Gasoline'}</span>
              </div>
              <div className="flex items-center">
                <FiMap className="text-gray-500 mr-2" />
                <span>{car.location}</span>
              </div>
              <div className="flex items-center">
                <svg
                  className="h-5 w-5 text-gray-500 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span className="capitalize">{car.type}</span>
              </div>
            </div>

            {/* Car Description */}
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-2">Description</h2>
              <p className="text-gray-600">
                {car.description ||
                  `Experience the thrill of driving the ${car.year} ${car.make} ${car.model}. This ${car.type} offers a perfect blend of style, comfort, and performance for your journey.`}
              </p>
            </div>

            {/* Features */}
            {car.features && car.features.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold text-gray-800 mb-2">Features</h2>
                <ul className="grid grid-cols-2 gap-2">
                  {car.features.map((feature, index) => (
                    <li key={index} className="flex items-center">
                      <svg
                        className="h-5 w-5 text-blue-500 mr-2"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Right Column - Booking Form */}
        <div className="md:w-1/3 mt-6 md:mt-0">
          {car.availabilityStatus === 'available' ? (
            <BookingForm vehicle={car} />
          ) : (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Not Available</h2>
              <div className="p-4 bg-yellow-50 text-yellow-800 rounded-md mb-4">
                <p>
                  This vehicle is currently not available for booking.
                  {car.availabilityStatus === 'maintenance' && ' It is under maintenance.'}
                  {car.availabilityStatus === 'rented' && ' It is currently rented.'}
                </p>
              </div>
              <button
                onClick={() => navigate('/cars')}
                className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Browse Other Cars
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CarDetailsPage; 