import React, { useEffect, useMemo, useRef, useState } from 'react';
import axios from 'axios';
import API_BASE_URL from '../../api/config';

const Chip = ({ label, onRemove }) => (
  <span className="inline-flex items-center gap-1 bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full text-sm">
    <span>{label}</span>
    <button type="button" onClick={onRemove} className="hover:text-indigo-900">×</button>
  </span>
);

export default function ArtistSelector({ value = [], onChange, placeholder = 'Search artists…', label = 'Artists', className = '' }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  useEffect(() => {
    const run = async () => {
      const q = query.trim();
      if (!q) { setResults([]); return; }
      try {
        const { data } = await axios.get(`${API_BASE_URL}/api/artists/search`, { params: { q } });
        const picked = new Set(value.map(a => a.id));
        setResults(data.filter(a => !picked.has(a.id)));
      } catch (e) {
        setResults([]);
      }
    };
    const id = setTimeout(run, 250);
    return () => clearTimeout(id);
  }, [query, value]);

  const add = (artist) => {
    const next = [...value, artist];
    onChange?.(next);
    setQuery('');
    setResults([]);
    setOpen(false);
  };

  const remove = (id) => onChange?.(value.filter(a => a.id !== id));

  return (
    <div className={`w-full ${className}`} ref={containerRef}>
      {label && <label className="block text-sm font-semibold text-gray-900 mb-2">{label}</label>}

      <div className="flex flex-wrap gap-2 mb-2">
        {value.map(a => (
          <Chip key={a.id} label={a.stage_name || a.real_name || `Artist #${a.id}`} onRemove={() => remove(a.id)} />
        ))}
      </div>

      <input
        type="text"
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
        value={query}
        onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
        onFocus={() => setOpen(true)}
        placeholder={placeholder}
      />

      {open && results.length > 0 && (
        <div className="mt-1 max-h-56 overflow-auto border border-gray-200 rounded-lg bg-white shadow">
          {results.map(r => (
            <button
              key={r.id}
              type="button"
              className="w-full text-left px-3 py-2 hover:bg-gray-50"
              onClick={() => add(r)}
            >
              <div className="font-medium">{r.stage_name || r.real_name || `Artist #${r.id}`}</div>
              {r.real_name && r.stage_name && <div className="text-xs text-gray-500">{r.real_name}</div>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
 
