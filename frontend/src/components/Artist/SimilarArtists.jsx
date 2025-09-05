import React from 'react';
import axios from 'axios';
import API_BASE_URL, { APP_BASE_PATH } from '../../api/config';

export default function SimilarArtists({ artistId }) {
  const [artists, setArtists] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  const [page, setPage] = React.useState(0); // carousel page (0-based)

  React.useEffect(() => {
    const fetchSimilar = async () => {
      try {
        setLoading(true);
        setError(null);
        // Backend may not have a dedicated endpoint; fall back to general list and filter client-side
        // Try a best-effort endpoint first
        let results = [];
        try {
          const res = await axios.get(`${API_BASE_URL}/api/artists/${artistId}/similar`);
          results = res.data?.artists || [];
        } catch (_) {
          // Fallback: fetch all artists and filter out current artist
          const resAll = await axios.get(`${API_BASE_URL}/api/artists`);
          results = (resAll.data?.artists || resAll.data || []).filter(a => String(a.id) !== String(artistId));
        }
        setArtists(results);
      } catch (e) {
        setError('Failed to load similar artists');
      } finally {
        setLoading(false);
      }
    };
    if (artistId) fetchSimilar();
  }, [artistId]);

  const itemsPerSlide = 4;
  const totalSlides = Math.max(1, Math.ceil(artists.length / itemsPerSlide));
  const visible = artists.slice(page * itemsPerSlide, page * itemsPerSlide + itemsPerSlide);

  if (loading) return null;
  if (error || artists.length === 0) return null;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mt-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-gray-900">Similar Artists</h2>
        {totalSlides > 1 && (
          <div className="flex gap-2">
            <button
              className="px-3 py-1 rounded-lg border text-sm hover:bg-gray-50"
              onClick={() => setPage(p => (p - 1 + totalSlides) % totalSlides)}
            >Prev</button>
            <button
              className="px-3 py-1 rounded-lg border text-sm hover:bg-gray-50"
              onClick={() => setPage(p => (p + 1) % totalSlides)}
            >Next</button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {visible.map(a => {
          const name = a.stage_name || a.real_name || a.name || `Artist #${a.id}`;
          // Choose an image
          const img = a.profile_picture || a.image_url || null;
          let imgUrl = null;
          if (img) {
            imgUrl = img.startsWith('http') ? img : `${API_BASE_URL}${img.startsWith('/') ? img : `/${img}`}`;
          }
          const href = `${APP_BASE_PATH}/Artists/${a.id}`;
          return (
            <a key={a.id} href={href} className="group block rounded-xl overflow-hidden border hover:shadow-md transition">
              <div className="aspect-square bg-gray-100 overflow-hidden">
                {imgUrl ? (
                  <img src={imgUrl} alt={name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">No image</div>
                )}
              </div>
              <div className="p-3">
                <div className="font-semibold text-gray-900 truncate">{name}</div>
              </div>
            </a>
          );
        })}
      </div>

      {totalSlides > 1 && (
        <div className="flex justify-center gap-2 mt-4">
          {Array.from({ length: totalSlides }).map((_, i) => (
            <button
              key={i}
              className={`h-2 w-2 rounded-full ${i === page ? 'bg-purple-600' : 'bg-gray-300'}`}
              onClick={() => setPage(i)}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}


