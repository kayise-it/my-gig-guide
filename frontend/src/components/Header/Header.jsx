// src/components/Header/Header.jsx
import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { 
  MusicalNoteIcon, 
  Bars3Icon, 
  XMarkIcon,
  UserIcon,
  ArrowRightOnRectangleIcon,
  ChevronDownIcon,
  HomeIcon,
  CalendarDaysIcon,
  MicrophoneIcon,
  InformationCircleIcon,
  PhoneIcon
} from '@heroicons/react/24/outline';
import DisplayRoleName from '../../components/DisplayRoleName';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const { currentUser, logout } = useContext(AuthContext);
  const location = useLocation();
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsUserDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  // Check if we're on an admin page
  const isAdminPage = location.pathname.startsWith('/admin');
  
  // Navigation items with icons
  const navigationItems = isAdminPage ? [
    { name: 'Dashboard', href: '/admin', icon: HomeIcon },
    { name: 'Users', href: '/admin/users', icon: UserIcon },
    { name: 'Artists', href: '/admin/artists', icon: MicrophoneIcon },
    { name: 'Organisers', href: '/admin/organisers', icon: InformationCircleIcon },
    { name: 'Venues', href: '/admin/venues', icon: InformationCircleIcon },
    { name: 'Events', href: '/admin/events', icon: CalendarDaysIcon },
  ] : [
    { name: 'Home', href: '/', icon: HomeIcon },
    { name: 'Events', href: '/Events', icon: CalendarDaysIcon },
    { name: 'Artists', href: '/Artists', icon: MicrophoneIcon },
    { name: 'About', href: '/about', icon: InformationCircleIcon },
    { name: 'Venues', href: '/venues', icon: InformationCircleIcon },
    { name: 'Contact', href: '/contact', icon: PhoneIcon },
  ];

  const isActiveLink = (href) => {
    if (href === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(href);
  };

  const getDashboardLink = () => {
    if (currentUser?.artist_id) return '/artists/dashboard';
    if (currentUser?.organiser_id) return '/organiser/dashboard';
    return '/dashboard';
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo/Brand */}
          <Link to={isAdminPage ? "/admin" : "/"} className="flex items-center space-x-3 group">
            <div className={`p-2 rounded-lg transition-all duration-200 ${
              isAdminPage 
                ? 'bg-yellow-400 group-hover:bg-yellow-500' 
                : 'bg-gradient-to-br from-indigo-600 to-purple-600 group-hover:from-indigo-700 group-hover:to-purple-700'
            }`}>
              {isAdminPage ? (
                <svg className="h-6 w-6 text-purple-900" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 2L3 7v11h14V7l-7-5zM8 15V9h4v6H8z" clipRule="evenodd" />
                </svg>
              ) : (
                <MusicalNoteIcon className="h-6 w-6 text-white" />
              )}
            </div>
            <div className="hidden sm:block">
              <span className={`text-xl font-bold ${
                isAdminPage 
                  ? 'text-gray-900' 
                  : 'bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent'
              }`}>
                {isAdminPage ? 'Majesty Portal' : 'Gig Guide'}
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = isActiveLink(item.href);
              
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            
            {/* User Menu */}
            {(currentUser || isAdminPage) ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                  className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      isAdminPage 
                        ? 'bg-gradient-to-br from-yellow-400 to-yellow-500' 
                        : 'bg-gradient-to-br from-indigo-500 to-purple-600'
                    }`}>
                      <UserIcon className={`h-4 w-4 ${isAdminPage ? 'text-purple-900' : 'text-white'}`} />
                    </div>
                    <div className="hidden md:block text-left">
                      <p className="text-sm font-medium text-gray-900">
                        {isAdminPage ? (localStorage.getItem('majesty') ? JSON.parse(localStorage.getItem('majesty')).full_name || JSON.parse(localStorage.getItem('majesty')).username : 'Admin') : (currentUser.name || currentUser.username)}
                      </p>
                      <p className="text-xs text-gray-500">
                        {isAdminPage ? 'Owner' : <DisplayRoleName role={currentUser.role} />}
                      </p>
                    </div>
                  </div>
                  <ChevronDownIcon 
                    className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${
                      isUserDropdownOpen ? 'transform rotate-180' : ''
                    }`} 
                  />
                </button>

                {/* Dropdown Menu */}
                {isUserDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900">
                        {isAdminPage ? (localStorage.getItem('majesty') ? JSON.parse(localStorage.getItem('majesty')).full_name || JSON.parse(localStorage.getItem('majesty')).username : 'Admin') : (currentUser.name || currentUser.username)}
                      </p>
                      <p className="text-xs text-gray-500">
                        {isAdminPage ? 'Owner' : currentUser.email}
                      </p>
                    </div>
                    
                    <div className="py-2">
                      {isAdminPage ? (
                        <Link
                          to="/admin"
                          className="flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                          onClick={() => setIsUserDropdownOpen(false)}
                        >
                          <UserIcon className="h-4 w-4 text-gray-400" />
                          <span>Admin Dashboard</span>
                        </Link>
                      ) : (
                        <Link
                          to={getDashboardLink()}
                          className="flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                          onClick={() => setIsUserDropdownOpen(false)}
                        >
                          <UserIcon className="h-4 w-4 text-gray-400" />
                          <span>Dashboard</span>
                        </Link>
                      )}
                      
                      <button
                        onClick={() => {
                          if (isAdminPage) {
                            localStorage.removeItem('majesty_token');
                            localStorage.removeItem('majesty');
                            window.location.href = '/majesty-login';
                          } else {
                            logout();
                          }
                          setIsUserDropdownOpen(false);
                        }}
                        className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200"
                      >
                        <ArrowRightOnRectangleIcon className="h-4 w-4" />
                        <span>Sign out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              // Sign In/Sign Up buttons
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium transition-colors duration-200"
                >
                  Sign in
                </Link>
                <Link
                  to="/signup"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 shadow-sm"
                >
                  Get started
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <XMarkIcon className="h-6 w-6" />
              ) : (
                <Bars3Icon className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-gray-200 py-4">
            <nav className="space-y-2">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                const isActive = isActiveLink(item.href);
                
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`flex items-center space-x-3 px-3 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
              
              {/* Mobile User Menu */}
              {(currentUser || isAdminPage) ? (
                <div className="pt-4 border-t border-gray-200 mt-4 space-y-2">
                  <Link
                    to={isAdminPage ? "/admin" : getDashboardLink()}
                    className="flex items-center space-x-3 px-3 py-3 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors duration-200"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <UserIcon className="h-5 w-5" />
                    <span>{isAdminPage ? 'Admin Dashboard' : 'Dashboard'}</span>
                  </Link>
                  <button
                    onClick={() => {
                      if (isAdminPage) {
                        localStorage.removeItem('majesty_token');
                        localStorage.removeItem('majesty');
                        window.location.href = '/majesty-login';
                      } else {
                        logout();
                      }
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full flex items-center space-x-3 px-3 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                  >
                    <ArrowRightOnRectangleIcon className="h-5 w-5" />
                    <span>Sign out</span>
                  </button>
                </div>
              ) : (
                <div className="pt-4 border-t border-gray-200 mt-4 space-y-3">
                  <Link
                    to="/login"
                    className="block text-center text-gray-600 hover:text-gray-900 px-3 py-3 font-medium transition-colors duration-200"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Sign in
                  </Link>
                  <Link
                    to="/signup"
                    className="block text-center bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-3 rounded-lg font-medium transition-colors duration-200"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Get started
                  </Link>
                </div>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;