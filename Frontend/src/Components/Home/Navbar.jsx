import React, { useState } from 'react';
import { Search, Menu, X, User, Home } from 'lucide-react';

/**
 * Modern Navbar Component
 * A clean, responsive navigation bar with logo, search, and user avatar
 * 
 * @param {Object} props - Component props
 * @param {string} props.companyName - Name of the company/brand
 * @param {string} props.logoIcon - Logo icon component from Lucide React
 * @param {string} props.searchPlaceholder - Placeholder text for search input
 * @param {string} props.userAvatarSrc - Source URL for user avatar image
 * @param {string} props.userName - User name for accessibility
 * @param {Function} props.onSearch - Callback function for search input changes
 * @param {Function} props.onLogoClick - Callback function for logo click
 * @param {Function} props.onAvatarClick - Callback function for avatar click
 */
const Navbar = ({
  companyName = "YourBrand",
  logoIcon: LogoIcon = Home,
  searchPlaceholder = "Search...",
  userAvatarSrc = null,
  userName = "",
  onSearch = () => {},
  onLogoClick,
  onAvatarClick = () => {},
  
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Handle search input changes
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    onSearch(value);
  };

  // Handle search form submission
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  // Toggle mobile menu
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo Section - Left */}
          <div className="flex items-center flex-shrink-0">
            <button
              onClick={onLogoClick}
              className="flex items-center space-x-2 text-gray-900 hover:text-blue-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-md p-1"
              aria-label={`${companyName} home`}
            >
              <LogoIcon className="h-8 w-8 text-blue-600" />
              <span className="hidden sm:block text-xl font-bold tracking-tight">
                {companyName}
              </span>
            </button>
          </div>

          {/* Search Bar Section - Center */}
          <div className="hidden md:flex flex-1 justify-center px-6 lg:px-8">
            <div className="w-full max-w-lg">
              <form onSubmit={handleSearchSubmit} className="relative">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" aria-hidden="true" />
                  </div>
                  <input
                    type="search"
                    value={searchQuery}
                    onChange={handleSearchChange}
                    placeholder={searchPlaceholder}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-full leading-5 bg-gray-50 text-gray-900 placeholder-gray-500 focus:outline-none focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 sm:text-sm"
                    aria-label="Search"
                  />
                </div>
              </form>
            </div>
          </div>

          {/* User Avatar Section - Right */}
          <div className="flex items-center space-x-4">
            {/* Mobile search button */}
            <button
              className="md:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
              aria-label="Open search"
              onClick={toggleMobileMenu}
            >
              <Search className="h-6 w-6" />
            </button>

            {/* User Avatar */}
            <button
              onClick={onAvatarClick}
              className="flex items-center space-x-2 p-1 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200"
              aria-label={`${userName} profile`}
            >
              <div className="relative">
                {userAvatarSrc ? (
                  <img
                    src={userAvatarSrc}
                    alt={`${userName} avatar`}
                    className="h-8 w-8 rounded-full object-cover ring-2 ring-gray-200"
                  />
                ) : (
                  <div className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center">
                    <User className="h-5 w-5 text-gray-600" />
                  </div>
                )}
                {/* Online status indicator */}
                <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 bg-green-400 border-2 border-white rounded-full"></div>
              </div>
              <span className="hidden lg:block text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors duration-200">
                {userName}
              </span>
            </button>

            {/* Mobile menu button */}
            
          </div>
        </div>

        {/* Mobile Search Bar */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 pt-4 pb-3">
            <form onSubmit={handleSearchSubmit} className="px-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
                <input
                  type="search"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  placeholder={searchPlaceholder}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-full leading-5 bg-gray-50 text-gray-900 placeholder-gray-500 focus:outline-none focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 sm:text-sm"
                  aria-label="Mobile search"
                />
              </div>
            </form>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
