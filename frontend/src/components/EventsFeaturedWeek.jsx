import React, { useEffect, useState } from 'react';

const EventsFeaturedWeek = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch('/api/admin/purchases?ownerType=event&featureKey=event_boost&active=1');
        const data = await res.json();
        if (!data.success) throw new Error(data.message || 'Failed to load');
        setItems(data.data);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <div className="py-8 text-center text-sm text-gray-500">Loading featured events…</div>;
  if (error) return <div className="py-8 text-center text-sm text-red-600">{error}</div>;
  if (!items.length) return null;

  return (
    <section className="my-8">
      <h3 className="text-lg font-semibold mb-3">Featured Events</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {items.map((p) => (
          <a key={p.id} href={`/events/${p.owner_id}`} className="block bg-white border rounded-lg p-4 hover:shadow">
            <div className="text-sm text-gray-600">Event ID #{p.owner_id}</div>
            <div className="text-xs text-gray-500">Until {new Date(p.ends_at).toLocaleDateString()}</div>
          </a>
        ))}
      </div>
    </section>
  );
};

export default EventsFeaturedWeek;


