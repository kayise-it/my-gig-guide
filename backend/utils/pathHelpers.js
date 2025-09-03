// backend/utils/pathHelpers.js
const path = require('path');

// Root of the application (override via APP_ROOT env if needed)
const APP_ROOT = process.env.APP_ROOT || '/var/www/my-gig-guide';

// Public uploads root under the frontend
const UPLOADS_ROOT = path.join(APP_ROOT, 'frontend', 'public');

function getUploadsRoot() {
  return UPLOADS_ROOT;
}

function getUserBasePath(userType) {
  // userType: 'artists' | 'organisers'
  return path.join(UPLOADS_ROOT, userType);
}

function buildUserFolderAbsolutePath(userType, folderName) {
  return path.join(getUserBasePath(userType), folderName);
}

module.exports = {
  APP_ROOT,
  UPLOADS_ROOT,
  getUploadsRoot,
  getUserBasePath,
  buildUserFolderAbsolutePath,
};



