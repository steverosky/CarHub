import React, { useState } from 'react';
import { FiFilter, FiX, FiSearch, FiHeart } from 'react-icons/fi';
import { useAuth } from '../../contexts/AuthContext';

interface FilterProps {
  onFilterChange: (filters: FilterValues) => void;
  locations: string[];
  carTypes: string[];
  showFavoritesOnly: boolean;
  onFavoritesToggle: () => void;
}

export interface FilterValues {
  search: string;
  type: string;
  location: string;
  minPrice: number;
  maxPrice: number;
  transmission?: string;
  minMileage?: number;
  maxMileage?: number;
  seats?: number;
  fuelType?: string;
}

const CarFilter: React.FC<FilterProps> = ({ onFilterChange, locations, carTypes, showFavoritesOnly, onFavoritesToggle }) => {
  const { currentUser } = useAuth();
  const [filters, setFilters] = useState<FilterValues>({
    search: '',
    type: '',
    location: '',
    minPrice: 0,
    maxPrice: 1000,
    transmission: '',
    minMileage: undefined,
    maxMileage: undefined,
    seats: undefined,
    fuelType: ''
  });

  const handleChange = (field: keyof FilterValues, value: string | number) => {
    const newFilters = { ...filters, [field]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const resetFilters = () => {
    const defaultFilters: FilterValues = {
      search: '',
      type: '',
      location: '',
      minPrice: 0,
      maxPrice: 1000,
      transmission: '',
      minMileage: undefined,
      maxMileage: undefined,
      seats: undefined,
      fuelType: ''
    };
    setFilters(defaultFilters);
    onFilterChange(defaultFilters);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold text-secondary-900">
          <FiFilter className="inline mr-2" />
          Filters
        </h2>
        <button
          onClick={resetFilters}
          className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
        >
          <FiX className="mr-1" />
          Reset
        </button>
      </div>

      <div className="space-y-6">
        {/* Search input */}
        <div className="relative mb-4">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search cars..."
            value={filters.search}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            onChange={(e) => handleChange('search', e.target.value)}
          />
        </div>

        {/* Favorites Toggle */}
        {currentUser && (
          <button
            onClick={onFavoritesToggle}
            className={`inline-flex items-center px-4 py-2 rounded-md text-sm font-medium mb-4 ${
              showFavoritesOnly 
                ? 'bg-blue-50 text-blue-700 border border-blue-200'
                : 'text-gray-700 border border-gray-300 hover:bg-gray-50'
            }`}
            aria-pressed={showFavoritesOnly}
          >
            <FiHeart 
              className={`mr-2 ${showFavoritesOnly ? 'text-red-500 fill-current' : ''}`} 
            />
            Favorites Only
          </button>
        )}

        {/* Location Filter */}
        <div>
          <label className="block text-sm font-medium text-secondary-700 mb-2">
            Location
          </label>
          <select
            value={filters.location}
            onChange={(e) => handleChange('location', e.target.value)}
            className="w-full rounded-md border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Locations</option>
            {locations.map((location) => (
              <option key={location} value={location}>
                {location}
              </option>
            ))}
          </select>
        </div>

        {/* Car Type Filter */}
        <div>
          <label className="block text-sm font-medium text-secondary-700 mb-2">
            Car Type
          </label>
          <select
            value={filters.type}
            onChange={(e) => handleChange('type', e.target.value)}
            className="w-full rounded-md border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Types</option>
            {carTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        {/* Price Range */}
        <div>
          <label className="block text-sm font-medium text-secondary-700 mb-2">
            Price Range (per day)
          </label>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <input
                type="number"
                value={filters.minPrice}
                onChange={(e) => handleChange('minPrice', Number(e.target.value))}
                min={0}
                max={filters.maxPrice}
                className="w-full rounded-md border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Min"
              />
            </div>
            <div>
              <input
                type="number"
                value={filters.maxPrice}
                onChange={(e) => handleChange('maxPrice', Number(e.target.value))}
                min={filters.minPrice}
                className="w-full rounded-md border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Max"
              />
            </div>
          </div>
        </div>

        {/* Transmission */}
        <div>
          <label className="block text-sm font-medium text-secondary-700 mb-2">
            Transmission
          </label>
          <select
            value={filters.transmission}
            onChange={(e) => handleChange('transmission', e.target.value)}
            className="w-full rounded-md border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Any</option>
            <option value="automatic">Automatic</option>
            <option value="manual">Manual</option>
          </select>
        </div>

        {/* Mileage Range */}
        <div>
          <label className="block text-sm font-medium text-secondary-700 mb-2">
            Mileage
          </label>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <input
                type="number"
                value={filters.minMileage || ''}
                onChange={(e) => handleChange('minMileage', Number(e.target.value))}
                min={0}
                max={filters.maxMileage}
                className="w-full rounded-md border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Min"
              />
            </div>
            <div>
              <input
                type="number"
                value={filters.maxMileage || ''}
                onChange={(e) => handleChange('maxMileage', Number(e.target.value))}
                min={filters.minMileage}
                className="w-full rounded-md border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Max"
              />
            </div>
          </div>
        </div>

        {/* Seats */}
        <div>
          <label className="block text-sm font-medium text-secondary-700 mb-2">
            Seats
          </label>
          <select
            value={filters.seats || ''}
            onChange={(e) => handleChange('seats', Number(e.target.value))}
            className="w-full rounded-md border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Any</option>
            <option value="2">2 seats</option>
            <option value="4">4 seats</option>
            <option value="5">5 seats</option>
            <option value="7">7 seats</option>
            <option value="8">8+ seats</option>
          </select>
        </div>

        {/* Fuel Type */}
        <div>
          <label className="block text-sm font-medium text-secondary-700 mb-2">
            Fuel Type
          </label>
          <select
            value={filters.fuelType}
            onChange={(e) => handleChange('fuelType', e.target.value)}
            className="w-full rounded-md border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Any</option>
            <option value="Gasoline">Gasoline</option>
            <option value="Electric">Electric</option>
            <option value="Hybrid">Hybrid</option>
            <option value="Diesel">Diesel</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default CarFilter;