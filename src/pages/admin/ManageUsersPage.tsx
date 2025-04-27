import React, { useState, useEffect } from 'react';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import LoadingSpinner from '../../components/LoadingSpinner';

interface User {
  id: string;
  email: string;
  displayName: string;
  role: string;
  createdAt: string;
}

const ManageUsersPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const usersRef = collection(db, 'users');
      const snapshot = await getDocs(usersRef);
      const fetchedUsers = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as User[];

      setUsers(fetchedUsers);
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
  }, []);

  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        role: newRole,
        updatedAt: new Date().toISOString()
      });
      
      toast.success(`User role updated successfully`);
      fetchUsers(); // Refresh the users list
    } catch (err) {
      toast.error('Failed to update user role');
      console.error('Error updating user role:', err);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="text-red-500 text-center p-4">{error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Manage Users</h1>
      
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2">User ID</th>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Email</th>
              <th className="px-4 py-2">Role</th>
              <th className="px-4 py-2">Joined</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-b hover:bg-gray-50">
                <td className="px-4 py-2">{user.id.slice(0, 8)}</td>
                <td className="px-4 py-2">{user.displayName || 'N/A'}</td>
                <td className="px-4 py-2">{user.email}</td>
                <td className="px-4 py-2">
                  <span className={`px-2 py-1 rounded text-sm ${
                    user.role === 'admin' ? 'bg-purple-100 text-purple-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                  </span>
                </td>
                <td className="px-4 py-2">
                  {new Date(user.createdAt).toLocaleDateString()}
                </td>
                <td className="px-4 py-2">
                  <select
                    value={user.role}
                    onChange={(e) => handleRoleChange(user.id, e.target.value)}
                    className="border rounded p-1 text-sm"
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageUsersPage; 