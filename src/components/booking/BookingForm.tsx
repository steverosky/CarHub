import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Vehicle } from '../../types';
import { FiCalendar, FiMap, FiDollarSign, FiClock } from 'react-icons/fi';
import { useAuth } from '../../contexts/AuthContext';
import { collection, addDoc, serverTimestamp, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase/config';

interface BookingFormProps {
  vehicle: Vehicle;
}

const BookingForm: React.FC<BookingFormProps> = ({ vehicle }) => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [pickupLocation, setPickupLocation] = useState(vehicle.location);
  const [dropoffLocation, setDropoffLocation] = useState(vehicle.location);
  const [totalPrice, setTotalPrice] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Set minimum start date to today
  const today = new Date().toISOString().split('T')[0];
  
  // Calculate total price based on dates
  useEffect(() => {
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const daysDiff = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
      
      if (daysDiff > 0) {
        setTotalPrice(daysDiff * vehicle.ratePerDay);
      } else {
        setTotalPrice(0);
      }
    }
  }, [startDate, endDate, vehicle.ratePerDay]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentUser) {
      navigate('/login', { state: { from: `/cars/${vehicle.id}` } });
      return;
    }
    
    if (!startDate || !endDate || !pickupLocation || !dropoffLocation) {
      setError('Please fill in all fields');
      return;
    }
    
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (start >= end) {
      setError('End date must be after start date');
      return;
    }
    
    try {
      setLoading(true);
      setError('');
      
      // Create booking document
      const bookingRef = await addDoc(collection(db, 'bookings'), {
        userId: currentUser.id,
        vehicleId: vehicle.id,
        startDate,
        endDate,
        pickupLocation,
        dropoffLocation,
        totalPrice,
        status: 'booked',
        createdAt: serverTimestamp()
      });
      
      // Update vehicle status
      await updateDoc(doc(db, 'vehicles', vehicle.id), {
        availabilityStatus: 'rented'
      });
      
      navigate(`/bookings/${bookingRef.id}/confirm`);
    } catch (err) {
      console.error('Error creating booking:', err);
      setError('An error occurred while creating your booking. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Book This Car</h2>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div>
            <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
              <FiCalendar className="inline mr-2" />
              Pick-up Date
            </label>
            <input
              type="date"
              id="startDate"
              min={today}
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          
          <div>
            <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">
              <FiCalendar className="inline mr-2" />
              Drop-off Date
            </label>
            <input
              type="date"
              id="endDate"
              min={startDate || today}
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          
          <div>
            <label htmlFor="pickupLocation" className="block text-sm font-medium text-gray-700 mb-1">
              <FiMap className="inline mr-2" />
              Pick-up Location
            </label>
            <input
              type="text"
              id="pickupLocation"
              value={pickupLocation}
              onChange={(e) => setPickupLocation(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          
          <div>
            <label htmlFor="dropoffLocation" className="block text-sm font-medium text-gray-700 mb-1">
              <FiMap className="inline mr-2" />
              Drop-off Location
            </label>
            <input
              type="text"
              id="dropoffLocation"
              value={dropoffLocation}
              onChange={(e) => setDropoffLocation(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          
          {totalPrice > 0 && (
            <div className="bg-gray-50 p-4 rounded-md">
              <div className="flex justify-between items-center">
                <span className="font-medium text-gray-700">
                  <FiDollarSign className="inline mr-1" />
                  Daily Rate:
                </span>
                <span>${vehicle.ratePerDay}/day</span>
              </div>
              
              <div className="flex justify-between items-center mt-2">
                <span className="font-medium text-gray-700">
                  <FiClock className="inline mr-1" />
                  Rental Duration:
                </span>
                <span>
                  {Math.ceil(
                    (new Date(endDate).getTime() - new Date(startDate).getTime()) / 
                    (1000 * 60 * 60 * 24)
                  )}{' '}
                  days
                </span>
              </div>
              
              <div className="flex justify-between items-center mt-2 text-lg font-bold">
                <span>Total Price:</span>
                <span className="text-blue-600">${totalPrice}</span>
              </div>
            </div>
          )}
          
          <button
            type="submit"
            disabled={loading || totalPrice === 0}
            className={`w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
              loading || totalPrice === 0 ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {loading ? 'Processing...' : 'Reserve Now'}
          </button>
          
          {!currentUser && (
            <p className="text-sm text-gray-500 text-center mt-2">
              You'll need to login to complete your booking
            </p>
          )}
        </div>
      </form>
    </div>
  );
};

export default BookingForm; 