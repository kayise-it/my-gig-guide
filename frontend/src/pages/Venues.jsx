import React, { useState, useEffect } from 'react';
import { MagnifyingGlassIcon, FunnelIcon, MapPinIcon, StarIcon, UsersIcon, CalendarIcon, BuildingOfficeIcon, TableCellsIcon, Squares2X2Icon } from '@heroicons/react/24/outline';
import { venueService } from '../api/venueService';
import VenueCard from '../components/Venue/VenueCard';
import HeroSection from '../components/UI/HeroSection';

export default function Venues() {
  const [venues, setVenues] = useState([]);
  const [filteredVenues, setFilteredVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState('cards'); // 'cards' or 'table'
  const [venuesPerPage] = useState(20);

  // Popular South African cities for location filter
  const popularLocations = [
    'Johannesburg', 'Cape Town', 'Durban', 'Pretoria', 'Sandton', 
    'Rosebank', 'Soweto', 'Centurion', 'Stellenbosch', 'Port Elizabeth'
  ];

  // Fetch venues from database
  useEffect(() => {
    const fetchVenues = async () => {
      try {
        setLoading(true);
        const response = await venueService.getVenues({ limit: 1000 });
        if (response.venues) {
          // Enhance venue data with calculated fields
          const enhancedVenues = response.venues.map(venue => ({
            ...venue,
            // Add events count (placeholder for now - could be fetched separately)
            events_count: Math.floor(Math.random() * 10) + 1, // Random for demo
            // Add rating (placeholder for now - could be fetched from ratings API)
            rating: (() => {
              if (venue.rating) {
                const rating = parseFloat(venue.rating);
                return isNaN(rating) ? parseFloat((Math.random() * 2 + 3).toFixed(1)) : rating;
              }
              return parseFloat((Math.random() * 2 + 3).toFixed(1));
            })(), // Random 3-5 rating for demo
            // Add featured status based on criteria
            featured: venue.main_picture && venue.capacity >= 50 && 
                     (venue.location?.toLowerCase().includes('johannesburg') ||
                      venue.location?.toLowerCase().includes('sandton') ||
                      venue.location?.toLowerCase().includes('rosebank') ||
                      venue.location?.toLowerCase().includes('fourways'))
          }));
          
          setVenues(enhancedVenues);
          setFilteredVenues(enhancedVenues);
        }
      } catch (error) {
        console.error('Error fetching venues:', error);
        setVenues([]);
        setFilteredVenues([]);
      } finally {
        setLoading(false);
      }
    };

    fetchVenues();
  }, []);

  // Filter venues based on search, filter, and location
  useEffect(() => {
    let filtered = venues;

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(venue => 
        venue.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        venue.location?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        venue.category?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply category filter
    if (activeFilter !== 'all') {
      if (activeFilter === 'featured') {
        // Featured venues: those with main pictures, good capacity, and in popular areas
        filtered = filtered.filter(venue => {
          const hasPicture = venue.main_picture;
          const goodCapacity = venue.capacity && venue.capacity >= 50;
          const popularLocation = venue.location && (
            venue.location.toLowerCase().includes('johannesburg') ||
            venue.location.toLowerCase().includes('sandton') ||
            venue.location.toLowerCase().includes('rosebank') ||
            venue.location.toLowerCase().includes('fourways')
          );
          return hasPicture && goodCapacity && popularLocation;
        });
      } else if (activeFilter === 'unclaimed') {
        filtered = filtered.filter(venue => 
          venue.owner && venue.owner.type === 'unclaimed'
        );
      } else if (activeFilter === 'johannesburg') {
        filtered = filtered.filter(venue => 
          venue.location?.toLowerCase().includes('johannesburg')
        );
      }
    }

    // Apply location filter
    if (selectedLocation) {
      filtered = filtered.filter(venue => 
        venue.location?.toLowerCase().includes(selectedLocation.toLowerCase())
      );
    }

    setFilteredVenues(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  }, [venues, searchQuery, activeFilter, selectedLocation]);

  // Calculate pagination
  const indexOfLastVenue = currentPage * venuesPerPage;
  const indexOfFirstVenue = indexOfLastVenue - venuesPerPage;
  const currentVenues = filteredVenues.slice(indexOfFirstVenue, indexOfLastVenue);
  const totalPages = Math.ceil(filteredVenues.length / venuesPerPage);

  // Debug logging
  console.log('Pagination Debug:', {
    totalVenues: filteredVenues.length,
    venuesPerPage,
    totalPages,
    currentPage,
    indexOfFirstVenue,
    indexOfLastVenue,
    currentVenuesLength: currentVenues.length
  });

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
  };

  const handleLocationChange = (location) => {
    setSelectedLocation(location === selectedLocation ? '' : location);
  };

  const clearFilters = () => {
    setSearchQuery('');
    setActiveFilter('all');
    setSelectedLocation('');
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    // Removed scroll to top - user stays in current view
  };

  const toggleViewMode = () => {
    setViewMode(viewMode === 'cards' ? 'table' : 'cards');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-purple-50 to-blue-50">
      {/* Hero Section */}
      <HeroSection
        title="Discover Amazing"
        subtitle="Venues"
        description="Find the perfect venue for your next event, concert, or performance"
      />

      <div className="container mx-auto px-4 py-8">
        {/* Search and Filters Section */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Search Bar */}
            <div className="flex-1 relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search venues, locations, categories..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            {/* Filter Buttons */}
            <div className="flex flex-wrap gap-3">
              {[
                { id: 'all', name: 'All Venues', icon: BuildingOfficeIcon },
                { id: 'featured', name: 'Featured', icon: StarIcon },
                { id: 'unclaimed', name: 'Available', icon: StarIcon },
                { id: 'johannesburg', name: 'Johannesburg', icon: MapPinIcon }
              ].map(filter => (
                <button
                  key={filter.id}
                  onClick={() => handleFilterChange(filter.id)}
                  className={`flex items-center gap-2 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                    activeFilter === filter.id
                      ? 'bg-purple-600 text-white shadow-lg shadow-purple-200'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <filter.icon className="h-4 w-4" />
                  {filter.name}
                </button>
              ))}
            </div>
          </div>
          
          {/* Location Pills */}
          <div className="mt-6">
            <div className="flex items-center gap-2 mb-3">
              <MapPinIcon className="h-4 w-4 text-purple-500" />
              <span className="text-sm font-medium text-gray-700">Popular Locations:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {popularLocations.map(location => (
                <button
                  key={location}
                  onClick={() => handleLocationChange(location)}
                  className={`px-3 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                    selectedLocation === location
                      ? 'bg-purple-100 text-purple-700 border-2 border-purple-300'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {location}
                </button>
              ))}
            </div>
          </div>
          
          {/* Clear Filters */}
          {(searchQuery || activeFilter !== 'all' || selectedLocation) && (
            <div className="mt-4 pt-4 border-t border-gray-100">
              <button
                onClick={clearFilters}
                className="text-purple-600 hover:text-purple-700 text-sm font-medium flex items-center gap-2"
              >
                <FunnelIcon className="h-4 w-4" />
                Clear all filters
              </button>
            </div>
          )}
        </div>
        
        {/* Results Header and View Toggle */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {activeFilter === 'all' ? 'All Venues' : 
               activeFilter === 'featured' ? 'Featured Venues' : 
               activeFilter === 'unclaimed' ? 'Available Venues' : 'Johannesburg Venues'}
            </h2>
            <p className="text-sm text-gray-600">
              {filteredVenues.length} venue{filteredVenues.length !== 1 ? 's' : ''} found • Page {currentPage} of {totalPages}
            </p>
          </div>
          
          {/* View Mode Toggle */}
          <div className="flex items-center gap-2 bg-white rounded-lg p-1 shadow-sm">
            <button
              onClick={() => setViewMode('cards')}
              className={`p-2 rounded-md transition-colors ${
                viewMode === 'cards' 
                  ? 'bg-purple-100 text-purple-600' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              title="Card View"
            >
              <Squares2X2Icon className="h-5 w-5" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-2 rounded-md transition-colors ${
                viewMode === 'table' 
                  ? 'bg-purple-100 text-purple-600' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              title="Table View"
            >
              <TableCellsIcon className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Top Pagination */}
        {filteredVenues.length > venuesPerPage && (
          <div className="mb-6 bg-white rounded-xl shadow-sm p-4 border border-gray-100">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="text-sm text-gray-600 font-medium">
                Showing {indexOfFirstVenue + 1} to {Math.min(indexOfLastVenue, filteredVenues.length)} of {filteredVenues.length} venues
              </div>
              <nav className="flex items-center space-x-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    currentPage === 1
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200 hover:border-purple-300'
                  }`}
                >
                  ← Previous
                </button>

                <div className="flex items-center space-x-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(pageNumber => {
                    if (
                      pageNumber === 1 ||
                      pageNumber === totalPages ||
                      (pageNumber >= currentPage - 2 && pageNumber <= currentPage + 2)
                    ) {
                      return (
                        <button
                          key={pageNumber}
                          onClick={() => handlePageChange(pageNumber)}
                          className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                            pageNumber === currentPage
                              ? 'bg-purple-600 text-white shadow-lg shadow-purple-200'
                              : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200 hover:border-purple-300'
                          }`}
                        >
                          {pageNumber}
                        </button>
                      );
                    } else if (
                      pageNumber === currentPage - 3 ||
                      pageNumber === currentPage + 3
                    ) {
                      return (
                        <span key={pageNumber} className="px-2 py-2 text-gray-500">
                          ...
                        </span>
                      );
                    }
                    return null;
                  })}
                </div>

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    currentPage === totalPages
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200 hover:border-purple-300'
                  }`}
                >
                  Next →
                </button>
              </nav>
            </div>
          </div>
        )}
                
        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading venues...</p>
          </div>
        )}

        {/* Venues Display */}
        {!loading && currentVenues.length > 0 && (
          <>
            {/* Cards View */}
            {viewMode === 'cards' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {currentVenues.map(venue => (
                  <VenueCard 
                    key={venue.id} 
                    venue={venue} 
                    who="public"
                  />
                ))}
              </div>
            )}

            {/* Table View */}
            {viewMode === 'table' && (
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Venue</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Capacity</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rating</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Owner</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {currentVenues.map(venue => (
                        <tr key={venue.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              {venue.main_picture && (
                                <img 
                                  className="h-10 w-10 rounded-lg object-cover mr-3" 
                                  src={venue.main_picture} 
                                  alt={venue.name}
                                />
                              )}
                              <div>
                                <div className="text-sm font-medium text-gray-900">{venue.name}</div>
                                {venue.category && (
                                  <div className="text-sm text-gray-500">{venue.category}</div>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {venue.location}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {venue.capacity} people
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <StarIcon className="h-4 w-4 text-yellow-500 mr-1" />
                              <span className="text-sm text-gray-900">
                                {(() => {
                                  const rating = parseFloat(venue.rating);
                                  return isNaN(rating) ? venue.rating : rating.toFixed(1);
                                })()}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {venue.owner && venue.owner.type === 'unclaimed' ? (
                              <span className="text-blue-600 font-medium">Available</span>
                            ) : venue.owner ? (
                              <span>{venue.owner.name}</span>
                            ) : (
                              <span className="text-gray-500">-</span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {venue.contact_email ? (
                              <a href={`mailto:${venue.contact_email}`} className="text-purple-600 hover:text-purple-800">
                                {venue.contact_email}
                              </a>
                            ) : venue.phone_number ? (
                              <a href={`tel:${venue.phone_number}`} className="text-purple-600 hover:text-purple-800">
                                {venue.phone_number}
                              </a>
                            ) : (
                              <span className="text-gray-500">-</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Bottom Pagination */}
            {filteredVenues.length > venuesPerPage && (
              <div className="mt-8 bg-white rounded-xl shadow-sm p-4 border border-gray-100">
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                  <div className="text-sm text-gray-600 font-medium">
                    Showing {indexOfFirstVenue + 1} to {Math.min(indexOfLastVenue, filteredVenues.length)} of {filteredVenues.length} venues
                  </div>
                  <nav className="flex items-center space-x-2">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                        currentPage === 1
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200 hover:border-purple-300'
                      }`}
                    >
                      ← Previous
                    </button>

                    <div className="flex items-center space-x-1">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map(pageNumber => {
                        if (
                          pageNumber === 1 ||
                          pageNumber === totalPages ||
                          (pageNumber >= currentPage - 2 && pageNumber <= currentPage + 2)
                        ) {
                          return (
                            <button
                              key={pageNumber}
                              onClick={() => handlePageChange(pageNumber)}
                              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                                pageNumber === currentPage
                                  ? 'bg-purple-600 text-white shadow-lg shadow-purple-200'
                                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200 hover:border-purple-300'
                              }`}
                            >
                              {pageNumber}
                            </button>
                          );
                        } else if (
                          pageNumber === currentPage - 3 ||
                          pageNumber === currentPage + 3
                        ) {
                          return (
                            <span key={pageNumber} className="px-2 py-2 text-gray-500">
                              ...
                            </span>
                          );
                        }
                        return null;
                      })}
                    </div>

                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                        currentPage === totalPages
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200 hover:border-purple-300'
                      }`}
                    >
                      Next →
                    </button>
                  </nav>
                </div>
              </div>
            )}
          </>
        )}
        
        {/* Empty State */}
        {!loading && filteredVenues.length === 0 && (
          <div className="text-center py-16 bg-white rounded-2xl shadow-lg">
            <div className="text-6xl mb-4">🎭</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No venues found</h3>
            <p className="text-gray-500 mb-6">
              {venues.length === 0 
                ? "We're working on adding more venues to our platform."
                : "Try adjusting your search or filters to find what you're looking for."
              }
            </p>
            {venues.length === 0 ? (
              <button
                onClick={() => window.location.reload()}
                className="bg-purple-600 hover:bg-purple-700 text-white font-medium px-6 py-3 rounded-xl transition-colors"
              >
                Refresh Page
              </button>
            ) : (
              <button
                onClick={clearFilters}
                className="bg-purple-600 hover:bg-purple-700 text-white font-medium px-6 py-3 rounded-xl transition-colors"
              >
                Clear Filters
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}