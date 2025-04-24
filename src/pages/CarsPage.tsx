import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db } from '../firebase/config';
import { Vehicle } from '../types';
import CarCard from '../components/cars/CarCard';
import CarFilter, { FilterValues } from '../components/cars/CarFilter';
import { FiSearch } from 'react-icons/fi';

const CarsPage: React.FC = () => {
  const [cars, setCars] = useState<Vehicle[]>([]);
  const [filteredCars, setFilteredCars] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [locations, setLocations] = useState<string[]>([]);
  const [carTypes, setCarTypes] = useState<string[]>([]);

  // Fetch cars from Firestore
  useEffect(() => {
    const fetchCars = async () => {
      try {
        const carsQuery = query(
          collection(db, 'vehicles'),
          orderBy('make', 'asc')
        );
        
        const querySnapshot = await getDocs(carsQuery);
        const carsList: Vehicle[] = [];
        const uniqueLocations = new Set<string>();
        const uniqueTypes = new Set<string>();
        
        querySnapshot.forEach((doc) => {
          const car = { id: doc.id, ...doc.data() } as Vehicle;
          carsList.push(car);
          
          // Collect unique locations and types for filters
          if (car.location) uniqueLocations.add(car.location);
          if (car.type) uniqueTypes.add(car.type);
        });
        
        setCars(carsList);
        setFilteredCars(carsList);
        setLocations(Array.from(uniqueLocations));
        setCarTypes(Array.from(uniqueTypes));
      } catch (error) {
        console.error('Error fetching cars:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCars();
  }, []);

  // Handle filter changes
  const handleFilterChange = (filters: FilterValues) => {
    let filtered = [...cars];
    
    // Filter by type
    if (filters.type) {
      filtered = filtered.filter(car => car.type === filters.type);
    }
    
    // Filter by location
    if (filters.location) {
      filtered = filtered.filter(car => car.location === filters.location);
    }
    
    // Filter by price range
    filtered = filtered.filter(
      car => car.ratePerDay >= filters.minPrice && car.ratePerDay <= filters.maxPrice
    );
    
    // Apply search query filter if present
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        car => 
          car.make.toLowerCase().includes(query) || 
          car.model.toLowerCase().includes(query)
      );
    }
    
    setFilteredCars(filtered);
  };

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    
    let filtered = [...cars];
    
    if (query) {
      const lowercaseQuery = query.toLowerCase();
      filtered = filtered.filter(
        car => 
          car.make.toLowerCase().includes(lowercaseQuery) || 
          car.model.toLowerCase().includes(lowercaseQuery)
      );
    }
    
    setFilteredCars(filtered);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Available Cars</h1>
        <p className="mt-2 text-gray-600">
          Find and book the perfect vehicle for your journey
        </p>
      </div>
      
      {/* Search Input */}
      <div className="mb-6">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiSearch className="text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="Search by make or model..."
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </div>
      </div>
      
      <div className="flex flex-col md:flex-row gap-6">
        {/* Filters */}
        <div className="md:w-1/4">
          <CarFilter 
            onFilterChange={handleFilterChange}
            locations={locations}
            carTypes={carTypes}
          />
        </div>
        
        {/* Car List */}
        <div className="md:w-3/4">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, index) => (
                <div key={index} className="bg-white rounded-lg shadow-md p-4 animate-pulse">
                  <div className="h-48 bg-gray-300 rounded-md mb-4"></div>
                  <div className="h-6 bg-gray-300 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-300 rounded mb-2"></div>
                  <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : filteredCars.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCars.map((car) => (
                <CarCard key={car.id} vehicle={car} />
              ))}
            </div>
          ) : (
            <div className="text-center py-10 bg-white rounded-lg shadow-md">
              <p className="text-gray-500">No cars match your search criteria. Please try adjusting your filters.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CarsPage; 