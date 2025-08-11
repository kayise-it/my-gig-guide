// frontend/src/components/Venue/VenueSelector.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { 
  MagnifyingGlassIcon, 
  MapPinIcon, 
  CheckIcon, 
  UsersIcon,
  XMarkIcon,
  ChevronDownIcon,
  AdjustmentsHorizontalIcon,
  UserIcon,
  BuildingOffice2Icon,
  StarIcon
} from '@heroicons/react/24/outline';
import { venueService } from '../../api/venueService';
import { useAuth } from '../../context/AuthContext';

const VenueSelector = ({ 
  selectedVenueId, 
  onVenueSelect, 
  userRole = 'all', // 'organiser', 'artist', or 'all'  
  organiserId = null,
  artistId = null,
  onVenueOwnerNotify = null // Callback for when a non-owned venue is selected
}) => {
  const { currentUser } = useAuth();
  const [venues, setVenues] = useState([]);
  const [filteredVenues, setFilteredVenues] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [capacityRange, setCapacityRange] = useState({ min: '', max: '' });
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedVenue, setSelectedVenue] = useState(null);

  // Popular South African cities for location filter
  const popularLocations = [
    'Johannesburg', 'Cape Town', 'Durban', 'Pretoria', 'Sandton', 
    'Rosebank', 'Soweto', 'Centurion', 'Stellenbosch', 'Port Elizabeth'
  ];

  // Debounced search function
  const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  };

  const fetchVenues = useCallback(async (searchParams = {}) => {
    setLoading(true);
    try {
      // Always fetch all venues with smart ordering
      const params = {
        page: currentPage,
        limit: 20,
        ...searchParams
      };
      
      // Prepare user information for smart ordering
      const userInfo = {
        role: userRole,
        id: userRole === 'organiser' ? organiserId : userRole === 'artist' ? artistId : null
      };
      
      const data = await venueService.getVenues(params, userInfo);
      setVenues(data.venues || []);
      setFilteredVenues(data.venues || []);
      setPagination(data.pagination);
    } catch (error) {
      console.error('Error fetching venues:', error);
      setVenues([]);
      setFilteredVenues([]);
    } finally {
      setLoading(false);
    }
  }, [userRole, organiserId, artistId, currentPage]);

  // Debounced search
  const debouncedSearch = useCallback(
    debounce((searchParams) => {
      fetchVenues(searchParams);
    }, 300),
    [fetchVenues]
  );

  // Initial load
  useEffect(() => {
    fetchVenues();
  }, [fetchVenues]);

  // Handle search and filter changes
  useEffect(() => {
    const searchParams = {};
    
    if (searchTerm) searchParams.search = searchTerm;
    if (selectedLocation) searchParams.location = selectedLocation;
    if (capacityRange.min) searchParams.capacity_min = capacityRange.min;
    if (capacityRange.max) searchParams.capacity_max = capacityRange.max;
    
    debouncedSearch(searchParams);
  }, [searchTerm, selectedLocation, capacityRange, debouncedSearch]);

  // Find selected venue
  useEffect(() => {
    if (selectedVenueId) {
      const venue = venues.find(v => v.id === selectedVenueId);
      setSelectedVenue(venue);
    }
  }, [selectedVenueId, venues]);

  const handleVenueSelect = (venue) => {
    setSelectedVenue(venue);
    onVenueSelect(venue);
    
    // If selecting someone else's venue, trigger notification callback
    if (!venue.isOwnVenue && venue.owner && onVenueOwnerNotify) {
      onVenueOwnerNotify({
        venue: venue,
        owner: venue.owner,
        requester: {
          type: userRole,
          id: userRole === 'organiser' ? organiserId : artistId,
          name: currentUser?.username
        }
      });
    }
    
    setIsOpen(false);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedLocation('');
    setCapacityRange({ min: '', max: '' });
    setCurrentPage(1);
  };

  const handleLocationSelect = (location) => {
    setSelectedLocation(location);
    setShowFilters(false);
  };

  return (
    <div className="relative">
      {/* Selected Venue Display */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className={`
          relative w-full bg-white border-2 rounded-xl p-4 cursor-pointer transition-all duration-200
          ${isOpen ? 'border-purple-500 ring-2 ring-purple-200' : 'border-gray-200 hover:border-gray-300'}
        `}
      >
        {selectedVenue ? (
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-purple-100 p-2 rounded-lg">
                <MapPinIcon className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">{selectedVenue.name}</h3>
                <p className="text-sm text-gray-600">{selectedVenue.location}</p>
                {selectedVenue.capacity && (
                  <p className="text-xs text-gray-500">Capacity: {selectedVenue.capacity}</p>
                )}
              </div>
            </div>
            <ChevronDownIcon className={`h-5 w-5 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-gray-100 p-2 rounded-lg">
                <MapPinIcon className="h-5 w-5 text-gray-400" />
              </div>
              <span className="text-gray-500">Select a venue...</span>
            </div>
            <ChevronDownIcon className={`h-5 w-5 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
          </div>
        )}
      </div>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg z-50 max-h-96 overflow-hidden">
          {/* Search and Filters */}
          <div className="p-4 border-b border-gray-100">
            {/* Search Bar */}
            <div className="relative mb-3">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search venues by name or location..."
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            {/* Filters Toggle */}
            <div className="flex items-center justify-between">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center space-x-2 text-sm text-purple-600 hover:text-purple-700"
              >
                <AdjustmentsHorizontalIcon className="h-4 w-4" />
                <span>Filters</span>
              </button>
              
              {(searchTerm || selectedLocation || capacityRange.min || capacityRange.max) && (
                <button
                  onClick={clearFilters}
                  className="flex items-center space-x-1 text-sm text-gray-500 hover:text-gray-700"
                >
                  <XMarkIcon className="h-4 w-4" />
                  <span>Clear</span>
                </button>
              )}
            </div>

            {/* Filter Options */}
            {showFilters && (
              <div className="mt-3 space-y-3 pt-3 border-t border-gray-100">
                {/* Location Filter */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Location</label>
                  <div className="grid grid-cols-2 gap-1">
                    {popularLocations.slice(0, 6).map(location => (
                      <button
                        key={location}
                        onClick={() => handleLocationSelect(location)}
                        className={`px-2 py-1 text-xs rounded transition-colors ${
                          selectedLocation === location
                            ? 'bg-purple-100 text-purple-700'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        {location}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Capacity Filter */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Capacity Range</label>
                  <div className="flex space-x-2">
                    <input
                      type="number"
                      value={capacityRange.min}
                      onChange={(e) => setCapacityRange(prev => ({ ...prev, min: e.target.value }))}
                      placeholder="Min"
                      className="flex-1 px-2 py-1 text-sm border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-purple-500"
                    />
                    <input
                      type="number"
                      value={capacityRange.max}
                      onChange={(e) => setCapacityRange(prev => ({ ...prev, max: e.target.value }))}
                      placeholder="Max"
                      className="flex-1 px-2 py-1 text-sm border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-purple-500"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Venue List */}
          <div className="max-h-64 overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-600"></div>
                <span className="ml-2 text-sm text-gray-600">Loading venues...</span>
              </div>
            ) : filteredVenues.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <MapPinIcon className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                <p className="text-sm">No venues found</p>
                {userRole === 'all' && (
                  <p className="text-xs text-gray-400 mt-1">Try adjusting your search criteria</p>
                )}
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {filteredVenues.map(venue => (
                  <div
                    key={venue.id}
                    onClick={() => handleVenueSelect(venue)}
                    className={`p-3 cursor-pointer transition-colors hover:bg-gray-50 ${
                      selectedVenueId === venue.id ? 'bg-purple-50' : ''
                    } ${venue.isOwnVenue ? 'border-l-4 border-l-green-400' : ''}`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <h4 className="font-medium text-gray-900">{venue.name}</h4>
                          {venue.isOwnVenue && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                              <StarIcon className="h-3 w-3 mr-1" />
                              Your Venue
                            </span>
                          )}
                          {selectedVenueId === venue.id && (
                            <CheckIcon className="h-4 w-4 text-purple-600" />
                          )}
                        </div>
                        <p className="text-sm text-gray-600 flex items-center mt-1">
                          <MapPinIcon className="h-3 w-3 mr-1" />
                          {venue.location}
                        </p>
                        {venue.capacity && (
                          <p className="text-xs text-gray-500 flex items-center mt-1">
                            <UsersIcon className="h-3 w-3 mr-1" />
                            Capacity: {venue.capacity}
                          </p>
                        )}
                        {venue.owner && !venue.isOwnVenue && (
                          <p className="text-xs text-gray-500 flex items-center mt-1">
                            {venue.owner.type === 'organiser' ? (
                              <BuildingOffice2Icon className="h-3 w-3 mr-1" />
                            ) : (
                              <UserIcon className="h-3 w-3 mr-1" />
                            )}
                            Owned by: {venue.owner.name}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <div className="border-t border-gray-100 p-3 flex items-center justify-between">
              <span className="text-xs text-gray-500">
                Page {pagination.page} of {pagination.totalPages} ({pagination.total} venues)
              </span>
              <div className="flex space-x-1">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="px-2 py-1 text-xs border border-gray-200 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Previous
                </button>
                <button
                  onClick={() => setCurrentPage(Math.min(pagination.totalPages, currentPage + 1))}
                  disabled={currentPage === pagination.totalPages}
                  className="px-2 py-1 text-xs border border-gray-200 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default VenueSelector;
