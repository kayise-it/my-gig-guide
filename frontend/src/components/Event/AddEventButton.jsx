import React, { useState } from 'react';
import API_BASE_URL from '../../api/config';

export default function AddEventButton({
  venue,
  ownerType,
  ownerId,
  userId,
  onCreated,
  buttonLabel = 'Add Event',
  className = ''
}) {
  const [open, setOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({
    name: '',
    date: '',
    time: '',
    description: '',
    price: '',
    category: '',
    capacity: ''
  });

  const isReady = form.name && form.date && form.time;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!venue || !ownerType || !ownerId || !userId) {
      alert('Missing required context to create event.');
      return;
    }
    if (!isReady) {
      alert('Please fill in name, date and time');
      return;
    }
    try {
      setCreating(true);
      const body = new FormData();
      body.append('name', form.name);
      body.append('date', form.date);
      body.append('time', form.time);
      if (form.description) body.append('description', form.description);
      if (form.price) body.append('price', form.price);
      if (form.category) body.append('category', form.category);
      if (form.capacity) body.append('capacity', form.capacity);
      body.append('venue_id', String(venue.id));
      body.append('userId', String(userId));
      body.append('owner_id', String(ownerId));
      body.append('owner_type', ownerType);

      const token = localStorage.getItem('token');
      const res = await fetch(`${API_BASE_URL}/api/events/create_event`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`
        },
        body
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Failed to create event');
      }
      setOpen(false);
      setForm({ name: '', date: '', time: '', description: '', price: '', category: '', capacity: '' });
      onCreated && onCreated(data.event);
    } catch (err) {
      console.error('Create event error:', err);
      alert(err.message || 'Failed to create event');
    } finally {
      setCreating(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className={`w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold py-3 px-4 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg ${className}`}
      >
        {buttonLabel}
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-xl shadow-xl">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-xl font-bold">Create Event at {venue?.name}</h3>
              <button onClick={() => setOpen(false)} className="text-gray-500 hover:text-gray-700">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-6 h-6"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"/></svg>
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input name="name" value={form.name} onChange={handleChange} className="w-full border rounded-lg px-3 py-2" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                  <input type="date" name="date" value={form.date} onChange={handleChange} className="w-full border rounded-lg px-3 py-2" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                  <input type="time" name="time" value={form.time} onChange={handleChange} className="w-full border rounded-lg px-3 py-2" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea name="description" value={form.description} onChange={handleChange} className="w-full border rounded-lg px-3 py-2" rows={3} />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price (R)</label>
                  <input type="number" name="price" value={form.price} onChange={handleChange} className="w-full border rounded-lg px-3 py-2" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <input name="category" value={form.category} onChange={handleChange} className="w-full border rounded-lg px-3 py-2" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Capacity</label>
                  <input type="number" name="capacity" value={form.capacity} onChange={handleChange} className="w-full border rounded-lg px-3 py-2" />
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setOpen(false)} className="px-4 py-2 rounded-lg border">Cancel</button>
                <button type="submit" disabled={creating || !isReady} className="px-4 py-2 rounded-lg text-white bg-purple-600 hover:bg-purple-700 disabled:opacity-60">
                  {creating ? 'Creating...' : 'Create Event'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
