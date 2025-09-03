import React from 'react';
import { Link } from 'react-router-dom';
import { MapPinIcon, StarIcon, UsersIcon, BuildingOfficeIcon, TrashIcon } from '@heroicons/react/24/outline';
import VenueMap from '../Map/VenueMap';
import API_BASE_URL from '../../api/config';
import { useAuth } from '../../context/AuthContext';
import { venueService } from '../../api/venueService';

const EnhancedVenueCard = ({ venue, className = '', showActions = true, showStats = true, onDelete }) => {
    const { currentUser, isAuthenticated } = useAuth();

    const isOwner = React.useMemo(() => {
        if (!venue) return false;
        if (venue.isOwnVenue || venue.isOwner) return true;
        if (!isAuthenticated || !currentUser) return false;
        if (currentUser?.artist_id && venue.owner_type === 'artist' && String(venue.owner_id) === String(currentUser.artist_id)) return true;
        if (currentUser?.organiser_id && venue.owner_type === 'organiser' && String(venue.owner_id) === String(currentUser.organiser_id)) return true;
        return false;
    }, [venue, isAuthenticated, currentUser]);

    const [deleting, setDeleting] = React.useState(false);

    const handleDelete = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (!window.confirm('Are you sure you want to delete this venue?')) return;
        try {
            setDeleting(true);
            await venueService.deleteVenue(venue.id);
            if (typeof onDelete === 'function') {
                onDelete(venue.id);
            }
        } catch (err) {
            console.error('Failed to delete venue:', err);
            alert(err.message || 'Failed to delete venue');
        } finally {
            setDeleting(false);
        }
    };
    const imageUrl = React.useMemo(() => {
        if (!venue.main_picture) return null;
        
        // If it's already a full URL, return as is
        if (venue.main_picture.startsWith('http')) {
            return venue.main_picture;
        }
        
        // If it's a relative path, construct the full URL using API_BASE_URL
        const fullUrl = `${API_BASE_URL}${venue.main_picture}`;
        
        // Debug logging
        console.log('🔍 EnhancedVenueCard Image Debug:', {
            venueName: venue.name,
            venueId: venue.id,
            mainPicture: venue.main_picture,
            mainPictureType: typeof venue.main_picture,
            mainPictureLength: venue.main_picture?.length,
            API_BASE_URL: API_BASE_URL,
            fullUrl: fullUrl,
            hasImage: !!fullUrl
        });
        
        return fullUrl;
    }, [venue.main_picture]);

    const lat = venue?.coordinates?.lat ?? venue?.lat;
    const lng = venue?.coordinates?.lng ?? venue?.lng;

    return (
        <div className={`bg-white rounded-[22px] shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 overflow-hidden ${className}`}>
            {/* Top Image Section */}
            <div className="relative aspect-[4/3]">
                {imageUrl ? (
                    <>
                        <img 
                            src={imageUrl}
                            alt={venue.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                                console.error('❌ Image failed to load:', {
                                    venueName: venue.name,
                                    venueId: venue.id,
                                    imageUrl: imageUrl,
                                    error: e
                                });
                                e.target.style.display = 'none';
                            }}
                            onLoad={() => {
                                console.log('✅ Image loaded successfully:', {
                                    venueName: venue.name,
                                    venueId: venue.id,
                                    imageUrl: imageUrl
                                });
                            }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                    </>
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-100 to-pink-100">
                        <div className="p-4 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 shadow-lg">
                            <BuildingOfficeIcon className="h-8 w-8 text-white" />
                        </div>
                    </div>
                )}

                {/* Badges */}
                <div className="absolute top-3 right-3 flex items-center space-x-2">
                    {venue.rating && (
                        <div className="flex items-center bg-white/90 backdrop-blur px-2 py-1 rounded-full text-xs font-medium shadow-sm">
                            <StarIcon className="h-4 w-4 text-yellow-500 mr-1" />
                            {Number(venue.rating).toFixed(1)}
                        </div>
                    )}
                </div>

                {/* Title overlay button */}
                <div className="absolute bottom-3 right-3">
                    <div className="bg-white/95 px-4 py-2 rounded-full text-sm font-medium shadow">
                        Start Route
                    </div>
                </div>

                {/* Caption */}
                <div className="absolute bottom-3 left-3">
                    <div className="bg-black/60 text-white px-3 py-1 rounded-full text-xs flex items-center">
                        <MapPinIcon className="h-4 w-4 mr-1 text-white" />
                        {venue?.location || venue?.address || 'Location'}
                    </div>
                </div>
            </div>

            {/* Bottom stats + mini map */}
            <div className="grid grid-cols-5 gap-3 p-4 items-center">
                <div className="col-span-3 space-y-1">
                    <h3 className="font-semibold text-gray-900 truncate">{venue?.name}</h3>
                    <div className="text-xs text-gray-500 truncate">{venue?.subtitle || venue?.city || ''}</div>
                    <div className="mt-2 flex items-center text-xs text-gray-600 space-x-4">
                        {venue?.capacity && (
                            <span className="flex items-center">
                                <UsersIcon className="h-3 w-3 mr-1" />
                                {venue.capacity} max
                            </span>
                        )}
                        {venue?.distance && (
                            <span>{venue.distance} km</span>
                        )}
                        {venue?.level && (
                            <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-600">{venue.level}</span>
                        )}
                    </div>
                </div>
                <div className="col-span-2">
                    <div className="rounded-lg overflow-hidden border border-gray-100">
                        <div className="h-24 w-full">
                            {lat && lng ? (
                                <VenueMap venue={{ ...venue, latitude: lat, longitude: lng }} height="100%" width="100%" zoom={14} />
                            ) : (
                                <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                                    <MapPinIcon className="h-6 w-6 text-gray-400" />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Action button */}
            {showActions && (
                <div className="px-4 pb-4 flex items-center gap-2">
                    <Link
                        to={`/venue/${venue.id}`}
                        className="flex-1 bg-purple-100 text-purple-600 hover:bg-purple-200 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-300 flex items-center justify-center"
                    >
                        View
                    </Link>
                    {isOwner && (
                        <button
                            onClick={handleDelete}
                            disabled={deleting}
                            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-300 flex items-center justify-center border ${deleting ? 'bg-red-100 text-red-400 border-red-200 cursor-not-allowed' : 'bg-red-100 text-red-600 hover:bg-red-200 border-red-200'}`}
                            title="Delete venue"
                        >
                            <TrashIcon className="h-4 w-4 mr-1" /> {deleting ? 'Deleting...' : 'Delete'}
                        </button>
                    )}
                </div>
            )}
        </div>
    );
};

export default EnhancedVenueCard;
