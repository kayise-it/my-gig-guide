// frontend/src/pages/Artists/ArtistPage.jsx
import { useEffect, useState } from 'react';
import axios from 'axios';
import { FaMusic, FaSearch, FaSpinner } from 'react-icons/fa';

export default function ArtistPage() {
  const [artists, setArtists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  useEffect(() => {
    const fetchArtists = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/artists', {
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
      <div className="flex justify-center items-center h-64">
        <FaSpinner className="animate-spin text-4xl text-indigo-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Artists</h1>
      
      {/* Search Bar */}
      <div className="relative mb-8">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <FaSearch className="text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Search artists by name or genre..."
          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Artists Grid */}
      {filteredArtists.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredArtists.map((artist) => (
            <div key={artist.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
              <div className="relative h-48 bg-gray-200">
                {artist.image_url ? (
                  <img 
                    src={artist.image_url} 
                    alt={artist.stage_name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-indigo-100">
                    <FaMusic className="text-4xl text-indigo-600" />
                  </div>
                )}
              </div>
              <div className="p-4">
                <h2 className="text-xl font-semibold text-gray-800 mb-1">{artist.stage_name}</h2>
                <span className="inline-block px-2 py-1 text-xs font-semibold bg-indigo-100 text-indigo-800 rounded-full mb-2">
                  {artist.artist_type}
                </span>
                <p className="text-gray-600 text-sm line-clamp-3">{artist.bio}</p>
                <div className="mt-4 flex justify-between items-center">
                  <span className="text-xs text-gray-500">
                    Joined: {new Date(artist.createdAt).toLocaleDateString()}
                  </span>
                  <button className="text-sm text-indigo-600 hover:text-indigo-800 font-medium">
                    View Profile
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500">No artists found matching your search</p>
        </div>
      )}

      {/* JSON Debug View (optional) */}
      <details className="mt-12 bg-gray-100 p-4 rounded-lg">
        <summary className="font-medium text-gray-700 cursor-pointer">Debug: Artists JSON</summary>
        <pre className="mt-2 p-4 bg-white rounded overflow-auto max-h-64">
          {JSON.stringify(artists, null, 2)}
        </pre>
      </details>
    </div>
  );
}