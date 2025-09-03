import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  CalendarIcon, 
  ClockIcon, 
  PhotoIcon, 
  MapPinIcon, 
  SparklesIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  TicketIcon,
  FireIcon,
  UsersIcon,
  ChevronDownIcon,
  HeartIcon,
  ShareIcon,
  StarIcon,
  PlayIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';
import axios from 'axios';
import API_BASE_URL from '../../api/config';
import EventCard from '../../components/Events/EventCard';
import LiveEventsMap from '../../components/Map/LiveEventsMap';

export default function ViewEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [showPastEvents, setShowPastEvents] = useState(true); // Toggle for past events
  const [favorites, setFavorites] = useState(new Set());
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  // Helper function to fix poster URLs
  const fixPosterUrl = (posterPath) => {
    if (!posterPath || posterPath === 'null' || posterPath === '') return null;
    
    // Remove extra spaces and fix the path
    let cleanPath = posterPath.replace(/\s+/g, '');
    
    // Fix common path issues based on your actual file structure
    cleanPath = cleanPath.replace('/artists/3_Thando_9144/', '/artists/3_Thando_8146/');
    cleanPath = cleanPath.replace('/events/event_poster/', '/events/1_kamal_lamb/event_poster/');
    
    // Ensure path starts with forward slash
    if (!cleanPath.startsWith('/')) {
      cleanPath = '/' + cleanPath;
    }
    
    return cleanPath;
  };

  // Fetch events from database
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_BASE_URL}/api/events`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        // Transform the data to match the expected format
        const transformedEvents = response.data.map(event => ({
          id: event.id,
          name: event.name || event.event_name,
          description: event.description,
          date: event.date || event.event_date,
          time: event.time,
          category: event.category || 'concert', // Default category
          price: event.price || event.ticket_price || 0,
          poster: fixPosterUrl(event.poster), // Fix poster URL
          venue: event.venue || { name: event.venue_name || 'TBD' },
          rating: Math.floor(Math.random() * 2) + 4, // Random rating for demo
          attendees: Math.floor(Math.random() * 500) + 50 // Random attendees for demo
        }));
        
        console.log('Fetched events from database:', transformedEvents);
        console.log('Poster URLs:', transformedEvents.map(e => ({ name: e.name, poster: e.poster, fullUrl: e.poster ? `${API_BASE_URL}${e.poster}` : null })));
        setEvents(transformedEvents);
        setError(null);
      } catch (err) {
        console.error('Error fetching events:', err);
        setError(err.response?.data?.message || 'Failed to fetch events');
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [token]);

  // Helper function to check if event is upcoming (today or later)
  const isUpcoming = (eventDate) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set to start of today
    const eventDateTime = new Date(eventDate);
    eventDateTime.setHours(0, 0, 0, 0); // Set to start of event day
    return eventDateTime >= today;
  };

  // Filter events based on search, category, and date preferences
  const filteredEvents = events.filter(event => {
    const matchesSearch = event.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (event.venue?.name || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || event.category === categoryFilter;
    const matchesDateFilter = showPastEvents || isUpcoming(event.date);
    return matchesSearch && matchesCategory && matchesDateFilter;
  });

  // Sort events
  const sortedEvents = [...filteredEvents].sort((a, b) => {
    switch (sortBy) {
      case 'date':
        return new Date(a.date) - new Date(b.date);
      case 'price':
        return (a.price || 0) - (b.price || 0);
      case 'name':
        return a.name.localeCompare(b.name);
      case 'popularity':
        return (b.attendees || 0) - (a.attendees || 0);
      default:
        return new Date(a.date) - new Date(b.date);
    }
  });

  // Featured events (first 3)
  const featuredEvents = sortedEvents.slice(0, 3);
  const regularEvents = sortedEvents.slice(3);

  // Toggle favorite
  const toggleFavorite = (eventId) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(eventId)) {
      newFavorites.delete(eventId);
    } else {
      newFavorites.add(eventId);
    }
    setFavorites(newFavorites);
  };

  // Share event
  const shareEvent = (event) => {
    if (navigator.share) {
      navigator.share({
        title: event.name,
        text: event.description,
        url: window.location.href
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(`${event.name} - ${window.location.href}`);
    }
  };
  
  // Debug logging
  console.log('Total events:', events.length);
  console.log('Filtered events:', filteredEvents.length);
  console.log('Sorted events:', sortedEvents.length);

  if (loading) return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex justify-center items-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-600 mx-auto mb-4"></div>
        <p className="text-xl text-gray-600">Loading amazing events...</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex justify-center items-center">
      <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-8 rounded-lg max-w-md">
        <h2 className="text-xl font-bold mb-2">Oops! Something went wrong</h2>
        <p>{error}</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      {/* Live Events Map Hero */}
      <div className="relative bg-gradient-to-br from-purple-600 via-blue-600 to-purple-800 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-6xl font-black text-white mb-4 leading-tight">
              Events <span className="bg-gradient-to-r from-yellow-300 to-pink-300 bg-clip-text text-transparent">Near You</span>
            </h1>
            <p className="text-xl text-purple-100 mb-6 max-w-2xl mx-auto">
              Discover live events happening around your current location
            </p>
            
            {/* Search Bar */}
            <div className="relative max-w-xl mx-auto mb-6">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className="text-purple-300 text-lg" />
              </div>
              <input
                type="text"
                placeholder="Search events, venues, or artists..."
                className="block w-full pl-12 pr-4 py-3 text-base border-0 rounded-xl shadow-lg focus:outline-none focus:ring-2 focus:ring-white/20 bg-white/95 backdrop-blur-sm text-gray-800 placeholder-gray-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          {/* Live Events Map */}
          <div className="max-w-6xl mx-auto">
            <LiveEventsMap events={events} />
          </div>
        </div>
      </div>

      {/* Main Content with Enhanced Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex gap-8">
          {/* Enhanced Left Sidebar - Filters */}
          <div className="hidden lg:block w-80 flex-shrink-0">
            <div className="sticky top-8">
              <div className="bg-white/90 backdrop-blur-lg border border-purple-200 rounded-2xl p-6 shadow-lg">
                <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
                  <FunnelIcon className="h-5 w-5 text-purple-600 mr-2" />
                  Find Events
                </h3>

                {/* Sort Options */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Sort By
                  </label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full px-3 py-2 border border-purple-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white/70"
                  >
                    <option value="date">Date (Earliest)</option>
                    <option value="price">Price (Low to High)</option>
                    <option value="name">Name (A-Z)</option>
                    <option value="popularity">Popularity</option>
                  </select>
                </div>

                {/* View Mode Toggle */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    View Mode
                  </label>
                  <div className="flex bg-gray-100 rounded-xl p-1">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                        viewMode === 'grid' 
                          ? 'bg-white text-purple-600 shadow-sm' 
                          : 'text-gray-600 hover:text-gray-800'
                      }`}
                    >
                      Grid
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                        viewMode === 'list' 
                          ? 'bg-white text-purple-600 shadow-sm' 
                          : 'text-gray-600 hover:text-gray-800'
                      }`}
                    >
                      List
                    </button>
                  </div>
                </div>

                {/* Category Filter */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Category
                  </label>
                  <div className="space-y-2">
                    {[
                      { value: 'all', label: 'All Categories', count: sortedEvents.length },
                              { value: 'live_music', label: 'Live Music', count: events.filter(e => e.category === 'live_music' && isUpcoming(e.date)).length },
        { value: 'concert', label: 'Concerts', count: events.filter(e => e.category === 'concert' && isUpcoming(e.date)).length },
        { value: 'festival', label: 'Festivals', count: events.filter(e => e.category === 'festival' && isUpcoming(e.date)).length },
        { value: 'comedy', label: 'Comedy', count: events.filter(e => e.category === 'comedy' && isUpcoming(e.date)).length },
        { value: 'exhibition', label: 'Exhibitions', count: events.filter(e => e.category === 'exhibition' && isUpcoming(e.date)).length },
        { value: 'conference', label: 'Conferences', count: events.filter(e => e.category === 'conference' && isUpcoming(e.date)).length },
        { value: 'theater', label: 'Theater', count: events.filter(e => e.category === 'theater' && isUpcoming(e.date)).length },
        { value: 'sports', label: 'Sports', count: events.filter(e => e.category === 'sports' && isUpcoming(e.date)).length }
                    ].map(category => (
                      <label key={category.value} className="flex items-center justify-between p-3 rounded-lg hover:bg-purple-50 cursor-pointer transition-colors duration-200">
                        <div className="flex items-center">
                          <input
                            type="radio"
                            name="category"
                            value={category.value}
                            checked={categoryFilter === category.value}
                            onChange={(e) => setCategoryFilter(e.target.value)}
                            className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-purple-300"
                          />
                          <span className={`ml-3 text-sm ${categoryFilter === category.value ? 'font-semibold text-purple-700' : 'font-medium text-gray-700'}`}>
                            {category.label}
                          </span>
                        </div>
                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                          {category.count}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Date Filter */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Event Timing
                  </label>
                  <div className="space-y-3">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={showPastEvents}
                        onChange={(e) => setShowPastEvents(e.target.checked)}
                        className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-purple-300 rounded"
                      />
                      <span className="ml-3 text-sm font-medium text-gray-700">
                        Show past events
                      </span>
                    </label>
                    <div className="text-xs text-gray-500 ml-7">
                      {showPastEvents 
                        ? 'Showing all events (past and upcoming)' 
                        : 'Showing only upcoming events'
                      }
                    </div>
                  </div>
                </div>

                {/* Active Filters */}
                {(searchTerm || categoryFilter !== 'all') && (
                  <div className="mb-6">
                    <h4 className="text-sm font-semibold text-gray-700 mb-3">Active Filters</h4>
                    <div className="space-y-2">
                      {searchTerm && (
                        <div className="flex items-center justify-between bg-blue-50 border border-blue-200 px-3 py-2 rounded-lg">
                          <span className="text-sm text-blue-700">Search: "{searchTerm}"</span>
                          <button
                            onClick={() => setSearchTerm('')}
                            className="text-blue-500 hover:text-blue-700"
                          >
                            ×
                          </button>
                        </div>
                      )}
                      {categoryFilter !== 'all' && (
                        <div className="flex items-center justify-between bg-purple-50 border border-purple-200 px-3 py-2 rounded-lg">
                          <span className="text-sm text-purple-700">Category: {categoryFilter}</span>
                          <button
                            onClick={() => setCategoryFilter('all')}
                            className="text-purple-500 hover:text-purple-700"
                          >
                            ×
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Results Summary */}
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span className="font-medium">{sortedEvents.length} events found</span>
                    <span className="text-xs">Updated just now</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 min-w-0">
            {/* Enhanced Mobile Filter Button */}
            <div className="lg:hidden mb-6">
              <div className="flex items-center justify-between bg-white/90 backdrop-blur-lg border border-purple-200 rounded-xl p-4 shadow-sm">
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <input
                      type="text"
                      className="pl-8 pr-3 py-2 border border-purple-200 rounded-lg text-sm placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="Search events..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <MagnifyingGlassIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-purple-400" />
                  </div>
                  <select
                    className="py-2 px-3 border border-purple-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                  >
                    <option value="all">All</option>
                    <option value="concert">Concerts</option>
                    <option value="festival">Festivals</option>
                    <option value="comedy">Comedy</option>
                    <option value="exhibition">Exhibitions</option>
                    <option value="conference">Conferences</option>
                    <option value="theater">Theater</option>
                    <option value="sports">Sports</option>
                  </select>
                </div>
                <span className="text-sm text-gray-600 font-medium">{sortedEvents.length} events</span>
              </div>
            </div>

            {/* Featured Events Section */}
            {featuredEvents.length > 0 && (
              <div className="mb-12">
                <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center">
                  <StarIcon className="h-8 w-8 text-purple-600 mr-3" />
                  Featured Events
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {featuredEvents.map((event) => (
                    <EventCard 
                      key={event.id} 
                      event={event} 
                      navigate={navigate}
                      toggleFavorite={toggleFavorite}
                      shareEvent={shareEvent}
                      favorites={favorites}
                      variant="featured"
                    />
                  ))}
                </div>
              </div>
            )}

            {/* All Events Section */}
            <div>
              <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center">
                <CalendarIcon className="h-8 w-8 text-purple-600 mr-3" />
                All Events ({sortedEvents.length})
              </h2>
              
              {/* Modern Events Grid/List */}
              {sortedEvents.length === 0 ? (
                <div className="text-center py-20">
                  <div className="relative mb-8">
                    <div className="absolute -inset-4 bg-purple-100 rounded-full blur-xl opacity-60"></div>
                    <div className="relative bg-white p-6 rounded-2xl shadow-sm border border-purple-200 mx-auto w-fit">
                      <CalendarIcon className="h-16 w-16 text-purple-400 mx-auto" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">No upcoming events found</h3>
                  <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto">
                    {searchTerm || categoryFilter !== 'all' 
                      ? "Try adjusting your search or filter to discover more events"
                      : "Check back soon for new events, or browse past events in our archive"
                    }
                  </p>
                  <button 
                    onClick={() => {
                      setSearchTerm('');
                      setCategoryFilter('all');
                    }}
                    className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-3 rounded-xl font-medium transition-all duration-300 hover:scale-105 shadow-sm"
                  >
                    Clear Filters
                  </button>
                </div>
              ) : viewMode === 'grid' ? (
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                  {regularEvents.map((event) => (
                    <EventCard 
                      key={event.id} 
                      event={event} 
                      navigate={navigate}
                      toggleFavorite={toggleFavorite}
                      shareEvent={shareEvent}
                      favorites={favorites}
                      variant="compact"
                    />
                  ))}
                </div>
              ) : (
                <div className="space-y-6">
                  {regularEvents.map((event) => (
                    <EventListCard 
                      key={event.id} 
                      event={event} 
                      navigate={navigate}
                      toggleFavorite={toggleFavorite}
                      shareEvent={shareEvent}
                      favorites={favorites}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}



// Event List Card Component (for list view)
const EventListCard = ({ event, navigate, toggleFavorite, shareEvent, favorites }) => {
  const eventDate = new Date(event.date);
  const today = new Date();
  const daysUntil = Math.ceil((eventDate - today) / (1000 * 60 * 60 * 24));
  const isToday = daysUntil === 0;
  const isTomorrow = daysUntil === 1;
  const isFavorite = favorites.has(event.id);
  
  return (
    <div className="group bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer"
         onClick={() => navigate(`/events/${event.id}`)}>
      <div className="flex">
        {/* Image Section */}
        <div className="relative w-48 h-32 flex-shrink-0">
          {event.poster ? (
            <>
              <img
                src={event.poster.startsWith('http') ? event.poster : `${API_BASE_URL}${event.poster}`}
                alt={event.name}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-transparent"></div>
            </>
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-purple-400 to-blue-500 flex items-center justify-center">
              <PhotoIcon className="h-8 w-8 text-white/80" />
            </div>
          )}

          {/* Price Badge */}
          <div className="absolute top-2 left-2">
            <div className={`px-2 py-1 rounded-lg font-bold text-xs shadow-sm backdrop-blur-sm ${
              event.price === 0 
                ? 'bg-green-500/90 text-white border border-green-300' 
                : 'bg-purple-500/90 text-white border border-purple-300'
            }`}>
              {event.price === 0 ? 'FREE' : `R${event.price}`}
            </div>
          </div>

          {/* Days Until */}
          {daysUntil > 0 && (
            <div className="absolute top-2 right-2">
              <div className={`px-2 py-1 rounded-lg text-xs font-medium shadow-sm backdrop-blur-sm ${
                isToday 
                  ? 'bg-red-500/90 text-white border border-red-300' 
                  : isTomorrow 
                  ? 'bg-orange-500/90 text-white border border-orange-300'
                  : 'bg-white/90 text-gray-800 border border-white/50'
              }`}>
                {isToday ? 'TODAY' : isTomorrow ? 'TOMORROW' : `${daysUntil}d`}
              </div>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 p-6">
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="inline-block px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
                  {event.category || 'Event'}
                </span>
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <StarIcon 
                      key={i} 
                      className={`h-3 w-3 ${i < event.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                    />
                  ))}
                </div>
              </div>

              <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors duration-300">
                {event.name}
              </h3>

              <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                {event.description}
              </p>

              {/* Event Details */}
              <div className="grid grid-cols-3 gap-4 text-sm text-gray-600">
                <div className="flex items-center">
                  <CalendarIcon className="h-4 w-4 mr-2 text-purple-500" />
                  <span>{eventDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</span>
                </div>
                <div className="flex items-center">
                  <ClockIcon className="h-4 w-4 mr-2 text-blue-500" />
                  <span>{event.time}</span>
                </div>
                <div className="flex items-center">
                  <MapPinIcon className="h-4 w-4 mr-2 text-pink-500" />
                  <span className="truncate">{event.venue?.name || 'TBD'}</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-2 ml-4">
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFavorite(event.id);
                }}
                className="p-2 text-gray-400 hover:text-red-500 transition-colors"
              >
                {isFavorite ? (
                  <HeartIconSolid className="h-5 w-5 text-red-500" />
                ) : (
                  <HeartIcon className="h-5 w-5" />
                )}
              </button>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  shareEvent(event);
                }}
                className="p-2 text-gray-400 hover:text-purple-500 transition-colors"
              >
                <ShareIcon className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Call to Action */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
            <div className="flex items-center text-sm text-gray-500">
              <UsersIcon className="h-4 w-4 mr-1" />
              <span>{event.attendees} attending</span>
            </div>
            <button className="text-purple-600 hover:text-purple-800 font-medium text-sm">
              View Details
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};