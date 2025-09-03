// backend/helpers/userProfileHelper.js

const db = require('../models');
const Artist = db.artist;
const Organiser = db.organiser;
const { createFolderStructure } = require('../utils/fileUtils');
const { getUserBasePath, buildUserFolderAbsolutePath } = require('../utils/pathHelpers');
const fs = require('fs');
const path = require('path');

/**
 * Generates folder path for user based on their role and ID
 * @param {Object} user - User object
 * @param {Object} roleData - Role-specific data (artist or organiser)
 * @param {string} userType - 'artist' or 'organiser'
 * @returns {Object} Settings object with path and folder_name
 */
function generateUserFolderPath(user, roleData, userType) {
    // Prefer existing settings from role profile (artist/organiser)
    try {
        if (roleData && roleData.settings) {
            const settings = JSON.parse(roleData.settings);
            const userType = settings.userType || (settings.path && settings.path.includes('organiser') ? 'organisers' : 'artists');
            const baseResolved = getUserBasePath(userType);
            return {
                path: `${userType}/`,
                folder_name: settings.folder_name,
                fullPath: path.join(baseResolved, settings.folder_name)
            };
        }
    } catch (_) { /* ignore parse errors; fallback below */ }

    // Fallback: derive folder using brand format: `${role}_${username}_${rand4}`
    const rolePrefix = userType === 'artists' ? '3' : '4';
    const rand4 = Math.floor(Math.random() * 9000 + 1000);
    const folderName = `${rolePrefix}_${user.username}_${rand4}`;
    const basePath = getUserBasePath(userType);
    return {
        path: `${userType}/`,
        folder_name: folderName,
        fullPath: path.join(basePath, folderName)
    };
}

/**
 * Creates user folder structure if it doesn't exist
 * @param {Object} user - User object
 * @param {Object} roleData - Role-specific data (artist or organiser)
 * @param {string} userType - 'artist' or 'organiser'
 * @returns {Object} Settings object
 */
function createUserFolderStructure(user, roleData, userType) {
    const settings = generateUserFolderPath(user, roleData, userType);
    const fullPath = settings.fullPath; // already absolute
    if (!fs.existsSync(fullPath)) {
        fs.mkdirSync(fullPath, { recursive: true });
        console.log(`Created folder for ${userType}: ${fullPath}`);
    }
    return settings;
}

/**
 * Gets existing user folder path from their profile settings
 * @param {Object} user - User object
 * @param {Object} roleData - Role-specific data (artist or organiser)
 * @param {string} userType - 'artists' or 'organisers'
 * @param {string} subFolder - Optional subfolder ('events', 'venues', 'profile', 'gallery')
 * @returns {string} Folder path for file uploads
 */
function getUserFolderPath(user, roleData, userType, subFolder = null) {
    if (!roleData || !roleData.settings) {
        console.log('No roleData settings found, falling back to default structure');
        const settings = createUserFolderStructure(user, roleData, userType);
        return subFolder ? path.join(settings.fullPath, subFolder) : settings.fullPath;
    }

    try {
        // Parse existing settings from the database
        const settings = JSON.parse(roleData.settings);
        const userType = settings.userType || (settings.path && settings.path.includes('organiser') ? 'organisers' : 'artists');
        const fullPath = buildUserFolderAbsolutePath(userType, settings.folder_name);
        
        // Create all required subfolders if they don't exist
        createArtistSubfolders(fullPath);
        
        const finalPath = subFolder ? path.join(fullPath, subFolder) : fullPath;
        console.log(`Using ${subFolder ? subFolder + ' ' : ''}folder path from settings:`, finalPath);
        return finalPath;
    } catch (error) {
        console.error('Error parsing settings JSON:', error);
        // Fallback to creating new structure
        const settings = createUserFolderStructure(user, roleData, userType);
        return subFolder ? path.join(settings.fullPath, subFolder) : settings.fullPath;
    }
}

