import React, { useState, useEffect } from 'react';
import { MagnifyingGlassIcon, XMarkIcon, UserIcon } from '@heroicons/react/24/outline';
import axios from 'axios';
import API_BASE_URL from '../../api/config';

const ArtistSelector = ({ 
  selectedArtists = [], 
  onArtistsChange, 
  label = "Select Artists",
  placeholder = "Search for artists...",
  className = ""
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  // Search for artists
  const searchArtists = async (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/api/artists/search?q=${encodeURIComponent(query)}`);
      setSearchResults(response.data.filter(artist => 
        !selectedArtists.some(selected => selected.id === artist.id)
      ));
    } catch (error) {
      console.error('Error searching artists:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  // Handle search input changes
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    
    if (value.trim()) {
      searchArtists(value);
      setShowDropdown(true);
    } else {
      setSearchResults([]);
      setShowDropdown(false);
    }
  };

  // Select an artist
  const selectArtist = (artist) => {
    const newSelectedArtists = [...selectedArtists, artist];
    onArtistsChange(newSelectedArtists);
    setSearchTerm('');
    setSearchResults([]);
    setShowDropdown(false);
  };

  // Remove an artist
  const removeArtist = (artistId) => {
    const newSelectedArtists = selectedArtists.filter(artist => artist.id !== artistId);
    onArtistsChange(newSelectedArtists);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.artist-selector')) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={`artist-selector ${className}`}>
      <label className="block text-sm font-semibold text-gray-900 mb-2">
        {label}
      </label>
      
      {/* Selected Artists Display */}
      {selectedArtists.length > 0 && (
        <div className="mb-3 flex flex-wrap gap-2">
          {selectedArtists.map((artist) => (
            <div
              key={artist.id}
              className="inline-flex items-center gap-2 bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium"
            >
              <UserIcon className="h-4 w-4" />
              <span>{artist.stage_name || artist.real_name || artist.username}</span>
              <button
                type="button"
                onClick={() => removeArtist(artist.id)}
                className="text-purple-600 hover:text-purple-800 transition-colors"
              >
                <XMarkIcon className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Search Input */}
      <div className="relative">
        <div className="relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder={placeholder}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
          />
        </div>

        {/* Search Results Dropdown */}
        {showDropdown && (searchResults.length > 0 || isSearching) && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
            {isSearching ? (
              <div className="p-4 text-center text-gray-500">
                Searching...
              </div>
            ) : (
              <div>
                {searchResults.map((artist) => (
                  <button
                    key={artist.id}
                    type="button"
                    onClick={() => selectArtist(artist)}
                    className="w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                        <UserIcon className="h-5 w-5 text-purple-600" />
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">
                          {artist.stage_name || artist.real_name || 'Unknown Artist'}
                        </div>
                        {artist.genre && (
                          <div className="text-sm text-gray-500">{artist.genre}</div>
                        )}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Help Text */}
      <p className="mt-2 text-sm text-gray-600">
        Search and select artists to perform at your event. Artists will be notified of their selection.
      </p>
    </div>
  );
};

export default ArtistSelector;




