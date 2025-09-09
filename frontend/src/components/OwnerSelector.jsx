import React, { useEffect, useState } from 'react';

const OwnerSelector = ({ ownerType, value, onSelect }) => {
  const [query, setQuery] = useState('');
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => { setQuery(''); setOptions([]); }, [ownerType]);

  useEffect(() => {
    let active = true;
    const controller = new AbortController();
    const run = async () => {
      const q = query.trim();
      if (!ownerType || ownerType === 'unclaimed' || q.length < 2) { setOptions([]); return; }
      try {
        setLoading(true);
        const base = import.meta.env.VITE_API_BASE_URL || '';
        let url = '';
        if (ownerType === 'artist') url = `${base}/api/admin/artists?limit=7&page=1&search=${encodeURIComponent(q)}`;
        else if (ownerType === 'organiser') url = `${base}/api/admin/organisers?limit=7&page=1&search=${encodeURIComponent(q)}`;
        else if (ownerType === 'user') url = `${base}/api/admin/users?limit=7&page=1&search=${encodeURIComponent(q)}`;
        const res = await fetch(url, {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('majesty_token') || ''}` },
          signal: controller.signal
        });
        const data = await res.json();
        if (!active) return;
        let list = [];
        if (data?.success) {
          if (ownerType === 'artist') list = (data.artists || []).map(a => ({ id: a.id, label: `${a.stage_name} · ${a.contact_email || ''}` }));
          if (ownerType === 'organiser') list = (data.organisers || []).map(o => ({ id: o.id, label: `${o.name} · ${o.contact_email || ''}` }));
          if (ownerType === 'user') list = (data.users || []).map(u => ({ id: u.id, label: `${u.username || u.email} · ${u.email}` }));
        }
        setOptions(list);
      } catch (e) {
        if (e.name !== 'AbortError') setOptions([]);
      } finally { if (active) setLoading(false); }
    };
    const t = setTimeout(run, 300);
    return () => { active = false; controller.abort(); clearTimeout(t); };
  }, [query, ownerType]);

  if (!ownerType || ownerType === 'unclaimed') return null;

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">{ownerType.charAt(0).toUpperCase() + ownerType.slice(1)} <span className="text-gray-500 text-sm">(search)</span></label>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={`Search ${ownerType}...`}
        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-yellow-500 focus:border-yellow-500"
      />
      {options.length > 0 && (
        <div className="mt-2 max-h-48 overflow-auto border border-gray-200 rounded-md divide-y bg-white shadow-sm">
          {options.map(opt => (
            <button
              type="button"
              key={opt.id}
              onClick={() => { onSelect(opt.id, opt); setQuery(opt.label); setOptions([]); }}
              className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-50 ${value === opt.id ? 'bg-yellow-50' : ''}`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
      {loading && <div className="text-xs text-gray-500 mt-1">Searching...</div>}
      {value && <p className="text-xs text-gray-600 mt-1">Selected ID: {value}</p>}
    </div>
  );
};

export default OwnerSelector;
