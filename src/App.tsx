import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Layout from './components/layout/Layout';
import PrivateRoute from './components/auth/PrivateRoute';

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

// CSS
import './App.css';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Layout><HomePage /></Layout>} />
          <Route path="/cars" element={<Layout><CarsPage /></Layout>} />
          <Route path="/cars/:id" element={<Layout><CarDetailsPage /></Layout>} />
          <Route path="/login" element={<Layout><LoginPage /></Layout>} />
          <Route path="/register" element={<Layout><RegisterPage /></Layout>} />
          <Route path="/about" element={<Layout><AboutPage /></Layout>} />

          {/* Protected Routes */}
          <Route 
            path="/bookings" 
            element={
              <PrivateRoute>
                <Layout>
                  <MyBookingsPage />
                </Layout>
              </PrivateRoute>
            } 
          />
          <Route 
            path="/bookings/:id/confirm" 
            element={
              <PrivateRoute>
                <Layout>
                  <BookingConfirmPage />
                </Layout>
              </PrivateRoute>
            } 
          />

          {/* Admin Routes */}
          <Route 
            path="/admin" 
            element={
              <PrivateRoute requireAdmin>
                <Layout>
                  <AdminDashboardPage />
                </Layout>
              </PrivateRoute>
            } 
          />
          
          {/* Fallback Route */}
          <Route 
            path="*" 
            element={
              <Layout>
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
              </Layout>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
