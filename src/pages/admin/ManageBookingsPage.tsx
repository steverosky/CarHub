import React, { useState, useEffect } from 'react';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { Booking } from '../../types';
import { FaCheck, FaTimes, FaMapMarkerAlt } from 'react-icons/fa';
import toast from 'react-hot-toast';
import LoadingSpinner from '../../components/LoadingSpinner';

const ManageBookingsPage: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'cancelled' | 'completed'>('all');

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const bookingsRef = collection(db, 'bookings');
      const snapshot = await getDocs(bookingsRef);
      const fetchedBookings = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Booking[];

      // Sort bookings by date (most recent first)
      const sortedBookings = fetchedBookings.sort((a, b) => 
        new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
      );

      // Filter bookings based on selected status
      const filteredBookings = statusFilter === 'all' 
        ? sortedBookings 
        : sortedBookings.filter(booking => booking.status === statusFilter);

      setBookings(filteredBookings);
      setError(null);
    } catch (err) {
      setError('Failed to fetch bookings. Please try again later.');
      console.error('Error fetching bookings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [statusFilter]);

  const handleStatusChange = async (bookingId: string, newStatus: 'approved' | 'cancelled') => {
    try {
      const bookingRef = doc(db, 'bookings', bookingId);
      await updateDoc(bookingRef, {
        status: newStatus,
        updatedAt: new Date().toISOString()
      });
      
      toast.success(`Booking ${newStatus} successfully`);
      fetchBookings(); // Refresh the bookings list
    } catch (err) {
      toast.error('Failed to update booking status');
      console.error('Error updating booking status:', err);
    }
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="text-red-500 text-center p-4">{error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Manage Bookings</h1>
        <div className="flex items-center space-x-4">
          <label htmlFor="statusFilter" className="text-gray-700">Filter by status:</label>
          <select
            id="statusFilter"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}
            className="border rounded-md py-2 px-3 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Booking ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vehicle</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dates</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Locations</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {bookings.map((booking) => (
                <tr key={booking.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {booking.id.slice(0, 8)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{booking.customerName}</div>
                    <div className="text-sm text-gray-500">{booking.customerEmail}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {booking.vehicleYear} {booking.vehicleMake} {booking.vehicleModel}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      From: {new Date(booking.startDate).toLocaleDateString()}
                    </div>
                    <div className="text-sm text-gray-500">
                      To: {new Date(booking.endDate).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-900 mb-1">
                      <FaMapMarkerAlt className="text-green-500 mr-2" />
                      <span>Pickup: {booking.pickupLocation}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <FaMapMarkerAlt className="text-red-500 mr-2" />
                      <span>Return: {booking.dropoffLocation}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(booking.status)}`}>
                      {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${booking.totalPrice ? booking.totalPrice.toFixed(2) : (booking.totalAmount || 0).toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    {booking.status === 'pending' && (
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleStatusChange(booking.id, 'approved')}
                          className="p-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors duration-200"
                          title="Approve"
                        >
                          <FaCheck className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleStatusChange(booking.id, 'cancelled')}
                          className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors duration-200"
                          title="Cancel"
                        >
                          <FaTimes className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ManageBookingsPage; 