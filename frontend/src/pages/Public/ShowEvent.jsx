import React from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import favoriteService from '../../api/favoriteService';
import {
    CalendarIcon,
    MapPinIcon,
    EnvelopeIcon,
    PhoneIcon,
    LinkIcon,
    UserIcon,
    HeartIcon,
    ShareIcon,
    SparklesIcon,
    TicketIcon,
    UsersIcon,
    ClockIcon,
    ArrowTopRightOnSquareIcon,
    BuildingLibraryIcon,
    PencilIcon,
    PhotoIcon
} from '@heroicons/react/24/outline';
import API_BASE_URL, { APP_BASE_PATH } from '../../api/config';
import GalleryImage from '../../components/GalleryImage';
import ArtistMiniCard from '../../components/Artist/ArtistMiniCard';
import VenueCardV2 from '../../components/Venue/VenueCardV2';
import { HeroBreadcrumb } from '../../components/UI/DynamicBreadcrumb';
import LiveEventsMap from '../../components/Map/LiveEventsMap';
import ArtistsBlock from '../../components/TemplateStructure/ArtistsBlock';
import GalleryPlaceholder from '../../components/TemplateStructure/GalleryPlaceholder';
import DisplayPicture from '../../components/UI/DisplayPicture';
import EventGallery from '../../components/Events/EventGallery';
import RatingSystem from '../../components/UI/RatingSystem';

