import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import { FavoritesProvider } from './contexts/FavoritesContext';
import Layout from './components/layout/Layout';
import PrivateRoute from './components/auth/PrivateRoute';
import { initializeDatabase } from './utils/sampleData';

// Pages
import HomePage from './pages/HomePage';
import CarsPage from './pages/CarsPage';
import CarDetailsPage from './pages/CarDetailsPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import MyBookingsPage from './pages/MyBookingsPage';
import BookingConfirmPage from './pages/BookingConfirmPage';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AboutPage from './pages/AboutPage';
import FavoritesPage from './pages/FavoritesPage';
import ProfilePage from './pages/ProfilePage';

// CSS
import './App.css';

const App: React.FC = () => {
  useEffect(() => {
    initializeDatabase();
  }, []);

  return (
    <AuthProvider>
      <FavoritesProvider>
        <Router>
          <div className="flex flex-col min-h-screen">
            <Toaster 
              position="top-right"
              toastOptions={{
                duration: 3000,
                style: {
                  background: '#363636',
                  color: '#fff',
                },
                success: {
                  duration: 3000,
                  iconTheme: {
                    primary: '#4ade80',
                    secondary: '#fff',
                  },
                },
                error: {
                  duration: 4000,
                  iconTheme: {
                    primary: '#ef4444',
                    secondary: '#fff',
                  },
                },
              }}
            />
            <Layout>
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<HomePage />} />
                <Route path="/cars" element={<CarsPage />} />
                <Route path="/cars/:id" element={<CarDetailsPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/about" element={<AboutPage />} />

                {/* Protected Routes */}
                <Route 
                  path="/profile" 
                  element={
                    <PrivateRoute>
                      <ProfilePage />
                    </PrivateRoute>
                  } 
                />
                <Route 
                  path="/bookings" 
                  element={
                    <PrivateRoute>
                      <MyBookingsPage />
                    </PrivateRoute>
                  } 
                />
                <Route 
                  path="/bookings/:id/confirm" 
                  element={
                    <PrivateRoute>
                      <BookingConfirmPage />
                    </PrivateRoute>
                  } 
                />
                <Route 
                  path="/favorites" 
                  element={
                    <PrivateRoute>
                      <FavoritesPage />
                    </PrivateRoute>
                  } 
                />

                {/* Admin Routes */}
                <Route 
                  path="/admin" 
                  element={
                    <PrivateRoute requireAdmin>
                      <AdminDashboardPage />
                    </PrivateRoute>
                  } 
                />
                
                {/* Fallback Route */}
                <Route 
                  path="*" 
                  element={
                    <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8 text-center">
                      <h1 className="text-4xl font-bold text-gray-800 mb-4">404 - Page Not Found</h1>
                      <p className="text-lg text-gray-600 mb-8">The page you are looking for does not exist.</p>
                      <a 
                        href="/" 
                        className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
                      >
                        Return Home
                      </a>
                    </div>
                  }
                />
              </Routes>
            </Layout>
          </div>
        </Router>
      </FavoritesProvider>
    </AuthProvider>
  );
};

export default App;
