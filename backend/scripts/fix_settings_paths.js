/*
  Usage: node backend/scripts/fix_settings_paths.js
  - Normalizes settings JSON for Artist and Organiser profiles
  - Ensures path is ../frontend/public/{artists|organisers}/ (plural)
  - Ensures folder_name exists
*/

const path = require('path');
const crypto = require('crypto');
const db = require('../models');

async function ensureSettingsForProfile({ profile, user, type }) {
  // type: 'artist' | 'organiser'
  const plural = type === 'artist' ? 'artists' : 'organisers';

  let settingsObj = null;
  try {
    if (profile.settings && profile.settings.trim() !== '') {
      settingsObj = JSON.parse(profile.settings);
    }
  } catch (_) {
    // ignore parse error; will rebuild
  }

  const username = user?.username || `user_${user?.id || 'unknown'}`;
  const rand4 = ('' + (Math.floor(Math.random() * 9000) + 1000));
  const defaultFolderName = `${type === 'artist' ? '3' : '4'}_${username}_${rand4}`;

  const nextSettings = {
    setting_name: user?.name || username,
    path: `../frontend/public/${plural}/`,
    folder_name: settingsObj?.folder_name || defaultFolderName
  };

  // Only update if something changed or missing
  const needsUpdate = !settingsObj ||
    !settingsObj.path || !settingsObj.folder_name ||
    settingsObj.path.includes('/organiser/') || // fix singular
    settingsObj.path.includes('/frontend/public/organiser/') ||
    settingsObj.path.startsWith('/var/www'); // fix absolute

  if (needsUpdate) {
    await profile.update({ settings: JSON.stringify(nextSettings) });
    return { updated: true, settings: nextSettings };
  }
  return { updated: false, settings: settingsObj };
}

async function run() {
  try {
    const updates = { artists: 0, organisers: 0 };

    const artists = await db.artist.findAll();
    for (const artist of artists) {
      const user = await db.user.findByPk(artist.userId);
      const { updated } = await ensureSettingsForProfile({ profile: artist, user, type: 'artist' });
      if (updated) updates.artists += 1;
    }

    const organisers = await db.organiser.findAll();
    for (const org of organisers) {
      const user = await db.user.findByPk(org.userId);
      const { updated } = await ensureSettingsForProfile({ profile: org, user, type: 'organiser' });
      if (updated) updates.organisers += 1;
    }

    console.log('Settings normalization complete:', updates);
    process.exit(0);
  } catch (err) {
    console.error('Failed to normalize settings:', err);
    process.exit(1);
  }
}

run();


