import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import favoriteService from '../../api/favoriteService';
import {
    CalendarIcon,
    MapPinIcon,
    ClockIcon,
    HeartIcon,
    ShareIcon,
    TicketIcon,
    UsersIcon,
    TagIcon,
    PhotoIcon,
    StarIcon,
    EyeIcon,
    CheckCircleIcon,
    ChevronLeftIcon,
    ChevronRightIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon, StarIcon as StarSolidIcon } from '@heroicons/react/24/solid';
import API_BASE_URL from '../../api/config';
import EventBookedArtists from '../../components/Events/EventBookedArtists';
import SimilarEvents from '../../components/Events/SimilarEvents';

const ShowEvent = () => {
    const { id } = useParams();
    const { currentUser, isAuthenticated } = useAuth();
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [venue, setVenue] = useState(null);
    const [bookedArtists, setBookedArtists] = useState([]);
    const [isLiked, setIsLiked] = useState(false);
    const [isInterested, setIsInterested] = useState(false);
    const [attendeeCount, setAttendeeCount] = useState(0);
    const [eventRating, setEventRating] = useState(0);
    const [showGallery, setShowGallery] = useState(false);
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    // Check if current user is the event owner
    const isEventOwner = React.useMemo(() => {
        if (!isAuthenticated || !currentUser || !event) return false;
        if (event.owner_type === 'artist' && currentUser.artist_id === event.owner_id) return true;
        if (event.owner_type === 'organiser' && currentUser.organiser_id === event.owner_id) return true;
        return false;
    }, [isAuthenticated, currentUser, event]);

    useEffect(() => {
        fetchEventDetails();
    }, [id]);

    const fetchEventDetails = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/api/events/${id}`);
            const eventData = response.data.event;
            setEvent(eventData);

            // Fetch event artists
            try {
                const artistsRes = await axios.get(`${API_BASE_URL}/api/events/${id}/artists`);
                if (artistsRes.data?.success) {
                    setBookedArtists(artistsRes.data.artists || []);
                } else if (artistsRes.data?.artists) {
                    setBookedArtists(artistsRes.data.artists);
                } else {
                    setBookedArtists([]);
                }
            } catch (e) {
                console.error('Error fetching event artists:', e);
                setBookedArtists([]);
            }

            // Fetch venue details if venue_id exists
            if (eventData.venue_id) {
                try {
                    const venueRes = await axios.get(`${API_BASE_URL}/api/venue/public/${eventData.venue_id}`);
                    setVenue(venueRes.data.venue);
                } catch (venueError) {
                    console.warn('Venue details not available:', venueError.message);
                }
            }

            // Set mock data for demo
            setAttendeeCount(Math.floor(Math.random() * 200) + 50);
            setEventRating(4.2);

        } catch (err) {
            console.error('Error fetching event:', err);
            setError(err.response?.data?.message || 'Failed to load event');
        } finally {
            setLoading(false);
        }
    };

    // Check favorite status when event and user are loaded
    useEffect(() => {
        const checkFavoriteStatus = async () => {
            if (event && isAuthenticated && event.owner_type) {
                try {
                    const favoriteType = event.owner_type;
                    const itemId = event.owner_id;
                    const result = await favoriteService.checkFavorite(favoriteType, itemId);
                    setIsLiked(result.isFavorite);
                } catch (error) {
                    console.error('Error checking favorite status:', error);
                }
            }
        };
        checkFavoriteStatus();
    }, [event, isAuthenticated]);

    // Parse gallery images
    const galleryImages = React.useMemo(() => {
        if (event?.gallery) {
            try {
                const parsed = JSON.parse(event.gallery);
                if (Array.isArray(parsed)) {
                    return parsed.filter(img => img && img.trim());
                }
            } catch (e) {
                if (typeof event.gallery === 'string') {
                    return event.gallery.split(',').filter(img => img && img.trim());
                }
            }
        }
        return [];
    }, [event?.gallery]);

    // Get main image (poster, main_picture, or first gallery image)
    const mainImage = React.useMemo(() => {
        if (event?.poster) return event.poster;
        if (event?.main_picture) return event.main_picture;
        if (galleryImages.length > 0) return galleryImages[0];
        return null;
    }, [event?.poster, event?.main_picture, galleryImages]);

    // Carousel navigation functions
    const nextImage = () => {
        if (galleryImages.length > 0) {
            setCurrentImageIndex((prev) => (prev + 1) % galleryImages.length);
        }
    };

    const prevImage = () => {
        if (galleryImages.length > 0) {
            setCurrentImageIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length);
        }
    };

    // Helper functions
    const formatPrice = (price) => {
        if (!price || Number(price) === 0) return 'Free';
        return `R${Number(price).toLocaleString('en-ZA')}`;
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

    const handleLike = async () => {
        if (!isAuthenticated) {
            alert('Please log in to add favorites');
            return;
        }

        try {
            const favoriteType = event.owner_type;
            const itemId = event.owner_id;

            if (isLiked) {
                await favoriteService.removeFavorite(favoriteType, itemId);
                setIsLiked(false);
                setAttendeeCount(prev => Math.max(0, prev - 1));
            } else {
                await favoriteService.addFavorite(favoriteType, itemId);
                setIsLiked(true);
                setAttendeeCount(prev => prev + 1);
            }
        } catch (error) {
            console.error('Error toggling favorite:', error);
            alert('Failed to update favorite status. Please try again.');
        }
    };

    const handleInterest = () => {
        setIsInterested(!isInterested);
        setAttendeeCount(prev => isInterested ? Math.max(0, prev - 1) : prev + 1);
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
            navigator.clipboard.writeText(window.location.href);
            alert('Event link copied to clipboard!');
        }
    };

    const handleEdit = () => {
        if (currentUser.artist_id) {
            window.location.href = `/artist/dashboard/events/edit/${event.id}`;
        } else if (currentUser.organiser_id) {
            window.location.href = `/organiser/dashboard/events/edit/${event.id}`;
        }
    };

    // Loading state
    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-200 border-t-purple-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading event details...</p>
                </div>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Error</h2>
                    <p className="text-gray-600 mb-4">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    // Not found state
    if (!event) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Event Not Found</h2>
                    <p className="text-gray-600">The event you are looking for does not exist.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section */}
            <div className="relative h-96 md:h-[500px] overflow-hidden">
                {galleryImages.length > 1 ? (
                    // Carousel for multiple gallery images
                    <div className="relative w-full h-full">
                        <img
                            src={`${API_BASE_URL}${galleryImages[currentImageIndex]}`}
                            alt={`${event.name} - Image ${currentImageIndex + 1}`}
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/40"></div>
                        
                        {/* Carousel Controls */}
                        <button
                            onClick={prevImage}
                            className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white/20 hover:bg-white/30 rounded-full transition-all"
                        >
                            <ChevronLeftIcon className="h-6 w-6 text-white" />
                        </button>
                            <button
                            onClick={nextImage}
                            className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white/20 hover:bg-white/30 rounded-full transition-all"
                            >
                            <ChevronRightIcon className="h-6 w-6 text-white" />
                            </button>
                        
                        {/* Dots Indicator */}
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
                            {galleryImages.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => setCurrentImageIndex(index)}
                                    className={`w-2 h-2 rounded-full transition-all ${
                                        index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                                    }`}
                                />
                            ))}
                        </div>
                    </div>
                ) : mainImage ? (
                    // Single image background
                    <div className="relative w-full h-full">
                        <img
                            src={`${API_BASE_URL}${mainImage}`}
                            alt={event.name}
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/40"></div>
                    </div>
                ) : (
                    // Fallback gradient background
                    <div className="w-full h-full bg-gradient-to-br from-purple-600 to-blue-600"></div>
                )}
                
                {/* Hero Content */}
                <div className="absolute inset-0 flex items-end">
                    <div className="w-full bg-gradient-to-t from-black/80 to-transparent p-6 md:p-8">
                        <div className="max-w-7xl mx-auto">
                            <div className="flex items-end justify-between">
                                <div className="text-white">
                                    <h1 className="text-4xl md:text-6xl font-bold mb-2">{event.name}</h1>
                                    <div className="flex items-center space-x-6 text-lg">
                                        <div className="flex items-center space-x-2">
                                            <CalendarIcon className="h-5 w-5" />
                                            <span>{formatDate(event.date)}</span>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <ClockIcon className="h-5 w-5" />
                                            <span>{event.time || 'TBD'}</span>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <MapPinIcon className="h-5 w-5" />
                                            <span>{venue?.name || 'Venue TBD'}</span>
                    </div>
                </div>
            </div>

                                <div className="flex items-center space-x-4">
                                <button
                                    onClick={handleLike}
                                        className="p-3 bg-white/20 hover:bg-white/30 rounded-full transition-all"
                                >
                                    {isLiked ? (
                                            <HeartSolidIcon className="h-6 w-6 text-red-400" />
                                    ) : (
                                            <HeartIcon className="h-6 w-6 text-white" />
                                    )}
                                </button>
                                <button
                                    onClick={handleShare}
                                        className="p-3 bg-white/20 hover:bg-white/30 rounded-full transition-all"
                                    >
                                        <ShareIcon className="h-6 w-6 text-white" />
                                    </button>
                                    {isEventOwner && (
                                        <button
                                            onClick={handleEdit}
                                            className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-all"
                                        >
                                            Edit Event
                                </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                            </div>
                        </div>

            {/* Main Content Grid */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    {/* Left Column - Main Info */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* About Section */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">About This Event</h2>
                            {event.description ? (
                                <div className="space-y-4">
                                    <p className="text-gray-700 leading-relaxed text-lg">{event.description}</p>
                                    <div className="flex flex-wrap gap-2">
                                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
                                            {event.category || 'General'}
                                        </span>
                                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                                            {event.capacity ? `${event.capacity} capacity` : 'Open event'}
                                        </span>
                                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getEventStatusColor(event.status)}`}>
                                            {event.status || 'Active'}
                                        </span>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                <p className="text-gray-500 italic">No description provided for this event.</p>
                                    <div className="flex flex-wrap gap-2">
                                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
                                            {event.category || 'General'}
                                        </span>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Event Statistics */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">Event Statistics</h2>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="text-center p-4 bg-gray-50 rounded-lg">
                                    <div className="text-2xl font-bold text-purple-600">{attendeeCount}</div>
                                    <div className="text-sm text-gray-600">Interested</div>
                                </div>
                                <div className="text-center p-4 bg-gray-50 rounded-lg">
                                    <div className="text-2xl font-bold text-purple-600">{eventRating}</div>
                                    <div className="text-sm text-gray-600">Rating</div>
                                </div>
                                <div className="text-center p-4 bg-gray-50 rounded-lg">
                                    <div className="text-2xl font-bold text-purple-600">{event.capacity || '∞'}</div>
                                    <div className="text-sm text-gray-600">Capacity</div>
                                </div>
                                <div className="text-center p-4 bg-gray-50 rounded-lg">
                                    <div className="text-2xl font-bold text-purple-600">{galleryImages.length}</div>
                                    <div className="text-sm text-gray-600">Photos</div>
                                </div>
                            </div>
                        </div>

                        {/* Booked Artists */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">Booked Artists</h2>
                            <EventBookedArtists artists={bookedArtists} />
                        </div>

                        {/* What to Expect */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">What to Expect</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="flex items-start space-x-3">
                                    <CheckCircleIcon className="h-6 w-6 text-green-500 mt-1" />
                                    <div>
                                        <p className="font-semibold text-gray-900">Live Performance</p>
                                        <p className="text-gray-600 text-sm">Experience amazing live entertainment</p>
                                    </div>
                                </div>
                                <div className="flex items-start space-x-3">
                                    <CheckCircleIcon className="h-6 w-6 text-green-500 mt-1" />
                                    <div>
                                        <p className="font-semibold text-gray-900">Great Atmosphere</p>
                                        <p className="text-gray-600 text-sm">Connect with fellow music lovers</p>
                                    </div>
                                </div>
                                <div className="flex items-start space-x-3">
                                    <CheckCircleIcon className="h-6 w-6 text-green-500 mt-1" />
                                    <div>
                                        <p className="font-semibold text-gray-900">Quality Sound</p>
                                        <p className="text-gray-600 text-sm">Professional audio equipment</p>
                                    </div>
                                </div>
                                <div className="flex items-start space-x-3">
                                    <CheckCircleIcon className="h-6 w-6 text-green-500 mt-1" />
                                    <div>
                                        <p className="font-semibold text-gray-900">Memorable Experience</p>
                                        <p className="text-gray-600 text-sm">Create lasting memories</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Similar Events */}
                        <SimilarEvents currentEvent={event} currentEventId={id} />
                    </div>

                    {/* Right Column - Details & Actions */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Ticket Purchase Card */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 top-8">
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
                            </div>
                        </div>

                        {/* Event Details Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Date & Time */}
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                                <div className="flex items-center space-x-3 mb-2">
                                    <CalendarIcon className="h-5 w-5 text-purple-600" />
                                    <span className="font-semibold text-gray-900">Date & Time</span>
                                </div>
                                <p className="text-gray-700">{formatDate(event.date)}</p>
                                <p className="text-gray-600">{event.time || 'TBD'}</p>
                            </div>

                            {/* Location */}
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                                <div className="flex items-center space-x-3 mb-2">
                                    <MapPinIcon className="h-5 w-5 text-purple-600" />
                                    <span className="font-semibold text-gray-900">Location</span>
                                </div>
                                <p className="text-gray-700">{venue?.name || 'Venue TBD'}</p>
                                {venue?.address && (
                                    <p className="text-gray-600 text-sm">{venue.address}</p>
                                )}
                            </div>

                            {/* Category & Status */}
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                                <div className="flex items-center space-x-3 mb-2">
                                    <TagIcon className="h-5 w-5 text-purple-600" />
                                    <span className="font-semibold text-gray-900">Category</span>
                                </div>
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
                                    {event.category || 'General'}
                                </span>
                            </div>

                            {/* Attendees & Rating */}
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                                <div className="flex items-center space-x-3 mb-2">
                                    <UsersIcon className="h-5 w-5 text-purple-600" />
                                    <span className="font-semibold text-gray-900">Interest</span>
                                </div>
                                <p className="text-gray-700">{attendeeCount} interested</p>
                                <div className="flex items-center space-x-1 mt-1">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <StarSolidIcon
                                            key={star}
                                            className={`h-4 w-4 ${star <= eventRating ? 'text-yellow-400' : 'text-gray-300'}`}
                                        />
                                    ))}
                                    <span className="text-sm text-gray-600 ml-1">{eventRating}/5</span>
                                </div>
                            </div>
                        </div>

                        {/* Event Gallery */}
                        {galleryImages.length > 0 && (
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                                <h2 className="text-2xl font-bold text-gray-900 mb-4">Event Gallery</h2>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                    {galleryImages.map((image, index) => (
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
                            </div>
                        )}

                        {/* Event Tips */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">Event Tips</h2>
                            <div className="space-y-3">
                                <div className="flex items-start space-x-3">
                                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                        <CheckCircleIcon className="h-4 w-4 text-green-600" />
                                    </div>
                                    <p className="text-gray-700 text-sm">Arrive 15-30 minutes early for the best seats</p>
                                </div>
                                <div className="flex items-start space-x-3">
                                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                        <CheckCircleIcon className="h-4 w-4 text-green-600" />
                                    </div>
                                    <p className="text-gray-700 text-sm">Bring a valid ID for age verification</p>
                                </div>
                                <div className="flex items-start space-x-3">
                                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                        <CheckCircleIcon className="h-4 w-4 text-green-600" />
                                    </div>
                                    <p className="text-gray-700 text-sm">Check venue parking options in advance</p>
                                </div>
                                <div className="flex items-start space-x-3">
                                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                        <CheckCircleIcon className="h-4 w-4 text-green-600" />
                                    </div>
                                    <p className="text-gray-700 text-sm">Follow the event on social media for updates</p>
                                </div>
                                    </div>
                                </div>

                        {/* Event Reviews */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">Event Reviews</h2>
                            <div className="space-y-4">
                                <div className="flex items-center space-x-4">
                                    <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                                        <span className="text-purple-600 font-semibold">JD</span>
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center space-x-2 mb-1">
                                            <span className="font-semibold text-gray-900">John Doe</span>
                                            <div className="flex items-center space-x-1">
                                                {[1, 2, 3, 4, 5].map((star) => (
                                                    <StarSolidIcon
                                                        key={star}
                                                        className="h-4 w-4 text-yellow-400"
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                        <p className="text-gray-600 text-sm">"Amazing event! Great atmosphere and fantastic performances."</p>
                                    </div>
                                        </div>
                                <div className="flex items-center space-x-4">
                                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                        <span className="text-blue-600 font-semibold">SM</span>
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center space-x-2 mb-1">
                                            <span className="font-semibold text-gray-900">Sarah Miller</span>
                                            <div className="flex items-center space-x-1">
                                                {[1, 2, 3, 4].map((star) => (
                                                    <StarSolidIcon
                                                        key={star}
                                                        className="h-4 w-4 text-yellow-400"
                                                    />
                                                ))}
                                                <StarSolidIcon className="h-4 w-4 text-gray-300" />
                                            </div>
                                        </div>
                                        <p className="text-gray-600 text-sm">"Really enjoyed the music and the venue was perfect."</p>
                                    </div>
                                </div>
                                <button className="w-full text-center py-2 text-purple-600 hover:text-purple-700 font-medium">
                                    View All Reviews
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Gallery Modal */}
            {showGallery && galleryImages.length > 0 && (
                <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
                    <div className="relative max-w-4xl max-h-full">
                        <button
                            onClick={() => setShowGallery(false)}
                            className="absolute -top-12 right-0 text-white hover:text-gray-300"
                        >
                            <span className="text-2xl">&times;</span>
                        </button>
                        <img
                            src={`${API_BASE_URL}${galleryImages[selectedImageIndex]}`}
                            alt={`${event.name} - Image ${selectedImageIndex + 1}`}
                            className="max-w-full max-h-full object-contain rounded-lg"
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default ShowEvent;