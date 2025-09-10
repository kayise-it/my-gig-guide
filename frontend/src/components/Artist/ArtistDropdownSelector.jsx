// frontend/src/components/Artist/ArtistDropdownSelector.jsx
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  MagnifyingGlassIcon,
  MusicalNoteIcon,
  ChevronDownIcon,
  AdjustmentsHorizontalIcon,
  CheckIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import axios from 'axios';
import API_BASE_URL from '../../api/config';

/**
 * ArtistDropdownSelector
 * - Styled similarly to VenueSelector
 * - Supports search and basic client-side filtering (genre)
 * - Multi-select by default with removable chips
 */
export default function ArtistDropdownSelector({
  value = [], // [{ id, stage_name, real_name, genre }]
  onChange,
  label = 'Artists',
  placeholder = 'Search artists by stage or real name...',
  allowMultiple = true,
  className = ''
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedGenre, setSelectedGenre] = useState('');
  const containerRef = useRef(null);
  const prefetchedRef = useRef(false);
  const [topCache, setTopCache] = useState([]); // cache top 5 artists for reuse across opens
  const topCacheLoadedRef = useRef(false);
  const requestIdRef = useRef(0);

  const beginLoading = () => {
    requestIdRef.current += 1;
    const id = requestIdRef.current;
    setLoading(true);
    return id;
  };

  const popularGenres = useMemo(
    () => [
      'Afrobeat', 'Amapiano', 'House', 'Hip-Hop', 'R&B', 'Jazz', 'Gospel', 'Rock', 'Pop', 'Kwaito'
    ],
    []
  );

  // Close when clicking outside
  useEffect(() => {
    const handler = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) setIsOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Warm top-5 cache on mount (no spinner) so opening is instant
  useEffect(() => {
    let cancelled = false;
    const warmTopCache = async () => {
      try {
        const { data } = await axios.get(`${API_BASE_URL}/api/artists`);
        if (cancelled) return;
        const top = (Array.isArray(data) ? data : []).slice(0, 5);
        setTopCache(top);
        topCacheLoadedRef.current = true;
      } catch (_) {
        // ignore warm failures
      }
    };
    warmTopCache();
    return () => { cancelled = true; };
  }, []);

  // Load top 5 artists when opening with empty query
  useEffect(() => {
    let cancelled = false;
    const fetchTop = async () => {
      try {
        const id = beginLoading();
        const { data } = await axios.get(`${API_BASE_URL}/api/artists`);
        const picked = new Set(value.map((a) => a.id));
        const top = (Array.isArray(data) ? data : [])
          .slice(0, 5)
          .filter((a) => !picked.has(a.id));
        if (!cancelled) {
          setResults(top);
          setTopCache(top);
          topCacheLoadedRef.current = true;
        }
      } catch (_) {
        if (!cancelled) setResults([]);
      } finally {
        if (!cancelled && requestIdRef.current === id) setLoading(false);
      }
    };

    if (isOpen && searchTerm.trim() === '') {
      const picked = new Set(value.map((a) => a.id));
      if (topCacheLoadedRef.current && topCache.length > 0) {
        // Reuse cached results, only filter out newly selected artists
        setResults(topCache.filter((a) => !picked.has(a.id)));
        setLoading(false);
      } else if (!prefetchedRef.current) {
        prefetchedRef.current = true;
        fetchTop();
      }
    }

    return () => { cancelled = true; };
  }, [isOpen, searchTerm, value]);

  // Reset prefetch guard when closing or when user types
  useEffect(() => {
    if (!isOpen || searchTerm.trim() !== '') {
      prefetchedRef.current = false;
    }
  }, [isOpen, searchTerm]);

  // Debounced search
  useEffect(() => {
    const controller = new AbortController();
    let cancelled = false;
    const run = async () => {
      const q = searchTerm.trim();
      if (!q) { setLoading(false); return; }
      const rid = beginLoading();
      try {
        const { data } = await axios.get(`${API_BASE_URL}/api/artists/search`, { params: { q }, signal: controller.signal });
        const picked = new Set(value.map((a) => a.id));
        const genreFiltered = selectedGenre
          ? (data || []).filter((a) => (a.genre || '').toLowerCase().includes(selectedGenre.toLowerCase()))
          : (data || []);
        const filtered = genreFiltered.filter((a) => !picked.has(a.id));
        if (!cancelled) setResults(filtered);
      } catch (e) {
        if (!cancelled) setResults([]);
      } finally {
        if (!cancelled && requestIdRef.current === rid) setLoading(false);
      }
    };
    const t = setTimeout(run, 300);
    return () => { cancelled = true; controller.abort(); clearTimeout(t); };
  }, [searchTerm, selectedGenre]);

  const addArtist = (artist) => {
    if (allowMultiple) {
      const exists = value.some((a) => a.id === artist.id);
      const next = exists ? value : [...value, artist];
      onChange?.(next);
    } else {
      onChange?.([artist]);
      setIsOpen(false);
    }
  };

  const removeArtist = (id) => onChange?.(value.filter((a) => a.id !== id));

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      {label && <label className="block text-sm font-semibold text-gray-900 mb-2">{label}</label>}

      {/* Selector shell */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className={`relative w-full bg-white border-2 rounded-xl p-4 cursor-pointer transition-all duration-200 ${
          isOpen ? 'border-purple-500 ring-2 ring-purple-200' : 'border-gray-200 hover:border-gray-300'
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-purple-100 p-2 rounded-lg">
              <MusicalNoteIcon className="h-5 w-5 text-purple-600" />
            </div>
            <div className="min-w-0">
              {value.length === 0 ? (
                <span className="text-gray-500">Select artist{allowMultiple ? 's' : ''}…</span>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {value.map((a) => (
                    <span key={a.id} className="inline-flex items-center gap-1 bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full text-xs">
                      <span className="truncate max-w-[140px]">{a.stage_name || a.real_name || `Artist #${a.id}`}</span>
                      <button type="button" onClick={(e) => { e.stopPropagation(); removeArtist(a.id); }} className="hover:text-indigo-900">
                        <XMarkIcon className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
          <ChevronDownIcon className={`h-5 w-5 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </div>
      </div>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg z-50 max-h-96 overflow-hidden">
          {/* Search + Filters */}
          <div className="p-4 border-b border-gray-100">
            <div className="relative mb-3">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={placeholder}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            <div className="flex items-center justify-between">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center space-x-2 text-sm text-purple-600 hover:text-purple-700"
              >
                <AdjustmentsHorizontalIcon className="h-4 w-4" />
                <span>Filters</span>
              </button>

              {(selectedGenre) && (
                <button
                  onClick={() => setSelectedGenre('')}
                  className="flex items-center space-x-1 text-sm text-gray-500 hover:text-gray-700"
                >
                  <XMarkIcon className="h-4 w-4" />
                  <span>Clear</span>
                </button>
              )}
            </div>

            {showFilters && (
              <div className="mt-3 space-y-3 pt-3 border-t border-gray-100">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Genre</label>
                  <div className="grid grid-cols-2 gap-1">
                    {popularGenres.map((g) => (
                      <button
                        key={g}
                        onClick={() => setSelectedGenre(g)}
                        className={`px-2 py-1 text-xs rounded transition-colors ${
                          selectedGenre === g ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        {g}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Results */}
          <div className="max-h-64 overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-600"></div>
                <span className="ml-2 text-sm text-gray-600">Searching artists…</span>
              </div>
            ) : results.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <MusicalNoteIcon className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                <p className="text-sm">Start typing to search for artists</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {results.map((artist) => {
                  const selected = value.some((a) => a.id === artist.id);
                  return (
                    <button
                      key={artist.id}
                      type="button"
                      onClick={() => addArtist(artist)}
                      className={`w-full text-left p-3 hover:bg-gray-50 ${selected ? 'bg-purple-50' : ''}`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium text-gray-900">{artist.stage_name || artist.real_name || `Artist #${artist.id}`}</div>
                          {artist.real_name && artist.stage_name && (
                            <div className="text-xs text-gray-500">{artist.real_name}</div>
                          )}
                          {artist.genre && (
                            <div className="text-xs text-gray-500 mt-1">{artist.genre}</div>
                          )}
                        </div>
                        {selected && <CheckIcon className="h-4 w-4 text-purple-600" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}


