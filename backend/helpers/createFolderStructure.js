// backend/helpers/createFolderStructure.js

const fs = require('fs');
const path = require('path');
const { buildUserFolderAbsolutePath } = require('../utils/pathHelpers');

/**
 * Creates a folder for the user if it doesn't exist already.
 * @param {Object} settings - The settings object containing folder info.
 * @param {string} settings.userType - 'artists' | 'organisers'
 * @param {string} settings.folder_name - The folder name to create.
 */
async function createFolderStructure(settings) {
    try {
        const userType = settings.userType || (settings.path && settings.path.includes('organiser') ? 'organisers' : 'artists');
        const fullPath = buildUserFolderAbsolutePath(userType, settings.folder_name);

        console.log('Full path:', fullPath);
        // If folder doesn't exist, create it
        if (!fs.existsSync(fullPath)) {
            fs.mkdirSync(fullPath, {
                recursive: true
            });
            console.log(`Folder created at: ${fullPath}`);
        } else {
            console.log(`Folder already exists: ${fullPath}`);
        }

    } catch (err) {
        console.error('Error creating folder structure:', err);
        throw err; // rethrow so caller knows something went wrong
    }
}

module.exports = createFolderStructure;