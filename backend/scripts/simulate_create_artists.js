// Simulate creating 10 artists using the same logic as admin createArtist
// Run with: node backend/scripts/simulate_create_artists.js

const bcrypt = require('bcryptjs');
const db = require('../models');
const { createFolderStructure } = require('../helpers/createFolderStructure');

function slugify(text) {
  return (text || '')
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '_')
    .replace(/[^a-z0-9_\-]/g, '')
    .replace(/_+/g, '_')
    .replace(/^_+|_+$/g, '');
}

async function ensureUser(contactEmail, stageName) {
  let user = await db.user.findOne({ where: { email: contactEmail } });
  if (user) return user;

  const generatedUsername = `${slugify(stageName) || 'artist'}_${Math.floor(Math.random() * 9000 + 1000)}`;
  const tempPassword = Math.random().toString(36).slice(-10);
  const hashedPassword = await bcrypt.hash(tempPassword, 12);

  user = await db.user.create({
    username: generatedUsername,
    email: contactEmail,
    password: hashedPassword,
    full_name: stageName || generatedUsername,
    role: 3, // artist
  });
  return user;
}

async function createArtist({ stage_name, contact_email, real_name = '', genre = '', phone_number = null }) {
  const user = await ensureUser(contact_email, stage_name);

  const folderName = `5_${slugify(stage_name) || 'artist'}_${Math.floor(Math.random() * 9000 + 1000)}`;
  const settings = {
    setting_name: stage_name || 'artist',
    path: 'frontend/public/artists',
    folder_name: folderName,
  };

  const artist = await db.artist.create({
    userId: user.id,
    stage_name: stage_name || 'New Artist',
    contact_email,
    phone_number,
    real_name,
    genre,
    settings: JSON.stringify(settings),
  });

  try {
    await createFolderStructure(settings);
    const subfolders = ['events', 'venues', 'profile', 'gallery'];
    for (const subfolder of subfolders) {
      await createFolderStructure({ path: `${settings.path}/${folderName}`, folder_name: subfolder });
    }
  } catch (e) {
    console.warn('Folder creation warning:', e.message);
  }

  return artist;
}

async function main() {
  try {
    const samples = Array.from({ length: 10 }, (_, i) => ({
      stage_name: `SimArtist_${i + 1}`,
      contact_email: `simartist_${i + 1}@example.com`,
      real_name: `Simulated Artist ${i + 1}`,
      genre: ['Rock', 'Pop', 'Jazz', 'HipHop', 'Indie'][i % 5],
    }));

    const created = [];
    for (const s of samples) {
      const artist = await createArtist(s);
      created.push({ id: artist.id, stage_name: artist.stage_name, userId: artist.userId, email: s.contact_email });
    }

    console.log(JSON.stringify({ success: true, created }, null, 2));
    process.exit(0);
  } catch (e) {
    console.error('Simulation failed:', e);
    console.log(JSON.stringify({ success: false, error: e.message }, null, 2));
    process.exit(1);
  }
}

main();



