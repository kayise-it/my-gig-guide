import React, { useEffect, useState } from 'react';
import { MagnifyingGlassIcon, ChevronDownIcon, MapPinIcon, UsersIcon } from '@heroicons/react/24/outline';
import useAdminAPI from '../hooks/useAdminAPI';

const AdminVenueSelector = ({ value, onSelect, label = 'Venue' }) => {
  const { venues } = useAdminAPI();
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedLabel, setSelectedLabel] = useState('');

  const loadVenues = async (searchText = '') => {
    setLoading(true);
    try {
      const params = { limit: 7, page: 1 };
      const q = (searchText || '').trim();
      if (q.length >= 2) params.search = q;
      const data = await venues.list(params);
      const list = (data?.venues || []).map(v => ({ id: v.id, label: `${v.name} · ${v.location || ''}`, location: v.location, capacity: v.capacity }));
      setOptions(list);
    } catch (_) {
      setOptions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) loadVenues('');
  }, [isOpen]);

  useEffect(() => {
    const t = setTimeout(() => { if (isOpen) loadVenues(query); }, 300);
    return () => clearTimeout(t);
  }, [query, isOpen]);

  return (
    <div className="relative">
      <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
      <div
        onClick={() => setIsOpen(!isOpen)}
        className={`relative w-full bg-white border-2 rounded-xl p-4 cursor-pointer transition-all duration-200 ${isOpen ? 'border-purple-500 ring-2 ring-purple-200' : 'border-gray-200 hover:border-gray-300'}`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-purple-100 p-2 rounded-lg">
              <MapPinIcon className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{selectedLabel || 'Select a venue...'}</h3>
              {value && <p className="text-xs text-gray-500">Selected ID: {value}</p>}
            </div>
          </div>
          <ChevronDownIcon className={`h-5 w-5 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </div>
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg z-50 max-h-96 overflow-hidden">
          <div className="p-4 border-b border-gray-100">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search venues by name or location..."
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="max-h-64 overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-600"></div>
                <span className="ml-2 text-sm text-gray-600">Loading venues...</span>
              </div>
            ) : options.length === 0 ? (
              <div className="text-center py-8 text-gray-500">No results</div>
            ) : (
              <div className="divide-y divide-gray-100">
                {options.map(opt => (
                  <button
                    type="button"
                    key={opt.id}
                    onClick={() => { onSelect(opt.id, opt); setSelectedLabel(opt.label); setIsOpen(false); }}
                    className={`w-full text-left p-3 hover:bg-gray-50 ${value === opt.id ? 'bg-purple-50' : ''}`}
                  >
                    <div className="font-medium text-gray-900">{opt.label}</div>
                    {opt.capacity && (
                      <div className="text-xs text-gray-500 flex items-center mt-1"><UsersIcon className="h-3 w-3 mr-1" />Capacity: {opt.capacity}</div>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminVenueSelector;


