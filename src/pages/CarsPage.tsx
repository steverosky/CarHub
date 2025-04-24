import React, { useState, useMemo, useEffect } from 'react';
import CarCard from '../components/cars/CarCard';
import CarFilter, { FilterValues } from '../components/cars/CarFilter';
import SortSelect, { SortOption } from '../components/cars/SortSelect';
import { Vehicle } from '../types';
import { useFavorites } from '../contexts/FavoritesContext';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase/config';

const CarsPage: React.FC = () => {
  const [cars, setCars] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<FilterValues>({
    search: '',
    type: '',
    location: '',
    minPrice: 0,
    maxPrice: 1000,
  });
  const [sortBy, setSortBy] = useState<SortOption>('price-low');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const { isFavorite } = useFavorites();

  // Fetch cars from Firestore
  useEffect(() => {
    const fetchCars = async () => {
      try {
        const carsRef = collection(db, 'vehicles');
        const snapshot = await getDocs(carsRef);
        const carsData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Vehicle[];
        setCars(carsData);
      } catch (error) {
        console.error('Error fetching cars:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCars();
  }, []);

  // Extract unique locations and car types for filters
  const locations = useMemo(() => 
    Array.from(new Set(cars.map(car => car.location))).sort(),
    [cars]
  );

  const carTypes = useMemo(() => 
    Array.from(new Set(cars.map(car => car.type))).sort(),
    [cars]
  );

  // Filter and sort cars
  const filteredCars = useMemo(() => {
    let result = [...cars];

    // Apply favorites filter
    if (showFavoritesOnly) {
      result = result.filter(car => isFavorite(car.id));
    }

    // Apply search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter(car =>
        car.make.toLowerCase().includes(searchLower) ||
        car.model.toLowerCase().includes(searchLower) ||
        car.type.toLowerCase().includes(searchLower)
      );
    }

    // Apply other filters
    if (filters.type) {
      result = result.filter(car => car.type === filters.type);
    }
    if (filters.location) {
      result = result.filter(car => car.location === filters.location);
    }
    if (filters.minPrice) {
      result = result.filter(car => car.ratePerDay >= filters.minPrice);
    }
    if (filters.maxPrice) {
      result = result.filter(car => car.ratePerDay <= filters.maxPrice);
    }
    if (filters.transmission) {
      result = result.filter(car => car.transmission === filters.transmission);
    }
    if (filters.seats) {
      result = result.filter(car => (car.seats ?? 0) >= (filters.seats ?? 0));
    }
    if (filters.fuelType) {
      result = result.filter(car => car.fuelType === filters.fuelType);
    }

    // Apply sorting
    result.sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.ratePerDay - b.ratePerDay;
        case 'price-high':
          return b.ratePerDay - a.ratePerDay;
        case 'rating':
          return (b.rating || 0) - (a.rating || 0);
        default:
          return 0;
      }
    });

    return result;
  }, [cars, filters, sortBy, showFavoritesOnly, isFavorite]);

  const handleFilterChange = (newFilters: FilterValues) => {
    setFilters(newFilters);
  };

  const toggleFavorites = () => {
    setShowFavoritesOnly(!showFavoritesOnly);
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="bg-gray-200 h-64 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="md:flex md:items-center md:justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Available Cars</h1>
        <div className="mt-4 md:mt-0">
          <SortSelect value={sortBy} onChange={setSortBy} />
        </div>
      </div>

      <div className="lg:grid lg:grid-cols-4 lg:gap-8">
        <div className="lg:col-span-1">
          <CarFilter
            onFilterChange={handleFilterChange}
            locations={locations}
            carTypes={carTypes}
            showFavoritesOnly={showFavoritesOnly}
            onFavoritesToggle={toggleFavorites}
          />
        </div>

        <div className="mt-6 lg:mt-0 lg:col-span-3">
          {filteredCars.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg shadow">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No cars found
              </h3>
              <p className="text-gray-500">
                Try adjusting your filters or search criteria
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredCars.map((car) => (
                <CarCard key={car.id} vehicle={car} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CarsPage;