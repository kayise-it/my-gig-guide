// frontend/src/pages/Artists/ArtistPage.jsx
import { useEffect, useState } from 'react';
import axios from 'axios';
import { 
  MusicalNoteIcon, 
  MagnifyingGlassIcon, 
  UserIcon,
  CalendarDaysIcon,
  ArrowTopRightOnSquareIcon,
  SparklesIcon 
} from '@heroicons/react/24/outline';
import API_BASE_URL from '../api/config';

export default function ArtistPage() {
  const [artists, setArtists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
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

  const filteredArtists = artists.filter(artist =>
    (artist.stage_name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (artist.artist_type?.toLowerCase() || '').includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 bg-gradient-to-br from-purple-50 via-white to-blue-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
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
      {/* Modern Hero Header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-purple-600 via-blue-600 to-purple-800 py-24">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center space-x-2 bg-white/10 px-4 py-2 rounded-full mb-6">
              <MusicalNoteIcon className="h-5 w-5 text-white" />
              <span className="font-medium text-white">Discover Amazing Artists</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-white mb-4 leading-tight">
              Featured Artists
            </h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              Explore talented musicians and performers from around the world
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Search Bar */}
        <div className="bg-white/90 backdrop-blur-lg border border-purple-200 rounded-2xl p-6 shadow-sm mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-gradient-to-br from-purple-200 to-blue-200 rounded-lg">
              <MagnifyingGlassIcon className="h-5 w-5 text-purple-700" />
            </div>
            <h2 className="text-xl font-bold text-purple-700">Search Artists</h2>
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5 text-purple-400" />
            </div>
            <input
              type="text"
              placeholder="Search artists by name or genre..."
              className="block w-full pl-12 pr-4 py-3 border border-purple-100 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white/80 backdrop-blur-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Artists Grid */}
        {filteredArtists.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredArtists.map((artist) => (
              <div key={artist.id} className="bg-white/90 backdrop-blur-lg border border-purple-200 rounded-2xl shadow-sm overflow-hidden hover:shadow-lg hover:scale-105 transition-all duration-300 group">
                <div className="relative h-48 bg-gradient-to-br from-purple-100 to-blue-100">
                  {artist.image_url ? (
                    <img 
                      src={artist.image_url} 
                      alt={artist.stage_name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="p-4 bg-gradient-to-br from-purple-400 to-blue-400 rounded-2xl">
                        <MusicalNoteIcon className="h-12 w-12 text-white" />
                      </div>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
                  <div className="absolute top-3 right-3">
                    <div className="bg-white/80 backdrop-blur-sm p-2 rounded-full">
                      <SparklesIcon className="h-4 w-4 text-purple-600" />
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-purple-700 transition-colors duration-300">{artist.stage_name}</h2>
                  <span className="inline-block px-3 py-1 text-sm font-semibold bg-gradient-to-r from-purple-100 to-blue-100 text-purple-700 rounded-full mb-3">
                    {artist.artist_type}
                  </span>
                  <p className="text-gray-600 text-sm line-clamp-3 mb-4">{artist.bio}</p>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                      <CalendarDaysIcon className="h-4 w-4 text-gray-400" />
                      <span className="text-xs text-gray-500">
                        {new Date(artist.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <a
                      href={`/Artists/${artist.id}`}
                      className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-4 py-2 rounded-xl transition-all duration-300 font-medium text-sm hover:scale-105 group"
                    >
                      <span>View Profile</span>
                      <ArrowTopRightOnSquareIcon className="h-4 w-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
                    </a>
                  </div>
                </div>
              </div>
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
                    ? `No artists found matching "${searchTerm}". Try adjusting your search.`
                    : "No artists are currently available. Check back soon!"
                  }
                </p>
              </div>
            </div>
          </div>
        )}

        {/* JSON Debug View (optional) */}
        <details className="mt-12 bg-white/90 backdrop-blur-lg border border-purple-200 rounded-2xl p-6 shadow-sm">
          <summary className="font-medium text-purple-700 cursor-pointer hover:text-purple-800 transition-colors duration-200">
            Debug: Artists JSON
          </summary>
          <pre className="mt-4 p-4 bg-purple-50 rounded-xl overflow-auto max-h-64 text-sm border border-purple-100">
            {JSON.stringify(artists, null, 2)}
          </pre>
        </details>
      </div>
    </div>
  );
}