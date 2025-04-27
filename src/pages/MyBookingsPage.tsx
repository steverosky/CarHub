import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs, orderBy, doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import { useAuth } from '../contexts/AuthContext';
import { Booking } from '../types';
import BookingCard from '../components/booking/BookingCard';
import { FiAlertCircle } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const MyBookingsPage: React.FC = () => {
  const { currentUser } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cancelSuccess, setCancelSuccess] = useState('');

  // Fetch user's bookings
  useEffect(() => {
    const fetchBookings = async () => {
      if (!currentUser) {
        setLoading(false);
        return;
      }
      
      try {
        console.log('Current User:', currentUser); // Debug log
        
        // Simplified query without orderBy to avoid index requirement
        const bookingsQuery = query(
          collection(db, 'bookings'),
          where('userId', '==', currentUser.id)
        );
        
        const querySnapshot = await getDocs(bookingsQuery);
        console.log('Query Results:', querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))); // Debug log
        
        const bookingsList: Booking[] = [];
        
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          console.log('Booking Data:', data); // Debug log
          bookingsList.push({ 
            id: doc.id, 
            ...data,
            startDate: data.startDate,
            endDate: data.endDate,
            createdAt: data.createdAt?.toDate?.() || new Date(data.createdAt)
          } as Booking);
        });

        // Sort bookings by createdAt in memory
        bookingsList.sort((a, b) => {
          const dateA = new Date(a.createdAt);
          const dateB = new Date(b.createdAt);
          return dateB.getTime() - dateA.getTime(); // descending order
        });
        
        console.log('Processed Bookings:', bookingsList); // Debug log
        setBookings(bookingsList);
      } catch (error) {
        console.error('Error fetching bookings:', error);
        setError('Failed to load your bookings');
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [currentUser]);

  // Handle booking cancellation
  const handleCancelBooking = async (bookingId: string) => {
    try {
      // Find the booking to get the vehicle ID
      const bookingToCancel = bookings.find(booking => booking.id === bookingId);
      
      if (!bookingToCancel) {
        throw new Error('Booking not found');
      }
      
      // Update booking status
      await updateDoc(doc(db, 'bookings', bookingId), {
        status: 'cancelled'
      });
      
      // Update vehicle availability status
      await updateDoc(doc(db, 'vehicles', bookingToCancel.vehicleId), {
        availabilityStatus: 'available'
      });
      
      // Update local state
      setBookings(prevBookings =>
        prevBookings.map(booking =>
          booking.id === bookingId
            ? { ...booking, status: 'cancelled' }
            : booking
        )
      );
      
      setCancelSuccess('Booking cancelled successfully');
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setCancelSuccess('');
      }, 3000);
    } catch (error) {
      console.error('Error cancelling booking:', error);
      setError('Failed to cancel booking');
      
      // Clear error message after 3 seconds
      setTimeout(() => {
        setError('');
      }, 3000);
    }
  };

  // Filter bookings by status and date
  const activeBookings = bookings.filter(booking => {
    const endDate = new Date(booking.endDate);
    const now = new Date();
    const isWithinDuration = endDate > now;
    
    // Include if:
    // 1. Status is pending or approved, OR
    // 2. Booking end date is in the future (still active duration)
    return (
      booking.status === 'pending' || 
      booking.status === 'approved' ||
      (isWithinDuration && booking.status !== 'cancelled' && booking.status !== 'completed')
    );
  });
  
  const pastBookings = bookings.filter(booking => {
    const endDate = new Date(booking.endDate);
    const now = new Date();
    return endDate <= now || booking.status === 'cancelled' || booking.status === 'completed';
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">My Bookings</h1>
      
      {/* Success/Error Messages */}
      {cancelSuccess && (
        <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md flex items-center">
          <FiAlertCircle className="mr-2" />
          <span>{cancelSuccess}</span>
        </div>
      )}
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md flex items-center">
          <FiAlertCircle className="mr-2" />
          <span>{error}</span>
        </div>
      )}
      
      {loading ? (
        // Loading state
        <div className="space-y-4">
          {[...Array(3)].map((_, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md p-4 animate-pulse">
              <div className="h-8 bg-gray-300 rounded w-1/3 mb-4"></div>
              <div className="h-24 bg-gray-300 rounded-md"></div>
            </div>
          ))}
        </div>
      ) : bookings.length === 0 ? (
        // No bookings state
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <p className="text-gray-500 mb-4">You don't have any bookings yet.</p>
          <Link
            to="/cars"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            Browse Cars
          </Link>
        </div>
      ) : (
        // Bookings list
        <div className="space-y-8">
          {/* Active Bookings */}
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Active Bookings</h2>
            {activeBookings.length > 0 ? (
              <div className="space-y-4">
                {activeBookings.map(booking => (
                  <BookingCard 
                    key={booking.id} 
                    booking={booking} 
                    onCancel={handleCancelBooking}
                  />
                ))}
              </div>
            ) : (
              <p className="text-gray-500 bg-white rounded-lg shadow-md p-4">
                You don't have any active bookings.
              </p>
            )}
          </div>
          
          {/* Past Bookings */}
          {pastBookings.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Past Bookings</h2>
              <div className="space-y-4">
                {pastBookings.map(booking => (
                  <BookingCard 
                    key={booking.id} 
                    booking={booking}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MyBookingsPage; 