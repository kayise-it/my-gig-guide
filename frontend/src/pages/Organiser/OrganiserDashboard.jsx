// file: frontend/src/pages/Organiser/OrganiserDashboard.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import API_BASE_URL, { APP_BASE_PATH } from '../../api/config';
import { venueService } from '../../api/venueService';
import { eventService } from '../../api/eventService';
import VenueCard from '../../components/Venue/VenueCard';
import { useAuth } from '../../context/AuthContext';
import VenueList from '../../components/Venue/VenueList';
import {
  CalendarDaysIcon,
  MapPinIcon,
  UsersIcon,
  ChartBarIcon,
  PlusIcon,
  UserIcon,
  BuildingOffice2Icon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  SparklesIcon,
  TicketIcon
} from '@heroicons/react/24/outline';
const API_URL = `${API_BASE_URL}/api`;

const OrganiserDashboard = ({ organiser }) => {
  // Sample data - replace with actual data from props/API
  const [organiserEvents, setOrganiserEvents] = useState([]);
  const { currentUser } = useAuth();
  const [activeEvents, setActiveEvents] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [venues, setVenues] = useState([]);
  const userId = JSON.parse(localStorage.getItem('user')).id;
  const [apiError, setApiError] = useState(null);

  const fetchVenues = async () => {
    /* Try to get the venues for this organiser */
    try {
      if (currentUser?.organiser_id) {
        const response = await venueService.getOrganisersVenues(currentUser.organiser_id);
        setVenues(response);
      }
    } catch (error) {
      console.error("Failed to fetch venues:", error);
      setApiError("Failed to fetch venues.");
    }
  };
  const handleDeleteEvent = async (eventId) => {
    setLoading(true);
    setError(null);
    try {
      await axios.delete(`${API_URL}/events/delete/${eventId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      setActiveEvents(Array.isArray(activeEvents) ? activeEvents.filter(event => event.id !== eventId) : []);
    } catch (err) {
      console.error('Delete error:', err);
      setError(err.response?.data?.message || 'Failed to delete event');
    } finally {
      setLoading(false);
    }
  };


  const handleDeleteVenue = async (venueId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await venueService.deleteVenue(venueId);
      setVenues(venues.filter(venue => venue.id !== venueId));
      console.log("Venue deleted successfully:", response);
    } catch (err) {
      console.error('Delete error:', err);
      setError(err.response?.data?.message || 'Failed to delete event');
    } finally {
      setLoading(false);
    }
  };

  const upcomingEventsCount = Array.isArray(activeEvents) ? activeEvents.filter(event => {
    const eventDate = new Date(event.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Remove time portion for comparison
    return eventDate >= today;
  }).length : 0;

  const stats = [
    { 
      name: 'Total Events', 
      value: Array.isArray(activeEvents) ? activeEvents.length : 0, 
      change: '+4%', 
      changeType: 'positive',
      icon: CalendarDaysIcon,
      color: 'purple'
    },
    { 
      name: 'Upcoming Events', 
      value: upcomingEventsCount, 
      change: '+2', 
      changeType: 'positive',
      icon: SparklesIcon,
      color: 'blue'
    },
    { 
      name: 'Total Venues', 
      value: venues?.length || 0, 
      change: '+1', 
      changeType: 'positive',
      icon: BuildingOffice2Icon,
      color: 'green'
    },
    { 
      name: 'Total Bookings', 
      value: '156', 
      change: '+12%', 
      changeType: 'positive',
      icon: TicketIcon,
      color: 'orange'
    },
  ];

  const recentEvents = [
    { id: 1, name: 'Summer Festival', date: '2023-07-15', attendees: 1200, status: 'completed' },
    { id: 2, name: 'Tech Conference', date: '2023-08-20', attendees: 800, status: 'upcoming' },
    { id: 3, name: 'Music Awards', date: '2023-09-05', attendees: 0, status: 'planned' },
  ];

  const token = localStorage.getItem('token'); // or wherever your token is stored

  // Fetch user info on mount
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    setUser(storedUser);
  }, []);

  // Fetch venues when currentUser is available
  useEffect(() => {
    if (currentUser?.organiser_id) {
      fetchVenues();
    }
  }, [currentUser]);

  // Fetch events after user is loaded
  useEffect(() => {
    const fetchEvents = async () => {
      if (currentUser?.organiser_id) {
        try {
          setLoading(true);
          const eventData = await eventService.getEventsByOrganiser(currentUser.organiser_id);
          // Handle both array and object response formats
          const events = eventData?.events || eventData || [];
          setActiveEvents(events);
          console.log('Fetched events:', eventData);
        } catch (error) {
          console.error('Error fetching events:', error);
          setError('Failed to load events');
        } finally {
          setLoading(false);
        }
      } else if (currentUser?.id) {
        // Fallback to user ID if organiser_id is not available
        try {
          setLoading(true);
          const eventData = await eventService.getOrganisersEvents(currentUser.id);
          setActiveEvents(eventData);
          console.log('Fetched events by user ID:', eventData);
        } catch (error) {
          console.error('Error fetching events by user ID:', error);
          setError('Failed to load events');
        } finally {
          setLoading(false);
        }
      }
    };
    
    fetchEvents();
  }, [currentUser]); // Depends on currentUser state


  /*   if (loading) return <div className="text-center py-8">Loading event details...</div>;
    if (error) return <div className="text-center py-8 text-red-500">{error}</div>;
    if (!event) return <div className="text-center py-8">Event not foun90d</div>;
   */


  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      {/* Modern Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-purple-100 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Event Organiser Dashboard
              </h1>
              <p className="text-gray-600 mt-1">Welcome back! Here's what's happening with your events.</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-2 rounded-xl">
                <UserIcon className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Welcome back,</p>
                <p className="font-semibold text-gray-900">{organiser?.name || currentUser?.username || 'Organiser'}</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Enhanced Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => {
            const IconComponent = stat.icon;
            const colorClasses = {
              purple: 'from-purple-500 to-purple-600 bg-purple-50 text-purple-600',
              blue: 'from-blue-500 to-blue-600 bg-blue-50 text-blue-600',
              green: 'from-green-500 to-green-600 bg-green-50 text-green-600',
              orange: 'from-orange-500 to-orange-600 bg-orange-50 text-orange-600'
            };
            
            return (
              <div key={stat.name} className="bg-white/70 backdrop-blur-sm border border-purple-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-600 mb-1">{stat.name}</p>
                    <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                    <div className="flex items-center mt-2">
                      {stat.changeType === 'positive' ? (
                        <ArrowTrendingUpIcon className="h-4 w-4 text-green-500 mr-1" />
                      ) : (
                        <ArrowTrendingDownIcon className="h-4 w-4 text-red-500 mr-1" />
                      )}
                      <span className={`text-sm font-medium ${
                        stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {stat.change}
                      </span>
                      <span className="text-gray-500 text-sm ml-1">vs last month</span>
                    </div>
                  </div>
                  <div className={`p-3 rounded-xl bg-gradient-to-r ${colorClasses[stat.color].split(' ')[0]} ${colorClasses[stat.color].split(' ')[1]}`}>
                    <IconComponent className="h-8 w-8 text-white" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Modern Quick Actions */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Link
              to={`${APP_BASE_PATH}/organiser/dashboard/events/new`}
              className="group bg-white/70 backdrop-blur-sm border border-purple-100 rounded-2xl p-6 hover:shadow-lg transition-all duration-300 hover:scale-105 hover:border-purple-300"
            >
              <div className="flex items-center">
                <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-3 rounded-xl mr-4 group-hover:scale-110 transition-transform duration-300">
                  <PlusIcon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 group-hover:text-purple-600 transition-colors">Create New Event</h3>
                  <p className="text-sm text-gray-600">Start planning your next amazing event</p>
                </div>
              </div>
            </Link>

            <Link
              to="/organiser/dashboard/profile"
              className="group bg-white/70 backdrop-blur-sm border border-purple-100 rounded-2xl p-6 hover:shadow-lg transition-all duration-300 hover:scale-105 hover:border-blue-300"
            >
              <div className="flex items-center">
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-3 rounded-xl mr-4 group-hover:scale-110 transition-transform duration-300">
                  <UserIcon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">Edit Profile</h3>
                  <p className="text-sm text-gray-600">Update your organization details</p>
                </div>
              </div>
            </Link>

            <Link
              to="/organiser/dashboard/venues/new"
              className="group bg-white/70 backdrop-blur-sm border border-purple-100 rounded-2xl p-6 hover:shadow-lg transition-all duration-300 hover:scale-105 hover:border-green-300"
            >
              <div className="flex items-center">
                <div className="bg-gradient-to-r from-green-500 to-green-600 p-3 rounded-xl mr-4 group-hover:scale-110 transition-transform duration-300">
                  <BuildingOffice2Icon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 group-hover:text-green-600 transition-colors">Add New Venue</h3>
                  <p className="text-sm text-gray-600">Register a new event venue</p>
                </div>
              </div>
            </Link>
          </div>
        </div>

        {/* Modern Grid Layout */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Enhanced Recent Events */}
          <div className="bg-white/70 backdrop-blur-sm border border-purple-100 rounded-2xl overflow-hidden shadow-sm">
            <div className="px-6 py-5 border-b border-purple-100 flex justify-between items-center">
              <div className="flex items-center">
                <CalendarDaysIcon className="h-6 w-6 text-purple-600 mr-3" />
                <h3 className="text-xl font-semibold text-gray-900">Recent Events</h3>
              </div>
              <Link 
                to={`${APP_BASE_PATH}/organiser/dashboard/events`} 
                className="text-sm font-medium text-purple-600 hover:text-purple-700 flex items-center"
              >
                View all
                <EyeIcon className="h-4 w-4 ml-1" />
              </Link>
            </div>
            <div className="max-h-96 overflow-y-auto">
              {loading && (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
                  <p className="text-gray-600 mt-2">Loading events...</p>
                </div>
              )}
              
              {error && (
                <div className="text-center py-12">
                  <div className="text-red-500 mb-4">{error}</div>
                  <Link 
                    to={`${APP_BASE_PATH}/organiser/dashboard/events/new`}
                    className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:from-purple-700 hover:to-blue-700 transition-all"
                  >
                    Create Your First Event
                  </Link>
                </div>
              )}
              
              {activeEvents?.length === 0 && !loading && !error && (
                <div className="text-center py-12">
                  <CalendarDaysIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">No events yet</p>
                  <Link 
                    to={`${APP_BASE_PATH}/organiser/dashboard/events/new`}
                    className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:from-purple-700 hover:to-blue-700 transition-all"
                  >
                    Create Your First Event
                  </Link>
                </div>
              )}
              
              {activeEvents?.map((event) => (
                <div key={event.id} className="px-6 py-4 border-b border-gray-100 last:border-b-0 hover:bg-purple-50/50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <Link
                        to={`/organiser/dashboard/event/${event.id}`}
                        className="text-lg font-semibold text-gray-900 hover:text-purple-600 transition-colors"
                      >
                        {event.name}
                      </Link>
                      <div className="flex items-center mt-2 text-sm text-gray-600">
                        <CalendarDaysIcon className="h-4 w-4 mr-1" />
                        {new Date(event.date).toLocaleDateString()}
                        <UsersIcon className="h-4 w-4 ml-4 mr-1" />
                        {event.attendees || 0} attendees
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                        event.status === 'completed'
                          ? 'bg-green-100 text-green-700 border border-green-200'
                          : event.status === 'upcoming'
                          ? 'bg-blue-100 text-blue-700 border border-blue-200'
                          : 'bg-gray-100 text-gray-700 border border-gray-200'
                      }`}>
                        {event.status}
                      </span>

                      <div className="flex items-center space-x-2">
                        <Link
                          to={`/organiser/dashboard/event/edit/${event.id}`}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit event"
                        >
                          <PencilIcon className="h-4 w-4" />
                        </Link>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (window.confirm('Are you sure you want to delete this event?')) {
                              handleDeleteEvent(event.id);
                            }
                          }}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete event"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Enhanced Venue List */}
          <div className="bg-white/70 backdrop-blur-sm border border-purple-100 rounded-2xl overflow-hidden shadow-sm">
            <div className="px-6 py-5 border-b border-purple-100 flex justify-between items-center">
              <div className="flex items-center">
                <BuildingOffice2Icon className="h-6 w-6 text-purple-600 mr-3" />
                <h3 className="text-xl font-semibold text-gray-900">Your Venues</h3>
              </div>
              <Link 
                to="/organiser/dashboard/venues/new"
                className="text-sm font-medium text-purple-600 hover:text-purple-700 flex items-center"
              >
                Add venue
                <PlusIcon className="h-4 w-4 ml-1" />
              </Link>
            </div>
            <div className="max-h-96 overflow-y-auto">
              {venues?.length === 0 ? (
                <div className="text-center py-12">
                  <BuildingOffice2Icon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">No venues registered yet</p>
                  <Link 
                    to="/organiser/dashboard/venues/new"
                    className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:from-purple-700 hover:to-blue-700 transition-all"
                  >
                    Add Your First Venue
                  </Link>
                </div>
              ) : (
                <VenueList venues={venues} onDelete={handleDeleteVenue} />
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default OrganiserDashboard;