/**
 * Creates the standard subfolder structure for artists
 * @param {string} artistFolderPath - Main artist folder path
 */
function createArtistSubfolders(artistFolderPath) {
    const subfolders = ['events', 'venues', 'profile', 'gallery'];
    
    // Ensure main folder exists
    if (!fs.existsSync(artistFolderPath)) {
        fs.mkdirSync(artistFolderPath, { recursive: true });
        console.log('Created main artist folder:', artistFolderPath);
    }
    
    // Create all subfolders
    subfolders.forEach(subfolder => {
        const subfolderPath = path.join(artistFolderPath, subfolder);
        if (!fs.existsSync(subfolderPath)) {
            fs.mkdirSync(subfolderPath, { recursive: true });
            console.log(`Created ${subfolder} subfolder:`, subfolderPath);
        }
    });
}

/**
 * Creates or updates profile settings for artists (role 3) or organisers (role 4).
 * If settings are missing, they will be added. If no profile exists, it will create one.
 * @param {Object} options - user info
 * @param {string|number} options.role - User role (3=artist, 4=organiser)
 * @param {string} options.name - Real name (optional)
 * @param {string} options.username - Username (required)
 * @param {string} options.email - Email (required)
 * @param {string} options.contact_email - Alternate email (optional)
 * @param {string} options.phone_number - Phone number (optional)
 * @param {string} options.folderName - Folder name to use
 * @param {number} options.userId - The ID of the user (foreign key)
 * @param {object} [options.transaction] - Optional Sequelize transaction object
 */
async function createOrUpdateUserProfileSettings({
  role,
  name,
  username,
  email,
  contact_email,
  phone_number,
  folderName,
  userId,
  transaction = null
}) {
  let model, profileData, settings;

  // Check if a profile already exists for this user FIRST
  const existingProfile = role === '3' || role === 3 
    ? await Artist.findOne({ where: { userId } })
    : await Organiser.findOne({ where: { userId } });

  // If profile exists and has valid settings, return existing settings
  if (existingProfile && existingProfile.settings && existingProfile.settings.trim() !== '') {
    try {
      const existingSettings = JSON.parse(existingProfile.settings);
      console.log(`Using existing settings for userId ${userId}:`, existingSettings.folder_name);
      return existingSettings;
    } catch (error) {
      console.error('Error parsing existing settings, will create new ones:', error);
    }
  }

  // Only create new settings if profile doesn't exist or has no settings
  if (role === '3' || role === 3) {
    // Artist
    settings = {
      setting_name: name || username,
      userType: 'artists',
      folder_name: folderName
    };
    model = Artist;
    profileData = {
      stage_name: username,
      contact_email: contact_email || email,
      phone_number,
      settings: JSON.stringify(settings),
      userId
    };

    console.log('Creating new artist settings:', settings);

  } else if (role === '4' || role === 4) {
    // Organiser
    settings = {
      setting_name: name || username,
      userType: 'organisers',
      folder_name: folderName
    };
    model = Organiser;
    profileData = {
      name: name || username,
      contact_email: contact_email || email,
      phone_number,
      settings: JSON.stringify(settings),
      userId
    };

    console.log('Creating new organiser settings:', settings);

  } else {
    // Not artist or organiser, do nothing
    return null;
  }

  if (existingProfile) {
    // Update existing profile with new settings
    await existingProfile.update(
      { settings: JSON.stringify(settings) },
      transaction ? { transaction } : {}
    );
    console.log(`Updated settings for userId ${userId}`);
  } else {
    // Create new profile
    await model.create(profileData, transaction ? { transaction } : {});
    console.log(`Created new profile for userId ${userId}`);
  }

  // Always ensure the folder exists
  await createFolderStructure(settings);

  return settings; // Return settings object for debugging or further use
}

module.exports = {
    generateUserFolderPath,
    createUserFolderStructure,
    getUserFolderPath,
    createArtistSubfolders,
    createOrUpdateUserProfileSettings
};