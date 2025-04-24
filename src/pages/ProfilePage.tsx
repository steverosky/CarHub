import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { FiUser, FiMail, FiCalendar, FiEdit2, FiLock, FiMapPin } from 'react-icons/fi';

const ProfilePage: React.FC = () => {
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState<'profile' | 'bookings'>('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: currentUser?.name || '',
    email: currentUser?.email || '',
    phone: currentUser?.phone || '',
    address: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically update the user's profile in your backend
    setIsEditing(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <div className="md:w-1/4">
          <div className="card p-6">
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
                <FiUser className="text-primary-600 text-2xl" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-secondary-900">
                  {currentUser?.name || 'User'}
                </h2>
                <p className="text-secondary-600">{currentUser?.email}</p>
              </div>
            </div>

            <nav className="space-y-2">
              <button
                onClick={() => setActiveTab('profile')}
                className={`w-full flex items-center space-x-2 px-4 py-2 rounded-lg ${
                  activeTab === 'profile'
                    ? 'bg-primary-50 text-primary-600'
                    : 'text-secondary-600 hover:bg-secondary-50'
                }`}
              >
                <FiUser className="text-lg" />
                <span>Profile</span>
              </button>
              <button
                onClick={() => setActiveTab('bookings')}
                className={`w-full flex items-center space-x-2 px-4 py-2 rounded-lg ${
                  activeTab === 'bookings'
                    ? 'bg-primary-50 text-primary-600'
                    : 'text-secondary-600 hover:bg-secondary-50'
                }`}
              >
                <FiCalendar className="text-lg" />
                <span>My Bookings</span>
              </button>
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="md:w-3/4">
          {activeTab === 'profile' ? (
            <div className="card p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-secondary-900">Profile Information</h2>
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="btn btn-secondary"
                >
                  <FiEdit2 className="mr-2" />
                  {isEditing ? 'Cancel' : 'Edit Profile'}
                </button>
              </div>

              {isEditing ? (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="label">Full Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="input"
                    />
                  </div>

                  <div>
                    <label className="label">Email</label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="input"
                        disabled
                      />
                      <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={() => {/* Handle email change */}}
                      >
                        <FiMail className="mr-2" />
                        Change
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="label">Phone Number</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="input"
                    />
                  </div>

                  <div>
                    <label className="label">Address</label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      className="input"
                    />
                  </div>

                  <div className="flex justify-end">
                    <button type="submit" className="btn btn-primary">
                      Save Changes
                    </button>
                  </div>
                </form>
              ) : (
                <div className="space-y-6">
                  <div className="flex items-center space-x-4">
                    <FiUser className="text-primary-600 text-xl" />
                    <div>
                      <p className="text-secondary-500">Full Name</p>
                      <p className="text-secondary-900">{formData.name}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <FiMail className="text-primary-600 text-xl" />
                    <div>
                      <p className="text-secondary-500">Email</p>
                      <p className="text-secondary-900">{formData.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <FiCalendar className="text-primary-600 text-xl" />
                    <div>
                      <p className="text-secondary-500">Phone Number</p>
                      <p className="text-secondary-900">{formData.phone || 'Not provided'}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <FiMapPin className="text-primary-600 text-xl" />
                    <div>
                      <p className="text-secondary-500">Address</p>
                      <p className="text-secondary-900">{formData.address || 'Not provided'}</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="mt-8 pt-6 border-t border-secondary-200">
                <h3 className="text-lg font-semibold text-secondary-900 mb-4">Security</h3>
                <button
                  onClick={() => {/* Handle password change */}}
                  className="btn btn-secondary"
                >
                  <FiLock className="mr-2" />
                  Change Password
                </button>
              </div>
            </div>
          ) : (
            <div className="card p-6">
              <h2 className="text-2xl font-bold text-secondary-900 mb-6">My Bookings</h2>
              <div className="space-y-4">
                {/* Here you would map through the user's bookings */}
                <p className="text-secondary-600">No bookings found.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;