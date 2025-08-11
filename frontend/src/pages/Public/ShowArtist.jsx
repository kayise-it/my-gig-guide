import React, { useState, useEffect } from 'react';
import API_BASE_URL from '../../api/config';
import axios from 'axios';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { 
  StarIcon as StarIconSolid,
  HeartIcon as HeartIconSolid 
} from '@heroicons/react/24/solid';
import { 
  StarIcon as StarIconOutline,
  HeartIcon as HeartIconOutline,
  MusicalNoteIcon,
  CalendarDaysIcon,
  UsersIcon,
  SparklesIcon,
  MapPinIcon,
  ArrowTopRightOnSquareIcon,
  XMarkIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ShareIcon,
  TicketIcon
} from '@heroicons/react/24/outline';
import { HeroBreadcrumb } from '../../components/UI/DynamicBreadcrumb';


export default function ShowArtist() {
    const { artist_id } = useParams(); // must match your route like /artists/:artist_id

    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [events, setEvents] = useState([]);
    const [isFavorite, setIsFavorite] = useState(false);
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [galleryModalOpen, setGalleryModalOpen] = useState(false);
    const [currentCarouselIndex, setCurrentCarouselIndex] = useState(0);

    useEffect(() => {
        const fetchArtistProfile = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`${API_BASE_URL}/api/artists/${artist_id}`);
                setProfile(response.data);
                setError(null);

                // Fetch artist events
                try {
                    const eventsResponse = await axios.get(`${API_BASE_URL}/api/events/artist/${artist_id}`);
                    setEvents(eventsResponse.data.events || []);
                } catch (eventsError) {
                    console.log('No events found for artist');
                    setEvents([]);
                }
            } catch (err) {
                setError('Failed to load artist profile');
                console.error('Error fetching artist:', err);
            } finally {
                setLoading(false);
            }
        };

        if (artist_id) {
            fetchArtistProfile();
        }
    }, [artist_id]);

    // Parse gallery images
    const galleryImages = React.useMemo(() => {
        if (Array.isArray(profile?.gallery)) {
            return profile.gallery;
        }
        if (profile?.gallery && typeof profile.gallery === 'string') {
            try {
                return JSON.parse(profile.gallery);
            } catch {
                return profile.gallery.split(',').filter(img => img.trim());
            }
        }
        return [];
    }, [profile?.gallery]);

    // Handle favorite toggle
    const handleFavoriteToggle = () => {
        setIsFavorite(!isFavorite);
    };

    // Handle share
    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: profile?.stage_name || profile?.name,
                text: `Check out ${profile?.stage_name || profile?.name}`,
                url: window.location.href
            });
        } else {
            navigator.clipboard.writeText(window.location.href);
            alert('Link copied to clipboard!');
        }
    };

    // Gallery functions
    const openGallery = (index = 0) => {
        setSelectedImageIndex(index);
        setGalleryModalOpen(true);
    };

    const closeGallery = () => {
        setGalleryModalOpen(false);
    };

    const nextImage = () => {
        const images = Array.isArray(profile?.gallery) ? profile.gallery : [];
        if (images.length > 0) {
            setSelectedImageIndex((prev) => (prev + 1) % images.length);
        }
    };

    const prevImage = () => {
        const images = Array.isArray(profile?.gallery) ? profile.gallery : [];
        if (images.length > 0) {
            setSelectedImageIndex((prev) => (prev - 1 + images.length) % images.length);
        }
    };

    // Carousel functions for gallery
    const imagesPerSlide = 4;
    const totalSlides = Math.ceil(galleryImages.length / imagesPerSlide);

    const nextCarouselSlide = () => {
        setCurrentCarouselIndex((prev) => (prev + 1) % totalSlides);
    };

    const prevCarouselSlide = () => {
        setCurrentCarouselIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
    };

    const getCurrentSlideImages = () => {
        const startIndex = currentCarouselIndex * imagesPerSlide;
        return galleryImages.slice(startIndex, startIndex + imagesPerSlide);
    };

    if (loading) return (
        <div className="flex items-center justify-center h-64 bg-gradient-to-br from-purple-50 via-white to-blue-50">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
        </div>
    );

    if (error) return (
        <div className="bg-red-50 border border-red-200 text-red-700 p-6 rounded-2xl mx-4 my-8">
            <p className="font-medium">{error}</p>
        </div>
    );

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
                        onClick={handleFavoriteToggle}
                        className={`backdrop-blur-sm p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 group ${
                            isFavorite 
                                ? 'bg-red-500 text-white hover:bg-red-600' 
                                : 'bg-white/90 text-gray-700 hover:bg-red-50 hover:text-red-500'
                        }`}
                    >
                        <HeartIconOutline className={`h-5 w-5 transition-all duration-300 ${
                            isFavorite ? 'fill-current' : 'group-hover:fill-current'
                        }`} />
                    </button>
                </div>

                {profile?.profile_picture ? (
                    <div className="relative w-full h-full">
                        <img
                            src={profile.profile_picture.startsWith('http') ? profile.profile_picture : `${API_BASE_URL}${profile.profile_picture}`}
                            alt={profile?.stage_name || profile?.name}
                            className="absolute inset-0 w-full h-full object-cover transform hover:scale-105 transition-transform duration-700"
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
                                    <MusicalNoteIcon className="relative h-20 w-20 mx-auto opacity-90" />
                                </div>
                                <span className="text-2xl font-semibold">Artist Photo Coming Soon</span>
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
                                    { label: 'Artists', path: '/artists', icon: null },
                                    { label: profile?.stage_name || profile?.name || 'Artist', path: `/artists/${artist_id}`, isLast: true }
                                ]}
                                showHome={true}
                            />
                        </div>
                        
                        <div className="max-w-6xl mx-auto">
                            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between">
                                <div className="flex-1 mb-6 lg:mb-0">
                                    {profile?.artist_type && (
                                        <div className="mb-4">
                                            <span className="inline-flex items-center bg-purple-600/90 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg">
                                                <SparklesIcon className="h-4 w-4 mr-2" />
                                                {profile.artist_type}
                                            </span>
                                        </div>
                                    )}
                                    <h1 className="text-4xl lg:text-6xl font-black text-white drop-shadow-2xl mb-4 leading-tight">
                                        {profile?.stage_name || profile?.name}
                                    </h1>
                                    <div className="flex flex-wrap items-center gap-6 text-white/90 text-lg">
                                        <div className="flex items-center">
                                            <MusicalNoteIcon className="h-6 w-6 mr-2 text-purple-300" />
                                            <span>Professional Artist</span>
                                        </div>
                                        <div className="flex items-center">
                                            <CalendarDaysIcon className="h-6 w-6 mr-2 text-blue-300" />
                                            <span>{events.length} Events</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="lg:ml-8">
                                    <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 text-center shadow-xl">
                                        <div className="flex items-center justify-center mb-1">
                                            <StarIconSolid className="h-5 w-5 text-yellow-300 mr-1" />
                                            <span className="text-2xl font-bold text-white">4.8</span>
                                        </div>
                                        <div className="text-blue-200 text-sm">Artist Rating</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-4 py-8">
                <div className="relative -mt-20 mb-8 bg-white rounded-2xl shadow-2xl overflow-hidden border border-purple-100">
                    {/* Enhanced Artist Header */}
                    <div className="p-8 border-b border-gray-100 bg-gradient-to-r from-purple-50 to-blue-50">
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                            <div className="flex-1">
                                <div className="flex items-center gap-4 mb-4">
                                    <h1 className="text-4xl font-bold text-gray-900">{profile?.stage_name || profile?.name}</h1>
                                    <button 
                                        onClick={handleFavoriteToggle}
                                        className={`p-2 rounded-full transition-all duration-300 hover:scale-110 ${
                                            isFavorite 
                                                ? 'bg-red-100 text-red-600' 
                                                : 'bg-gray-100 text-gray-400 hover:bg-red-50 hover:text-red-500'
                                        }`}
                                    >
                                        <HeartIconOutline className={`h-6 w-6 ${isFavorite ? 'fill-current' : ''}`} />
                                    </button>
                                </div>
                                <div className="flex flex-wrap items-center gap-6 text-gray-600 mb-4">
                                    <div className="flex items-center">
                                        <MusicalNoteIcon className="h-5 w-5 mr-2 text-purple-500" />
                                        <span className="font-medium">{profile?.artist_type || 'Professional Artist'}</span>
                                    </div>
                                    <div className="flex items-center">
                                        <CalendarDaysIcon className="h-5 w-5 mr-2 text-blue-500" />
                                        <span className="font-medium">{events.length} Upcoming Events</span>
                                    </div>
                                    <div className="flex items-center">
                                        <UsersIcon className="h-5 w-5 mr-2 text-purple-500" />
                                        <span className="font-medium">1.2k Followers</span>
                                    </div>
                                </div>
                                {profile?.artist_type && (
                                    <span className="inline-flex items-center bg-gradient-to-r from-purple-600 to-blue-600 text-white text-sm font-medium px-4 py-2 rounded-full shadow-md">
                                        <SparklesIcon className="h-4 w-4 mr-2" />
                                        {profile.artist_type}
                                    </span>
                                )}
                            </div>
                            
                            {/* Enhanced Action Card */}
                            <div className="mt-6 lg:mt-0 lg:ml-8">
                                <div className="bg-gradient-to-br from-purple-50 to-blue-50 border border-purple-200 p-6 rounded-2xl min-w-[250px] shadow-lg">
                                    <div className="mb-6 text-center">
                                        <p className="text-4xl font-black text-gray-900 mb-1">★ 4.8</p>
                                        <p className="text-sm text-gray-600 bg-white px-3 py-1 rounded-full inline-block">artist rating</p>
                                    </div>

                                    <button className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-105 group">
                                        <SparklesIcon className="h-5 w-5 mr-2" />
                                        <span>Follow Artist</span>
                                        <ArrowTopRightOnSquareIcon className="h-5 w-5 ml-2 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
                                    </button>

                                    {/* Additional CTA */}
                                    <button 
                                        onClick={handleShare}
                                        className="w-full mt-3 bg-white hover:bg-gray-50 border border-purple-200 hover:border-purple-300 text-purple-700 font-medium py-3 px-6 rounded-xl transition-all duration-300 flex items-center justify-center"
                                    >
                                        <ShareIcon className="h-5 w-5 mr-2" />
                                        <span>Share Artist</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Artist Details Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 p-8">
                        {/* Main Content */}
                        <div className="lg:col-span-2 space-y-8">
                            {/* Biography */}
                            {profile?.bio && (
                                <div>
                                    <h2 className="text-2xl font-semibold text-gray-900 mb-4">About the Artist</h2>
                                    <div className="prose max-w-none">
                                        <p className="text-gray-700 whitespace-pre-line leading-relaxed">
                                            {profile.bio}
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* Gallery Section */}
                            {galleryImages.length > 0 && (
                                <div>
                                    <div className="flex items-center justify-between mb-6">
                                        <h2 className="text-2xl font-semibold text-gray-900">Gallery</h2>
                                        <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-medium">
                                            {galleryImages.length} photos
                                        </span>
                                    </div>
                                    <div className="relative">
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                            {getCurrentSlideImages().map((image, index) => (
                                                <div 
                                                    key={index}
                                                    className="relative aspect-square rounded-xl overflow-hidden cursor-pointer group shadow-md hover:shadow-xl transition-all duration-300"
                                                    onClick={() => openGallery(currentCarouselIndex * imagesPerSlide + index)}
                                                >
                                                    <img
                                                        src={image.startsWith('http') ? image : `${API_BASE_URL}${image}`}
                                                        alt={`Gallery ${index + 1}`}
                                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                                    />
                                                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                                </div>
                                            ))}
                                        </div>
                                        
                                        {/* Carousel Navigation */}
                                        {totalSlides > 1 && (
                                            <div className="flex items-center justify-between mt-4">
                                                <button 
                                                    onClick={prevCarouselSlide}
                                                    className="p-2 rounded-full bg-purple-100 text-purple-600 hover:bg-purple-200 transition-colors duration-200"
                                                >
                                                    <ChevronLeftIcon className="h-5 w-5" />
                                                </button>
                                                <div className="flex space-x-2">
                                                    {Array.from({ length: totalSlides }).map((_, index) => (
                                                        <button
                                                            key={index}
                                                            onClick={() => setCurrentCarouselIndex(index)}
                                                            className={`w-2 h-2 rounded-full transition-colors duration-200 ${
                                                                index === currentCarouselIndex ? 'bg-purple-600' : 'bg-gray-300'
                                                            }`}
                                                        />
                                                    ))}
                                                </div>
                                                <button 
                                                    onClick={nextCarouselSlide}
                                                    className="p-2 rounded-full bg-purple-100 text-purple-600 hover:bg-purple-200 transition-colors duration-200"
                                                >
                                                    <ChevronRightIcon className="h-5 w-5" />
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Upcoming Events */}
                            <div>
                                <h2 className="text-2xl font-semibold text-gray-900 mb-6">Upcoming Events</h2>
                                {events.length > 0 ? (
                                    <div className="space-y-4">
                                        {events.slice(0, 3).map(event => (
                                            <Link 
                                                key={event.id}
                                                to={`/event/${event.id}`}
                                                className="block bg-white hover:bg-gray-50 border border-gray-200 rounded-xl p-6 transition-all duration-300 hover:shadow-lg group"
                                            >
                                                <div className="flex items-center justify-between">
                                                    <div className="flex-1">
                                                        <h3 className="text-lg font-semibold text-gray-900 group-hover:text-purple-600 transition-colors duration-300">
                                                            {event.name}
                                                        </h3>
                                                        <div className="flex items-center text-sm text-gray-600 mt-2">
                                                            <CalendarDaysIcon className="h-4 w-4 mr-2" />
                                                            {new Date(event.date).toLocaleDateString()} at {event.time}
                                                        </div>
                                                        {event.venue && (
                                                            <div className="flex items-center text-sm text-gray-600 mt-1">
                                                                <MapPinIcon className="h-4 w-4 mr-2" />
                                                                {event.venue.name}
                                                            </div>
                                                        )}
                                                    </div>
                                                    <ArrowTopRightOnSquareIcon className="h-5 w-5 text-gray-400 group-hover:text-purple-600 transition-colors duration-300" />
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-12">
                                        <div className="bg-gray-50 border border-gray-200 rounded-xl p-8">
                                            <CalendarDaysIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                            <h3 className="text-lg font-medium text-gray-900 mb-2">No Upcoming Events</h3>
                                            <p className="text-gray-600">This artist hasn't scheduled any events yet.</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-6">
                            {/* Quick Info */}
                            <div className="bg-gradient-to-br from-purple-50 to-blue-50 border border-purple-200 p-6 rounded-xl">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Artist Info</h3>
                                <div className="space-y-3">
                                    <div>
                                        <label className="text-sm font-medium text-gray-600">Genre</label>
                                        <p className="text-gray-900">{profile?.artist_type || 'Not specified'}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-600">Total Events</label>
                                        <p className="text-gray-900">{events.length}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-600">Rating</label>
                                        <div className="flex items-center">
                                            <StarIconSolid className="h-4 w-4 text-yellow-400 mr-1" />
                                            <span className="text-gray-900">4.8 (124 reviews)</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Contact Info */}
                            {(profile?.email || profile?.phone_number) && (
                                <div className="bg-white border border-gray-200 p-6 rounded-xl">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Get in Touch</h3>
                                    <div className="space-y-3">
                                        {profile?.email && (
                                            <a href={`mailto:${profile.email}`} className="flex items-center text-purple-600 hover:text-purple-700 transition-colors duration-200">
                                                <ArrowTopRightOnSquareIcon className="h-4 w-4 mr-2" />
                                                Email Artist
                                            </a>
                                        )}
                                        {profile?.phone_number && (
                                            <a href={`tel:${profile.phone_number}`} className="flex items-center text-purple-600 hover:text-purple-700 transition-colors duration-200">
                                                <ArrowTopRightOnSquareIcon className="h-4 w-4 mr-2" />
                                                Call Artist
                                            </a>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Gallery Modal */}
            {galleryModalOpen && galleryImages.length > 0 && (
                <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
                    <div className="relative max-w-4xl w-full">
                        <button
                            onClick={closeGallery}
                            className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors duration-200"
                        >
                            <XMarkIcon className="h-8 w-8" />
                        </button>
                        
                        <div className="relative">
                            <img
                                src={galleryImages[selectedImageIndex]?.startsWith('http') ? galleryImages[selectedImageIndex] : `${API_BASE_URL}${galleryImages[selectedImageIndex]}`}
                                alt={`Gallery ${selectedImageIndex + 1}`}
                                className="w-full h-auto max-h-[80vh] object-contain rounded-lg"
                            />
                            
                            {galleryImages.length > 1 && (
                                <>
                                    <button
                                        onClick={prevImage}
                                        className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors duration-200"
                                    >
                                        <ChevronLeftIcon className="h-6 w-6" />
                                    </button>
                                    <button
                                        onClick={nextImage}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors duration-200"
                                    >
                                        <ChevronRightIcon className="h-6 w-6" />
                                    </button>
                                </>
                            )}
                        </div>
                        
                        <div className="text-center text-white mt-4">
                            <span className="text-sm">{selectedImageIndex + 1} of {galleryImages.length}</span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}