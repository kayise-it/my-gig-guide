// File: backend/controllers/artist.controller.js
const db = require("../models");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { validationResult } = require('express-validator');
const { changeFolderName } = require("../utils/changeFolderName");
const Artist = db.artist;

//Access control list to delete the event ACL[1,2,3]
exports.deleteArtist = async (req, res) => {
  try {
    const artistId = req.params.id;

    // Check if the artist exists
    const artist = await Artist.findByPk(artistId);
    if (!artist) {
      return res.status(404).json({
        message: 'Artist not found'
      });
    }

    // Delete the artist
    await Artist.destroy({
      where: {
        id: artistId
      }
    });

    res.status(200).json({
      message: 'Artist deleted successfully'
    });
  } catch (err) {
    console.error('Error deleting artist:', err);
    res.status(500).json({
      message: 'Failed to delete artist',
      error: err.message
    });
  }
};
exports.artists = async (req, res) => {
  try {
    // Try to fetch all artists from the database
    const artists = await Artist.findAll();

    if (artists.length === 0) {
      return res.status(404).json({
        message: 'No artists found'
      });
    }

    // If found, return the list of artists
    res.status(200).json(artists);
  } catch (err) {
    console.error('Error fetching artists:', err);
    res.status(500).json({
      message: 'Failed to fetch artists',
      error: err.message
    });
  }
};

//get Artist by id
exports.getArtistById = async (req, res) => {
  try {
    console.log("Received request for artist_id:", req.params.artist_id);
    const userId = req.params.artist_id;

    console.log("Querying database with userId:", userId);
    const artist = await Artist.findOne({
      where: { userId }
    });

    if (!artist) {
      console.log("Artist not found for userId:", userId);
      return res.status(404).json({ message: 'Artist not found' });
    }

    console.log("Found artist:", artist);
    res.status(200).json(artist);
  } catch (err) {
    console.error('Error fetching artist:', err);
    res.status(500).json({ message: 'Failed to fetch artist', error: err.message });
  }
};

// Update the artist
exports.updateArtist = async (req, res) => {
  console.log("Updating artist");

  try {
    const artistId = req.params.id;
    const {
      stage_name,
      real_name,
      genre,
      bio,
      phone_number,
      instagram,
      facebook,
      twitter
    } = req.body;

    // Check if the artist exists
    const artist = await Artist.findByPk(artistId);
    if (!artist) {
      return res.status(404).json({
        message: 'Artist not found'
      });
    }
    const oldStageName = artist.stage_name;

    // Update the artist details
    await Artist.update(
      {
        stage_name,
        real_name,
        genre,
        bio,
        phone_number,
        instagram,
        facebook,
        twitter
      },
      {
        where: {
          id: artistId
        }
      }
    );

    // Change the folder name only if the stage name is changed
    if (oldStageName !== stage_name) {
    }

    res.status(200).json({
      message: 'Artist updated successfully'
    });
  } catch (err) {
    console.error('Error updating artist:', err);
    res.status(500).json({
      message: 'Failed to update artist',
      error: err.message
    });
  }
};
// We have set up a directory structure for uploading profile pictures. The folder path is “uploads/artist/{id}_{name}”, where {id} is the artist’s unique ID, and {name} is the artist’s name. Uploaded images are stored in this directory.
// The artist's profile picture is updated in the database with the new image path.
exports.uploadProfilePicture = async (req, res) => {
  console.log(req.body);
};
