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
  ChevronDownIcon
} from '@heroicons/react/24/outline';
import axios from 'axios';
import API_BASE_URL from '../../api/config';

export default function ViewEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const navigate = useNavigate();
  const token = localStorage.getItem('token'); // or wherever your token is stored

  // Hardcoded example events
  useEffect(() => {
    const loadExampleEvents = () => {
      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(today.getDate() + 1);
      
      const exampleEvents = [
        {
          id: 1,
          name: "Electric Nights Festival",
          description: "A spectacular electronic music festival featuring top DJs from around the world. Experience mind-blowing visuals and beats that will keep you dancing all night long.",
          date: today.toISOString().split('T')[0],
          time: "18:00",
          category: "festival",
          price: 250,
          poster: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=500&h=300&fit=crop",
          venue: { name: "Cape Town Stadium" }
        },
        {
          id: 2,
          name: "Jazz Under the Stars",
          description: "An intimate evening of smooth jazz with renowned local and international artists. Enjoy cocktails and great music under the beautiful starlit sky.",
          date: tomorrow.toISOString().split('T')[0],
          time: "19:30",
          category: "concert",
          price: 0,
          poster: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=500&h=300&fit=crop",
          venue: { name: "V&A Waterfront Amphitheatre" }
        },
        {
          id: 3,
          name: "Comedy Central Live",
          description: "Get ready to laugh until your sides hurt! Top comedians bring their best material for an unforgettable night of comedy and entertainment.",
          date: new Date(today.getTime() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          time: "20:00",
          category: "comedy",
          price: 180,
          poster: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=500&h=300&fit=crop",
          venue: { name: "Baxter Theatre" }
        },
        {
          id: 4,
          name: "Art & Wine Exhibition",
          description: "Discover contemporary African art while enjoying premium wines. Meet the artists, learn about their inspiration, and take home a piece of culture.",
          date: new Date(today.getTime() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          time: "17:00",
          category: "exhibition",
          price: 0,
          poster: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500&h=300&fit=crop",
          venue: { name: "Zeitz Museum" }
        },
        {
          id: 5,
          name: "Tech Innovation Summit",
          description: "Join industry leaders and innovators for a day of groundbreaking talks about the future of technology, AI, and digital transformation in Africa.",
          date: new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          time: "09:00",
          category: "conference",
          price: 450,
          poster: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=500&h=300&fit=crop",
          venue: { name: "Cape Town International Convention Centre" }
        },
        {
          id: 6,
          name: "Shakespeare in the Park",
          description: "A magical outdoor performance of Hamlet in the beautiful Kirstenbosch Gardens. Bring a picnic and enjoy classical theater in a stunning natural setting.",
          date: new Date(today.getTime() + 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          time: "16:00",
          category: "theater",
          price: 120,
          poster: "https://images.unsplash.com/photo-1507924538820-ede94a04019d?w=500&h=300&fit=crop",
          venue: { name: "Kirstenbosch Botanical Garden" }
        },
        {
          id: 7,
          name: "Rugby Championship Final",
          description: "The ultimate showdown! Two powerhouse teams battle it out for the championship title. Experience the passion, skill, and excitement of South African rugby.",
          date: new Date(today.getTime() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          time: "15:00",
          category: "sports",
          price: 320,
          poster: "https://images.unsplash.com/photo-1551958219-acbc608c6377?w=500&h=300&fit=crop",
          venue: { name: "DHL Stadium" }
        },
        {
          id: 8,
          name: "Indie Music Showcase",
          description: "Discover the next big thing in indie music! Local bands and solo artists showcase their original compositions in an intimate venue setting.",
          date: new Date(today.getTime() + 21 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          time: "20:30",
          category: "concert",
          price: 85,
          poster: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=500&h=300&fit=crop",
          venue: { name: "The Assembly" }
        }
      ];

      console.log('Loading example events:', exampleEvents);
      setEvents(exampleEvents);
      setLoading(false);
    };

    // Simulate loading time
    setTimeout(loadExampleEvents, 100);
  }, []);

  // Helper function to check if event is upcoming (today or later)
  const isUpcoming = (eventDate) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set to start of today
    const eventDateTime = new Date(eventDate);
    eventDateTime.setHours(0, 0, 0, 0); // Set to start of event day
    return eventDateTime >= today;
  };

  // Filter events based on search, category, and upcoming dates
  const filteredEvents = events.filter(event => {
    const matchesSearch = event.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || event.category === categoryFilter;
    const isUpcomingEvent = isUpcoming(event.date);
    return matchesSearch && matchesCategory && isUpcomingEvent;
  });

  // Sort events by date (earliest first)
  const sortedEvents = filteredEvents.sort((a, b) => new Date(a.date) - new Date(b.date));
  
  // Debug logging
  console.log('Total events:', events.length);
  console.log('Filtered events:', filteredEvents.length);
  console.log('Sorted events:', sortedEvents.length);

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
    </div>
  );

  if (error) return (
    <div className="bg-red-50 border-l-4 border-red-500 p-4 my-4">
      <div className="flex">
        <div className="flex-shrink-0">
          <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="ml-3">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      {/* Modern Hero Header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-purple-600 via-blue-600 to-purple-800 py-24">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute transform rotate-45 -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
            <div className="grid grid-cols-8 gap-4">
              {Array.from({ length: 64 }).map((_, i) => (
                <div key={i} className="w-4 h-4 bg-white rounded-full animate-pulse" style={{ animationDelay: `${i * 0.1}s` }}></div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="absolute -inset-4 bg-white/20 rounded-full blur-xl"></div>
                <div className="relative bg-white/10 backdrop-blur-sm p-4 rounded-2xl border border-white/20">
                  <FireIcon className="h-12 w-12 text-white mx-auto" />
                </div>
              </div>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-black text-white mb-6 leading-tight">
              What's <span className="bg-gradient-to-r from-yellow-300 to-pink-300 bg-clip-text text-transparent">Happening</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-purple-100 mb-8 max-w-3xl mx-auto leading-relaxed">
              Discover the hottest events happening in your area. From concerts to festivals, we've got your entertainment covered.
            </p>
            
            {/* Quick Stats */}
            <div className="flex justify-center space-x-8 mb-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-white">{sortedEvents.length}</div>
                <div className="text-purple-200 text-sm">Upcoming Events</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white">Live</div>
                <div className="text-purple-200 text-sm">Right Now</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white">24/7</div>
                <div className="text-purple-200 text-sm">Discovery</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content with Sidebar Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex gap-8">
          {/* Left Sidebar - Filters */}
          <div className="hidden lg:block w-80 flex-shrink-0">
            <div className="sticky top-8">
              <div className="bg-white/90 backdrop-blur-lg border border-purple-200 rounded-2xl p-6 shadow-sm">
                <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
                  <FunnelIcon className="h-5 w-5 text-purple-600 mr-2" />
                  Find Events
                </h3>

                {/* Search Input */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Search
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <MagnifyingGlassIcon className="h-4 w-4 text-purple-400" />
                    </div>
                    <input
                      type="text"
                      className="block w-full pl-10 pr-3 py-3 border border-purple-200 rounded-xl text-sm placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white/70 transition-all duration-300"
                      placeholder="Events, artists, venues..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
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
            {/* Mobile Filter Button */}
            <div className="lg:hidden mb-6">
              <div className="flex items-center justify-between bg-white/90 backdrop-blur-lg border border-purple-200 rounded-xl p-4">
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

        {/* Modern Events Grid */}
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
        ) : (
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {sortedEvents.map((event) => {
              const eventDate = new Date(event.date);
              const today = new Date();
              const daysUntil = Math.ceil((eventDate - today) / (1000 * 60 * 60 * 24));
              const isToday = daysUntil === 0;
              const isTomorrow = daysUntil === 1;
              
              return (
                <div
                  key={event.id}
                  className="group relative bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-500 cursor-pointer border border-purple-100 hover:border-purple-300 hover:scale-105"
                  onClick={() => navigate(`/events/${event.id}`)}
                >
                  {/* Event Image */}
                  <div className="relative h-56 bg-gradient-to-br from-purple-100 to-blue-100 overflow-hidden">
                    {event.poster ? (
                      <>
                        <img
                          src={event.poster.startsWith('http') ? event.poster : `${API_BASE_URL}${event.poster}`}
                          alt={event.name}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                      </>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <div className="p-6 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 shadow-sm">
                          <PhotoIcon className="h-12 w-12 text-white" />
                        </div>
                      </div>
                    )}

                    {/* Date Badge */}
                    <div className="absolute top-4 right-4">
                      <div className={`px-3 py-2 rounded-xl font-bold text-sm shadow-sm backdrop-blur-sm border ${
                        isToday 
                          ? 'bg-red-500/90 text-white border-red-300' 
                          : isTomorrow 
                          ? 'bg-orange-500/90 text-white border-orange-300'
                          : 'bg-white/90 text-gray-800 border-white/50'
                      }`}>
                        {isToday ? 'TODAY' : isTomorrow ? 'TOMORROW' : `${daysUntil} DAYS`}
                      </div>
                    </div>

                    {/* Price Badge */}
                    {event.price !== undefined && (
                      <div className="absolute top-4 left-4">
                        <div className={`px-3 py-2 rounded-xl font-bold text-sm shadow-sm backdrop-blur-sm ${
                          event.price === 0 
                            ? 'bg-green-500/90 text-white border border-green-300' 
                            : 'bg-purple-500/90 text-white border border-purple-300'
                        }`}>
                          {event.price === 0 ? 'FREE' : `R${event.price}`}
                        </div>
                      </div>
                    )}

                    {/* Category Badge */}
                    {event.category && (
                      <div className="absolute bottom-4 left-4">
                        <span className="bg-white/90 backdrop-blur-sm text-purple-700 px-3 py-1 rounded-full text-xs font-semibold border border-white/50 capitalize">
                          {event.category}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Event Details */}
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-purple-600 transition-colors duration-300">
                      {event.name}
                    </h3>

                    <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">
                      {event.description}
                    </p>

                    {/* Event Meta */}
                    <div className="space-y-3">
                      <div className="flex items-center text-sm text-gray-600">
                        <CalendarIcon className="h-4 w-4 mr-3 text-purple-500" />
                        <span className="font-medium">
                          {eventDate.toLocaleDateString('en-US', {
                            weekday: 'short',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </span>
                      </div>

                      <div className="flex items-center text-sm text-gray-600">
                        <ClockIcon className="h-4 w-4 mr-3 text-blue-500" />
                        <span className="font-medium">{event.time}</span>
                      </div>

                      {event.venue && (
                        <div className="flex items-center text-sm text-gray-600">
                          <MapPinIcon className="h-4 w-4 mr-3 text-pink-500" />
                          <span className="font-medium truncate">{event.venue.name}</span>
                        </div>
                      )}
                    </div>

                    {/* Call to Action */}
                    <div className="mt-6 pt-4 border-t border-gray-100">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center text-sm text-gray-500">
                          <UsersIcon className="h-4 w-4 mr-1" />
                          <span>Click to view details</span>
                        </div>
                        <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <TicketIcon className="h-4 w-4" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
          </div>
        </div>
      </div>
    </div>
  );
}