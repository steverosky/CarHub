import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Booking, Vehicle } from '../../types';
import { FiCalendar, FiMap, FiTag, FiDollarSign, FiClock } from 'react-icons/fi';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase/config';

interface BookingCardProps {
  booking: Booking;
  onCancel?: (bookingId: string) => void;
}

const BookingCard: React.FC<BookingCardProps> = ({ booking, onCancel }) => {
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [loading, setLoading] = useState(true);

  // Format date to readable string
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Get vehicle data
  useEffect(() => {
    const fetchVehicle = async () => {
      try {
        const vehicleDoc = await getDoc(doc(db, 'vehicles', booking.vehicleId));
        if (vehicleDoc.exists()) {
          setVehicle(vehicleDoc.data() as Vehicle);
        }
      } catch (error) {
        console.error('Error fetching vehicle:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchVehicle();
  }, [booking.vehicleId]);

  const handleCancel = () => {
    if (onCancel) {
      onCancel(booking.id);
    }
  };

  // Status badge color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'booked':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-4 animate-pulse">
        <div className="h-24 bg-gray-200 rounded-md"></div>
      </div>
    );
  }

  if (!vehicle) {
    return (
      <div className="bg-white rounded-lg shadow-md p-4">
        <p className="text-red-500">Vehicle information not available</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-4 border-b">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">
            {vehicle.make} {vehicle.model}
          </h3>
          <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${getStatusColor(booking.status)}`}>
            {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
          </span>
        </div>
      </div>

      <div className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <div className="flex items-start mb-2">
              <FiCalendar className="mt-1 mr-2 text-gray-500" />
              <div>
                <p className="text-sm font-medium text-gray-700">Pickup Date</p>
                <p>{formatDate(booking.startDate)}</p>
              </div>
            </div>

            <div className="flex items-start mb-2">
              <FiCalendar className="mt-1 mr-2 text-gray-500" />
              <div>
                <p className="text-sm font-medium text-gray-700">Return Date</p>
                <p>{formatDate(booking.endDate)}</p>
              </div>
            </div>
          </div>

          <div>
            <div className="flex items-start mb-2">
              <FiMap className="mt-1 mr-2 text-gray-500" />
              <div>
                <p className="text-sm font-medium text-gray-700">Pickup Location</p>
                <p>{booking.pickupLocation}</p>
              </div>
            </div>

            <div className="flex items-start mb-2">
              <FiMap className="mt-1 mr-2 text-gray-500" />
              <div>
                <p className="text-sm font-medium text-gray-700">Return Location</p>
                <p>{booking.dropoffLocation}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t">
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center">
              <FiTag className="mr-2 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Daily Rate:</span>
            </div>
            <span>${vehicle.ratePerDay}/day</span>
          </div>

          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center">
              <FiClock className="mr-2 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Duration:</span>
            </div>
            <span>
              {Math.ceil(
                (new Date(booking.endDate).getTime() - new Date(booking.startDate).getTime()) /
                (1000 * 60 * 60 * 24)
              )}{' '}
              days
            </span>
          </div>

          <div className="flex justify-between items-center text-lg font-bold">
            <div className="flex items-center">
              <FiDollarSign className="mr-2 text-gray-500" />
              <span>Total:</span>
            </div>
            <span className="text-blue-600">${booking.totalPrice}</span>
          </div>
        </div>

        <div className="mt-4 flex justify-between">
          <Link
            to={`/cars/${vehicle.id}`}
            className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            View Car
          </Link>

          {booking.status === 'booked' && onCancel && (
            <button
              onClick={handleCancel}
              className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              Cancel Booking
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingCard; 