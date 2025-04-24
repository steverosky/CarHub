import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Vehicle } from '../../types';
import { FiCalendar, FiMap, FiUsers, FiSettings, FiStar, FiTool, FiDroplet, FiHeart } from 'react-icons/fi';
import { useFavorites } from '../../contexts/FavoritesContext';
import { useAuth } from '../../contexts/AuthContext';
import LoginPromptModal from '../auth/LoginPromptModal';
import toast from 'react-hot-toast';
import { favoriteButtonAnimations } from '../../utils/animations';

interface CarCardProps {
  vehicle: Vehicle;
}

const CarCard: React.FC<CarCardProps> = ({ vehicle }) => {
  const { currentUser } = useAuth();
  const { isFavorite, addToFavorites, removeFromFavorites } = useFavorites();
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const { 
    id, make, model, year, type, ratePerDay, images, availabilityStatus, 
    seats, transmission, fuelType, location, rating, colors, specifications 
  } = vehicle;

  const handleFavoriteClick = async (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent card click navigation
    if (!currentUser) {
      setShowLoginPrompt(true);
      return;
    }
    
    setIsAnimating(true);
    const toastId = toast.loading('Updating favorites...');
    try {
      if (isFavorite(id)) {
        await removeFromFavorites(id);
        toast.success('Removed from favorites', { id: toastId });
      } else {
        await addToFavorites(vehicle);
        toast.success('Added to favorites', { id: toastId });
      }
    } catch (error) {
      console.error('Error updating favorites:', error);
      toast.error('Failed to update favorites', { id: toastId });
    } finally {
      setTimeout(() => setIsAnimating(false), 200);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleFavoriteClick(e as unknown as React.MouseEvent);
    }
  };

  const statusColor = 
    availabilityStatus === 'available' 
      ? 'bg-green-100 text-green-800' 
      : availabilityStatus === 'maintenance'
        ? 'bg-yellow-100 text-yellow-800'
        : 'bg-red-100 text-red-800';

  return (
    <div 
      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
      role="article"
      aria-label={`${make} ${model} car details`}
    >
      <div className="relative">
        <img 
          src={images[0]} 
          alt={`${make} ${model}`} 
          className="w-full h-48 object-cover"
        />
        <span 
          className={`absolute top-2 right-2 text-xs font-semibold px-2 py-1 rounded-full ${statusColor}`}
          role="status"
        >
          {availabilityStatus.charAt(0).toUpperCase() + availabilityStatus.slice(1)}
        </span>
        {rating && (
          <div 
            className="absolute top-2 left-2 bg-white bg-opacity-90 rounded-full px-2 py-1 flex items-center"
            role="note"
            aria-label={`Rating: ${rating} stars`}
          >
            <FiStar className="text-yellow-400 mr-1" aria-hidden="true" />
            <span className="text-sm font-medium">{rating}</span>
          </div>
        )}
        <button
          onClick={handleFavoriteClick}
          onKeyDown={handleKeyDown}
          className={`absolute bottom-2 right-2 p-2 rounded-full bg-white bg-opacity-90 hover:bg-opacity-100 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
            favoriteButtonAnimations.default
          } ${isAnimating ? favoriteButtonAnimations.click : ''}`}
          aria-label={`${isFavorite(id) ? 'Remove from' : 'Add to'} favorites`}
          title={`${isFavorite(id) ? 'Remove from' : 'Add to'} favorites`}
          tabIndex={0}
        >
          <FiHeart 
            className={`text-xl ${
              isFavorite(id) ? 'text-red-500 fill-current' : 'text-gray-600'
            } ${isAnimating ? favoriteButtonAnimations.active : ''}`}
            aria-hidden="true"
          />
        </button>
      </div>
      
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800">
          {make} {model}
        </h3>
        
        <div className="mt-2 flex items-center text-sm text-gray-500">
          <FiCalendar className="mr-1" aria-hidden="true" />
          <span>{year}</span>
          <span className="mx-2" aria-hidden="true">•</span>
          <span className="capitalize">{type}</span>
        </div>
        
        <div className="mt-3 grid grid-cols-2 gap-2">
          {seats && (
            <div className="flex items-center text-sm text-gray-500">
              <FiUsers className="mr-1" aria-hidden="true" />
              <span>{seats} seats</span>
            </div>
          )}
          
          {transmission && (
            <div className="flex items-center text-sm text-gray-500">
              <FiSettings className="mr-1" aria-hidden="true" />
              <span className="capitalize">{transmission}</span>
            </div>
          )}
          
          {specifications?.engine && (
            <div className="flex items-center text-sm text-gray-500">
              <FiTool className="mr-1" aria-hidden="true" />
              <span>{specifications.engine}</span>
            </div>
          )}
          
          {fuelType && (
            <div className="flex items-center text-sm text-gray-500">
              <FiDroplet className="mr-1" aria-hidden="true" />
              <span>{fuelType}</span>
            </div>
          )}
          
          <div className="flex items-center text-sm text-gray-500">
            <FiMap className="mr-1" aria-hidden="true" />
            <span>{location}</span>
          </div>
        </div>
        
        {colors && colors.length > 0 && (
          <div className="mt-3 flex items-center gap-1" role="list" aria-label="Available colors">
            {colors.map((color, index) => (
              <span 
                key={index}
                className="w-4 h-4 rounded-full border border-gray-200"
                style={{ backgroundColor: color.toLowerCase().replace(' ', '') }}
                title={color}
                role="listitem"
                aria-label={color}
              />
            ))}
          </div>
        )}
        
        <div className="mt-4 flex items-center justify-between">
          <div aria-label={`${ratePerDay} dollars per day`}>
            <span className="text-lg font-bold text-blue-600">${ratePerDay}</span>
            <span className="text-gray-500 text-sm"> / day</span>
          </div>
          
          <Link 
            to={`/cars/${id}`}
            className={`inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
              availabilityStatus !== 'available' ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            onClick={(e) => availabilityStatus !== 'available' && e.preventDefault()}
            aria-disabled={availabilityStatus !== 'available'}
            tabIndex={availabilityStatus !== 'available' ? -1 : 0}
          >
            {availabilityStatus === 'available' ? 'Book Now' : 'Not Available'}
          </Link>
        </div>
      </div>
      <LoginPromptModal 
        isOpen={showLoginPrompt} 
        onClose={() => setShowLoginPrompt(false)} 
      />
    </div>
  );
};

export default CarCard;