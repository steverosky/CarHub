import React, { useState, useEffect } from 'react';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { User } from '../../types';
import { FaUserShield, FaUser, FaCheck, FaTimes } from 'react-icons/fa';
import toast from 'react-hot-toast';
import LoadingSpinner from '../../components/LoadingSpinner';

const ManageUsersPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [roleFilter, setRoleFilter] = useState<'all' | 'admin' | 'customer'>('all');

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const usersRef = collection(db, 'users');
      const snapshot = await getDocs(usersRef);
      const fetchedUsers = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as User[];

      // Sort users by name
      const sortedUsers = fetchedUsers.sort((a, b) => 
        (a.name || '').localeCompare(b.name || '')
      );

      // Filter users based on selected role
      const filteredUsers = roleFilter === 'all' 
        ? sortedUsers 
        : sortedUsers.filter(user => user.role === roleFilter);

      setUsers(filteredUsers);
      setError(null);
    } catch (err) {
      setError('Failed to fetch users. Please try again later.');
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [roleFilter]);

  const handleRoleChange = async (userId: string, newRole: 'admin' | 'customer') => {
    try {
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        role: newRole,
        updatedAt: new Date().toISOString()
      });
      
      toast.success(`User role updated to ${newRole}`);
      fetchUsers();
    } catch (err) {
      toast.error('Failed to update user role');
      console.error('Error updating user role:', err);
    }
  };

  const getRoleBadgeClass = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-purple-100 text-purple-800';
      case 'customer':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="text-red-500 text-center p-4">{error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Manage Users</h1>
        <div className="flex items-center space-x-4">
          <label htmlFor="roleFilter" className="text-gray-700">Filter by role:</label>
          <select
            id="roleFilter"
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value as typeof roleFilter)}
            className="border rounded-md py-2 px-3 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All</option>
            <option value="customer">Customers</option>
            <option value="admin">Admins</option>
          </select>
        </div>
      </div>

      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {user.id.slice(0, 8)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-8 w-8">
                        {user.role === 'admin' ? (
                          <FaUserShield className="h-8 w-8 text-purple-500" />
                        ) : (
                          <FaUser className="h-8 w-8 text-blue-500" />
                        )}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{user.name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getRoleBadgeClass(user.role)}`}>
                      {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleRoleChange(user.id, 'admin')}
                        className={`p-2 rounded-full ${
                          user.role === 'admin'
                            ? 'bg-gray-200 cursor-not-allowed'
                            : 'bg-purple-500 text-white hover:bg-purple-600 transition-colors duration-200'
                        }`}
                        disabled={user.role === 'admin'}
                        title={user.role === 'admin' ? 'Already an admin' : 'Make Admin'}
                      >
                        <FaUserShield className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleRoleChange(user.id, 'customer')}
                        className={`p-2 rounded-full ${
                          user.role === 'customer'
                            ? 'bg-gray-200 cursor-not-allowed'
                            : 'bg-blue-500 text-white hover:bg-blue-600 transition-colors duration-200'
                        }`}
                        disabled={user.role === 'customer'}
                        title={user.role === 'customer' ? 'Already a customer' : 'Make Customer'}
                      >
                        <FaUser className="w-4 h-4" />
                      </button>
                    </div>
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

export default ManageUsersPage; 