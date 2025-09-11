// Script: simulate_create_events_and_links.js
// Usage: node backend/scripts/simulate_create_events_and_links.js
// Purpose: Create 3 demo events and link 3 random artists to each via event_artists

const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
const db = require('../models');

async function pickRandomUnique(items, count) {
  const pool = [...items];
  const result = [];
  while (pool.length > 0 && result.length < count) {
    const idx = Math.floor(Math.random() * pool.length);
    result.push(pool[idx]);
    pool.splice(idx, 1);
  }
  return result;
}

async function main() {
  try {
    await db.sequelize.authenticate();
    console.log('✅ DB connected');

    // Fetch some artists with a valid userId
    const artists = await db.artist.findAll({ limit: 25, order: db.sequelize.random() });
    if (artists.length < 3) {
      console.log('⚠️ Need at least 3 artists to link. Found:', artists.length);
      return;
    }

    // Pick an owner artist (first that has userId)
    const ownerArtist = artists.find(a => !!a.userId) || artists[0];
    const userId = ownerArtist.userId || 1;
    console.log('👤 Using owner artist:', ownerArtist.id, 'userId:', userId);

    const now = new Date();
    const baseNames = ['Demo Night', 'Summer Jam', 'City Vibes'];

    for (let i = 0; i < 3; i++) {
      const name = `${baseNames[i]} ${Math.floor(Math.random() * 1000)}`;
      const date = new Date(now.getTime() + (i + 1) * 24 * 60 * 60 * 1000);

      // Create event
      const event = await db.event.create({
        userId: userId,
        owner_id: ownerArtist.id,
        owner_type: 'artist',
        name: name,
        description: 'Simulated event for testing links',
        date: date.toISOString().split('T')[0],
        time: '19:30:00',
        price: 0,
        ticket_url: null,
        poster: null,
        venue_id: null,
        category: 'live_music',
        capacity: 100,
        gallery: null,
        status: 'scheduled'
      });
      console.log(`🎫 Created event ${event.id}: ${name}`);

      // Pick 3 random artists to link
      const toLink = await pickRandomUnique(artists.map(a => a.id), 3);
      const rows = toLink.map(artistId => ({ event_id: event.id, artist_id: artistId }));
      await db.event_artist.bulkCreate(rows, { ignoreDuplicates: true });
      console.log(`🔗 Linked artists [${toLink.join(', ')}] to event ${event.id}`);
    }

    console.log('✅ Simulation complete');
  } catch (err) {
    console.error('❌ Simulation error:', err.message);
  } finally {
    await db.sequelize.close();
  }
}

main();


