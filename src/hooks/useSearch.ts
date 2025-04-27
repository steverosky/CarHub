import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { SEARCH_UPDATE_EVENT } from '../components/layout/Navbar';

export const useSearch = (initialValue = '') => {
  const [searchQuery, setSearchQuery] = useState(initialValue);
  const location = useLocation();

  useEffect(() => {
    // Update search query from URL parameters
    const params = new URLSearchParams(location.search);
    const searchParam = params.get('search');
    if (searchParam) {
      setSearchQuery(decodeURIComponent(searchParam));
    }
  }, [location.search]);

  useEffect(() => {
    // Listen for search updates from Navbar
    const handleSearchUpdate = (event: CustomEvent<string>) => {
      setSearchQuery(event.detail);
    };

    window.addEventListener(
      SEARCH_UPDATE_EVENT,
      handleSearchUpdate as EventListener
    );

    return () => {
      window.removeEventListener(
        SEARCH_UPDATE_EVENT,
        handleSearchUpdate as EventListener
      );
    };
  }, []);

  return [searchQuery, setSearchQuery] as const;
}; 