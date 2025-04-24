import React, { useState } from 'react';
import { FiFilter, FiX } from 'react-icons/fi';

interface FilterProps {
  onFilterChange: (filters: FilterValues) => void;
  locations: string[];
  carTypes: string[];
}

export interface FilterValues {
  type: string;
  location: string;
  minPrice: number;
  maxPrice: number;
}

const CarFilter: React.FC<FilterProps> = ({ 
  onFilterChange,
  locations,
  carTypes
}) => {
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [filters, setFilters] = useState<FilterValues>({
    type: '',
    location: '',
    minPrice: 0,
    maxPrice: 500
  });

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value } = e.target;
    const updatedFilters = {
      ...filters,
      [name]: name === 'minPrice' || name === 'maxPrice' ? parseInt(value) : value
    };
    
    setFilters(updatedFilters);
    onFilterChange(updatedFilters);
  };

  const clearFilters = () => {
    const resetFilters = {
      type: '',
      location: '',
      minPrice: 0,
      maxPrice: 500
    };
    
    setFilters(resetFilters);
    onFilterChange(resetFilters);
  };

  const toggleFilters = () => {
    setIsFiltersOpen(!isFiltersOpen);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-800 flex items-center">
          <FiFilter className="mr-2" /> Filters
        </h2>
        <button 
          onClick={toggleFilters}
          className="text-sm text-blue-600 hover:text-blue-800 md:hidden"
        >
          {isFiltersOpen ? 'Hide Filters' : 'Show Filters'}
        </button>
      </div>
      
      <div className={`mt-4 space-y-4 ${isFiltersOpen ? 'block' : 'hidden md:block'}`}>
        <div>
          <label htmlFor="location" className="block text-sm font-medium text-gray-700">
            Location
          </label>
          <select
            id="location"
            name="location"
            value={filters.location}
            onChange={handleFilterChange}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
          >
            <option value="">All Locations</option>
            {locations.map((location) => (
              <option key={location} value={location}>
                {location}
              </option>
            ))}
          </select>
        </div>
        
        <div>
          <label htmlFor="type" className="block text-sm font-medium text-gray-700">
            Car Type
          </label>
          <select
            id="type"
            name="type"
            value={filters.type}
            onChange={handleFilterChange}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
          >
            <option value="">All Types</option>
            {carTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>
        
        <div>
          <label htmlFor="minPrice" className="block text-sm font-medium text-gray-700">
            Min Price ($ per day): ${filters.minPrice}
          </label>
          <input
            type="range"
            id="minPrice"
            name="minPrice"
            min="0"
            max="500"
            step="10"
            value={filters.minPrice}
            onChange={handleFilterChange}
            className="mt-1 block w-full"
          />
        </div>
        
        <div>
          <label htmlFor="maxPrice" className="block text-sm font-medium text-gray-700">
            Max Price ($ per day): ${filters.maxPrice}
          </label>
          <input
            type="range"
            id="maxPrice"
            name="maxPrice"
            min="0"
            max="500"
            step="10"
            value={filters.maxPrice}
            onChange={handleFilterChange}
            className="mt-1 block w-full"
          />
        </div>
        
        <div className="flex justify-end pt-2">
          <button
            onClick={clearFilters}
            className="flex items-center text-sm text-red-600 hover:text-red-800"
          >
            <FiX className="mr-1" /> Clear Filters
          </button>
        </div>
      </div>
    </div>
  );
};

export default CarFilter; 