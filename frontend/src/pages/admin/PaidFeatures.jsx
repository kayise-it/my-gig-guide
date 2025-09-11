import React, { useEffect, useMemo, useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';

const apiBase = '/api/admin/paid-features';

function useMajestyToken() {
  const [token, setToken] = useState(localStorage.getItem('management_token'));
  useEffect(() => {
    const handler = () => setToken(localStorage.getItem('management_token'));
    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
  }, []);
  return token;
}

const PaidFeatures = () => {
  const token = useMajestyToken();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('all');
  const [editing, setEditing] = useState(null);
  const [linking, setLinking] = useState(null); // {featureId, ownerType, ownerId, durationDays, price}

  const headers = useMemo(() => ({
    'Content-Type': 'application/json',
    Authorization: token ? `Bearer ${token}` : undefined,
  }), [token]);

  const load = async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (query) params.set('q', query);
    if (status !== 'all') params.set('status', status);
    const res = await fetch(`${apiBase}?${params.toString()}`, { headers });
    const data = await res.json();
    if (data.success) setItems(data.data);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const startCreate = () => setEditing({ id: null, name: '', slug: '', description: '', default_price: 0, is_active: true, target: 'any' });
  const startEdit = (row) => setEditing({ id: row.id, name: row.name, slug: row.key, description: row.description || '', default_price: row.default_price || 0, is_active: row.is_active, target: row.target || 'any' });

  const save = async () => {
    if (!editing.name || !editing.slug) return alert('Name and slug are required');
    const method = editing.id ? 'PUT' : 'POST';
    const url = editing.id ? `${apiBase}/${editing.id}` : apiBase;
    const res = await fetch(url, { method, headers, body: JSON.stringify({
      name: editing.name,
      slug: editing.slug,
      description: editing.description,
      default_price: Number(editing.default_price),
      isActive: editing.is_active,
      target: editing.target,
    })});
    const data = await res.json();
    if (!data.success) return alert(data.message || 'Save failed');
    setEditing(null);
    await load();
  };

  const toggleActive = async (row) => {
    const res = await fetch(`${apiBase}/${row.id}`, { method: 'PUT', headers, body: JSON.stringify({ isActive: !row.is_active })});
    const data = await res.json();
    if (data.success) load(); else alert(data.message);
  };

  const remove = async (row) => {
    if (!confirm('Delete this feature? This only works if never purchased.')) return;
    const res = await fetch(`${apiBase}/${row.id}`, { method: 'DELETE', headers });
    const data = await res.json();
    if (data.success) load(); else alert(data.message);
  };

  const openLink = (row) => setLinking({ featureId: row.id, featureKey: row.key, featureTarget: row.target || 'any', ownerType: (row.target && row.target !== 'any') ? row.target : 'artist', ownerId: '', durationDays: 7, price: row.default_price || 0 });

  const linkNow = async () => {
    const body = {
      ownerType: linking.ownerType,
      ownerId: Number(linking.ownerId),
      featureId: linking.featureId,
      durationDays: Number(linking.durationDays),
      pricePaid: Number(linking.price),
    };
    if (!body.ownerId) return alert('Owner ID required');
    const res = await fetch('/api/admin/purchases', { method: 'POST', headers, body: JSON.stringify(body) });
    const data = await res.json();
    if (!data.success) return alert(data.message || 'Link failed');
    setLinking(null);
  };

  const filtered = items.filter((i) => {
    const matches = i.name.toLowerCase().includes(query.toLowerCase());
    const statusOk = status === 'all' || (status === 'active' ? i.is_active : !i.is_active);
    return matches && statusOk;
  });

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold">Paid Features</h1>
            <p className="text-sm text-gray-600">Create and manage purchasable features.</p>
          </div>
          <button className="px-3 py-2 rounded-md bg-indigo-600 text-white text-sm" onClick={startCreate}>Create Feature</button>
        </div>

        <div className="flex items-center gap-3">
          <input className="border rounded-md px-3 py-2 text-sm" placeholder="Search by name" value={query} onChange={(e)=>setQuery(e.target.value)} />
          <select className="border rounded-md px-3 py-2 text-sm" value={status} onChange={(e)=>setStatus(e.target.value)}>
            <option value="all">All</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
          <button className="px-3 py-2 rounded-md border text-sm" onClick={load}>Apply</button>
        </div>

        <div className="bg-white shadow rounded-lg overflow-hidden">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Name</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Slug</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Price</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Status</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Created</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Updated</th>
                <th className="px-4 py-2"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((row) => (
                <tr key={row.id} className="border-t">
                  <td className="px-4 py-2 text-sm">{row.name}</td>
                  <td className="px-4 py-2 text-sm">{row.key}</td>
                  <td className="px-4 py-2 text-sm">{row.default_price ?? 0}</td>
                  <td className="px-4 py-2 text-sm">
                    <span className={`px-2 py-1 rounded text-xs ${row.is_active ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-600'}`}>{row.is_active ? 'Active' : 'Inactive'}</span>
                  </td>
                  <td className="px-4 py-2 text-xs text-gray-500">{new Date(row.created_at || row.createdAt).toLocaleString()}</td>
                  <td className="px-4 py-2 text-xs text-gray-500">{new Date(row.updated_at || row.updatedAt).toLocaleString()}</td>
                  <td className="px-4 py-2 text-sm flex gap-2">
                    <button className="text-indigo-600" onClick={()=>startEdit(row)}>Edit</button>
                    <button className="text-yellow-600" onClick={()=>toggleActive(row)}>{row.is_active ? 'Deactivate' : 'Activate'}</button>
                    <button className="text-green-700" onClick={()=>openLink(row)}>Link to Owner</button>
                    <button className="text-red-600" onClick={()=>remove(row)}>Delete</button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td className="px-4 py-8 text-center text-sm text-gray-500" colSpan={7}>No features found</td></tr>
              )}
            </tbody>
          </table>
        </div>

        {editing && (
          <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6">
              <h3 className="text-lg font-semibold mb-4">{editing.id ? 'Edit' : 'Create'} Feature</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm text-gray-700">Name</label>
                  <input className="mt-1 border rounded-md w-full px-3 py-2 text-sm" value={editing.name} onChange={(e)=>setEditing({...editing, name: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm text-gray-700">Slug</label>
                  <input className="mt-1 border rounded-md w-full px-3 py-2 text-sm" value={editing.slug} onChange={(e)=>setEditing({...editing, slug: e.target.value.replace(/\s+/g,'-').toLowerCase()})} />
                </div>
                <div>
                  <label className="block text-sm text-gray-700">Short Description</label>
                  <textarea className="mt-1 border rounded-md w-full px-3 py-2 text-sm" rows={3} value={editing.description} onChange={(e)=>setEditing({...editing, description: e.target.value})} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm text-gray-700">Price</label>
                    <input type="number" min="0" step="0.01" className="mt-1 border rounded-md w-full px-3 py-2 text-sm" value={editing.default_price} onChange={(e)=>setEditing({...editing, default_price: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700">Target</label>
                    <select className="mt-1 border rounded-md w-full px-3 py-2 text-sm" value={editing.target} onChange={(e)=>setEditing({...editing, target: e.target.value})}>
                      <option value="any">Any</option>
                      <option value="artist">Artist</option>
                      <option value="venue">Venue</option>
                      <option value="event">Event</option>
                    </select>
                  </div>
                  <div className="flex items-center gap-2 mt-6">
                    <input id="active" type="checkbox" checked={editing.is_active} onChange={(e)=>setEditing({...editing, is_active: e.target.checked})} />
                    <label htmlFor="active" className="text-sm">Active</label>
                  </div>
                </div>
              </div>
              <div className="mt-6 flex justify-end gap-3">
                <button className="px-3 py-2 rounded-md border text-sm" onClick={()=>setEditing(null)}>Cancel</button>
                <button className="px-3 py-2 rounded-md bg-indigo-600 text-white text-sm" onClick={save}>Save</button>
              </div>
            </div>
          </div>
        )}

        {linking && (
          <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Link Feature: {linking.featureKey}</h3>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm text-gray-700">Owner Type</label>
                    <select className="mt-1 border rounded-md w-full px-3 py-2 text-sm" value={linking.ownerType} onChange={(e)=>setLinking({...linking, ownerType: e.target.value})}>
                      {['artist','venue','event'].filter((t) => (linking.featureTarget === 'any' ? true : t === linking.featureTarget)).map((t) => (
                        <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700">Owner ID</label>
                    <input className="mt-1 border rounded-md w-full px-3 py-2 text-sm" value={linking.ownerId} onChange={(e)=>setLinking({...linking, ownerId: e.target.value})} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm text-gray-700">Duration (days)</label>
                    <select className="mt-1 border rounded-md w-full px-3 py-2 text-sm" value={linking.durationDays} onChange={(e)=>setLinking({...linking, durationDays: e.target.value})}>
                      <option value={7}>7 days (R1000)</option>
                      <option value={14}>14 days (R1450)</option>
                      <option value={30}>30 days (R5000)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700">Price Paid (ZAR)</label>
                    <input type="number" min="0" step="0.01" className="mt-1 border rounded-md w-full px-3 py-2 text-sm" value={linking.price} onChange={(e)=>setLinking({...linking, price: e.target.value})} />
                  </div>
                </div>
              </div>
              <div className="mt-6 flex justify-end gap-3">
                <button className="px-3 py-2 rounded-md border text-sm" onClick={()=>setLinking(null)}>Cancel</button>
                <button className="px-3 py-2 rounded-md bg-green-600 text-white text-sm" onClick={linkNow}>Link Feature</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default PaidFeatures;


