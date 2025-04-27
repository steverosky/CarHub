import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import { Booking, Vehicle } from '../types';
import { FiCheck, FiCalendar, FiClock, FiMap, FiDollarSign, FiPrinter } from 'react-icons/fi';

const BookingConfirmPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBookingDetails = async () => {
      try {
        if (!id) {
          throw new Error('Booking ID is missing');
        }

        // Fetch booking details
        const bookingDoc = await getDoc(doc(db, 'bookings', id));
        
        if (!bookingDoc.exists()) {
          throw new Error('Booking not found');
        }
        
        const bookingData = { id: bookingDoc.id, ...bookingDoc.data() } as Booking;
        setBooking(bookingData);
        
        // Fetch vehicle details
        const vehicleDoc = await getDoc(doc(db, 'vehicles', bookingData.vehicleId));
        
        if (vehicleDoc.exists()) {
          setVehicle({ id: vehicleDoc.id, ...vehicleDoc.data() } as Vehicle);
        }
      } catch (error) {
        console.error('Error fetching booking details:', error);
        setError('Failed to load booking details');
      } finally {
        setLoading(false);
      }
    };

    fetchBookingDetails();
  }, [id]);

  // Format date to readable string
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Calculate rental duration in days
  const calculateDuration = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    return Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  };

  // Handle print
  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-300 rounded w-1/2 mb-8"></div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="h-6 bg-gray-300 rounded w-1/3 mb-6"></div>
            <div className="h-4 bg-gray-300 rounded mb-4"></div>
            <div className="h-4 bg-gray-300 rounded mb-4"></div>
            <div className="h-4 bg-gray-300 rounded w-3/4 mb-4"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !booking || !vehicle) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
          <p className="text-gray-700 mb-6">{error || 'Booking information not found'}</p>
          <Link
            to="/bookings"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Go to My Bookings
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 sm:px-6 lg:px-8 print:py-2 print:px-0">
      <div className="bg-white rounded-lg shadow-md p-8 print:shadow-none">
        <div className="text-center mb-6 print:mb-4">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-100 text-green-600 mb-4 print:hidden">
            <FiCheck className="h-6 w-6" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800">Booking Confirmed!</h1>
          <p className="text-gray-600 mt-1">
            Your booking has been successfully confirmed. Details are provided below.
          </p>
        </div>

        <div className="border-t border-b border-gray-200 py-4 mb-6 print:mb-4">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Booking Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start">
              <FiCalendar className="mt-1 mr-3 text-gray-500" />
              <div>
                <p className="text-sm font-medium text-gray-700">Booking ID</p>
                <p className="text-gray-900">{booking.id}</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <FiClock className="mt-1 mr-3 text-gray-500" />
              <div>
                <p className="text-sm font-medium text-gray-700">Booking Date</p>
                <p className="text-gray-900">
                  {new Date(booking.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-6 print:mb-4">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Vehicle Details</h2>
          
          <div className="flex flex-col md:flex-row gap-6">
            <div className="w-full md:w-1/3 h-48 rounded-lg overflow-hidden">
              <img
                src={vehicle.images?.[0]}
                alt={`${vehicle.make} ${vehicle.model}`}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800">
                {vehicle.make} {vehicle.model} ({vehicle.year})
              </h3>
              <p className="text-gray-600 text-sm">
                {vehicle.type} • {vehicle.transmission} • {vehicle.seats || 5} seats
              </p>
            </div>
          </div>
        </div>

        <div className="mb-6 print:mb-4">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Rental Details</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start">
              <FiCalendar className="mt-1 mr-3 text-gray-500" />
              <div>
                <p className="text-sm font-medium text-gray-700">Pick-up Date</p>
                <p className="text-gray-900">{formatDate(booking.startDate)}</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <FiCalendar className="mt-1 mr-3 text-gray-500" />
              <div>
                <p className="text-sm font-medium text-gray-700">Return Date</p>
                <p className="text-gray-900">{formatDate(booking.endDate)}</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <FiMap className="mt-1 mr-3 text-gray-500" />
              <div>
                <p className="text-sm font-medium text-gray-700">Pick-up Location</p>
                <p className="text-gray-900">{booking.pickupLocation}</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <FiMap className="mt-1 mr-3 text-gray-500" />
              <div>
                <p className="text-sm font-medium text-gray-700">Return Location</p>
                <p className="text-gray-900">{booking.dropoffLocation}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-md mb-6 print:bg-white print:mb-4">
          <h2 className="text-lg font-semibold text-gray-800 mb-2">Payment Summary</h2>
          
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">
                Daily Rate
              </span>
              <span className="text-gray-900">${vehicle.ratePerDay}/day</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-600">
                Rental Duration
              </span>
              <span className="text-gray-900">
                {calculateDuration(booking.startDate, booking.endDate)} days
              </span>
            </div>
            
            <div className="border-t border-gray-200 my-2 pt-2 flex justify-between font-semibold">
              <span className="text-gray-800">
                <FiDollarSign className="inline mr-1" />
                Total Amount
              </span>
              <span className="text-blue-600">${booking.totalPrice}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:justify-between gap-4 print:hidden">
          <Link
            to="/bookings"
            className="inline-flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            View All Bookings
          </Link>
          
          <button
            onClick={handlePrint}
            className="inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <FiPrinter className="mr-2" />
            Print Confirmation
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingConfirmPage; 