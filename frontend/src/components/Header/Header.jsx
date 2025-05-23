// src/components/Header/Header.jsx
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { FiMusic } from 'react-icons/fi';
import { FaUser, FaSignOutAlt, FaChevronDown, FaChevronUp } from 'react-icons/fa';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const { currentUser, logout } = useContext(AuthContext);

  // Debugging: Log the currentUser to verify authentication status
  console.log('Current User:', currentUser);

  return (
    <header className="bg-indigo-100 text-white shadow-md">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          {/* Logo/Brand */}
          <Link to="/" className="flex items-center space-x-2">
            <FiMusic className="text-2xl" />
            <span className="text-xl font-bold">MusicApp</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/discover" className="hover:text-indigo-200 transition">
              Discover
            </Link>
            <Link to="/library" className="hover:text-indigo-200 transition">
              My Library
            </Link>
            <Link to="/playlists" className="hover:text-indigo-200 transition">
              Playlists
            </Link>

            {/* User Dropdown - Only show if currentUser exists */}
            {currentUser ? (
              <div className="relative">
                <button onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)} className="bg-indigo-600 flex items-center space-x-2 hover:bg-indigo-200 transition">
                  <div className="w-8 h-8 rounded-full bg-indigo-700 flex items-center justify-center">
                    <FaUser className="text-sm" />
                  </div>
                  <span>{currentUser.username || currentUser.email}</span>
                  {isUserDropdownOpen ? <FaChevronUp size={12} /> : <FaChevronDown size={12} />}
                </button>

                {isUserDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 z-50">
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-gray-800 hover:bg-indigo-50 transition"
                      onClick={() => setIsUserDropdownOpen(false)}
                    >
                      <div className="flex items-center space-x-2">
                        <FaUser size={14} />
                        <span>Profile</span>
                      </div>
                    </Link>
                    <button
                      onClick={() => {
                        logout();
                        setIsUserDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-gray-800 hover:bg-indigo-50 transition flex items-center space-x-2"
                    >
                      <FaSignOutAlt size={14} />
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              // Sign In button - Only show if currentUser doesn't exist
              <Link
                to="/login"
                className=" text-indigo-900 px-4 py-2 rounded-md hover:bg-indigo-100 transition font-medium"
              >
                Sign In
              </Link>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-2xl focus:outline-none"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? '×' : '☰'}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <nav className="md:hidden mt-4 pb-4 space-y-3">
            <Link
              to="/discover"
              className="block py-2 hover:bg-indigo-800 px-2 rounded transition"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Discover
            </Link>
            <Link
              to="/library"
              className="block py-2 hover:bg-indigo-800 px-2 rounded transition"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              My Library
            </Link>
            <Link
              to="/playlists"
              className="block py-2 hover:bg-indigo-800 px-2 rounded transition"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Playlists
            </Link>

            {currentUser ? (
              <>
                <Link
                  to="/profile"
                  className="block py-2 hover:bg-indigo-800 px-2 rounded transition flex items-center space-x-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <FaUser size={14} />
                  <span>Profile</span>
                </Link>
                <button
                  onClick={() => {
                    logout();
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full text-left py-2 hover:bg-indigo-800 px-2 rounded transition flex items-center space-x-2"
                >
                  <FaSignOutAlt size={14} />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="block text-indigo-900 px-4 py-2 rounded-md text-center font-medium mt-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Sign In
              </Link>
            )}
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;