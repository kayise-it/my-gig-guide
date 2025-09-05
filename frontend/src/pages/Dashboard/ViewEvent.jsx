import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  ArrowLeftIcon, 
  CalendarDaysIcon,
  MapPinIcon,
  ClockIcon,
  UsersIcon,
  CurrencyDollarIcon,
  PencilIcon,
  TrashIcon,
  HeartIcon,
  ShareIcon,
  StarIcon,
  TicketIcon,
  PhotoIcon,
  EyeIcon,
  UserGroupIcon,
  TagIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon, StarIcon as StarSolidIcon } from '@heroicons/react/24/solid';
import { useAuth } from '../../context/AuthContext';
import API_BASE_URL from '../../api/config';
import axios from 'axios';
import EventBookedArtists from '../../components/Events/EventBookedArtists';

const ViewEvent = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { currentUser } = useAuth();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [bookedArtists, setBookedArtists] = useState([]);
  const [isLiked, setIsLiked] = useState(false);
  const [isInterested, setIsInterested] = useState(false);
  const [attendeeCount, setAttendeeCount] = useState(0);
  const [eventRating, setEventRating] = useState(0);
  const [showGallery, setShowGallery] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  useEffect(() => {
    fetchEventDetails();
    fetchEventArtists();
  }, [id]);

  const fetchEventDetails = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_BASE_URL}/api/events/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setEvent(response.data.event);
      // Set mock data for demo purposes
      setAttendeeCount(Math.floor(Math.random() * 200) + 50);
      setEventRating(4.2);
    } catch (error) {
      console.error('Error fetching event details:', error);
      setError('Failed to load event details');
    } finally {
      setLoading(false);
    }
  };

  const fetchEventArtists = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/events/${id}/artists`);
      if (res.data?.success) {
        setBookedArtists(res.data.artists || []);
      } else if (res.data?.artists) {
        setBookedArtists(res.data.artists);
      } else {
        setBookedArtists([]);
      }
    } catch (e) {
      console.error('Error fetching event artists:', e);
      setBookedArtists([]);
    }
  };

  const handleEditEvent = () => {
    navigate(`/user/dashboard/edit-event/${id}`);
  };

  const handleDeleteEvent = async () => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`${API_BASE_URL}/api/events/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        navigate('/user/dashboard');
      } catch (error) {
        console.error('Error deleting event:', error);
        alert('Failed to delete event');
      }
    }
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
  };

  const handleInterest = () => {
    setIsInterested(!isInterested);
    setAttendeeCount(prev => isInterested ? prev - 1 : prev + 1);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: event.name,
          text: `Check out this event: ${event.name}`,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Event link copied to clipboard!');
    }
  };

  const formatPrice = (price) => {
    if (!price) return 'Free';
    return `R${parseFloat(price).toLocaleString()}`;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-ZA', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getEventStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'active':
      case 'scheduled':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'completed':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header Skeleton */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-gray-200 rounded-lg animate-pulse"></div>
                <div>
                  <div className="h-8 w-64 bg-gray-200 rounded animate-pulse mb-2"></div>
                  <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
                </div>
              </div>
              <div className="flex space-x-3">
                <div className="h-10 w-24 bg-gray-200 rounded-lg animate-pulse"></div>
                <div className="h-10 w-28 bg-gray-200 rounded-lg animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Content Skeleton */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="h-64 bg-gray-200 rounded-xl animate-pulse"></div>
              <div className="h-32 bg-gray-200 rounded-xl animate-pulse"></div>
              <div className="h-48 bg-gray-200 rounded-xl animate-pulse"></div>
            </div>
            <div className="space-y-6">
              <div className="h-48 bg-gray-200 rounded-xl animate-pulse"></div>
              <div className="h-32 bg-gray-200 rounded-xl animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Event Not Found</h2>
          <p className="text-gray-600 mb-4">{error || 'The event you are looking for does not exist.'}</p>
          <button
            onClick={() => navigate('/user/dashboard')}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/user/dashboard')}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeftIcon className="h-5 w-5" />
              </button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{event.name}</h1>
                <p className="text-gray-600 mt-1">Event Details</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={handleEditEvent}
                className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-all"
              >
                <PencilIcon className="h-4 w-4 mr-2" />
                Edit Event
              </button>
              <button
                onClick={handleDeleteEvent}
                className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-all"
              >
                <TrashIcon className="h-4 w-4 mr-2" />
                Delete Event
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Banner */}
      <div className="relative bg-gradient-to-r from-purple-900 via-purple-800 to-indigo-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Event Info */}
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <button
                  onClick={handleLike}
                  className="p-3 bg-white/20 hover:bg-white/30 rounded-full transition-all"
                >
                  {isLiked ? (
                    <HeartSolidIcon className="h-6 w-6 text-red-400" />
                  ) : (
                    <HeartIcon className="h-6 w-6" />
                  )}
                </button>
                <div className="flex items-center space-x-2 text-white/80">
                  <UserGroupIcon className="h-5 w-5" />
                  <span className="font-medium">{attendeeCount} Interested</span>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <CalendarDaysIcon className="h-6 w-6 text-purple-300" />
                  <span className="text-lg">{formatDate(event.date)}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <ClockIcon className="h-6 w-6 text-purple-300" />
                  <span className="text-lg">{event.time}</span>
                </div>
                {event.venue_name && (
                  <div className="flex items-center space-x-3">
                    <MapPinIcon className="h-6 w-6 text-purple-300" />
                    <span className="text-lg">{event.venue_name}</span>
                  </div>
                )}
              </div>

              {event.category && (
                <div className="flex items-center space-x-2">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-white/20 text-white">
                    <TagIcon className="h-4 w-4 mr-1" />
                    {event.category}
                  </span>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getEventStatusColor(event.status)}`}>
                    <CheckCircleIcon className="h-4 w-4 mr-1" />
                    {event.status || 'Active'}
                  </span>
                </div>
              )}
            </div>

            {/* Event Poster */}
            <div className="relative">
              {event.poster ? (
                <img
                  src={`${API_BASE_URL}${event.poster}`}
                  alt={event.name}
                  className="w-full h-80 object-cover rounded-2xl shadow-2xl"
                />
              ) : (
                <div className="w-full h-80 bg-white/10 rounded-2xl flex items-center justify-center">
                  <PhotoIcon className="h-16 w-16 text-white/50" />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-8">
            {/* About Section */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">About This Event</h2>
              {event.description ? (
                <p className="text-gray-700 leading-relaxed">{event.description}</p>
              ) : (
                <p className="text-gray-500 italic">No description provided for this event.</p>
              )}
            </div>

            {/* Booked Artists */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Booked Artists</h2>
              <EventBookedArtists artists={bookedArtists} />
            </div>

            {/* Event Rating */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Event Rating</h2>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <StarSolidIcon
                      key={star}
                      className={`h-6 w-6 ${star <= eventRating ? 'text-yellow-400' : 'text-gray-300'}`}
                    />
                  ))}
                </div>
                <span className="text-lg font-semibold text-gray-900">{eventRating}/5</span>
                <span className="text-gray-600">({attendeeCount} reviews)</span>
              </div>
              <button className="mt-4 inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-all">
                <StarIcon className="h-4 w-4 mr-2" />
                Add Rating
              </button>
            </div>

            {/* Event Gallery */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Event Gallery</h2>
              {event.gallery && event.gallery.split(',').length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {event.gallery.split(',').map((image, index) => (
                    <div
                      key={index}
                      className="relative group cursor-pointer"
                      onClick={() => {
                        setSelectedImageIndex(index);
                        setShowGallery(true);
                      }}
                    >
                      <img
                        src={`${API_BASE_URL}${image}`}
                        alt={`${event.name} - Image ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg shadow-sm group-hover:shadow-md transition-shadow"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all rounded-lg flex items-center justify-center">
                        <EyeIcon className="h-6 w-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <PhotoIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No gallery images yet</p>
                </div>
              )}
            </div>

            {/* Event Location */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Event Location</h2>
              {event.venue_name ? (
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <MapPinIcon className="h-6 w-6 text-purple-600" />
                    <span className="text-lg font-medium text-gray-900">{event.venue_name}</span>
                  </div>
                  <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <MapPinIcon className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-500">Map integration coming soon</p>
                    </div>
                  </div>
                  <button className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-all">
                    <MapPinIcon className="h-4 w-4 mr-2" />
                    Get Directions
                  </button>
                </div>
              ) : (
                <div className="text-center py-12">
                  <MapPinIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No venue information available</p>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Ticket Purchase Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sticky top-8">
              <div className="text-center space-y-4">
                <div>
                  <div className="text-4xl font-bold text-gray-900">{formatPrice(event.price)}</div>
                  <div className="text-gray-600">per ticket</div>
                </div>
                
                {event.ticket_url ? (
                  <a
                    href={event.ticket_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center px-6 py-3 bg-purple-600 text-white rounded-xl font-semibold hover:bg-purple-700 transition-all shadow-lg hover:shadow-xl"
                  >
                    <TicketIcon className="h-5 w-5 mr-2" />
                    Get Tickets Now
                  </a>
                ) : (
                  <button className="w-full inline-flex items-center justify-center px-6 py-3 bg-gray-400 text-white rounded-xl font-semibold cursor-not-allowed">
                    <TicketIcon className="h-5 w-5 mr-2" />
                    Tickets Not Available
                  </button>
                )}

                {event.capacity && (
                  <p className="text-sm text-gray-600">{event.capacity} spots available</p>
                )}

                <button
                  onClick={handleShare}
                  className="w-full inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-all"
                >
                  <ShareIcon className="h-4 w-4 mr-2" />
                  Share Event
                </button>
              </div>
            </div>

            {/* Quick Details Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Details</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <CalendarDaysIcon className="h-5 w-5 text-purple-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-600">Date</p>
                    <p className="text-gray-900">{formatDate(event.date)}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <ClockIcon className="h-5 w-5 text-purple-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-600">Time</p>
                    <p className="text-gray-900">{event.time}</p>
                  </div>
                </div>

                {event.category && (
                  <div className="flex items-center space-x-3">
                    <TagIcon className="h-5 w-5 text-purple-600" />
                    <div>
                      <p className="text-sm font-medium text-gray-600">Category</p>
                      <p className="text-gray-900 capitalize">{event.category}</p>
                    </div>
                  </div>
                )}

                {event.capacity && (
                  <div className="flex items-center space-x-3">
                    <UsersIcon className="h-5 w-5 text-purple-600" />
                    <div>
                      <p className="text-sm font-medium text-gray-600">Capacity</p>
                      <p className="text-gray-900">{event.capacity} people</p>
                    </div>
                  </div>
                )}

                <div className="flex items-center space-x-3">
                  <CheckCircleIcon className="h-5 w-5 text-purple-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-600">Status</p>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getEventStatusColor(event.status)}`}>
                      {event.status || 'Active'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Gallery Modal */}
      {showGallery && event.gallery && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="relative max-w-4xl max-h-full">
            <button
              onClick={() => setShowGallery(false)}
              className="absolute -top-12 right-0 text-white hover:text-gray-300"
            >
              <span className="text-2xl">&times;</span>
            </button>
            <img
              src={`${API_BASE_URL}${event.gallery.split(',')[selectedImageIndex]}`}
              alt={`${event.name} - Image ${selectedImageIndex + 1}`}
              className="max-w-full max-h-full object-contain rounded-lg"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewEvent;
