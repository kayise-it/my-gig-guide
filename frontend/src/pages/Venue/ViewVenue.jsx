import React, { useEffect, useState, useMemo, useRef } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { venueService } from '../../api/venueService';
import API_BASE_URL from '../../api/config';
import HeroSection from '../../components/UI/HeroSection';
import { useAuth } from '../../context/AuthContext';
import { LoadScript, Autocomplete } from '@react-google-maps/api';
import VenueMap from '../../components/Map/VenueMap';
import { PhotoIcon } from '@heroicons/react/24/outline';
import { 
  StarIcon as StarIconSolid,
  HeartIcon as HeartIconSolid 
} from '@heroicons/react/24/solid';
import { 
  StarIcon as StarIconOutline,
  HeartIcon as HeartIconOutline,
  MapPinIcon, 
  UsersIcon, 
  PhoneIcon, 
  EnvelopeIcon, 
  GlobeAltIcon,
  XMarkIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronDownIcon,
  BuildingLibraryIcon,
  CalendarDaysIcon,
  MusicalNoteIcon,
  SparklesIcon,
  ShareIcon,
  ArrowTopRightOnSquareIcon,
  TicketIcon
} from '@heroicons/react/24/outline';


export default function ViewVenue() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser, isAuthenticated } = useAuth();
  const [venue, setVenue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [events, setEvents] = useState([]);
  const [isFavorite, setIsFavorite] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [galleryModalOpen, setGalleryModalOpen] = useState(false);
  const [currentCarouselIndex, setCurrentCarouselIndex] = useState(0);
  const [isEditingName, setIsEditingName] = useState(false);
  const [editedVenueName, setEditedVenueName] = useState('');
  const [isEditingDetails, setIsEditingDetails] = useState(false);
  const [editedVenueDetails, setEditedVenueDetails] = useState({
    location: '',
    capacity: '',
    category: '',
    latitude: '',
    longitude: ''
  });
  const [isGalleryUploadModalOpen, setIsGalleryUploadModalOpen] = useState(false);
  const [selectedGalleryFiles, setSelectedGalleryFiles] = useState([]);
  const [galleryFilePreviews, setGalleryFilePreviews] = useState([]);
  const [uploadingGallery, setUploadingGallery] = useState(false);

  // Google Maps configuration
  const libraries = ['places'];
  const googleMapsApiKey = 'AIzaSyDVfOS0l8Tv59v8WTgUO231X2FtmBQCc2Y';
  const autocompleteRef = useRef(null);

  // Venue categories
  const venueCategories = [
    'Live Music Venue',
    'Jazz Club',
    'Rock Venue',
    'Electronic Music Venue',
    'Folk Venue',
    'Blues Club',
    'Country Music Venue',
    'Hip Hop Venue',
    'Classical Music Venue',
    'Comedy Club',
    'Multi-Purpose Venue',
    'Theater',
    'Concert Hall',
    'Bar & Grill',
    'Nightclub',
    'Restaurant with Live Music',
    'Outdoor Venue',
    'Festival Grounds',
    'Recording Studio',
    'Rehearsal Space'
  ];

  // Capacity options (starting from 10)
  const capacityOptions = Array.from({ length: 91 }, (_, i) => (i + 10) * 10); // 10, 20, 30, ..., 1000

  // Check if current user is the venue owner
  const isVenueOwner = useMemo(() => {
    if (!isAuthenticated || !currentUser || !venue) return false;
    
    // Check if user is an artist and owns this venue
    if (currentUser.role === 3 && currentUser.artist_id) {
      return venue.owner_type === 'artist' && venue.owner_id === currentUser.artist_id;
    }
    
    // Check if user is an organiser and owns this venue
    if (currentUser.role === 4 && currentUser.organiser_id) {
      return venue.owner_type === 'organiser' && venue.owner_id === currentUser.organiser_id;
    }
    
    return false;
  }, [isAuthenticated, currentUser, venue]);


  const fetchVenueData = async () => {
    try {
      setLoading(true);
      const response = await venueService.getVenueByIdPublic(id);
      console.log('Venue data received:', response.venue);
      console.log('Venue coordinates:', response.venue?.latitude, response.venue?.longitude);
      console.log('Venue gallery:', response.venue?.venue_gallery);
      setVenue(response.venue);
      setError(null);

      // Fetch venue events (if you have this endpoint)
      try {
        // const eventsResponse = await venueService.getVenueEvents(id);
        // setEvents(eventsResponse.events || []);
        setEvents([]); // Mock data for now
      } catch (eventsError) {
        console.log('No events found for venue');
        setEvents([]);
      }
    } catch (err) {
      setError('Failed to load venue profile');
      console.error('Error fetching venue:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchVenueData();
    }
  }, [id]);

  // Parse gallery images
  const galleryImages = React.useMemo(() => {
    console.log('Parsing gallery images from:', venue?.venue_gallery);
    if (Array.isArray(venue?.venue_gallery)) {
      console.log('Gallery is already an array:', venue.venue_gallery);
      return venue.venue_gallery;
    }
    if (venue?.venue_gallery && typeof venue.venue_gallery === 'string') {
      try {
        const parsed = JSON.parse(venue.venue_gallery);
        console.log('Parsed gallery from JSON:', parsed);
        return parsed;
      } catch (error) {
        console.log('Failed to parse JSON, trying comma split:', error);
        const split = venue.venue_gallery.split(',').filter(img => img.trim());
        console.log('Split gallery:', split);
        return split;
      }
    }
    console.log('No gallery data found, returning empty array');
    return [];
  }, [venue?.venue_gallery]);

  // Handle favorite toggle
  const handleFavoriteToggle = () => {
    setIsFavorite(!isFavorite);
  };

  // Handle share
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: venue?.name,
        text: `Check out ${venue?.name}`,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  // Handle edit venue (name and details)
  const handleEditVenue = () => {
    if (isVenueOwner) {
      setIsEditingName(true);
      setEditedVenueName(venue?.name || '');
      setIsEditingDetails(true);
      setEditedVenueDetails({
        location: venue?.location || '',
        capacity: venue?.capacity || '',
        category: venue?.category || 'Live Music Venue',
        latitude: venue?.latitude || '',
        longitude: venue?.longitude || ''
      });
    }
  };

  // Handle edit venue details
  const handleEditVenueDetails = () => {
    if (isVenueOwner) {
      setIsEditingDetails(true);
      setEditedVenueDetails({
        location: venue?.location || '',
        capacity: venue?.capacity || '',
        category: venue?.category || 'Live Music Venue',
        latitude: venue?.latitude || '',
        longitude: venue?.longitude || ''
      });
    }
  };

  // Google Places onPlaceChanged function
  const onPlaceChanged = () => {
    if (autocompleteRef.current) {
      const place = autocompleteRef.current.getPlace();
      const address = place.formatted_address;
      const location = place.geometry?.location;

      setEditedVenueDetails(prev => ({
        ...prev,
        location: address || '',
        latitude: location?.lat() || '',
        longitude: location?.lng() || '',
      }));
    }
  };

  // Handle save venue (name and details)
  const handleSaveVenue = async () => {
    try {
      console.log('Saving venue:', { name: editedVenueName, details: editedVenueDetails });
      
      // Prepare update data with required owner information
      const updateData = {
        name: editedVenueName,
        location: editedVenueDetails.location,
        capacity: parseInt(editedVenueDetails.capacity),
        category: editedVenueDetails.category,
        latitude: editedVenueDetails.latitude || venue?.latitude,
        longitude: editedVenueDetails.longitude || venue?.longitude,
        owner_id: venue?.owner_id,
        owner_type: venue?.owner_type,
        userId: currentUser.id
      };
      
      console.log('Update data:', updateData);
      
      // Make API call to update venue
      const response = await venueService.updateVenue(id, updateData);
      
      // Update local venue state with the response
      if (response.venue) {
        setVenue(response.venue);
      } else {
        // Fallback: update local state if API response doesn't include venue object
        setVenue(prev => prev ? { 
          ...prev, 
          name: editedVenueName,
          location: editedVenueDetails.location,
          capacity: parseInt(editedVenueDetails.capacity),
          category: editedVenueDetails.category,
          latitude: editedVenueDetails.latitude,
          longitude: editedVenueDetails.longitude
        } : null);
      }
      
      setIsEditingName(false);
      setIsEditingDetails(false);
      console.log('Venue saved successfully');
      
      // Show success message
      alert('Venue updated successfully!');
    } catch (error) {
      console.error('Error saving venue:', error);
      alert(`Failed to save venue: ${error.message}`);
    }
  };

  // Handle save venue details
  const handleSaveVenueDetails = async () => {
    try {
      console.log('Saving venue details:', editedVenueDetails);
      
      // Prepare update data with required owner information
      const updateData = {
        location: editedVenueDetails.location,
        capacity: parseInt(editedVenueDetails.capacity),
        category: editedVenueDetails.category,
        latitude: editedVenueDetails.latitude || venue?.latitude,
        longitude: editedVenueDetails.longitude || venue?.longitude,
        owner_id: venue?.owner_id,
        owner_type: venue?.owner_type,
        userId: currentUser.id
      };
      
      console.log('Update data:', updateData);
      
      // Make API call to update venue details
      const response = await venueService.updateVenue(id, updateData);
      
      // Update local venue state with the response
      if (response.venue) {
        setVenue(response.venue);
      } else {
        // Fallback: update local state if API response doesn't include venue object
        setVenue(prev => prev ? { 
          ...prev, 
          location: editedVenueDetails.location,
          capacity: parseInt(editedVenueDetails.capacity),
          category: editedVenueDetails.category,
          latitude: editedVenueDetails.latitude,
          longitude: editedVenueDetails.longitude
        } : null);
      }
      
      setIsEditingDetails(false);
      console.log('Venue details saved successfully');
      
      // Show success message
      alert('Venue details updated successfully!');
    } catch (error) {
      console.error('Error saving venue details:', error);
      alert(`Failed to save venue details: ${error.message}`);
    }
  };

  // Handle cancel edit
  const handleCancelEdit = () => {
    setIsEditingName(false);
    setIsEditingDetails(false);
    setEditedVenueName(venue?.name || '');
    setEditedVenueDetails({
      location: venue?.location || '',
      capacity: venue?.capacity || '',
      category: venue?.category || 'Live Music Venue',
      latitude: venue?.latitude || '',
      longitude: venue?.longitude || ''
    });
  };

  // Handle cancel edit details
  const handleCancelEditDetails = () => {
    setIsEditingDetails(false);
    setEditedVenueDetails({
      location: venue?.location || '',
      capacity: venue?.capacity || '',
      category: venue?.category || 'Live Music Venue',
      latitude: venue?.latitude || '',
      longitude: venue?.longitude || ''
    });
  };

  // Gallery upload functions
  const handleGalleryFileSelection = (files) => {
    const fileArray = Array.from(files);
    const validFiles = fileArray.filter(file => {
      const isValidType = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'].includes(file.type);
      const isValidSize = file.size <= 5 * 1024 * 1024; // 5MB
      return isValidType && isValidSize;
    });

    setSelectedGalleryFiles(validFiles);
    
    // Create previews
    const previews = validFiles.map(file => URL.createObjectURL(file));
    setGalleryFilePreviews(previews);
  };

  const removeGalleryPreview = (index) => {
    const newFiles = selectedGalleryFiles.filter((_, i) => i !== index);
    const newPreviews = galleryFilePreviews.filter((_, i) => i !== index);
    setSelectedGalleryFiles(newFiles);
    setGalleryFilePreviews(newPreviews);
  };

  const handleGalleryUpload = async () => {
    if (selectedGalleryFiles.length === 0) return;
    
    setUploadingGallery(true);
    try {
      const formData = new FormData();
      selectedGalleryFiles.forEach(file => {
        formData.append('venue_gallery', file);
      });

      await venueService.uploadVenueGallery(id, formData);
      
      // Refresh venue data to get updated gallery
      await fetchVenueData();
      
      // Close modal and reset
      setIsGalleryUploadModalOpen(false);
      setSelectedGalleryFiles([]);
      setGalleryFilePreviews([]);
      
      alert('Gallery uploaded successfully!');
    } catch (error) {
      console.error('Error uploading gallery:', error);
      alert(`Failed to upload gallery: ${error.message}`);
    } finally {
      setUploadingGallery(false);
    }
  };

  const closeGalleryUploadModal = () => {
    setIsGalleryUploadModalOpen(false);
    setSelectedGalleryFiles([]);
    setGalleryFilePreviews([]);
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
    const images = Array.isArray(venue?.venue_gallery) ? venue.venue_gallery : [];
    if (images.length > 0) {
      setSelectedImageIndex((prev) => (prev + 1) % images.length);
    }
  };

  const prevImage = () => {
    const images = Array.isArray(venue?.venue_gallery) ? venue.venue_gallery : [];
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
      <HeroSection
        title={venue?.name}
        subtitle="Live Music Venue"
        image={(venue?.main_picture || venue?.venue_picture || venue?.image) ? 
          ((venue.main_picture || venue.venue_picture || venue.image)?.startsWith('http') 
            ? (venue.main_picture || venue.venue_picture || venue.image)
            : `${API_BASE_URL}${venue.main_picture || venue.venue_picture || venue.image}`) 
          : null}
        fallbackIcon={BuildingLibraryIcon}
        fallbackText="Venue Photo Coming Soon"
        breadcrumbs={[
          { label: 'Venues', path: '/venues', icon: null },
          { label: venue?.name || 'Venue', path: `/venue/${id}`, isLast: true }
        ]}
        onShare={handleShare}
        onFavorite={handleFavoriteToggle}
        isFavorite={isFavorite}
        stats={[
          { icon: MapPinIcon, text: venue?.location || 'Location TBD' },
          { icon: UsersIcon, text: `${venue?.capacity || 0} Capacity` }
        ]}
        rating="4.7"
        ratingText="Venue Rating"
        ctaText={isVenueOwner ? null : "Book Venue"}
        ctaIcon={isVenueOwner ? null : CalendarDaysIcon}
        onCtaClick={isVenueOwner ? null : () => console.log('Book venue clicked')}
      />

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="relative -mt-32 mb-8 bg-white rounded-2xl shadow-2xl overflow-hidden border border-purple-100">
          {/* Enhanced Venue Header */}
          <div className="p-8 border-b border-gray-100 bg-gradient-to-r from-purple-50 to-blue-50">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                          <div className="flex-1">
                <div className="flex items-center gap-4 mb-4">
                  {isEditingName ? (
                    <input
                      type="text"
                      value={editedVenueName}
                      onChange={(e) => setEditedVenueName(e.target.value)}
                      className="text-4xl font-bold text-gray-900 bg-white border-2 border-purple-300 rounded-lg px-3 py-2 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
                      placeholder="Enter venue name"
                    />
                  ) : (
                    <h1 className="text-4xl font-bold text-gray-900">{venue?.name}</h1>
                  )}
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
                  {isEditingDetails ? (
                    <>
                      <div className="flex items-center">
                        <MapPinIcon className="h-5 w-5 mr-2 text-purple-500" />
                        <LoadScript googleMapsApiKey={googleMapsApiKey} libraries={libraries}>
                          <Autocomplete
                            onLoad={(autoC) => (autocompleteRef.current = autoC)}
                            onPlaceChanged={onPlaceChanged}
                          >
                            <input
                              type="text"
                              value={editedVenueDetails.location}
                              onChange={(e) => setEditedVenueDetails(prev => ({ ...prev, location: e.target.value }))}
                              className="font-medium bg-white border-2 border-purple-300 rounded-lg px-3 py-1 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
                              placeholder="Start typing address..."
                            />
                          </Autocomplete>
                        </LoadScript>
                      </div>
                      <div className="flex items-center">
                        <UsersIcon className="h-5 w-5 mr-2 text-blue-500" />
                        <select
                          value={editedVenueDetails.capacity}
                          onChange={(e) => setEditedVenueDetails(prev => ({ ...prev, capacity: e.target.value }))}
                          className="font-medium bg-white border-2 border-purple-300 rounded-lg px-3 py-1 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
                        >
                          {capacityOptions.map((capacity) => (
                            <option key={capacity} value={capacity}>
                              {capacity}
                            </option>
                          ))}
                        </select>
                        <span className="ml-1">Capacity</span>
                      </div>
                      <div className="flex items-center">
                        <BuildingLibraryIcon className="h-5 w-5 mr-2 text-purple-500" />
                        <select
                          value={editedVenueDetails.category}
                          onChange={(e) => setEditedVenueDetails(prev => ({ ...prev, category: e.target.value }))}
                          className="font-medium bg-white border-2 border-purple-300 rounded-lg px-3 py-1 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
                        >
                          {venueCategories.map((category) => (
                            <option key={category} value={category}>
                              {category}
                            </option>
                          ))}
                        </select>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex items-center">
                        <MapPinIcon className="h-5 w-5 mr-2 text-purple-500" />
                        <span className="font-medium">{venue?.location}</span>
                      </div>
                      <div className="flex items-center">
                        <UsersIcon className="h-5 w-5 mr-2 text-blue-500" />
                        <span className="font-medium">{venue?.capacity} Capacity</span>
                      </div>
                      <div className="flex items-center">
                        <BuildingLibraryIcon className="h-5 w-5 mr-2 text-purple-500" />
                        <span className="font-medium">{venue?.category || 'Live Music Venue'}</span>
                      </div>
                    </>
                  )}
                </div>
                <span className="inline-flex items-center bg-gradient-to-r from-purple-600 to-blue-600 text-white text-sm font-medium px-4 py-2 rounded-full shadow-md">
                  <SparklesIcon className="h-4 w-4 mr-2" />
                  Premium Venue
                </span>
                

                      </div>
              
              {/* Enhanced Action Card */}
              <div className="mt-6 lg:mt-0 lg:ml-8">
                <div className="bg-gradient-to-br from-purple-50 to-blue-50 border border-purple-200 p-6 rounded-2xl min-w-[250px] shadow-lg">
                  <div className="mb-6 text-center">
                    <p className="text-4xl font-black text-gray-900 mb-1">★ 4.9</p>
                    <p className="text-sm text-gray-600 bg-white px-3 py-1 rounded-full inline-block">venue rating</p>
                  </div>

                  {isVenueOwner ? (
                    isEditingName ? (
                      <div className="flex gap-3">
                        <button 
                          onClick={handleSaveVenue}
                          className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-105 group"
                        >
                          <SparklesIcon className="h-5 w-5 mr-2" />
                          <span>Save</span>
                        </button>
                        <button 
                          onClick={handleCancelEdit}
                          className="flex-1 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-105 group"
                        >
                          <XMarkIcon className="h-5 w-5 mr-2" />
                          <span>Cancel</span>
                        </button>
                      </div>
                    ) : (
                      <button 
                        onClick={handleEditVenue}
                        className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-105 group"
                      >
                        <SparklesIcon className="h-5 w-5 mr-2" />
                        <span>Edit</span>
                        <ArrowTopRightOnSquareIcon className="h-5 w-5 ml-2 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
                      </button>
                    )
                  ) : (
                    <button className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-105 group">
                      <SparklesIcon className="h-5 w-5 mr-2" />
                      <span>Book Venue</span>
                      <ArrowTopRightOnSquareIcon className="h-5 w-5 ml-2 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
                    </button>
                  )}

                  {/* Additional CTA */}
                  <button 
                    onClick={handleShare}
                    className="w-full mt-3 bg-white hover:bg-gray-50 border border-purple-200 hover:border-purple-300 text-purple-700 font-medium py-3 px-6 rounded-xl transition-all duration-300 flex items-center justify-center"
                  >
                    <ShareIcon className="h-5 w-5 mr-2" />
                    <span>Share Venue</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Venue Details Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 p-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* About */}
              {venue?.description && (
                <div>
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4">About the Venue</h2>
                  <div className="prose max-w-none">
                    <p className="text-gray-700 whitespace-pre-line leading-relaxed">
                      {venue.description}
                    </p>
                  </div>
                </div>
              )}

              {/* Venue Gallery - Only show to owner */}
              {isVenueOwner && (
                <div>
                  <h2 className="text-2xl font-semibold text-gray-900 mb-6">Venue Gallery</h2>
                  {galleryImages.length > 0 ? (
                    <div className="bg-white border border-gray-200 rounded-xl p-6">
                      <div className="grid grid-cols-4 gap-4 mb-6">
                        {galleryImages.slice(0, 8).map((image, index) => (
                          <div 
                            key={index}
                            className="relative aspect-square rounded-lg overflow-hidden cursor-pointer group shadow-md hover:shadow-xl transition-all duration-300"
                            onClick={() => openGallery(index)}
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
                      
                      {/* View More Accordion */}
                      {galleryImages.length > 8 && (
                        <div className="border-t border-gray-200 pt-6">
                          <details className="group">
                            <summary className="flex items-center justify-between cursor-pointer text-purple-600 hover:text-purple-700 font-medium transition-colors duration-200">
                              <span>View All {galleryImages.length} Photos</span>
                              <ChevronDownIcon className="h-5 w-5 group-open:rotate-180 transition-transform duration-200" />
                            </summary>
                            <div className="mt-4 grid grid-cols-4 gap-4">
                              {galleryImages.slice(8).map((image, index) => (
                                <div 
                                  key={index + 8}
                                  className="relative aspect-square rounded-lg overflow-hidden cursor-pointer group shadow-md hover:shadow-xl transition-all duration-300"
                                  onClick={() => openGallery(index + 8)}
                                >
                                  <img
                                    src={image.startsWith('http') ? image : `${API_BASE_URL}${image}`}
                                    alt={`Gallery ${index + 9}`}
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                  />
                                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                </div>
                              ))}
                            </div>
                          </details>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="bg-white border border-gray-200 rounded-xl p-6">
                      <div className="text-center py-12">
                        <PhotoIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No Gallery Images</h3>
                        <p className="text-gray-600 mb-6">This venue doesn't have any gallery images yet.</p>
                        <button
                          onClick={() => setIsGalleryUploadModalOpen(true)}
                          className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium py-3 px-6 rounded-xl transition-all duration-300 flex items-center justify-center mx-auto shadow-lg hover:shadow-xl hover:scale-105"
                        >
                          <PhotoIcon className="h-5 w-5 mr-2" />
                          Add Gallery Images
                        </button>
                      </div>
                    </div>
                  )}
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
                            {event.artist && (
                              <div className="flex items-center text-sm text-gray-600 mt-1">
                                <MusicalNoteIcon className="h-4 w-4 mr-2" />
                                {event.artist.name}
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
                      <p className="text-gray-600">This venue hasn't scheduled any events yet.</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Venue Map */}
              <div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-6">Location</h2>
                <div className="bg-white border border-gray-200 rounded-xl p-6">
                  {venue?.latitude && venue?.longitude ? (
                    <VenueMap venue={venue} />
                  ) : (
                    <div>
                      <p className="text-gray-500 text-center py-8">No location coordinates available for this venue.</p>
                      <p className="text-sm text-gray-400 text-center">Latitude: {venue?.latitude || 'Not set'}</p>
                      <p className="text-sm text-gray-400 text-center">Longitude: {venue?.longitude || 'Not set'}</p>
                      {/* Test map with mock data */}
                      <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-600 mb-2">Test Map (Mock Data):</p>
                        <VenueMap venue={{
                          name: "Test Venue",
                          latitude: -25.4658,
                          longitude: 30.9853
                        }} />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Contact Info */}
              {(venue?.contact_email || venue?.phone_number) && (
                <div className="bg-white border border-gray-200 p-6 rounded-xl">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Get in Touch</h3>
                  <div className="space-y-3">
                    {venue?.contact_email && (
                      <a href={`mailto:${venue.contact_email}`} className="flex items-center text-purple-600 hover:text-purple-700 transition-colors duration-200">
                        <ArrowTopRightOnSquareIcon className="h-4 w-4 mr-2" />
                        Email Venue
                      </a>
                    )}
                    {venue?.phone_number && (
                      <a href={`tel:${venue.phone_number}`} className="flex items-center text-purple-600 hover:text-purple-700 transition-colors duration-200">
                        <ArrowTopRightOnSquareIcon className="h-4 w-4 mr-2" />
                        Call Venue
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

      {/* Gallery Upload Modal */}
      {isGalleryUploadModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">Upload Venue Gallery</h2>
                <button
                  onClick={closeGalleryUploadModal}
                  className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>
            </div>

            <div className="p-6">
              {galleryFilePreviews.length === 0 ? (
                /* File Selection Area */
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-purple-400 transition-colors">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={(e) => handleGalleryFileSelection(e.target.files)}
                    className="hidden"
                    id="venue-gallery-upload"
                    disabled={uploadingGallery}
                  />
                  <label htmlFor="venue-gallery-upload" className="cursor-pointer">
                    <PhotoIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <p className="text-sm text-gray-600 mb-2">
                      <span className="font-medium text-purple-600">Click to select photos</span> or drag and drop
                    </p>
                    <p className="text-xs text-gray-500">PNG, JPG, GIF, WebP up to 5MB each</p>
                  </label>
                </div>
              ) : (
                /* File Previews */
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium text-gray-900">
                      Selected Photos ({galleryFilePreviews.length})
                    </h4>
                    <button
                      onClick={() => {
                        setSelectedGalleryFiles([]);
                        setGalleryFilePreviews([]);
                      }}
                      className="text-sm text-gray-500 hover:text-gray-700"
                      disabled={uploadingGallery}
                    >
                      Clear All
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {galleryFilePreviews.map((preview, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={preview}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-32 object-cover rounded-lg"
                        />
                        <button
                          onClick={() => removeGalleryPreview(index)}
                          className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                          disabled={uploadingGallery}
                        >
                          <XMarkIcon className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
              <button
                onClick={closeGalleryUploadModal}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors duration-200"
                disabled={uploadingGallery}
              >
                Cancel
              </button>
              <button
                onClick={handleGalleryUpload}
                disabled={selectedGalleryFiles.length === 0 || uploadingGallery}
                className={`px-6 py-2 rounded-lg font-medium transition-all duration-300 ${
                  selectedGalleryFiles.length === 0 || uploadingGallery
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg hover:shadow-xl hover:scale-105'
                }`}
              >
                {uploadingGallery ? 'Uploading...' : 'Upload Gallery'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}