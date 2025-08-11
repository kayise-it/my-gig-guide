import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { venueService } from '../../api/venueService';
import VenueCard from '../../components/Venue/VenueCard';
import { useAuth } from '../../context/AuthContext';
import DashboardBreadCrumb from '../../components/Includes/DashboardBreadCrumb';
import { HeroBreadcrumb } from '../../components/UI/DynamicBreadcrumb';
import { Link } from 'react-router-dom';
import GoogleMapComponent from '../../components/Map/GoogleMapComponent';
import { 
  MapPinIcon, 
  UsersIcon, 
  PhoneIcon, 
  EnvelopeIcon, 
  GlobeAltIcon,
  StarIcon,
  XMarkIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  BuildingLibraryIcon,
  CalendarDaysIcon,
  MusicalNoteIcon,
  SparklesIcon,
  ShareIcon,
  HeartIcon,
  PlusIcon,
  ArrowTopRightOnSquareIcon
} from '@heroicons/react/24/outline';


export default function ViewVenue() {
  const { id } = useParams();
  const [venue, setVenue] = useState(null);
  const [venues, setVenues] = useState(null);
  const [apiError, setApiError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [galleryModalOpen, setGalleryModalOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);


  useEffect(() => {
    async function fetchVenue() {
      try {
        const response = await venueService.getVenueById(id);
        console.log("Venue qwe:", response);
        setVenue(response.venue);
      } catch (error) {
        console.error("Error fetching venue:", error);
      }
    }
    const userId = JSON.parse(localStorage.getItem('user')).id;

    const fetchVenues = async () => {
      /* Try to get the vunues for this currentUser.id */
      try {
        const response = await venueService.getOrganisersVenues(userId);
        setVenues(response);

      } catch (error) {
        console.error("Failed to fetch venues:", error);
        setApiError("Failed to fetch venues.");
      }
    };

    if (id) { fetchVenue(); fetchVenues(); }
  }, [id]);

  const breadcrumbs = [
    { label: 'Dashboard', path: '/organiser/dashboard' },
    { label: venue?.name, path: `/organiser/dashboard/venues/edit/${id}` },
  ];

  // Parse gallery images
  const galleryImages = venue?.venue_gallery ? JSON.parse(venue.venue_gallery) : [];
  const allImages = [venue?.main_picture, ...galleryImages].filter(Boolean);

  // Gallery navigation functions
  const openGallery = (index = 0) => {
    setSelectedImageIndex(index);
    setGalleryModalOpen(true);
  };

  const closeGallery = () => {
    setGalleryModalOpen(false);
  };

  const nextImage = () => {
    setSelectedImageIndex((prev) => (prev + 1) % allImages.length);
  };

  const prevImage = () => {
    setSelectedImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
  };

  console.log(venue)

  if (!venue) return (
    <div className="flex items-center justify-center h-64 bg-gradient-to-br from-purple-50 via-white to-blue-50">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
    </div>
  );

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
        {/* Modern Hero Header */}
        <div className="relative overflow-hidden bg-gradient-to-br from-purple-600 via-blue-600 to-purple-800 py-24">
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Dynamic Breadcrumb */}
            <HeroBreadcrumb
              customBreadcrumbs={[
                { label: 'Dashboard', path: '/organiser/dashboard', icon: null },
                { label: 'Venues', path: '/organiser/dashboard/venues', icon: null },
                { label: venue?.name || 'Venue', path: `/venue/${id}`, isLast: true }
              ]}
              showHome={true}
              className="mb-8"
            />
            <div className="text-left">
              <div className="inline-flex items-center space-x-2 bg-white/10 px-4 py-2 rounded-full mb-6">
                <BuildingLibraryIcon className="h-5 w-5 text-white" />
                <span className="font-medium text-white">Live Music Venue</span>
              </div>
              <h1 className="text-5xl md:text-7xl font-black text-white mb-4 leading-tight">
                {venue.name}
              </h1>
              <div className="flex flex-wrap items-center gap-6 text-white/90 text-lg mb-4">
                <div className="flex items-center space-x-2">
                  <MapPinIcon className="h-5 w-5 text-purple-300" />
                  <span>{venue.location}</span>
                </div>
                {venue.capacity && (
                  <div className="flex items-center space-x-2">
                    <UsersIcon className="h-5 w-5 text-purple-300" />
                    <span>{venue.capacity} capacity</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        {/* Main Content with Sidebar Layout */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex gap-8">
            {/* Main Content Card */}
            <div className="flex-1 space-y-8">
              {/* Venue Details Card */}
              <div className="bg-white/90 backdrop-blur-lg border border-purple-200 rounded-2xl p-8 shadow-sm">
                <div className="flex items-center space-x-3 mb-8">
                  <div className="p-3 bg-gradient-to-br from-purple-400 to-purple-200 rounded-xl">
                    <BuildingLibraryIcon className="h-6 w-6 text-purple-700" />
                  </div>
                  <h2 className="text-3xl font-bold text-purple-700">Venue Details</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div className="p-4 rounded-xl bg-purple-50 border border-purple-100">
                      <div className="flex items-start space-x-4">
                        <div className="p-2 bg-purple-200 rounded-lg">
                          <MapPinIcon className="h-5 w-5 text-purple-400" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-purple-700 mb-1">Address</h4>
                          <p className="text-purple-500">{venue.address}</p>
                        </div>
                      </div>
                    </div>
                    <div className="p-4 rounded-xl bg-purple-50 border border-purple-100">
                      <div className="flex items-start space-x-4">
                        <div className="p-2 bg-purple-100 rounded-lg">
                          <UsersIcon className="h-5 w-5 text-purple-400" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-purple-700 mb-1">Capacity</h4>
                          <p className="text-purple-600">{venue.capacity} people</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-6">
                    <div className="p-4 rounded-xl bg-purple-50 border border-purple-100">
                      <div className="flex items-start space-x-4">
                        <div className="p-2 bg-purple-100 rounded-lg">
                          <PhoneIcon className="h-5 w-5 text-purple-400" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-purple-700 mb-1">Phone</h4>
                          <p className="text-purple-600">{venue.phone_number}</p>
                        </div>
                      </div>
                    </div>
                    <div className="p-4 rounded-xl bg-pink-50 border border-pink-100">
                      <div className="flex items-start space-x-4">
                        <div className="p-2 bg-pink-100 rounded-lg">
                          <EnvelopeIcon className="h-5 w-5 text-pink-400" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-pink-700 mb-1">Email</h4>
                          <p className="text-pink-600">{venue.contact_email}</p>
                        </div>
                      </div>
                    </div>
                    {venue.website && (
                      <div className="p-4 rounded-xl bg-cyan-50 border border-cyan-100">
                        <div className="flex items-start space-x-4">
                          <div className="p-2 bg-cyan-100 rounded-lg">
                            <GlobeAltIcon className="h-5 w-5 text-cyan-400" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-cyan-700 mb-1">Website</h4>
                            <a 
                              href={venue.website} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-cyan-600 hover:text-cyan-700 flex items-center space-x-2"
                            >
                              <span>{venue.website}</span>
                              <ArrowTopRightOnSquareIcon className="h-4 w-4" />
                            </a>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              {/* Gallery Section */}
              {allImages.length > 0 && (
                <div className="bg-white/90 backdrop-blur-lg border border-pink-100 rounded-2xl p-8 shadow-sm">
                  <div className="flex items-center space-x-3 mb-8">
                    <div className="p-3 bg-gradient-to-br from-pink-200 to-purple-200 rounded-xl">
                      <SparklesIcon className="h-6 w-6 text-pink-700" />
                    </div>
                    <h2 className="text-3xl font-bold text-pink-700">Gallery</h2>
                    <div className="flex-1"></div>
                    <span className="bg-pink-200 text-pink-700 px-3 py-1 rounded-full text-sm">
                      {allImages.length} images
                    </span>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {allImages.map((image, index) => (
                      <div 
                        key={index}
                        className="relative aspect-square rounded-xl overflow-hidden cursor-pointer group border border-pink-100 hover:border-pink-300 transition-all duration-300"
                        onClick={() => openGallery(index)}
                      >
                        <img
                          src={image}
                          alt={`${venue.name} - Image ${index + 1}`}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-yellow-100 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                          <div className="bg-white/40 backdrop-blur-sm rounded-full p-3 transform scale-75 group-hover:scale-100 transition-transform duration-300">
                            <SparklesIcon className="h-6 w-6 text-pink-700" />
                          </div>
                        </div>
                        <div className="absolute top-2 right-2">
                          <span className="bg-white/70 backdrop-blur-sm text-pink-700 text-xs px-2 py-1 rounded-full">
                            {index + 1}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {/* Map Section */}
              <div className="bg-white/90 backdrop-blur-lg border border-purple-100 rounded-2xl p-8 shadow-sm">
                <div className="flex items-center space-x-3 mb-8">
                  <div className="p-3 bg-gradient-to-br from-purple-200 to-purple-300 rounded-xl">
                    <MapPinIcon className="h-6 w-6 text-purple-700" />
                  </div>
                  <h2 className="text-3xl font-bold text-purple-700">Location & Directions</h2>
                </div>
                <div className="w-full h-80 rounded-xl overflow-hidden border border-purple-100">
                  <GoogleMapComponent
                    gigs={[
                      {
                        id: venue.id,
                        name: venue.name,
                        venue: {
                          name: venue.name,
                          address: venue.address
                        }
                      }
                    ]}
                    apiKey={'AIzaSyDVfOS0l8Tv59v8WTgUO231X2FtmBQCc2Y'}
                  />
                </div>
                <div className="mt-6 p-4 bg-purple-50 rounded-xl border border-purple-100">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <MapPinIcon className="h-5 w-5 text-purple-400" />
                      <span className="text-purple-700">{venue.address}</span>
                    </div>
                    <button className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white px-4 py-2 rounded-lg font-medium transition-all duration-300 flex items-center space-x-2 hover:scale-105">
                      <span>Get Directions</span>
                      <ArrowTopRightOnSquareIcon className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
            {/* Sidebar */}
            <div className="w-80 flex-shrink-0 space-y-8 hidden lg:block">
              {/* Quick Actions */}
              <div className="bg-white/90 backdrop-blur-lg border border-purple-100 rounded-2xl p-6 shadow-sm sticky top-8">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="p-2 bg-gradient-to-br from-purple-200 to-purple-300 rounded-lg">
                    <MusicalNoteIcon className="h-5 w-5 text-purple-700" />
                  </div>
                  <h3 className="text-xl font-bold text-purple-700">Quick Actions</h3>
                </div>
                <div className="space-y-4">
                  <Link 
                    to="/organiser/dashboard/events/new"
                    className="w-full bg-gradient-to-r from-purple-400 to-pink-400 hover:from-purple-500 hover:to-pink-500 text-white px-4 py-3 rounded-xl font-medium transition-all duration-300 flex items-center space-x-3 hover:scale-105 group"
                  >
                    <PlusIcon className="h-5 w-5 group-hover:rotate-90 transition-transform duration-300" />
                    <span>Create Event</span>
                  </Link>
                  <Link 
                    to={`/organiser/dashboard/venues/edit/${id}`}
                    className="w-full bg-purple-50 hover:bg-purple-100 text-purple-700 px-4 py-3 rounded-xl font-medium transition-all duration-300 flex items-center space-x-3 border border-purple-100 hover:border-purple-300 group"
                  >
                    <BuildingLibraryIcon className="h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
                    <span>Edit Venue</span>
                  </Link>
                </div>
              </div>
              {/* Other Venues */}
              <div className="bg-white/90 backdrop-blur-lg border border-blue-100 rounded-2xl p-6 shadow-sm">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="p-2 bg-gradient-to-br from-blue-200 to-cyan-200 rounded-lg">
                    <BuildingLibraryIcon className="h-5 w-5 text-blue-700" />
                  </div>
                  <h3 className="text-xl font-bold text-blue-700">Your Other Venues</h3>
                </div>
                
                  {error && (
                    <div className="text-center py-8 bg-red-900/20 border border-red-500/30 rounded-xl">
                      <p className="text-red-300 mb-3">{error}</p>
                      <Link 
                        to="/organiser/dashboard/events/new" 
                        className="text-purple-400 hover:text-purple-300 transition-colors duration-300 flex items-center justify-center space-x-2"
                      >
                        <PlusIcon className="h-4 w-4" />
                        <span>Create Event</span>
                      </Link>
                    </div>
                  )}
                  
                  {venues && venues.length > 0 ? (
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                      {venues.slice(0, 5).map((otherVenue) => (
                        <Link 
                          key={otherVenue.id}
                          to={`/organiser/dashboard/venues/${otherVenue.id}`}
                          className="block p-4 rounded-xl bg-purple-50 hover:bg-purple-100 border border-purple-100 hover:border-purple-300 transition-all duration-300 group"
                        >
                          <div className="flex items-start space-x-3">
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                              <BuildingLibraryIcon className="h-5 w-5 text-white" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-semibold text-gray-900 truncate group-hover:text-purple-700 transition-colors duration-300">
                                {otherVenue.name}
                              </h4>
                              <p className="text-sm text-gray-600 mt-1 truncate group-hover:text-purple-600 transition-colors duration-300">
                                {otherVenue.location}
                              </p>
                              {otherVenue.capacity && (
                                <div className="flex items-center space-x-2 mt-2">
                                  <UsersIcon className="h-3 w-3 text-gray-500" />
                                  <p className="text-xs text-gray-500">Cap: {otherVenue.capacity}</p>
                                </div>
                              )}
                            </div>
                          </div>
                        </Link>
                      ))}
                      
                      {venues.length > 5 && (
                        <div className="text-center pt-4">
                          <Link 
                            to="/organiser/dashboard/venues"
                            className="text-blue-400 hover:text-blue-300 text-sm transition-colors duration-300"
                          >
                            View all {venues.length} venues →
                          </Link>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-8 bg-purple-50 rounded-xl border border-purple-100">
                      <BuildingLibraryIcon className="h-12 w-12 text-purple-400 mx-auto mb-3" />
                      <p className="text-gray-600 mb-4">No other venues yet</p>
                      <Link 
                        to="/organiser/dashboard/venues/new"
                        className="inline-flex items-center space-x-2 bg-purple-100 hover:bg-purple-200 text-purple-700 px-4 py-2 rounded-lg transition-colors duration-300"
                      >
                        <PlusIcon className="h-4 w-4" />
                        <span>Add New Venue</span>
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

      {/* Enhanced Gallery Modal */}
      {galleryModalOpen && allImages.length > 0 && (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="relative w-full max-w-6xl max-h-full">
            
            {/* Close Button */}
            <button
              onClick={closeGallery}
              className="absolute top-6 right-6 z-10 bg-gray-900/80 backdrop-blur-sm text-white p-3 rounded-full hover:bg-red-600/80 transition-all duration-300 hover:scale-110 group"
            >
              <XMarkIcon className="h-6 w-6 group-hover:rotate-90 transition-transform duration-300" />
            </button>

            {/* Navigation Buttons */}
            {allImages.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-6 top-1/2 transform -translate-y-1/2 z-10 bg-gray-900/80 backdrop-blur-sm text-white p-3 rounded-full hover:bg-purple-600/80 transition-all duration-300 hover:scale-110 group"
                >
                  <ChevronLeftIcon className="h-6 w-6 group-hover:-translate-x-1 transition-transform duration-300" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-6 top-1/2 transform -translate-y-1/2 z-10 bg-gray-900/80 backdrop-blur-sm text-white p-3 rounded-full hover:bg-purple-600/80 transition-all duration-300 hover:scale-110 group"
                >
                  <ChevronRightIcon className="h-6 w-6 group-hover:translate-x-1 transition-transform duration-300" />
                </button>
              </>
            )}

            {/* Image Container */}
            <div className="relative w-full h-full flex items-center justify-center">
              <img
                src={allImages[selectedImageIndex]}
                alt={`${venue.name} - Image ${selectedImageIndex + 1}`}
                className="max-w-full max-h-[90vh] object-contain rounded-2xl shadow-2xl border border-gray-700"
              />
              
              {/* Image Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-black/20 rounded-2xl pointer-events-none"></div>
            </div>

            {/* Enhanced Image Counter & Info */}
            <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex items-center space-x-4">
              <div className="bg-gray-900/80 backdrop-blur-sm text-white px-6 py-3 rounded-full border border-gray-700">
                <div className="flex items-center space-x-3">
                  <SparklesIcon className="h-5 w-5 text-purple-400" />
                  <span className="font-medium">{selectedImageIndex + 1} of {allImages.length}</span>
                </div>
              </div>
              
              {/* Share Button */}
              <button className="bg-gray-900/80 backdrop-blur-sm text-white p-3 rounded-full border border-gray-700 hover:bg-purple-600/80 transition-all duration-300 hover:scale-110 group">
                <ShareIcon className="h-5 w-5 group-hover:rotate-12 transition-transform duration-300" />
              </button>
            </div>

            {/* Image Thumbnails */}
            {allImages.length > 1 && (
              <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 flex space-x-2 max-w-md overflow-x-auto">
                {allImages.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`relative w-16 h-16 rounded-lg overflow-hidden border-2 transition-all duration-300 hover:scale-110 ${
                      index === selectedImageIndex 
                        ? 'border-purple-500 ring-2 ring-purple-500/50' 
                        : 'border-gray-600 hover:border-gray-400'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`Thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    {index === selectedImageIndex && (
                      <div className="absolute inset-0 bg-purple-500/20"></div>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}