import React from 'react';
import { useFavorites } from '../contexts/FavoritesContext';
import { useAuth } from '../contexts/AuthContext';
import CarCard from '../components/cars/CarCard';
import { Link } from 'react-router-dom';
import { FiHeart } from 'react-icons/fi';

const FavoritesPage: React.FC = () => {
  const { currentUser } = useAuth();
  const { favorites, loading } = useFavorites();

  if (!currentUser) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8 text-center">
        <div className="bg-white rounded-lg shadow-md p-8">
          <FiHeart className="mx-auto text-4xl text-gray-400 mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Sign in to view your favorites</h2>
          <p className="text-gray-600 mb-6">Create an account or sign in to save your favorite cars.</p>
          <div className="space-x-4">
            <Link
              to="/login"
              className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              Create Account
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="bg-gray-200 h-64 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Favorites</h1>
        <p className="mt-2 text-gray-600">Your collection of favorite cars</p>
      </div>

      {favorites.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {favorites.map((car) => (
            <CarCard key={car.id} vehicle={car} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-lg shadow-md">
          <FiHeart className="mx-auto text-4xl text-gray-400 mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">No favorites yet</h2>
          <p className="text-gray-600 mb-6">
            Start adding cars to your favorites by clicking the heart icon on any car card.
          </p>
          <Link
            to="/cars"
            className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
          >
            Browse Cars
          </Link>
        </div>
      )}
    </div>
  );
};

export default FavoritesPage;