const ShowEvent = () => {
    const { id } = useParams();
    const { currentUser, isAuthenticated } = useAuth();
    const [event, setEvent] = React.useState(null);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState(null);
    const [venue, setVenue] = React.useState(null);
    const [creator, setCreator] = React.useState(null);
    const [creatorType, setCreatorType] = React.useState(null);

    const [isInterested, setIsInterested] = React.useState(false);
    const [attendeeCount, setAttendeeCount] = React.useState(Math.floor(Math.random() * 150) + 50);
    const [isFavorite, setIsFavorite] = React.useState(false);
    const [favoriteLoading, setFavoriteLoading] = React.useState(false);
    // Function to get settings for current user from the settings column of their user type (artist or organiser) table
    const getUserSettings = React.useCallback(() => {
        
        return currentUser;
    }, [currentUser]);
    
    console.log('User settings:', getUserSettings());

    // Check if current user is the event owner
    const isEventOwner = React.useMemo(() => {
        if (!isAuthenticated || !currentUser || !event) return false;

        // Check if user is the artist owner
        if (event.owner_type === 'artist' && currentUser.artist_id === event.owner_id) {
            return true;
        }

        // Check if user is the organiser owner
        if (event.owner_type === 'organiser' && currentUser.organiser_id === event.owner_id) {
            return true;
        }

        return false;
    }, [isAuthenticated, currentUser, event]);

    // Add defensive checks for event properties
    const safeEvent = React.useMemo(() => {
        if (!event) return null;
        return {
            ...event,
            name: event.name || 'Untitled Event',
            date: event.date || new Date().toISOString(),
            time: event.time || 'TBD',
            description: event.description || '',
            category: event.category || '',
            price: event.price || 0,
            capacity: event.capacity || 0,
            status: event.status || 'active',
            poster: event.poster || null,
            gallery: event.gallery || '',
            venue_id: event.venue_id || null,
            owner_type: event.owner_type || 'organiser',
            owner_id: event.owner_id || null
        };
    }, [event]);

    React.useEffect(() => {
        const fetchEvent = async () => {
            try {
                console.log('Fetching event with ID:', id);
                console.log('API URL:', `${API_BASE_URL}/api/events/${id}`);

                const response = await axios.get(`${API_BASE_URL}/api/events/${id}`);
                const eventData = response.data.event;
                console.log('Raw event data received:', eventData);
                console.log('Gallery data:', eventData.gallery);
                setEvent(eventData);

                // Determine creator type and fetch creator details
                if (eventData.owner_type === 'artist') {
                    setCreatorType('artist');
                    await fetchCreatorDetails('artists', eventData.owner_id);
                } else if (eventData.owner_type === 'organiser') {
                    setCreatorType('organiser');
                    await fetchCreatorDetails('organisers', eventData.owner_id);
                }

                // Fetch venue details if venue_id exists
                if (eventData.venue_id) {
                    try {
                        await fetchVenueDetails(eventData.venue_id);
                    } catch (venueError) {
                        console.warn('Venue details not available:', venueError.message);
                        // Continue without venue data - page will still work
                    }
                }

            } catch (err) {
                console.error('Error fetching event:', err);
                console.error('Error response:', err.response);
                setError(err.response?.data?.message || 'Failed to load event');
            } finally {
                setLoading(false);
            }
        };

        fetchEvent();
    }, [id]);

    // Check favorite status when event and user are loaded
    React.useEffect(() => {
        const checkFavoriteStatus = async () => {
            if (event && isAuthenticated && event.owner_type) {
                try {
                    const favoriteType = event.owner_type; // 'artist' or 'organiser'
                    const itemId = event.owner_id;
                    const result = await favoriteService.checkFavorite(favoriteType, itemId);
                    setIsFavorite(result.isFavorite);
                } catch (error) {
                    console.error('Error checking favorite status:', error);
                }
            }
        };

        checkFavoriteStatus();
    }, [event, isAuthenticated]);

    const fetchCreatorDetails = async (type, creatorId) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/api/${type}/${creatorId}`);
            setCreator(response.data);
        } catch (err) {
            console.error(`Failed to fetch ${type} details:`, err);
        }
    };

    const fetchVenueDetails = async (venueId) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/api/venue/public/${venueId}`);
            setVenue(response.data.venue);
        } catch (err) {
            console.error('Failed to fetch venue details:', err);
        }
    };

    // Parse gallery images if they exist (moved after useEffect to avoid hook order issues)
    const galleryImages = React.useMemo(() => {
        if (event?.gallery) {
            try {
                // First try to parse as JSON (new format)
                const parsed = JSON.parse(event.gallery);
                if (Array.isArray(parsed)) {
                    console.log('Parsed gallery images (JSON format):', parsed);
                    return parsed.filter(img => img && img.trim());
                }
            } catch (e) {
                // If JSON parsing fails, try comma-separated format (old format)
                if (typeof event.gallery === 'string') {
                    const images = event.gallery.split(',').filter(img => img && img.trim());
                    console.log('Parsed gallery images (comma-separated format):', images);
            return images;
                }
            }
        }
        // Return empty array if no gallery
        console.log('No gallery found for event');
        return [];
    }, [event?.gallery]);

    // Check if we have real gallery images (not test images)
    const hasRealGallery = galleryImages.length > 0;

    // Log event loading for debugging if needed
    React.useEffect(() => {
        if (event) {
            console.log('Event loaded:', event.name, '| Gallery images:', galleryImages.length, '| Has real gallery:', hasRealGallery);
            if (event.gallery) {
                console.log('Raw gallery data:', event.gallery);
            }
        }
    }, [event, galleryImages, hasRealGallery]);

    // Auto-advance carousel (optional)
    React.useEffect(() => {
        if (galleryImages.length > 5) {
            const interval = setInterval(() => {
                setCurrentCarouselIndex((prev) => {
                    const totalSlides = Math.ceil(galleryImages.length / 5);
                    if (prev >= totalSlides - 1) {
                        return 0; // Loop back to first slide
                    }
                    return prev + 1;
                });
            }, 5000); // Auto-advance every 5 seconds

            return () => clearInterval(interval);
        }
    }, [galleryImages.length]);

    // Render loading state
    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="relative mb-6">
                        <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-200 border-t-purple-600 mx-auto"></div>
                        <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-purple-400 to-blue-400 opacity-20 animate-pulse"></div>
                    </div>
                    <p className="text-gray-700 text-lg font-medium">Loading event details...</p>
                    <div className="mt-4 flex justify-center space-x-1">
                        <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                </div>
            </div>
        );
    }

    // Render error state
    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center text-red-500">
                    <p className="text-xl mb-2">Error</p>
                    <p>{error}</p>
                </div>
            </div>
        );
    }

    // Render not found state
    if (!event) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <p className="text-xl text-gray-600">Event not found</p>
                </div>
            </div>
        );
    }

    // Format date
    const eventDate = new Date(event.date).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });

    // Calculate days until event for countdown
    const today = new Date();
    const timeDiff = new Date(event.date).getTime() - today.getTime();
    const daysUntil = Math.ceil(timeDiff / (1000 * 3600 * 24));





    const handleInterestToggle = async () => {
        // If user is not authenticated, redirect to login or show message
        if (!isAuthenticated) {
            alert('Please log in to add favorites');
            return;
        }

        setFavoriteLoading(true);

        try {
            // Determine the favorite type based on event owner
            const favoriteType = event.owner_type; // 'artist' or 'organiser'
            const itemId = event.owner_id;

            if (isFavorite) {
                await favoriteService.removeFavorite(favoriteType, itemId);
                setIsFavorite(false);
                setAttendeeCount(prev => prev - 1);
            } else {
                await favoriteService.addFavorite(favoriteType, itemId);
                setIsFavorite(true);
                setAttendeeCount(prev => prev + 1);
            }
        } catch (error) {
            console.error('Error toggling favorite:', error);
            alert('Failed to update favorite status. Please try again.');
        } finally {
            setFavoriteLoading(false);
        }
    };

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: event.name,
                text: `Check out this amazing event: ${event.name}`,
                url: window.location.href,
            });
        } else {
            navigator.clipboard.writeText(window.location.href);
            alert('Event link copied to clipboard!');
        }
    };

    const handleEdit = () => {
        // Navigate to edit page based on user type
        if (currentUser.artist_id) {
            window.location.href = `${APP_BASE_PATH}/artist/dashboard/events/edit/${event.id}`;
        } else if (currentUser.organiser_id) {
            window.location.href = `${APP_BASE_PATH}/organiser/dashboard/events/edit/${event.id}`;
        }
    };





    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
            {/* Enhanced Hero Section */}
            <div className="relative w-full h-[500px] overflow-hidden">
                {/* Floating Action Buttons */}
                <div className="absolute top-6 right-6 z-20 flex space-x-3">
                    <button
                        onClick={handleShare}
                        className="bg-white/90 backdrop-blur-sm text-gray-700 p-3 rounded-full shadow-lg hover:shadow-xl hover:bg-purple-100 transition-all duration-300 hover:scale-110 group"
                    >
                        <ShareIcon className="h-5 w-5 group-hover:text-purple-600 transition-colors duration-300" />
                    </button>
                    <button
                        onClick={handleInterestToggle}
                        disabled={favoriteLoading}
                        className={`backdrop-blur-sm p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 group ${isFavorite
                            ? 'bg-red-500 text-white hover:bg-red-600'
                            : 'bg-white/90 text-gray-700 hover:bg-red-50 hover:text-red-500'
                            } ${favoriteLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        <HeartIcon className={`h-5 w-5 transition-all duration-300 ${isFavorite ? 'fill-current' : 'group-hover:fill-current'
                            }`} />
                    </button>
                </div>

                <div className="absolute inset-0 w-full h-full">
                    <DisplayPicture
                        imagePath={event.poster}
                        alt={event.name || 'Event'}
                        fallbackIcon={CalendarIcon}
                        fallbackText="Event Poster Coming Soon"
                        size="custom"
                        containerClassName="w-full h-full"
                        className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700"
                        id="event-poster"
                        showOverlay={true}
                    />
                    {/* Additional gradient overlays for the hero section */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/30 via-transparent to-blue-900/30"></div>
                    </div>

                {/* Enhanced Content Overlay */}
                <div className="absolute inset-0 flex items-end">
                    <div className="p-8 w-full mb-14">
                        {/* Breadcrumb at the top of content */}
                        <div className="max-w-6xl mx-auto mb-8">
                            <HeroBreadcrumb
                                customBreadcrumbs={[
                                    { label: 'Events', path: '/events', icon: null },
                                    { label: event?.name || 'Event', path: `/events/${id}`, isLast: true }
                                ]}
                                showHome={true}
                            />
                        </div>

                        <div className="max-w-6xl mx-auto">
                            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between">
                                <div className="flex-1 mb-6 lg:mb-0">
                                    {event.category && (
                                        <div className="mb-4">
                                            <span className="inline-flex items-center bg-purple-600/90 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg">
                                                <SparklesIcon className="h-4 w-4 mr-2" />
                                                {event.category}
                                            </span>
                                        </div>
                                    )}
                                    <h1 className="text-4xl lg:text-6xl font-black text-white drop-shadow-2xl mb-4 leading-tight">
                                        {event.name}
                                    </h1>
                                    <div className="flex flex-wrap items-center gap-6 text-white/90 text-lg">
                                        <div className="flex items-center">
                                            <CalendarIcon className="h-6 w-6 mr-2 text-purple-300" />
                                            <span>{eventDate}</span>
                                        </div>
                                        <div className="flex items-center">
                                            <ClockIcon className="h-6 w-6 mr-2 text-blue-300" />
                                            <span>{event.time}</span>
                                        </div>
                                        {venue && venue.name && (
                                            <div className="flex items-center">
                                                <MapPinIcon className="h-6 w-6 mr-2 text-pink-300" />
                                                <span>{venue.name}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Social Proof Cards */}
                                <div className="flex gap-4">
                                    {daysUntil > 0 && (
                                        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 text-center shadow-xl">
                                            <div className="text-3xl font-bold text-white">{daysUntil}</div>
                                            <div className="text-purple-200 text-sm">Days to go!</div>
                                        </div>
                                    )}
                                    <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 text-center shadow-xl">
                                        <div className="flex items-center justify-center mb-1">
                                            <UsersIcon className="h-5 w-5 text-blue-300 mr-1" />
                                            <span className="text-2xl font-bold text-white">{attendeeCount}</span>
                                        </div>
                                        <div className="text-blue-200 text-sm">Interested</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-4 py-8">
                <div className="relative -mt-20 mb-8 bg-white rounded-2xl shadow-xl overflow-hidden">
                    {/* Enhanced Event Header */}
                    <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-purple-50 to-blue-50">
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                            <div className="flex-1">
                                <div className="diplayPosterPic">
                                    <DisplayPicture
                                        imagePath={event.poster}
                                        alt={event.name || 'Event'}
                                        fallbackIcon={CalendarIcon}
                                        fallbackText="Event Poster"
                                        size="medium"
                                        className="transform hover:scale-105 transition-transform duration-700"
                                        id="event-poster-thumbnail"
                                    />
                                </div>
                                <div className="flex items-center gap-4 mb-3">
                                    <button
                                        onClick={handleInterestToggle}
                                        disabled={favoriteLoading}
                                        className={`p-2 rounded-full transition-all duration-300 hover:scale-110 ${isFavorite
                                            ? 'bg-red-100 text-red-600'
                                            : 'bg-gray-100 text-gray-400 hover:bg-red-50 hover:text-red-500'
                                            } ${favoriteLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    >
                                        <HeartIcon className={`h-6 w-6 ${isFavorite ? 'fill-current' : ''}`} />
                                    </button>
                                </div>
                                <div className="flex flex-wrap items-center gap-4 text-gray-600 mb-3">
                                    <div className="flex items-center">
                                        <CalendarIcon className="h-5 w-5 mr-2 text-purple-500" />
                                        <span className="font-medium">{eventDate}</span>
                                    </div>
                                    <div className="flex items-center">
                                        <ClockIcon className="h-5 w-5 mr-2 text-blue-500" />
                                        <span className="font-medium">{event.time}</span>
                                    </div>
                                    {attendeeCount && (
                                        <div className="flex items-center">
                                            <UsersIcon className="h-5 w-5 mr-2 text-green-500" />
                                            <span className="font-medium">{attendeeCount} interested</span>
                                        </div>
                                    )}
                                </div>
                                {event.category && (
                                    <span className="inline-flex items-center bg-gradient-to-r from-purple-600 to-blue-600 text-white text-sm font-medium px-4 py-2 rounded-full shadow-md">
                                        <SparklesIcon className="h-4 w-4 mr-2" />
                                        {event.category}
                                    </span>
                                )}
                            </div>

                            {/* Enhanced Price and Action Card */}
                            <div className="mt-4 lg:mt-0 lg:ml-6">
                                <div className="bg-gradient-to-br from-purple-50 to-blue-50 p-4 rounded-xl min-w-[220px] shadow-lg">
                                    {event.price && event.price > 0 ? (
                                        <div className="mb-4 text-center">
                                            <p className="text-3xl font-black text-gray-900 mb-1">R{event.price}</p>
                                            <p className="text-sm text-gray-600 bg-white px-3 py-1 rounded-full inline-block">per ticket</p>
                                        </div>
                                    ) : (
                                        <div className="mb-4 text-center">
                                            <p className="text-2xl font-black text-green-600 mb-1">FREE</p>
                                            <p className="text-sm text-gray-600 bg-white px-3 py-1 rounded-full inline-block">No cost to attend</p>
                                        </div>
                                    )}

                                    {isEventOwner ? (
                                        // Edit button for event owner
                                        <button
                                            onClick={handleEdit}
                                            className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold py-3 px-4 rounded-xl transition-all duration-300 flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-105 group"
                                        >
                                            <PencilIcon className="h-5 w-5 mr-2" />
                                            <span>Edit Event</span>
                                            <ArrowTopRightOnSquareIcon className="h-5 w-5 ml-2 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
                                        </button>
                                    ) : event.ticket_url ? (
                                        // Ticket button for non-owners with ticket URL
                                        <a
                                            href={event.ticket_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold py-3 px-4 rounded-xl transition-all duration-300 flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-105 group"
                                        >
                                            <TicketIcon className="h-5 w-5 mr-2" />
                                            <span>Get Tickets Now</span>
                                            <ArrowTopRightOnSquareIcon className="h-5 w-5 ml-2 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
                                        </a>
                                    ) : (
                                        // Join button for non-owners without ticket URL
                                        <button className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold py-3 px-4 rounded-xl transition-all duration-300 flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-105">
                                            <SparklesIcon className="h-5 w-5 mr-2" />
                                            <span>Join Event</span>
                                        </button>
                                    )}

                                    {event.capacity && (
                                        <div className="mt-4 text-center">
                                            <div className="bg-white/80 backdrop-blur-sm px-4 py-2 rounded-lg">
                                                <span className="text-sm text-purple-700 font-medium">{event.capacity} spots available</span>
                                            </div>
                                        </div>
                                    )}

                                    {/* Additional CTA */}
                                    <button
                                        onClick={handleShare}
                                        className="w-full mt-2 bg-white hover:bg-gray-50 text-purple-700 font-medium py-2 px-4 rounded-xl transition-all duration-300 flex items-center justify-center shadow-sm"
                                    >
                                        <ShareIcon className="h-5 w-5 mr-2" />
                                        <span>Share Event</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Event Details */}
                    <div className="p-6 space-y-6">
                        {/* Description - Full Width */}
                        {event.description && (
                            <div>
                                <h2 className="text-xl font-semibold text-gray-900 mb-3">About This Event</h2>
                                <div className="prose max-w-none">
                                    <p className="text-gray-700 whitespace-pre-line leading-relaxed text-sm">
                                        {event.description}
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Event Rating System */}
                        <div>
                            <h2 className="text-xl font-semibold text-gray-900 mb-3">Event Rating</h2>
                            <RatingSystem
                                rateableType="event"
                                rateableId={event?.id}
                                label="Event Rating"
                                showForm={true}
                                showReviews={true}
                            />
                        </div>

                        {/* Event Gallery and Quick Details Row - Optimized Layout */}
                        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                            {/* Event Gallery Section - Takes 3 columns */}
                            <div className="lg:col-span-3">
                                <div className="bg-gray-50 rounded-xl p-4">
                                    <div className="flex items-center justify-between mb-4">
                                        <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                                            <PhotoIcon className="h-5 w-5 text-purple-600 mr-2" />
                                            Event Gallery
                                            {galleryImages.length > 0 && (
                                                <span className="ml-2 text-sm text-gray-500">({galleryImages.length} photos)</span>
                                            )}
                                        </h2>
                                        {isEventOwner && (
                                            <button className="text-purple-600 hover:text-purple-700 text-sm font-medium">
                                                + Add Photos
                                            </button>
                                        )}
                                    </div>
                                    <EventGallery
                                        galleryImages={galleryImages}
                                        eventName={event?.name || 'Event'}
                                        eventId={event?.id}
                                        showHeader={false}
                                        isEventOwner={isEventOwner}
                                        onGalleryUpdate={(newGallery) => {
                                            console.log('Gallery updated:', newGallery);
                                            if (newGallery) {
                                                setEvent(prevEvent => ({
                                                    ...prevEvent,
                                                    gallery: Array.isArray(newGallery) ? JSON.stringify(newGallery) : newGallery
                                                }));
                                            }
                                        }}
                                    />
                                </div>
                            </div>

                            {/* Quick Details Sidebar - Takes 1 column */}
                            <div className="lg:col-span-1">
                                <div className="bg-white rounded-xl p-4 shadow-sm">
                                    <h2 className="text-lg font-semibold text-gray-900 flex items-center mb-4">
                                        <CalendarIcon className="h-5 w-5 text-purple-600 mr-2" />
                                        Quick Details
                                    </h2>
                                    
                                    {/* Compact Event Details */}
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between py-2">
                                            <div className="flex items-center">
                                                <CalendarIcon className="h-4 w-4 mr-2 text-purple-500" />
                                                <span className="text-sm text-gray-600">Date</span>
                                            </div>
                                            <span className="text-sm font-medium text-gray-900">{eventDate}</span>
                                        </div>

                                        <div className="flex items-center justify-between py-2">
                                            <div className="flex items-center">
                                                <ClockIcon className="h-4 w-4 mr-2 text-blue-500" />
                                                <span className="text-sm text-gray-600">Time</span>
                                            </div>
                                            <span className="text-sm font-medium text-gray-900">{event.time}</span>
                                        </div>

                                        {event.category && (
                                            <div className="flex items-center justify-between py-2">
                                                <div className="flex items-center">
                                                    <SparklesIcon className="h-4 w-4 mr-2 text-pink-500" />
                                                    <span className="text-sm text-gray-600">Category</span>
                                                </div>
                                                <span className="text-sm font-medium text-gray-900">{event.category}</span>
                                            </div>
                                        )}

                                        {event.capacity && (
                                            <div className="flex items-center justify-between py-2">
                                                <div className="flex items-center">
                                                    <UsersIcon className="h-4 w-4 mr-2 text-green-500" />
                                                    <span className="text-sm text-gray-600">Capacity</span>
                                                </div>
                                                <span className="text-sm font-medium text-gray-900">{event.capacity}</span>
                                            </div>
                                        )}

                                        <div className="flex items-center justify-between py-2">
                                            <div className="flex items-center">
                                                <TicketIcon className="h-4 w-4 mr-2 text-yellow-500" />
                                                <span className="text-sm text-gray-600">Status</span>
                                            </div>
                                            <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                                                event.status === 'active' ? 'bg-green-100 text-green-700' :
                                                event.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                                                'bg-blue-100 text-blue-700'
                                            }`}>
                                                {event.status || 'Scheduled'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                                                {/* Venue Section - Optimized Layout */}
                        {venue && (
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                                        <MapPinIcon className="h-5 w-5 text-purple-600 mr-2" />
                                        Event Location
                                    </h2>
                                </div>

                                {/* Venue Card and Map */}
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                    <div className="h-72">
                                        <VenueCardV2 venue={venue} showActions={true} showStats={true} />
                                    </div>
                                    <div className="h-72 relative">
                                        <LiveEventsMap events={safeEvent ? [safeEvent] : []} />
                                        {/* Get Directions Button Overlay */}
                                        {venue && venue.address && (
                                            <div className="absolute bottom-4 left-4 z-10">
                                                <button 
                                                    onClick={() => {
                                                        const address = encodeURIComponent(venue.address);
                                                        window.open(`https://www.google.com/maps/dir/?api=1&destination=${address}`, '_blank');
                                                    }}
                                                    className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-3 py-2 rounded-lg font-medium transition-all duration-300 flex items-center space-x-2 hover:scale-105 shadow-lg backdrop-blur-sm text-sm"
                                                >
                                                    <MapPinIcon className="h-4 w-4" />
                                                    <span>Get Directions</span>
                                                    <ArrowTopRightOnSquareIcon className="h-4 w-4" />
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}


                    </div>
                </div>




            </div>
        </div>
    );
};

export default ShowEvent;