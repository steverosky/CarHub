import React, { useState, useEffect } from 'react';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { Booking } from '../../types';
import { FaCheck, FaTimes } from 'react-icons/fa';
import { toast } from 'react-toastify';
import LoadingSpinner from '../../components/LoadingSpinner';

const ManageBookingsPage: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'cancelled'>('all');

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const bookingsRef = collection(db, 'bookings');
      const snapshot = await getDocs(bookingsRef);
      const fetchedBookings = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Booking[];

      // Filter bookings based on selected status
      const filteredBookings = statusFilter === 'all' 
        ? fetchedBookings 
        : fetchedBookings.filter(booking => booking.status === statusFilter);

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

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="text-red-500 text-center p-4">{error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Manage Bookings</h1>
      
      <div className="mb-6">
        <label htmlFor="statusFilter" className="mr-2">Filter by status:</label>
        <select
          id="statusFilter"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}
          className="border rounded p-2"
        >
          <option value="all">All</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2">Booking ID</th>
              <th className="px-4 py-2">Customer</th>
              <th className="px-4 py-2">Vehicle</th>
              <th className="px-4 py-2">Dates</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">Total Amount</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking) => (
              <tr key={booking.id} className="border-b hover:bg-gray-50">
                <td className="px-4 py-2">{booking.id.slice(0, 8)}</td>
                <td className="px-4 py-2">
                  <div>{booking.customerName}</div>
                  <div className="text-sm text-gray-500">{booking.customerEmail}</div>
                </td>
                <td className="px-4 py-2">
                  {booking.vehicleYear} {booking.vehicleMake} {booking.vehicleModel}
                </td>
                <td className="px-4 py-2">
                  <div>From: {new Date(booking.startDate).toLocaleDateString()}</div>
                  <div>To: {new Date(booking.endDate).toLocaleDateString()}</div>
                </td>
                <td className="px-4 py-2">
                  <span className={`px-2 py-1 rounded text-sm ${
                    booking.status === 'approved' ? 'bg-green-100 text-green-800' :
                    booking.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                  </span>
                </td>
                <td className="px-4 py-2">${booking.totalAmount.toFixed(2)}</td>
                <td className="px-4 py-2">
                  {booking.status === 'pending' && (
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleStatusChange(booking.id, 'approved')}
                        className="p-2 bg-green-500 text-white rounded hover:bg-green-600"
                        title="Approve"
                      >
                        <FaCheck />
                      </button>
                      <button
                        onClick={() => handleStatusChange(booking.id, 'cancelled')}
                        className="p-2 bg-red-500 text-white rounded hover:bg-red-600"
                        title="Cancel"
                      >
                        <FaTimes />
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
  );
};

export default ManageBookingsPage; 