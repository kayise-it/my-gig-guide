import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  CalendarDaysIcon,
  MusicalNoteIcon,
  ArrowTopRightOnSquareIcon,
  TicketIcon,
  ClockIcon,
  UsersIcon,
  XMarkIcon,
  MagnifyingGlassIcon,
  FunnelIcon
} from '@heroicons/react/24/outline';

const VenueUpcomingEvents = ({ 
  events = [], 
  venue,
  maxEvents = 3,
  showViewAll = true 
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date');

  const displayEvents = events.slice(0, maxEvents);

  // Get unique categories from events
  const categories = ['all', ...new Set(events.map(event => event.category).filter(Boolean))];

  // Filter and sort events for modal
  const filteredEvents = events.filter(event => {
    const matchesSearch = event.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (event.artist?.name || event.artist?.stage_name || event.artist)?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = categoryFilter === 'all' || event.category === categoryFilter;
    
    return matchesSearch && matchesCategory;
  }).sort((a, b) => {
    switch (sortBy) {
      case 'date':
        return new Date(a.date) - new Date(b.date);
      case 'name':
        return (a.name || '').localeCompare(b.name || '');
      case 'price':
        return (a.price || 0) - (b.price || 0);
      default:
        return 0;
    }
  });

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    } catch (error) {
      return dateString;
    }
  };

  const formatTime = (timeString) => {
    try {
      // Handle various time formats
      if (timeString && timeString.includes(':')) {
        const [hours, minutes] = timeString.split(':');
        const hour = parseInt(hours);
        const min = minutes || '00';
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const displayHour = hour % 12 || 12;
        return `${displayHour}:${min} ${ampm}`;
      }
      return timeString;
    } catch (error) {
      return timeString;
    }
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSearchTerm('');
    setCategoryFilter('all');
    setSortBy('date');
  };

  if (events.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center space-x-2 mb-6">
          <div>
          <CalendarDaysIcon className="h-5 w-5 text-purple-600" />
          <h3 className="text-lg font-semibold text-gray-900">Upcoming Events</h3>
          </div>
        </div>
        
        <div className="text-center">
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-8">
            <CalendarDaysIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Upcoming Events</h3>
            <p className="text-gray-600 mb-4">This venue hasn't scheduled any events yet.</p>
            <div className="text-sm text-gray-500">
              Check back later for exciting events at {venue?.name}!
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <CalendarDaysIcon className="h-5 w-5 text-purple-600" />
            <h3 className="text-lg font-semibold text-gray-900">Upcoming Events</h3>
            <span className="text-sm text-gray-500">({events.length} scheduled)</span>
          </div>
          
          {events.length > maxEvents && (
            <button
              onClick={openModal}
              className="text-sm text-purple-600 hover:text-purple-700 font-medium transition-colors"
            >
              View All Events
            </button>
          )}
        </div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {displayEvents.map((event, index) => (
                      <Link
            key={event.id || index}
            to={`/events/${event.id}`}
            className="block bg-white hover:bg-gray-50 border border-gray-200 rounded-xl p-4 transition-all duration-300 hover:shadow-lg hover:border-purple-200 group h-full min-h-[200px]"
          >
              <div className="flex flex-col h-full">
                {/* Event Title */}
                <h4 className="text-lg font-semibold text-gray-900 group-hover:text-purple-600 transition-colors duration-300 mb-3">
                  {event.name || event.title}
                </h4>

                {/* Event Details - Compact Layout */}
                <div className="space-y-2 flex-1">
                  {/* Date and Time */}
                  <div className="flex items-center text-sm text-gray-600">
                    <CalendarDaysIcon className="h-4 w-4 mr-2 text-purple-500 flex-shrink-0" />
                    <span className="font-medium">{formatDate(event.date)}</span>
                    {event.time && (
                      <>
                        <ClockIcon className="h-4 w-4 ml-3 mr-2 text-gray-400 flex-shrink-0" />
                        <span>{formatTime(event.time)}</span>
                      </>
                    )}
                  </div>

                  {/* Artist/Performer */}
                  {event.artist && (
                    <div className="flex items-center text-sm text-gray-600">
                      <MusicalNoteIcon className="h-4 w-4 mr-2 text-purple-500 flex-shrink-0" />
                      <span className="truncate">
                        {typeof event.artist === 'string' 
                          ? event.artist 
                          : event.artist.name || event.artist.stage_name
                        }
                      </span>
                    </div>
                  )}

                  {/* Price and Capacity in one row */}
                  <div className="flex items-center justify-between text-sm">
                    {(event.ticket_price || event.price) && (
                      <div className="flex items-center text-green-600">
                        <TicketIcon className="h-4 w-4 mr-1 text-green-500 flex-shrink-0" />
                        <span className="font-medium">
                          {event.ticket_price === 0 || event.price === 0 
                            ? 'Free' 
                            : `R${event.ticket_price || event.price}`
                          }
                        </span>
                      </div>
                    )}
                    
                    {(event.capacity || event.expected_attendance) && (
                      <div className="flex items-center text-gray-600">
                        <UsersIcon className="h-4 w-4 mr-1 text-gray-400 flex-shrink-0" />
                        <span className="text-xs">
                          {event.expected_attendance 
                            ? `${event.expected_attendance}` 
                            : `${event.capacity}`
                          }
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Event Description */}
                  {event.description && (
                    <p className="text-sm text-gray-500 line-clamp-2 mt-2">
                      {event.description}
                    </p>
                  )}
                </div>

                {/* Bottom Section with Status and Arrow */}
                <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
                  {/* Event Status Badge */}
                  {event.status && (
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      event.status === 'confirmed' 
                        ? 'bg-green-100 text-green-800'
                        : event.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                    </span>
                  )}
                  
                  {/* Arrow Icon */}
                  <ArrowTopRightOnSquareIcon className="h-4 w-4 text-gray-400 group-hover:text-purple-600 transition-colors duration-300" />
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* View More Link */}
        {events.length > maxEvents && (
          <div className="mt-6 pt-4 border-t border-gray-200 text-center">
            <button
              onClick={openModal}
              className="inline-flex items-center text-sm text-purple-600 hover:text-purple-700 font-medium transition-colors"
            >
              <span>View {events.length - maxEvents} more events</span>
              <ArrowTopRightOnSquareIcon className="h-4 w-4 ml-1" />
            </button>
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">All Events at {venue?.name}</h2>
                  <p className="text-gray-600 mt-1">{filteredEvents.length} events found</p>
                </div>
                <button
                  onClick={closeModal}
                  className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>

              {/* Filters */}
              <div className="mt-6 flex flex-col sm:flex-row gap-4">
                {/* Search */}
                <div className="flex-1">
                  <div className="relative">
                    <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Search events..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Category Filter */}
                <div className="sm:w-48">
                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    {categories.map(category => (
                      <option key={category} value={category}>
                        {category === 'all' ? 'All Categories' : category}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Sort */}
                <div className="sm:w-48">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="date">Sort by Date</option>
                    <option value="name">Sort by Name</option>
                    <option value="price">Sort by Price</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
              {filteredEvents.length === 0 ? (
                <div className="text-center py-12">
                  <CalendarDaysIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No events found</h3>
                  <p className="text-gray-600">Try adjusting your search or filters.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredEvents.map((event, index) => (
                                         <Link
                       key={event.id || index}
                       to={`/events/${event.id}`}
                       className="block bg-white hover:bg-gray-50 border border-gray-200 rounded-xl p-4 transition-all duration-300 hover:shadow-lg hover:border-purple-200 group h-full min-h-[200px]"
                       onClick={closeModal}
                     >
                      <div className="flex flex-col h-full">
                        {/* Event Title */}
                        <h4 className="text-lg font-semibold text-gray-900 group-hover:text-purple-600 transition-colors duration-300 mb-3">
                          {event.name || event.title}
                        </h4>

                        {/* Event Details - Compact Layout */}
                        <div className="space-y-2 flex-1">
                          {/* Date and Time */}
                          <div className="flex items-center text-sm text-gray-600">
                            <CalendarDaysIcon className="h-4 w-4 mr-2 text-purple-500 flex-shrink-0" />
                            <span className="font-medium">{formatDate(event.date)}</span>
                            {event.time && (
                              <>
                                <ClockIcon className="h-4 w-4 ml-3 mr-2 text-gray-400 flex-shrink-0" />
                                <span>{formatTime(event.time)}</span>
                              </>
                            )}
                          </div>

                          {/* Artist/Performer */}
                          {event.artist && (
                            <div className="flex items-center text-sm text-gray-600">
                              <MusicalNoteIcon className="h-4 w-4 mr-2 text-purple-500 flex-shrink-0" />
                              <span className="truncate">
                                {typeof event.artist === 'string' 
                                  ? event.artist 
                                  : event.artist.name || event.artist.stage_name
                                }
                              </span>
                            </div>
                          )}

                          {/* Price and Capacity in one row */}
                          <div className="flex items-center justify-between text-sm">
                            {(event.ticket_price || event.price) && (
                              <div className="flex items-center text-green-600">
                                <TicketIcon className="h-4 w-4 mr-1 text-green-500 flex-shrink-0" />
                                <span className="font-medium">
                                  {event.ticket_price === 0 || event.price === 0 
                                    ? 'Free' 
                                    : `R${event.ticket_price || event.price}`
                                  }
                                </span>
                              </div>
                            )}
                            
                            {(event.capacity || event.expected_attendance) && (
                              <div className="flex items-center text-gray-600">
                                <UsersIcon className="h-4 w-4 mr-1 text-gray-400 flex-shrink-0" />
                                <span className="text-xs">
                                  {event.expected_attendance 
                                    ? `${event.expected_attendance}` 
                                    : `${event.capacity}`
                                  }
                                </span>
                              </div>
                            )}
                          </div>

                          {/* Event Description */}
                          {event.description && (
                            <p className="text-sm text-gray-500 line-clamp-2 mt-2">
                              {event.description}
                            </p>
                          )}
                        </div>

                        {/* Bottom Section with Status and Arrow */}
                        <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
                          {/* Event Status Badge */}
                          {event.status && (
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                              event.status === 'confirmed' 
                                ? 'bg-green-100 text-green-800'
                                : event.status === 'pending'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                            </span>
                          )}
                          
                          {/* Arrow Icon */}
                          <ArrowTopRightOnSquareIcon className="h-4 w-4 text-gray-400 group-hover:text-purple-600 transition-colors duration-300" />
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default VenueUpcomingEvents;
