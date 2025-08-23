// frontend/src/pages/Artists/ArtistPage.jsx
import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { 
  MusicalNoteIcon, 
  MagnifyingGlassIcon, 
  UserIcon,
  CalendarDaysIcon,
  ArrowTopRightOnSquareIcon,
  SparklesIcon,
  HeartIcon,
  StarIcon,
  PlayIcon,
  PauseIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  MapPinIcon,
  UsersIcon,
  FireIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon, StarIcon as StarSolidIcon } from '@heroicons/react/24/solid';
import API_BASE_URL from '../api/config';
import ArtistCard from '../components/Artist/ArtistCard';

export default function ArtistPage() {
  const [artists, setArtists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [currentCarouselIndex, setCurrentCarouselIndex] = useState(0);
  const [isCarouselPlaying, setIsCarouselPlaying] = useState(true);
  const [likedArtists, setLikedArtists] = useState(new Set());
  const [favoriteArtists, setFavoriteArtists] = useState(new Set());
  const carouselIntervalRef = useRef(null);

  // Categories for filtering
  const categories = [
    { id: 'all', name: 'All Artists', icon: MusicalNoteIcon, color: 'from-purple-500 to-blue-500' },
    { id: 'rock', name: 'Rock', icon: FireIcon, color: 'from-red-500 to-orange-500' },
    { id: 'pop', name: 'Pop', icon: SparklesIcon, color: 'from-pink-500 to-purple-500' },
    { id: 'jazz', name: 'Jazz', icon: MusicalNoteIcon, color: 'from-yellow-500 to-orange-500' },
    { id: 'electronic', name: 'Electronic', icon: SparklesIcon, color: 'from-cyan-500 to-blue-500' },
    { id: 'classical', name: 'Classical', icon: MusicalNoteIcon, color: 'from-emerald-500 to-teal-500' },
    { id: 'hip-hop', name: 'Hip-Hop', icon: FireIcon, color: 'from-purple-500 to-pink-500' },
    { id: 'country', name: 'Country', icon: MapPinIcon, color: 'from-green-500 to-emerald-500' }
  ];

  useEffect(() => {
    const fetchArtists = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/artists`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        setArtists(response.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch artists');
      } finally {
        setLoading(false);
      }
    };

    fetchArtists();
  }, []);

  // Carousel auto-play functionality
  useEffect(() => {
    if (isCarouselPlaying && artists.length > 0) {
      carouselIntervalRef.current = setInterval(() => {
        setCurrentCarouselIndex((prev) => (prev + 1) % Math.min(artists.length, 5));
      }, 5000);
    } else {
      clearInterval(carouselIntervalRef.current);
    }

    return () => clearInterval(carouselIntervalRef.current);
  }, [isCarouselPlaying, artists.length]);

  // Filter artists based on search and category
  const filteredArtists = artists.filter(artist => {
    const matchesSearch = (artist.stage_name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
                         (artist.genre?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
                         (artist.bio?.toLowerCase() || '').includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === 'all' || 
                           (artist.genre?.toLowerCase() || '').includes(selectedCategory.toLowerCase());
    
    return matchesSearch && matchesCategory;
  });

  // Get featured artists for carousel (first 5 or random selection)
  const featuredArtists = artists.slice(0, 5);

  // Handle carousel navigation
  const nextCarousel = () => {
    setCurrentCarouselIndex((prev) => (prev + 1) % featuredArtists.length);
  };

  const prevCarousel = () => {
    setCurrentCarouselIndex((prev) => (prev - 1 + featuredArtists.length) % featuredArtists.length);
  };

  // Handle like/favorite toggles
  const toggleLike = (artistId) => {
    setLikedArtists(prev => {
      const newSet = new Set(prev);
      if (newSet.has(artistId)) {
        newSet.delete(artistId);
      } else {
        newSet.add(artistId);
      }
      return newSet;
    });
  };

  const toggleFavorite = (artistId) => {
    setFavoriteArtists(prev => {
      const newSet = new Set(prev);
      if (newSet.has(artistId)) {
        newSet.delete(artistId);
      } else {
        newSet.add(artistId);
      }
      return newSet;
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-500 mx-auto mb-4"></div>
          <p className="text-purple-600 font-medium">Discovering amazing artists...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 p-6 rounded-2xl mx-4 my-8">
        <p className="font-medium">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      {/* Hero Carousel Section */}
      {featuredArtists.length > 0 && (
        <div className="relative overflow-hidden bg-gradient-to-br from-purple-600 via-blue-600 to-purple-800 py-12">
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Carousel Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center space-x-2 bg-white/10 px-4 py-2 rounded-full mb-4">
                <SparklesIcon className="h-5 w-5 text-white" />
                <span className="font-medium text-white">Featured Artists</span>
              </div>
              <h1 className="text-3xl md:text-5xl font-black text-white mb-3 leading-tight">
                Discover Amazing Talent
              </h1>
              <p className="text-lg text-white/90 max-w-2xl mx-auto">
                Experience the best musicians and performers from around the world
              </p>
            </div>

            {/* Interactive Carousel */}
            <div className="relative">
              <div className="flex overflow-hidden rounded-3xl shadow-2xl">
                {featuredArtists.map((artist, index) => (
                  <div
                    key={artist.id}
                    className={`w-full flex-shrink-0 transition-transform duration-700 ease-in-out ${
                      index === currentCarouselIndex ? 'translate-x-0' : 'translate-x-full'
                    }`}
                  >
                    <div className="relative h-64 md:h-80 bg-gradient-to-br from-purple-900 to-blue-900">
                      {artist.image_url ? (
                        <img 
                          src={artist.image_url} 
                          alt={artist.stage_name}
                          className="w-full h-full object-cover opacity-80"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-800 to-blue-800">
                          <MusicalNoteIcon className="h-24 w-24 text-white/50" />
                        </div>
                      )}
                      
                      {/* Overlay Content */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent">
                        <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                          <div className="flex items-center space-x-3 mb-4">
                            <span className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium">
                              {artist.artist_type}
                            </span>
                            <div className="flex items-center space-x-1">
                              <StarSolidIcon className="h-4 w-4 text-yellow-400" />
                              <span className="text-sm">4.8</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <UsersIcon className="h-4 w-4" />
                              <span className="text-sm">1.2k followers</span>
                            </div>
                          </div>
                          <h2 className="text-2xl md:text-4xl font-bold mb-3">{artist.stage_name}</h2>
                          <p className="text-base text-white/90 mb-4 max-w-2xl line-clamp-2">{artist.bio}</p>
                          <div className="flex items-center space-x-4">
                            <button className="bg-white text-purple-600 px-6 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-colors duration-300">
                              Book Now
                            </button>
                            <button 
                              onClick={() => toggleLike(artist.id)}
                              className="p-3 bg-white/20 backdrop-blur-sm rounded-xl hover:bg-white/30 transition-colors duration-300"
                            >
                              {likedArtists.has(artist.id) ? (
                                <HeartSolidIcon className="h-6 w-6 text-red-500" />
                              ) : (
                                <HeartIcon className="h-6 w-6 text-white" />
                              )}
                            </button>
                            <button 
                              onClick={() => toggleFavorite(artist.id)}
                              className="p-3 bg-white/20 backdrop-blur-sm rounded-xl hover:bg-white/30 transition-colors duration-300"
                            >
                              {favoriteArtists.has(artist.id) ? (
                                <StarSolidIcon className="h-6 w-6 text-yellow-400" />
                              ) : (
                                <StarIcon className="h-6 w-6 text-white" />
                              )}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Carousel Controls */}
              <button
                onClick={prevCarousel}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-colors duration-300"
              >
                <ChevronLeftIcon className="h-6 w-6 text-white" />
              </button>
              <button
                onClick={nextCarousel}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-colors duration-300"
              >
                <ChevronRightIcon className="h-6 w-6 text-white" />
              </button>

              {/* Carousel Indicators */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
                {featuredArtists.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentCarouselIndex(index)}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      index === currentCarouselIndex ? 'bg-white w-8' : 'bg-white/50'
                    }`}
                  />
                ))}
              </div>

              {/* Play/Pause Control */}
              <button
                onClick={() => setIsCarouselPlaying(!isCarouselPlaying)}
                className="absolute top-4 right-4 p-3 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-colors duration-300"
              >
                {isCarouselPlaying ? (
                  <PauseIcon className="h-5 w-5 text-white" />
                ) : (
                  <PlayIcon className="h-5 w-5 text-white" />
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Category Tabs */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Browse by Category</h2>
          <div className="flex flex-wrap gap-3">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                  selectedCategory === category.id
                    ? `bg-gradient-to-r ${category.color} text-white shadow-lg scale-105`
                    : 'bg-white/80 backdrop-blur-sm border border-gray-200 text-gray-700 hover:bg-white hover:shadow-md'
                }`}
              >
                <category.icon className="h-5 w-5" />
                <span>{category.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Advanced Search & Results Counter */}
        <div className="bg-white/90 backdrop-blur-lg border border-purple-200 rounded-2xl p-6 shadow-sm mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-br from-purple-200 to-blue-200 rounded-lg">
                <MagnifyingGlassIcon className="h-5 w-5 text-purple-700" />
              </div>
              <h2 className="text-xl font-bold text-purple-700">Find Your Perfect Artist</h2>
            </div>
            <div className="text-sm text-gray-600">
              {filteredArtists.length} of {artists.length} artists
            </div>
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5 text-purple-400" />
            </div>
            <input
              type="text"
              placeholder="Search artists by name, genre, or style..."
              className="block w-full pl-12 pr-4 py-4 border border-purple-100 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white/80 backdrop-blur-sm text-lg"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          {searchTerm && (
            <div className="mt-3 text-sm text-gray-600">
              Found {filteredArtists.length} artist{filteredArtists.length !== 1 ? 's' : ''} matching "{searchTerm}"
            </div>
          )}
        </div>

        {/* Artists Grid - Optimized for Thousands */}
        {filteredArtists.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8 gap-4">
            {filteredArtists.map((artist) => (
              <ArtistCard
                key={artist.id}
                artist={artist}
                onLike={toggleLike}
                onFavorite={toggleFavorite}
                isLiked={likedArtists.has(artist.id)}
                isFavorited={favoriteArtists.has(artist.id)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="bg-white/90 backdrop-blur-lg border border-purple-200 rounded-2xl p-12 shadow-sm">
              <div className="flex flex-col items-center">
                <div className="p-4 bg-gradient-to-br from-purple-100 to-blue-100 rounded-2xl mb-6">
                  <UserIcon className="h-16 w-16 text-purple-400" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">No Artists Found</h3>
                <p className="text-gray-600 max-w-md">
                  {searchTerm 
                    ? `No artists found matching "${searchTerm}". Try adjusting your search or browse different categories.`
                    : "No artists are currently available in this category. Check back soon!"
                  }
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}