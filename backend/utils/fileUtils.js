// File: backend/utils/fileUtils.js
const fs = require("fs");
const path = require("path");
const db = require("../models"); // Adjust this path to your models directory
const { buildUserFolderAbsolutePath, getUserBasePath } = require('./pathHelpers');


// Function to create folder structure
const createFolderStructure = async (settings) => {
  // settings: { userType: 'artists'|'organisers', folder_name }
  const userType = settings.userType || (settings.path && settings.path.includes('organiser') ? 'organisers' : 'artists');
  const folderPath = buildUserFolderAbsolutePath(userType, settings.folder_name);

  console.log("Folder path:", folderPath);
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true });
    console.log("Created folder:", folderPath);
  }
};

const slugify = (text) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')      // Replace spaces with -
    .replace(/[^\w\-]+/g, '')  // Remove all non-word chars
    .replace(/\-\-+/g, '-');   // Replace multiple - with single -
};


module.exports = { createFolderStructure, slugify };