import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useFavorites } from '../../contexts/FavoritesContext';
import { 
  FiMenu, 
  FiX, 
  FiUser, 
  FiHeart, 
  FiCalendar, 
  FiLogOut,
  FiSearch,
  FiHome,
  FiInfo,
  FiSettings,
  FiMessageSquare,
  FiTruck
} from 'react-icons/fi';
import { toast } from 'react-hot-toast';

// Create a custom event for search updates
export const SEARCH_UPDATE_EVENT = 'searchUpdate';
export const updateSearchQuery = (query: string) => {
  const event = new CustomEvent(SEARCH_UPDATE_EVENT, { detail: query });
  window.dispatchEvent(event);
};

const Navbar: React.FC = () => {
  const { currentUser, logout, operationLoading } = useAuth();
  const { favoritesCount } = useFavorites();
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const searchInputRef = useRef<HTMLInputElement>(null);

  const toggleMenu = () => setIsOpen(!isOpen);

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logged out successfully');
      navigate('/');
    } catch (error) {
      toast.error('Failed to log out');
    }
  };

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  }, []);

  const handleSearch = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      if (location.pathname === '/cars') {
        updateSearchQuery(searchQuery.trim());
      } else {
        navigate({
          pathname: '/cars',
          search: `?search=${encodeURIComponent(searchQuery.trim())}`
        });
      }
      setIsOpen(false);
    }
  }, [searchQuery, location.pathname, navigate]);

  // Add search query parameter sync
  useEffect(() => {
    // Get search query from URL when component mounts or URL changes
    const params = new URLSearchParams(location.search);
    const searchParam = params.get('search');
    if (searchParam) {
      setSearchQuery(decodeURIComponent(searchParam));
    }
  }, [location.search]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // User action button with tooltip
  const ActionButton = ({ 
    to, 
    icon: Icon, 
    tooltip, 
    onClick, 
    isActive: active,
    disabled = false 
  }: { 
    to?: string; 
    icon: React.ElementType; 
    tooltip: string; 
    onClick?: () => void;
    isActive?: boolean;
    disabled?: boolean;
  }) => {
    const ButtonContent = (
      <div className="group relative">
        <div
          className={`inline-flex items-center px-3 py-2 rounded-md text-sm font-medium 
            ${active ? 'bg-primary-50 text-primary-700' : 'text-secondary-600 hover:bg-secondary-50 hover:text-secondary-900'}
            ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
          onClick={onClick}
        >
          <Icon className="h-5 w-5" />
        </div>
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1 px-2 py-1 text-xs font-medium text-white bg-gray-900 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
          {tooltip}
        </div>
      </div>
    );

    return to ? (
      <Link to={to}>{ButtonContent}</Link>
    ) : (
      ButtonContent
    );
  };

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${
      isScrolled || isOpen ? 'bg-white shadow-md' : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Main Navigation */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="flex items-center">
              <FiTruck className="h-8 w-8 text-primary-600" />
              <span className="ml-2 text-xl font-bold text-secondary-900">CarHub</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex lg:items-center lg:space-x-1">
            <Link
              to="/"
              className={`inline-flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                isActive('/') 
                  ? 'bg-primary-50 text-primary-700' 
                  : 'text-secondary-600 hover:bg-secondary-50 hover:text-secondary-900'
              }`}
            >
              <FiHome className="mr-1.5" />
              Home
            </Link>
            
            <Link
              to="/cars"
              className={`inline-flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                isActive('/cars')
                  ? 'bg-primary-50 text-primary-700'
                  : 'text-secondary-600 hover:bg-secondary-50 hover:text-secondary-900'
              }`}
            >
              <FiTruck className="mr-1.5" />
              Cars
            </Link>
            
            <Link
              to="/about"
              className={`inline-flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                isActive('/about')
                  ? 'bg-primary-50 text-primary-700'
                  : 'text-secondary-600 hover:bg-secondary-50 hover:text-secondary-900'
              }`}
            >
              <FiInfo className="mr-1.5" />
              About
            </Link>

            <Link
              to="/contact"
              className={`inline-flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                isActive('/contact')
                  ? 'bg-primary-50 text-primary-700'
                  : 'text-secondary-600 hover:bg-secondary-50 hover:text-secondary-900'
              }`}
            >
              <FiMessageSquare className="mr-1.5" />
              Contact
            </Link>
          </div>

          {/* Search Bar - Desktop */}
          <div className="hidden lg:flex lg:flex-1 lg:justify-center lg:px-4 max-w-lg">
            <form onSubmit={handleSearch} className="w-full">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  placeholder="Search cars..."
                  className="w-full pl-10 pr-16 py-2 text-sm border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-400" />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 px-3 py-1 text-sm bg-primary-50 text-primary-600 rounded hover:bg-primary-100"
                >
                  Search
                </button>
              </div>
            </form>
          </div>

          {/* User Actions - Desktop */}
          <div className="hidden lg:flex lg:items-center lg:space-x-2">
            {currentUser ? (
              <>
                <ActionButton
                  to="/favorites"
                  icon={FiHeart}
                  tooltip="Favorites"
                  isActive={isActive('/favorites')}
                />
                <ActionButton
                  to="/bookings"
                  icon={FiCalendar}
                  tooltip="My Bookings"
                  isActive={isActive('/bookings')}
                />
                <ActionButton
                  to="/profile"
                  icon={FiUser}
                  tooltip="Profile"
                  isActive={isActive('/profile')}
                />
                {currentUser.role === 'admin' && (
                  <ActionButton
                    to="/admin"
                    icon={FiSettings}
                    tooltip="Admin Dashboard"
                    isActive={isActive('/admin')}
                  />
                )}
                <ActionButton
                  icon={FiLogOut}
                  tooltip="Logout"
                  onClick={handleLogout}
                  disabled={operationLoading.logout}
                />
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="inline-flex items-center px-4 py-2 rounded-md text-sm font-medium text-secondary-600 hover:bg-secondary-50 hover:text-secondary-900"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="inline-flex items-center px-4 py-2 rounded-md text-sm font-medium text-white bg-primary-600 hover:bg-primary-700"
                >
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center lg:hidden">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-secondary-600 hover:text-secondary-900 hover:bg-secondary-50 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
            >
              {isOpen ? <FiX className="h-6 w-6" /> : <FiMenu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`${isOpen ? 'block' : 'hidden'} lg:hidden bg-white border-t`}>
        <div className="px-4 pt-2 pb-3 space-y-1">
          {/* Mobile Search */}
          <div className="py-2">
            <form onSubmit={handleSearch} className="w-full">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  placeholder="Search cars..."
                  className="w-full pl-10 pr-16 py-2 text-sm border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-400" />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 px-3 py-1 text-sm bg-primary-50 text-primary-600 rounded hover:bg-primary-100"
                >
                  Search
                </button>
              </div>
            </form>
          </div>

          {/* Mobile Navigation Links */}
          <Link
            to="/"
            className={`block px-3 py-2 rounded-md text-base font-medium ${
              isActive('/')
                ? 'bg-primary-50 text-primary-700'
                : 'text-secondary-600 hover:bg-secondary-50 hover:text-secondary-900'
            }`}
          >
            <FiHome className="inline mr-2" />
            Home
          </Link>
          
          <Link
            to="/cars"
            className={`block px-3 py-2 rounded-md text-base font-medium ${
              isActive('/cars')
                ? 'bg-primary-50 text-primary-700'
                : 'text-secondary-600 hover:bg-secondary-50 hover:text-secondary-900'
            }`}
          >
            <FiTruck className="inline mr-2" />
            Cars
          </Link>
          
          <Link
            to="/about"
            className={`block px-3 py-2 rounded-md text-base font-medium ${
              isActive('/about')
                ? 'bg-primary-50 text-primary-700'
                : 'text-secondary-600 hover:bg-secondary-50 hover:text-secondary-900'
            }`}
          >
            <FiInfo className="inline mr-2" />
            About
          </Link>

          <Link
            to="/contact"
            className={`block px-3 py-2 rounded-md text-base font-medium ${
              isActive('/contact')
                ? 'bg-primary-50 text-primary-700'
                : 'text-secondary-600 hover:bg-secondary-50 hover:text-secondary-900'
            }`}
          >
            <FiMessageSquare className="inline mr-2" />
            Contact
          </Link>

          {currentUser && (
            <>
              <Link
                to="/favorites"
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  isActive('/favorites')
                    ? 'bg-primary-50 text-primary-700'
                    : 'text-secondary-600 hover:bg-secondary-50 hover:text-secondary-900'
                }`}
              >
                <FiHeart className="inline mr-2" />
                Favorites
                {favoritesCount > 0 && (
                  <span className="ml-2 px-2 py-0.5 text-xs font-semibold rounded-full bg-primary-100 text-primary-800">
                    {favoritesCount}
                  </span>
                )}
              </Link>
              
              <Link
                to="/bookings"
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  isActive('/bookings')
                    ? 'bg-primary-50 text-primary-700'
                    : 'text-secondary-600 hover:bg-secondary-50 hover:text-secondary-900'
                }`}
              >
                <FiCalendar className="inline mr-2" />
                My Bookings
              </Link>

              {currentUser.role === 'admin' && (
                <Link
                  to="/admin"
                  className={`block px-3 py-2 rounded-md text-base font-medium ${
                    isActive('/admin')
                      ? 'bg-primary-50 text-primary-700'
                      : 'text-secondary-600 hover:bg-secondary-50 hover:text-secondary-900'
                  }`}
                >
                  <FiSettings className="inline mr-2" />
                  Admin
                </Link>
              )}

              <Link
                to="/profile"
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  isActive('/profile')
                    ? 'bg-primary-50 text-primary-700'
                    : 'text-secondary-600 hover:bg-secondary-50 hover:text-secondary-900'
                }`}
              >
                <FiUser className="inline mr-2" />
                Profile
              </Link>

              <button
                onClick={handleLogout}
                disabled={operationLoading.logout}
                className="block w-full text-left px-4 py-2 text-base font-medium text-secondary-600 hover:bg-secondary-50 hover:text-secondary-900 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FiLogOut className="inline mr-2" />
                Logout
              </button>
            </>
          )}

          {!currentUser && (
            <>
              <Link
                to="/login"
                className="block px-4 py-2 text-base font-medium text-secondary-600 hover:bg-secondary-50 hover:text-secondary-900"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="block px-4 py-2 text-base font-medium text-white bg-primary-600 hover:bg-primary-700"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;