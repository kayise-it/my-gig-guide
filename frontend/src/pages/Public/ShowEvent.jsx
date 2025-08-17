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
    XMarkIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
    BuildingLibraryIcon,
    PencilIcon
} from '@heroicons/react/24/outline';
import API_BASE_URL from '../../api/config';
import GalleryImage from '../../components/GalleryImage';
import ArtistMiniCard from '../../components/Artist/ArtistMiniCard';
import EnhancedVenueCard from '../../components/Venue/EnhancedVenueCard';
import { HeroBreadcrumb } from '../../components/UI/DynamicBreadcrumb';
import LiveEventsMap from '../../components/Map/LiveEventsMap';
import ArtistsBlock from '../../components/TemplateStructure/ArtistsBlock';
import GalleryPlaceholder from '../../components/TemplateStructure/GalleryPlaceholder';

const ShowEvent = () => {
    const { id } = useParams();
    const { currentUser, isAuthenticated } = useAuth();
    const [event, setEvent] = React.useState(null);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState(null);
    const [venue, setVenue] = React.useState(null);
    const [creator, setCreator] = React.useState(null);
    const [creatorType, setCreatorType] = React.useState(null);
    const [isGalleryOpen, setIsGalleryOpen] = React.useState(false);
    const [selectedImageIndex, setSelectedImageIndex] = React.useState(0);
    const [isInterested, setIsInterested] = React.useState(false);
    const [attendeeCount, setAttendeeCount] = React.useState(Math.floor(Math.random() * 150) + 50);
    const [currentCarouselIndex, setCurrentCarouselIndex] = React.useState(0);
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
            const images = event.gallery.split(',').filter(img => img.trim());
            console.log('Parsed gallery images:', images);
            return images;
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



    // Helper functions
    const openGallery = (index = 0) => {
        setSelectedImageIndex(index);
        setIsGalleryOpen(true);
    };

    const closeGallery = () => {
        setIsGalleryOpen(false);
    };

    const nextImage = () => {
        setSelectedImageIndex((prev) => (prev + 1) % galleryImages.length);
    };

    const prevImage = () => {
        setSelectedImageIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length);
    };

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
            window.location.href = `/artist/dashboard/events/edit/${event.id}`;
        } else if (currentUser.organiser_id) {
            window.location.href = `/organiser/dashboard/events/edit/${event.id}`;
        }
    };

    // Carousel functions
    const imagesPerSlide = 5; // Changed to 5 to match the grid layout
    const totalSlides = Math.ceil(galleryImages.length / imagesPerSlide);

    const nextCarouselSlide = () => {
        setCurrentCarouselIndex((prev) => {
            if (prev >= totalSlides - 1) {
                return 0; // Loop back to first slide
            }
            return prev + 1;
        });
    };

    const prevCarouselSlide = () => {
        setCurrentCarouselIndex((prev) => {
            if (prev <= 0) {
                return totalSlides - 1; // Loop to last slide
            }
            return prev - 1;
        });
    };

    const goToCarouselSlide = (index) => {
        setCurrentCarouselIndex(index);
    };

    const getCurrentSlideImages = () => {
        const startIndex = currentCarouselIndex * imagesPerSlide;
        return galleryImages.slice(startIndex, startIndex + imagesPerSlide);
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

                {event.poster ? (
                    <div className="relative w-full h-full">
                        <img
                            src={event.poster.startsWith('http') ? event.poster : (() => {
                                let posterPath = event.poster;

                                // Remove extra spaces and fix the path
                                posterPath = posterPath.replace(/\s+/g, '');

                                // Fix the artist ID from 3_Thando_9144 to 3_Thando_8146
                                posterPath = posterPath.replace('/artists/3_Thando_9144/', '/artists/3_Thando_8146/');

                                // Handle different path formats
                                console.log('Original poster path:', posterPath);
                                
                                if (posterPath.startsWith('/artists/') && posterPath.includes('/events/')) {
                                    // Path is already in the correct format, just add the base URL
                                    const finalUrl = `http://localhost:5173${posterPath}`;
                                    console.log('Poster URL:', finalUrl);
                                    return finalUrl;
                                } else if (posterPath.includes('/artists/events/events/')) {
                                    // Fix duplicate events in path
                                    const fixedPath = posterPath.replace('/artists/events/events/', '/artists/3_Thando_8146/events/');
                                    const finalUrl = `http://localhost:5173${fixedPath}`;
                                    console.log('Poster URL (fixed duplicate events):', finalUrl);
                                    return finalUrl;
                                } else if (posterPath.includes('/events/events/')) {
                                    // Fix duplicate events in path (without artists prefix)
                                    const fixedPath = posterPath.replace('/events/events/', '/artists/3_Thando_8146/events/');
                                    const finalUrl = `http://localhost:5173${fixedPath}`;
                                    console.log('Poster URL (fixed duplicate events no artists):', finalUrl);
                                    return finalUrl;
                                } else if (posterPath.includes('/events/event_poster/')) {
                                    // Handle legacy format - extract event info from filename
                                    const posterFileName = posterPath.split('/').pop();
                                    
                                    // Try to extract event folder from the path if possible
                                    const pathParts = posterPath.split('/');
                                    const eventsIndex = pathParts.indexOf('events');
                                    if (eventsIndex !== -1 && pathParts[eventsIndex + 1]) {
                                        const eventFolder = pathParts[eventsIndex + 1];
                                        posterPath = `/artists/3_Thando_8146/events/${eventFolder}/event_poster/${posterFileName}`;
                                    } else {
                                        // Fallback: try to construct from event data
                                        const eventFolder = event.event_folder || `5_freya_ball`; // fallback
                                        posterPath = `/artists/3_Thando_8146/events/${eventFolder}/event_poster/${posterFileName}`;
                                    }
                                    
                                    const finalUrl = `http://localhost:5173${posterPath}`;
                                    console.log('Poster URL (constructed):', finalUrl);
                                    return finalUrl;
                                }

                                // Fallback - just add base URL
                                const finalUrl = `http://localhost:5173${posterPath}`;
                                console.log('Poster URL (fallback):', finalUrl);
                                return finalUrl;
                            })()}
                            alt={event.name}
                            className="absolute inset-0 w-full h-full object-cover transform hover:scale-105 transition-transform duration-700"
                            onError={(e) => {
                                console.log('Poster image failed to load:', e.target.src);
                                e.target.style.display = 'none';
                            }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/30 via-transparent to-blue-900/30"></div>
                    </div>
                ) : (
                    <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-purple-600 via-blue-600 to-purple-800">
                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                        <div className="flex items-center justify-center h-full">
                            <div className="text-center text-white">
                                <div className="relative mb-6">
                                    <div className="absolute -inset-4 bg-white/20 rounded-full blur-xl"></div>
                                    <CalendarIcon className="relative h-20 w-20 mx-auto opacity-90" />
                                </div>
                                <span className="text-2xl font-semibold">Event Poster Coming Soon</span>
                            </div>
                        </div>
                    </div>
                )}

                {/* Enhanced Content Overlay */}
                <div className="absolute inset-0 flex items-end">
                    <div className="p-8 w-full">
                        {/* Breadcrumb at the top of content */}
                        <div className="max-w-6xl mx-auto mb-8">
                            <HeroBreadcrumb
                                customBreadcrumbs={[
                                    { label: 'Events', path: '/events', icon: null },
                                    { label: event?.name || 'Event', path: `/event/${id}`, isLast: true }
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
                <div className="relative -mt-20 mb-8 bg-white rounded-2xl shadow-2xl overflow-hidden border border-purple-100">
                    {/* Enhanced Event Header */}
                    <div className="p-8 border-b border-gray-100 bg-gradient-to-r from-purple-50 to-blue-50">
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                            <div className="flex-1">
                                <div className="diplayPosterPic rounded overflow-hidden relative h-[100px] w-[100px]" >
                                    <img
                                        src={event.poster.startsWith('http') ? event.poster : (() => {
                                            let posterPath = event.poster;

                                            // Remove extra spaces and fix the path
                                            posterPath = posterPath.replace(/\s+/g, '');

                                            // Fix the artist ID from 3_Thando_9144 to 3_Thando_8146
                                            posterPath = posterPath.replace('/artists/3_Thando_9144/', '/artists/3_Thando_8146/');

                                            // Handle different path formats
                                            console.log('Original poster path (section 2):', posterPath);
                                            
                                            if (posterPath.startsWith('/artists/') && posterPath.includes('/events/')) {
                                                // Path is already in the correct format, just add the base URL
                                                const finalUrl = `http://localhost:5173${posterPath}`;
                                                console.log('Poster URL (section 2):', finalUrl);
                                                return finalUrl;
                                            } else if (posterPath.includes('/artists/events/events/')) {
                                                // Fix duplicate events in path
                                                const fixedPath = posterPath.replace('/artists/events/events/', '/artists/3_Thando_8146/events/');
                                                const finalUrl = `http://localhost:5173${fixedPath}`;
                                                console.log('Poster URL (section 2, fixed duplicate events):', finalUrl);
                                                return finalUrl;
                                            } else if (posterPath.includes('/events/events/')) {
                                                // Fix duplicate events in path (without artists prefix)
                                                const fixedPath = posterPath.replace('/events/events/', '/artists/3_Thando_8146/events/');
                                                const finalUrl = `http://localhost:5173${fixedPath}`;
                                                console.log('Poster URL (section 2, fixed duplicate events no artists):', finalUrl);
                                                return finalUrl;
                                            } else if (posterPath.includes('/events/event_poster/')) {
                                                // Handle legacy format - extract event info from filename
                                                const posterFileName = posterPath.split('/').pop();
                                                
                                                // Try to extract event folder from the path if possible
                                                const pathParts = posterPath.split('/');
                                                const eventsIndex = pathParts.indexOf('events');
                                                if (eventsIndex !== -1 && pathParts[eventsIndex + 1]) {
                                                    const eventFolder = pathParts[eventsIndex + 1];
                                                    posterPath = `/artists/3_Thando_8146/events/${eventFolder}/event_poster/${posterFileName}`;
                                                } else {
                                                    // Fallback: try to construct from event data
                                                    const eventFolder = event.event_folder || `5_freya_ball`; // fallback
                                                    posterPath = `/artists/3_Thando_8146/events/${eventFolder}/event_poster/${posterFileName}`;
                                                }
                                                
                                                const finalUrl = `http://localhost:5173${posterPath}`;
                                                console.log('Poster URL (constructed section 2):', finalUrl);
                                                return finalUrl;
                                            }

                                            // Fallback - just add base URL
                                            const finalUrl = `http://localhost:5173${posterPath}`;
                                            console.log('Poster URL (fallback section 2):', finalUrl);
                                            return finalUrl;
                                        })()}
                                        alt={event.name}
                                        className="absolute inset-0 w-full h-full object-cover transform hover:scale-105 transition-transform duration-700"
                                        onError={(e) => {
                                            console.log('Poster image failed to load:', e.target.src);
                                            e.target.style.display = 'none';
                                        }}
                                    />


                                </div>
                                <div className="flex items-center gap-4 mb-4">
                                    <h1 className="text-4xl font-bold text-gray-900">{event.name}</h1>
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
                                <div className="flex flex-wrap items-center gap-6 text-gray-600 mb-4">
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
                            <div className="mt-6 lg:mt-0 lg:ml-8">
                                <div className="bg-gradient-to-br from-purple-50 to-blue-50 border border-purple-200 p-6 rounded-2xl min-w-[250px] shadow-lg">
                                    {event.price && event.price > 0 ? (
                                        <div className="mb-6 text-center">
                                            <p className="text-4xl font-black text-gray-900 mb-1">R{event.price}</p>
                                            <p className="text-sm text-gray-600 bg-white px-3 py-1 rounded-full inline-block">per ticket</p>
                                        </div>
                                    ) : (
                                        <div className="mb-6 text-center">
                                            <p className="text-3xl font-black text-green-600 mb-1">FREE</p>
                                            <p className="text-sm text-gray-600 bg-white px-3 py-1 rounded-full inline-block">No cost to attend</p>
                                        </div>
                                    )}

                                    {isEventOwner ? (
                                        // Edit button for event owner
                                        <button
                                            onClick={handleEdit}
                                            className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-105 group"
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
                                            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-105 group"
                                        >
                                            <TicketIcon className="h-5 w-5 mr-2" />
                                            <span>Get Tickets Now</span>
                                            <ArrowTopRightOnSquareIcon className="h-5 w-5 ml-2 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
                                        </a>
                                    ) : (
                                        // Join button for non-owners without ticket URL
                                        <button className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-105">
                                            <SparklesIcon className="h-5 w-5 mr-2" />
                                            <span>Join Event</span>
                                        </button>
                                    )}

                                    {event.capacity && (
                                        <div className="mt-4 text-center">
                                            <div className="bg-white/80 backdrop-blur-sm px-4 py-2 rounded-lg border border-purple-200">
                                                <span className="text-sm text-purple-700 font-medium">{event.capacity} spots available</span>
                                            </div>
                                        </div>
                                    )}

                                    {/* Additional CTA */}
                                    <button
                                        onClick={handleShare}
                                        className="w-full mt-3 bg-white hover:bg-gray-50 border border-purple-200 hover:border-purple-300 text-purple-700 font-medium py-3 px-6 rounded-xl transition-all duration-300 flex items-center justify-center"
                                    >
                                        <ShareIcon className="h-5 w-5 mr-2" />
                                        <span>Share Event</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Event Details Grid */}
                    <div className="p-8 space-y-8">
                        {/* Description */}
                        {event.description && (
                            <div>
                                <h2 className="text-2xl font-semibold text-gray-900 mb-4">About This Event</h2>
                                <div className="prose max-w-none">
                                    <p className="text-gray-700 whitespace-pre-line leading-relaxed">
                                        {event.description}
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Map and Quick Details Row */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                            {/* Map Section */}
                            <div className="lg:col-span-2 h-full">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-3xl font-bold text-gray-900 flex items-center">
                                        <MapPinIcon className="h-8 w-8 text-purple-600 mr-3" />
                                        Event Location
                                    </h2>
                                </div>


                                {venue ? (
                                    <div className="space-y-6 h-full">
                                        {/* Enhanced Venue Card */}
                                        {venue && (
                                            <div className="mb-6">
                                                <EnhancedVenueCard venue={venue} showActions={true} showStats={true} />
                                            </div>
                                        )}

                                        {/* Get Directions Button */}
                                        {venue && venue.address && (
                                            <button className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-300 flex items-center justify-center space-x-2 hover:scale-105 shadow-md">
                                                <MapPinIcon className="h-5 w-5" />
                                                <span>Get Directions</span>
                                                <ArrowTopRightOnSquareIcon className="h-5 w-5" />
                                            </button>
                                        )}

                                        {/* Live Events Map */}
                                        <div className="mt-6 flex-1">
                                            <LiveEventsMap events={safeEvent ? [safeEvent] : []} />
                                        </div>
                                    </div>
                                ) : (
                                    <div className="h-full">
                                        <LiveEventsMap events={safeEvent ? [safeEvent] : []} />
                                    </div>
                                )}
                            </div>

                            {/* Quick Details Sidebar */}
                            <div className="space-y-6 h-full">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-3xl font-bold text-gray-900 flex items-center">
                                        <CalendarIcon className="h-8 w-8 text-purple-600 mr-3" />
                                        Quick Details
                                    </h2>
                                </div>
                                {/* Enhanced Event Details */}
                                <div className="bg-gradient-to-br from-purple-50 to-blue-50 border border-purple-200 p-6 rounded-2xl shadow-lg">
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between p-3 bg-white/70 rounded-xl">
                                            <div className="flex items-center">
                                                <CalendarIcon className="h-5 w-5 mr-3 text-purple-600" />
                                                <span className="text-gray-700 font-medium">Date</span>
                                            </div>
                                            <span className="font-bold text-gray-900">{eventDate}</span>
                                        </div>

                                        <div className="flex items-center justify-between p-3 bg-white/70 rounded-xl">
                                            <div className="flex items-center">
                                                <ClockIcon className="h-5 w-5 mr-3 text-blue-600" />
                                                <span className="text-gray-700 font-medium">Time</span>
                                            </div>
                                            <span className="font-bold text-gray-900">{event.time}</span>
                                        </div>

                                        {event.category && (
                                            <div className="flex items-center justify-between p-3 bg-white/70 rounded-xl">
                                                <div className="flex items-center">
                                                    <SparklesIcon className="h-5 w-5 mr-3 text-pink-600" />
                                                    <span className="text-gray-700 font-medium">Category</span>
                                                </div>
                                                <span className="font-bold text-gray-900">{event.category}</span>
                                            </div>
                                        )}

                                        {event.capacity && (
                                            <div className="flex items-center justify-between p-3 bg-white/70 rounded-xl">
                                                <div className="flex items-center">
                                                    <UsersIcon className="h-5 w-5 mr-3 text-green-600" />
                                                    <span className="text-gray-700 font-medium">Capacity</span>
                                                </div>
                                                <span className="font-bold text-gray-900">{event.capacity} people</span>
                                            </div>
                                        )}

                                        <div className="flex items-center justify-between p-3 bg-white/70 rounded-xl">
                                            <div className="flex items-center">
                                                <TicketIcon className="h-5 w-5 mr-3 text-yellow-600" />
                                                <span className="text-gray-700 font-medium">Status</span>
                                            </div>
                                            <span className={`font-bold px-3 py-1 rounded-full text-sm ${event.status === 'active' ? 'bg-green-100 text-green-700' :
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

                        {/* Full Width Gallery Section */}
                        {hasRealGallery ? (
                            <div>
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-3xl font-bold text-gray-900 flex items-center">
                                        <SparklesIcon className="h-8 w-8 text-purple-600 mr-3" />
                                        Event Gallery
                                    </h2>
                                    <div className="flex items-center space-x-3">
                                        <span className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 rounded-full text-sm font-medium">
                                            {galleryImages.length} photos
                                        </span>
                                        <div className="flex space-x-2">
                                            <button
                                                onClick={prevCarouselSlide}
                                                disabled={totalSlides <= 1}
                                                className="bg-white border border-purple-200 hover:border-purple-300 hover:bg-purple-50 disabled:opacity-50 disabled:cursor-not-allowed p-2 rounded-full transition-all duration-300 hover:scale-110 shadow-md"
                                            >
                                                <ChevronLeftIcon className="h-5 w-5 text-purple-600" />
                                            </button>
                                            <button
                                                onClick={nextCarouselSlide}
                                                disabled={totalSlides <= 1}
                                                className="bg-white border border-purple-200 hover:border-purple-300 hover:bg-purple-50 disabled:opacity-50 disabled:cursor-not-allowed p-2 rounded-full transition-all duration-300 hover:scale-110 shadow-md"
                                            >
                                                <ChevronRightIcon className="h-5 w-5 text-purple-600" />
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Carousel Container */}
                                <div className="relative overflow-hidden">
                                    {/* Carousel Slides */}
                                    <div className="relative h-32 mb-4">
                                        <div
                                            className="flex transition-transform duration-500 ease-in-out h-full"
                                            style={{ transform: `translateX(-${currentCarouselIndex * 100}%)` }}
                                        >
                                            {Array.from({ length: totalSlides }).map((_, slideIndex) => (
                                                <div key={slideIndex} className="w-full flex-shrink-0 grid grid-cols-5 gap-3 h-full">
                                                    {galleryImages.slice(slideIndex * 5, (slideIndex + 1) * 5).map((image, imageIndex) => {
                                                        const actualIndex = slideIndex * 5 + imageIndex;
                                                        return (
                                                            <GalleryImage
                                                                key={actualIndex}
                                                                image={image}
                                                                index={actualIndex}
                                                                alt={`Event gallery ${actualIndex + 1}`}
                                                                onClick={() => openGallery(actualIndex)}
                                                                size="small"
                                                                aspectRatio="square"
                                                                showNumber={true}
                                                                showHoverIcon={true}
                                                                className="h-full w-full object-cover"
                                                            />
                                                        );
                                                    })}
                                                    {/* Fill empty slots to always show 5 images */}
                                                    {Array.from({ length: 5 - galleryImages.slice(slideIndex * 5, (slideIndex + 1) * 5).length }).map((_, emptyIndex) => (
                                                        <GalleryPlaceholder
                                                            key={`empty-${emptyIndex}`}
                                                            size="full"
                                                            className="h-full w-full"
                                                        />
                                                    ))}
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Carousel Indicators */}
                                    {totalSlides > 1 && (
                                        <div className="flex justify-center space-x-2">
                                            {Array.from({ length: totalSlides }).map((_, index) => (
                                                <button
                                                    key={index}
                                                    onClick={() => goToCarouselSlide(index)}
                                                    className={`w-3 h-3 rounded-full transition-all duration-300 ${index === currentCarouselIndex
                                                        ? 'bg-gradient-to-r from-purple-600 to-blue-600 scale-125'
                                                        : 'bg-gray-300 hover:bg-purple-300'
                                                        }`}
                                                />
                                            ))}
                                        </div>
                                    )}

                                    {/* Slide Counter */}
                                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full shadow-md">
                                        <span className="text-sm font-medium text-purple-700">
                                            {currentCarouselIndex + 1} of {totalSlides}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            // No gallery message
                            <div className="text-center py-12">
                                <div className="bg-gradient-to-br from-purple-50 to-blue-50 border border-purple-200 rounded-2xl p-8 shadow-lg">
                                    <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <SparklesIcon className="h-8 w-8 text-white" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No Gallery Available</h3>
                                    <p className="text-gray-600">This event doesn't have any gallery images yet.</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>



                {/* Enhanced Gallery Modal */}
                {isGalleryOpen && (
                    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                        <div className="relative w-full max-w-4xl">
                            {/* Close Button */}
                            <button
                                onClick={closeGallery}
                                className="absolute top-4 right-4 z-60 bg-white/90 backdrop-blur-sm text-gray-700 p-3 rounded-full hover:bg-white transition-all duration-300 hover:scale-110 shadow-lg"
                            >
                                <XMarkIcon className="h-6 w-6" />
                            </button>

                            {/* Navigation Buttons */}
                            {galleryImages.length > 1 && (
                                <>
                                    <button
                                        onClick={prevImage}
                                        className="absolute left-4 top-1/2 transform -translate-y-1/2 z-60 bg-white/90 backdrop-blur-sm text-gray-700 p-3 rounded-full hover:bg-white transition-all duration-300 hover:scale-110 shadow-lg"
                                    >
                                        <ChevronLeftIcon className="h-6 w-6" />
                                    </button>
                                    <button
                                        onClick={nextImage}
                                        className="absolute right-4 top-1/2 transform -translate-y-1/2 z-60 bg-white/90 backdrop-blur-sm text-gray-700 p-3 rounded-full hover:bg-white transition-all duration-300 hover:scale-110 shadow-lg"
                                    >
                                        <ChevronRightIcon className="h-6 w-6" />
                                    </button>
                                </>
                            )}

                            {/* Image Display */}
                            <div className="relative">
                                <img
                                    src={galleryImages[selectedImageIndex]?.startsWith('http') ? galleryImages[selectedImageIndex] : (() => {
                                        const imagePath = galleryImages[selectedImageIndex];
                                        
                                        // Handle different path formats
                                        console.log('Gallery image path:', imagePath);
                                        
                                        if (imagePath?.startsWith('/artists/') && imagePath.includes('/events/')) {
                                            // Path is already in the correct format, just add the base URL
                                            return `http://localhost:5173${imagePath}`;
                                        } else if (imagePath?.includes('/artists/events/events/')) {
                                            // Handle legacy format with duplicate events
                                            return `http://localhost:5173${imagePath.replace('/artists/events/events/', '/artists/3_Thando_8146/events/')}`;
                                        } else if (imagePath?.includes('/artists/events/')) {
                                            // Handle legacy format
                                            return `http://localhost:5173${imagePath.replace('/artists/events/', '/artists/3_Thando_8146/events/')}`;
                                        } else if (imagePath?.includes('/events/events/')) {
                                            // Handle another duplicate events format
                                            return `http://localhost:5173${imagePath.replace('/events/events/', '/artists/3_Thando_8146/events/')}`;
                                        }
                                        
                                        // Fallback - just add base URL
                                        return `http://localhost:5173${imagePath}`;
                                    })()}
                                    alt={`Gallery image ${selectedImageIndex + 1}`}
                                    className="w-full h-auto max-h-[80vh] object-contain rounded-2xl shadow-2xl"
                                />

                                {/* Image Counter */}
                                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white/90 backdrop-blur-sm text-gray-700 px-6 py-3 rounded-full shadow-lg">
                                    <span className="font-medium">{selectedImageIndex + 1} of {galleryImages.length}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ShowEvent;