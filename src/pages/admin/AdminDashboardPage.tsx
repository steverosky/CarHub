import React, { useState, useEffect } from 'react';
import { collection, query, getDocs, orderBy, limit } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { Booking, Vehicle } from '../../types';
import { FiUsers, FiTruck, FiCalendar, FiAlertCircle } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const AdminDashboardPage: React.FC = () => {
  const [recentBookings, setRecentBookings] = useState<Booking[]>([]);
  const [vehicleStats, setVehicleStats] = useState({
    total: 0,
    available: 0,
    rented: 0,
    maintenance: 0
  });
  const [userCount, setUserCount] = useState(0);
  const [totalBookings, setTotalBookings] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch recent bookings
        const bookingsQuery = query(
          collection(db, 'bookings'),
          orderBy('createdAt', 'desc'),
          limit(5)
        );
        
        const bookingsSnapshot = await getDocs(bookingsQuery);
        const bookingsList: Booking[] = [];
        
        bookingsSnapshot.forEach((doc) => {
          bookingsList.push({ id: doc.id, ...doc.data() } as Booking);
        });
        
        setRecentBookings(bookingsList);
        setTotalBookings(bookingsSnapshot.size);
        
        // Fetch vehicle statistics
        const vehiclesSnapshot = await getDocs(collection(db, 'vehicles'));
        let totalVehicles = 0;
        let availableVehicles = 0;
        let rentedVehicles = 0;
        let maintenanceVehicles = 0;
        
        vehiclesSnapshot.forEach((doc) => {
          const vehicle = doc.data() as Vehicle;
          totalVehicles++;
          
          if (vehicle.availabilityStatus === 'available') {
            availableVehicles++;
          } else if (vehicle.availabilityStatus === 'rented') {
            rentedVehicles++;
          } else if (vehicle.availabilityStatus === 'maintenance') {
            maintenanceVehicles++;
          }
        });
        
        setVehicleStats({
          total: totalVehicles,
          available: availableVehicles,
          rented: rentedVehicles,
          maintenance: maintenanceVehicles
        });
        
        // Fetch user count
        const usersSnapshot = await getDocs(collection(db, 'users'));
        setUserCount(usersSnapshot.size);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setError('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-300 rounded w-1/4 mb-8"></div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md p-6">
                <div className="h-6 bg-gray-300 rounded w-1/2 mb-4"></div>
                <div className="h-8 bg-gray-300 rounded w-1/3"></div>
              </div>
            ))}
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="h-6 bg-gray-300 rounded w-1/4 mb-4"></div>
            <div className="space-y-3">
              {[...Array(5)].map((_, index) => (
                <div key={index} className="h-12 bg-gray-300 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Admin Dashboard</h1>
      
      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-md flex items-center">
          <FiAlertCircle className="mr-2" />
          <span>{error}</span>
        </div>
      )}
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-medium text-gray-500">Total Vehicles</h2>
            <div className="p-2 bg-blue-100 rounded-md">
              <FiTruck className="text-blue-600" />
            </div>
          </div>
          <div className="flex items-center">
            <p className="text-3xl font-bold text-gray-800">{vehicleStats.total}</p>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-medium text-gray-500">Available Vehicles</h2>
            <div className="p-2 bg-green-100 rounded-md">
              <FiTruck className="text-green-600" />
            </div>
          </div>
          <div className="flex items-center">
            <p className="text-3xl font-bold text-gray-800">{vehicleStats.available}</p>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-medium text-gray-500">Total Users</h2>
            <div className="p-2 bg-purple-100 rounded-md">
              <FiUsers className="text-purple-600" />
            </div>
          </div>
          <div className="flex items-center">
            <p className="text-3xl font-bold text-gray-800">{userCount}</p>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-medium text-gray-500">Total Bookings</h2>
            <div className="p-2 bg-yellow-100 rounded-md">
              <FiCalendar className="text-yellow-600" />
            </div>
          </div>
          <div className="flex items-center">
            <p className="text-3xl font-bold text-gray-800">{totalBookings}</p>
          </div>
        </div>
      </div>
      
      {/* Recent Bookings */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold text-gray-800">Recent Bookings</h2>
          <Link 
            to="/admin/bookings" 
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            View all
          </Link>
        </div>
        
        {recentBookings.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Booking ID
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Vehicle
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recentBookings.map((booking) => (
                  <tr key={booking.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {booking.id.slice(0, 8)}...
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {booking.userId.slice(0, 8)}...
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {booking.vehicleId.slice(0, 8)}...
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(booking.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        booking.status === 'booked' 
                          ? 'bg-green-100 text-green-800' 
                          : booking.status === 'cancelled' 
                            ? 'bg-red-100 text-red-800' 
                            : 'bg-blue-100 text-blue-800'
                      }`}>
                        {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ${booking.totalPrice}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-center text-gray-500">No recent bookings found.</p>
        )}
      </div>
      
      {/* Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link 
          to="/admin/vehicles"
          className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center hover:bg-blue-50 transition-colors"
        >
          <FiTruck className="text-3xl text-blue-600 mb-2" />
          <h3 className="text-lg font-semibold text-gray-800">Manage Vehicles</h3>
          <p className="text-sm text-gray-500 text-center mt-1">
            Add, edit, or delete vehicles from your fleet
          </p>
        </Link>
        
        <Link 
          to="/admin/bookings"
          className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center hover:bg-blue-50 transition-colors"
        >
          <FiCalendar className="text-3xl text-blue-600 mb-2" />
          <h3 className="text-lg font-semibold text-gray-800">Manage Bookings</h3>
          <p className="text-sm text-gray-500 text-center mt-1">
            View and manage all customer bookings
          </p>
        </Link>
        
        <Link 
          to="/admin/users"
          className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center hover:bg-blue-50 transition-colors"
        >
          <FiUsers className="text-3xl text-blue-600 mb-2" />
          <h3 className="text-lg font-semibold text-gray-800">Manage Users</h3>
          <p className="text-sm text-gray-500 text-center mt-1">
            View and manage registered users
          </p>
        </Link>
      </div>
    </div>
  );
};

export default AdminDashboardPage; 