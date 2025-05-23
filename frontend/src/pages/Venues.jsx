import React, { useState } from 'react';
import { FaSearch, FaFilter, FaMapMarkerAlt, FaStar, FaRegStar, FaCalendarAlt, FaUsers } from 'react-icons/fa';

export default function Venues() {
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Sample venue data
  const venues = [
    {
      id: 1,
      name: 'The Jazz Lounge',
      location: 'Fourways, Johannesburg',
      rating: 4.5,
      capacity: 150,
      upcomingEvents: 3,
      image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
      featured: true
    },
    {
      id: 2,
      name: 'Rock Arena',
      location: 'Sandton, Johannesburg',
      rating: 4.2,
      capacity: 500,
      upcomingEvents: 5,
      image: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
      featured: false
    },
    {
      id: 3,
      name: 'Acoustic Corner',
      location: 'Rosebank, Johannesburg',
      rating: 4.7,
      capacity: 80,
      upcomingEvents: 2,
      image: 'https://images.unsplash.com/photo-1501612780327-45045538702b?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
      featured: true
    },
    {
      id: 4,
      name: 'Urban Beat Club',
      location: 'Melville, Johannesburg',
      rating: 4.0,
      capacity: 250,
      upcomingEvents: 4,
      image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
      featured: false
    },
    {
      id: 5,
      name: 'Symphony Hall',
      location: 'Pretoria',
      rating: 4.8,
      capacity: 1000,
      upcomingEvents: 7,
      image: 'https://images.unsplash.com/photo-1496293455970-f8581aae0e3b?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
      featured: true
    },
    {
      id: 6,
      name: 'The Underground',
      location: 'Braamfontein, Johannesburg',
      rating: 4.3,
      capacity: 200,
      upcomingEvents: 1,
      image: 'https://images.unsplash.com/photo-1461784180009-06ab8a7f50ce?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
      featured: false
    }
  ];

  // Filter venues based on active filter and search query
  const filteredVenues = venues.filter(venue => {
    const matchesFilter = activeFilter === 'all' || 
                         (activeFilter === 'featured' && venue.featured) ||
                         (activeFilter === 'johannesburg' && venue.location.includes('Johannesburg'));
    
    const matchesSearch = venue.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         venue.location.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-purple-900 text-white p-6">
        <h2 className="text-2xl font-bold mb-8">Venues</h2>
        
        {/* Search */}
        <div className="relative mb-6">
          <input
            type="text"
            placeholder="Search venues..."
            className="w-full bg-purple-800 text-white px-4 py-2 rounded-lg pl-10 focus:outline-none focus:ring-2 focus:ring-purple-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <FaSearch className="absolute left-3 top-3 text-purple-300" />
        </div>
        
        {/* Filters */}
        <div className="mb-8">
          <h3 className="flex items-center text-purple-200 font-medium mb-4">
            <FaFilter className="mr-2" /> Filters
          </h3>
          <ul className="space-y-2">
            {[
              { id: 'all', name: 'All Venues' },
              { id: 'featured', name: 'Featured Venues' },
              { id: 'johannesburg', name: 'Johannesburg Only' }
            ].map(filter => (
              <li key={filter.id}>
                <button
                  onClick={() => setActiveFilter(filter.id)}
                  className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${activeFilter === filter.id ? 'bg-purple-700 text-white' : 'text-purple-200 hover:bg-purple-800'}`}
                >
                  {filter.name}
                </button>
              </li>
            ))}
          </ul>
        </div>
        
        {/* Quick Actions */}
        <div>
          <h3 className="text-purple-200 font-medium mb-4">Quick Actions</h3>
          <button className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-lg mb-3 transition-colors">
            Add New Venue
          </button>
          <button className="w-full border border-purple-500 text-purple-300 hover:bg-purple-800 font-medium py-2 px-4 rounded-lg transition-colors">
            View Bookings
          </button>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            {activeFilter === 'all' ? 'All Venues' : 
             activeFilter === 'featured' ? 'Featured Venues' : 'Johannesburg Venues'}
          </h1>
          <p className="text-gray-600">{filteredVenues.length} venues found</p>
        </div>
        
        {/* Venue Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVenues.map(venue => (
            <div key={venue.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              {/* Venue Image */}
              <div className="relative h-48">
                <img 
                  src={venue.image} 
                  alt={venue.name} 
                  className="w-full h-full object-cover"
                />
                {venue.featured && (
                  <div className="absolute top-3 left-3 bg-purple-600 text-white text-xs font-bold px-2 py-1 rounded">
                    Featured
                  </div>
                )}
              </div>
              
              {/* Venue Info */}
              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-bold text-gray-800">{venue.name}</h3>
                  <div className="flex items-center bg-purple-100 text-purple-800 px-2 py-1 rounded text-sm font-medium">
                    <FaStar className="mr-1" />
                    {venue.rating}
                  </div>
                </div>
                
                <div className="flex items-center text-gray-600 mb-4">
                  <FaMapMarkerAlt className="mr-2 text-purple-500" />
                  <span>{venue.location}</span>
                </div>
                
                <div className="flex justify-between text-sm text-gray-500 mb-4">
                  <div className="flex items-center">
                    <FaUsers className="mr-1" />
                    <span>Capacity: {venue.capacity}</span>
                  </div>
                  <div className="flex items-center">
                    <FaCalendarAlt className="mr-1" />
                    <span>{venue.upcomingEvents} upcoming</span>
                  </div>
                </div>
                
                <div className="flex space-x-3">
                  <button className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-lg transition-colors">
                    View Details
                  </button>
                  <button className="flex-1 border border-purple-600 text-purple-600 hover:bg-purple-50 font-medium py-2 px-4 rounded-lg transition-colors">
                    Book Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Empty State */}
        {filteredVenues.length === 0 && (
          <div className="text-center py-12">
            <div className="text-5xl mb-4">🎭</div>
            <h3 className="text-xl font-medium text-gray-700 mb-2">No venues found</h3>
            <p className="text-gray-500">Try adjusting your search or filters</p>
          </div>
        )}
      </div>
    </div>
  );
}