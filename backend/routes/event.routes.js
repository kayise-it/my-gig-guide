//routes/event.routes.js
const express = require("express");
const router = express.Router();
const db = require("../models");
const eventController = require("../controllers/event.controller");
const Event = db.event;
const Artist = db.artist;
const Organiser = db.organiser;
const User = db.user;
const {verifyToken } = require("../middleware/auth.middleware");
const { createOrUpdateUserProfileSettings, getUserFolderPath } = require("../helpers/userProfileHelper");
const { buildUserFolderAbsolutePath, getUserBasePath, UPLOADS_ROOT } = require('../utils/pathHelpers');
const createFolderStructure = require("../helpers/createFolderStructure");

// Get all events
router.get("/", eventController.events);

const multer = require('multer');
const fs = require('fs');
const path = require('path');

// Setup multer for file uploads - using any() to handle all fields
const upload = multer({
    storage: multer.memoryStorage()
});

// Create new event with file uploads
router.post('/create_event', verifyToken, upload.any(), async (req, res) => {
    try {
        // Validate request
        if (!req.body.name) {
            return res.status(400).json({
                message: "Event name is required"
            });
        }
        if (!req.body.date) {
            return res.status(400).json({
                message: "Event date is required"
            });
        }
        if (!req.body.time) {
            return res.status(400).json({
                message: "Event time is required"
            });
        }
        if (!req.body.owner_id) {
            return res.status(400).json({
                message: "Owner ID is required"
            });
        }
        if (!req.body.owner_type || !['artist', 'organiser'].includes(req.body.owner_type)) {
            return res.status(400).json({
                message: "Owner type must be either 'artist' or 'organiser'"
            });
        }

        // Validate that the owner exists
        let ownerData;
        if (req.body.owner_type === 'artist') {
            ownerData = await Artist.findByPk(req.body.owner_id);
            if (!ownerData) {
                return res.status(400).json({
                    message: "Artist not found"
                });
            }
        } else if (req.body.owner_type === 'organiser') {
            ownerData = await Organiser.findByPk(req.body.owner_id);
            if (!ownerData) {
                return res.status(400).json({
                    message: "Organiser not found"
                });
            }
        }

        // Get user data
        const user = await User.findByPk(req.body.userId);
        if (!user) {
            return res.status(400).json({
                message: "User not found"
            });
        }

        // Create event object first
        const event = {
            userId: req.body.userId,
            owner_id: parseInt(req.body.owner_id),
            owner_type: req.body.owner_type,
            name: req.body.name,
            description: req.body.description && req.body.description !== '' ? req.body.description : null,
            date: req.body.date,
            time: req.body.time,
            price: req.body.price && req.body.price !== '' ? parseFloat(req.body.price) : 0,
            ticket_url: req.body.ticket_url && req.body.ticket_url !== '' ? req.body.ticket_url : null,
            poster: null, // Will be updated after file upload
            venue_id: req.body.venue_id && req.body.venue_id !== '' ? parseInt(req.body.venue_id) : null,
            category: req.body.category && req.body.category !== '' ? req.body.category : null,
            capacity: req.body.capacity && req.body.capacity !== '' ? parseInt(req.body.capacity) : null,
            gallery: null, // Will be updated after file upload
        };

        const createdEvent = await Event.create(event);

        // Generate event folder name
        const eventFolderName = req.body.name.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '');
        const eventId = createdEvent.id;
        
        // Get or create user folder path
        const userType = req.body.owner_type === 'artist' ? 'artists' : 'organisers';
        let orgFolder = req.body.orgFolder;
        
        if (!orgFolder) {
            // Generate folder path if not provided, using events subfolder
            orgFolder = getUserFolderPath(user, ownerData, userType, 'events');
        }
        
        if (orgFolder) {
            const eventFolderPath = path.join(orgFolder, `${eventId}_${eventFolderName}`);
            const eventPosterPath = path.join(eventFolderPath, 'event_poster');
            const eventGalleryPath = path.join(eventFolderPath, 'gallery');

            // Create directories
            if (!fs.existsSync(eventFolderPath)) {
                fs.mkdirSync(eventFolderPath, { recursive: true });
            }
            if (!fs.existsSync(eventPosterPath)) {
                fs.mkdirSync(eventPosterPath, { recursive: true });
            }
            if (!fs.existsSync(eventGalleryPath)) {
                fs.mkdirSync(eventGalleryPath, { recursive: true });
            }

            let posterPath = null;
            let galleryPaths = [];

            // Handle poster upload
            if (req.files && req.files.length > 0) {
                const posterFile = req.files.find(file => file.fieldname === 'poster');
                if (posterFile) {
                    const posterExtension = path.extname(posterFile.originalname).toLowerCase();
                    const posterFileName = `event_poster_${Date.now()}${posterExtension}`;
                    const posterFullPath = path.join(eventPosterPath, posterFileName);
                    
                    fs.writeFileSync(posterFullPath, posterFile.buffer);
                    
                    // Construct the correct web path for the database
                    // Extract the folder name from the orgFolder path
                    const folderName = path.basename(path.dirname(orgFolder)); // Get the artist folder name (e.g., "3_Thando_8146")
                    posterPath = `/${userType}/${folderName}/events/${eventId}_${eventFolderName}/event_poster/${posterFileName}`;
                }

                // Handle gallery uploads
                const galleryFiles = req.files.filter(file => file.fieldname === 'gallery');
                for (let i = 0; i < galleryFiles.length; i++) {
                    const galleryFile = galleryFiles[i];
                    const galleryExtension = path.extname(galleryFile.originalname).toLowerCase();
                    const galleryFileName = `gallery_${Date.now()}_${i}${galleryExtension}`;
                    const galleryFullPath = path.join(eventGalleryPath, galleryFileName);
                    
                    fs.writeFileSync(galleryFullPath, galleryFile.buffer);
                    
                    // Construct the correct web path for the database
                    const folderName = path.basename(path.dirname(orgFolder)); // Get the artist folder name (e.g., "3_Thando_8146")
                    const galleryPath = `/${userType}/${folderName}/events/${eventId}_${eventFolderName}/gallery/${galleryFileName}`;
                    galleryPaths.push(galleryPath);
                }
            }

            // Update event with file paths
            await createdEvent.update({
                poster: posterPath,
                gallery: galleryPaths.length > 0 ? galleryPaths.join(',') : null
            });
        }

        res.status(201).json({
            success: true,
            message: "Event created successfully",
            event: createdEvent,
            eventId: createdEvent.id
        });
    } catch (err) {
        console.error("Error creating event:", err);
        res.status(500).json({
            success: false,
            message: err.message || "Error creating event"
        });
    }
});

// Update event with file uploads
router.put('/edit/:id', verifyToken, upload.any(), async (req, res) => {
    try {
        const event = await Event.findByPk(req.params.id);
        if (!event) {
            return res.status(404).json({
                success: false,
                message: "Event not found"
            });
        }

        // Update basic event details
        event.name = req.body.name || event.name;
        event.description = req.body.description || event.description;
        event.date = req.body.date || event.date;
        event.time = req.body.time || event.time;
        event.price = req.body.price ? parseFloat(req.body.price) : event.price;
        event.ticket_url = req.body.ticket_url || event.ticket_url;
        event.category = req.body.category || event.category;
        event.capacity = req.body.capacity ? parseInt(req.body.capacity) : event.capacity;

        // Handle file uploads if provided
        const userType = req.body.owner_type === 'artist' ? 'artists' : 'organisers';
        let orgFolder = req.body.orgFolder;
        
        if (orgFolder && req.files && req.files.length > 0) {
            const eventFolderName = event.name.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '');
            const eventFolderPath = path.join(orgFolder, `${event.id}_${eventFolderName}`);
            const eventPosterPath = path.join(eventFolderPath, 'event_poster');
            const eventGalleryPath = path.join(eventFolderPath, 'gallery');

            // Create directories if they don't exist
            if (!fs.existsSync(eventFolderPath)) {
                fs.mkdirSync(eventFolderPath, { recursive: true });
            }
            if (!fs.existsSync(eventPosterPath)) {
                fs.mkdirSync(eventPosterPath, { recursive: true });
            }
            if (!fs.existsSync(eventGalleryPath)) {
                fs.mkdirSync(eventGalleryPath, { recursive: true });
            }

            // Handle new poster upload
            const posterFile = req.files.find(file => file.fieldname === 'poster');
            if (posterFile) {
                const posterExtension = path.extname(posterFile.originalname).toLowerCase();
                const posterFileName = `event_poster_${Date.now()}${posterExtension}`;
                const posterFullPath = path.join(eventPosterPath, posterFileName);
                
                fs.writeFileSync(posterFullPath, posterFile.buffer);
                
                // Construct the correct web path for the database
                const folderName = path.basename(path.dirname(orgFolder)); // Get the artist folder name (e.g., "3_Thando_8146")
                event.poster = `/${userType}/${folderName}/events/${event.id}_${eventFolderName}/event_poster/${posterFileName}`;
            }

            // Handle new gallery uploads
            const galleryFiles = req.files.filter(file => file.fieldname === 'gallery');
            if (galleryFiles.length > 0) {
                const existingGallery = event.gallery ? event.gallery.split(',') : [];
                const newGalleryPaths = [];

                for (let i = 0; i < galleryFiles.length; i++) {
                    const galleryFile = galleryFiles[i];
                    const galleryExtension = path.extname(galleryFile.originalname).toLowerCase();
                    const galleryFileName = `gallery_${Date.now()}_${i}${galleryExtension}`;
                    const galleryFullPath = path.join(eventGalleryPath, galleryFileName);
                    
                    fs.writeFileSync(galleryFullPath, galleryFile.buffer);
                    
                    // Construct the correct web path for the database
                    const folderName = path.basename(path.dirname(orgFolder)); // Get the artist folder name (e.g., "3_Thando_8146")
                    const galleryPath = `/${userType}/${folderName}/events/${event.id}_${eventFolderName}/gallery/${galleryFileName}`;
                    newGalleryPaths.push(galleryPath);
                }

                // Combine existing and new gallery paths
                event.gallery = [...existingGallery, ...newGalleryPaths].join(',');
            }
        }

        await event.save();

        res.status(200).json({
            success: true,
            message: "Event updated successfully",
            event
        });
    } catch (error) {
        console.error("Error updating event:", error);
        res.status(500).json({
            success: false,
            message: error.message || "Error updating event"
        });
    }
});

// Get events by owner type and ID
router.get('/owner/:ownerType/:ownerId', async (req, res) => {
    try {
        const { ownerType, ownerId } = req.params;
        
        if (!['artist', 'organiser'].includes(ownerType)) {
            return res.status(400).json({
                success: false,
                message: "Owner type must be either 'artist' or 'organiser'"
            });
        }

        const events = await Event.findAll({
            where: {
                owner_id: parseInt(ownerId),
                owner_type: ownerType
            },
            include: [
                {
                    model: db.user,
                    attributes: ["id", "username"],
                    as: 'creator'
                },
                {
                    model: Artist,
                    attributes: ["id", "stage_name", "real_name"],
                    as: 'artistOwner'
                },
                {
                    model: Organiser,
                    attributes: ["id", "name"],
                    as: 'organiserOwner'
                }
            ]
        });

        res.status(200).json({
            success: true,
            events
        });
    } catch (error) {
        console.error("Error fetching events by owner:", error);
        res.status(500).json({
            success: false,
            message: error.message || "Error fetching events by owner"
        });
    }
});

/**
 * Get event by ID (duplicate of the route below, but without the typo in the error message)
 */
router.get('/:id', async (req, res) => {
    try {
        const event = await Event.findByPk(req.params.id, {
            include: [
                {
                    model: db.user,
                    attributes: ["id", "username"],
                    as: 'creator'
                },
                {
                    model: Artist,
                    attributes: ["id", "stage_name", "real_name"],
                    as: 'artistOwner'
                },
                {
                    model: Organiser,
                    attributes: ["id", "name"],
                    as: 'organiserOwner'
                },
                {
                    model: db.venue,
                    attributes: ["id", "name", "address", "latitude", "longitude"],
                    as: 'venue'
                }
            ]
        });
        if (!event) {
            return res.status(404).json({
                success: false,
                message: "Event not found"
            });
        }
        res.status(200).json({
            success: true,
            event: event
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || "Error fetching event data"
        });
    }
});
router.delete('/delete/:id', verifyToken, eventController.deleteEvent);
// Get events for a specific organiser
router.get('/organiser/:id', verifyToken, async (req, res) => {
    try {
        const organiserId = parseInt(req.params.id, 10);
        

        const events = await Event.findAll({
            where: {
                owner_id: organiserId,
                owner_type: 'organiser'
            },
            include: [
                {
                    model: db.user,
                    attributes: ["id", "username"],
                    as: 'creator'
                },
                {
                    model: Organiser,
                    attributes: ["id", "name"],
                    as: 'organiserOwner'
                }
            ]
        });

        if (!events.length) {
            return res.status(200).json({
                success: false,
                message: "No events found for this organiser"
            });
        }

        res.status(200).json({
            success: true,
            events
        });
    } catch (error) {
        console.error("Error fetching events:", error);
        res.status(500).json({
            success: false,
            message: error.message || "Error fetching events"
        });
    }
});
router.get("/getAllEventsByOrganiser/:id", verifyToken, eventController.getAllEventsByOrganiser);

router.get("/by_organiser/:id", verifyToken, eventController.getAllEventsByOrganiser);

// Get events for a specific venue
router.get('/venue/:venueId', eventController.getEventsByVenue);

// Upload event gallery images
router.post('/:id/gallery', verifyToken, upload.array('gallery', 10), async (req, res) => {
    try {
        const eventId = parseInt(req.params.id);
        const event = await Event.findByPk(eventId);
        
        if (!event) {
            return res.status(404).json({
                success: false,
                message: "Event not found"
            });
        }

        // Check if user is the event owner
        const currentUser = await User.findByPk(req.user.id);
        if (!currentUser) {
            return res.status(401).json({
                success: false,
                message: "User not found"
            });
        }

        // Verify ownership
        let isOwner = false;
        if (event.owner_type === 'artist') {
            const artist = await Artist.findByPk(event.owner_id);
            isOwner = artist && artist.userId === currentUser.id;
        } else if (event.owner_type === 'organiser') {
            const organiser = await Organiser.findByPk(event.owner_id);
            isOwner = organiser && organiser.userId === currentUser.id;
        }

        if (!isOwner) {
            return res.status(403).json({
                success: false,
                message: "You can only upload gallery images to your own events"
            });
        }

        if (!req.files || req.files.length === 0) {
            return res.status(400).json({
                success: false,
                message: "No files uploaded"
            });
        }

        // Get user and owner data
        const user = await User.findByPk(event.userId);
        const ownerData = event.owner_type === 'artist' ? await Artist.findByPk(event.owner_id) : await Organiser.findByPk(event.owner_id);

        // Get or create settings - function will handle existing settings automatically
        const role = event.owner_type === 'artist' ? 3 : 4;
        const folderName = `${role}_${user.username}_${Math.floor(Math.random() * 9000 + 1000)}`;
        const settings = await createOrUpdateUserProfileSettings({
            role: role,
            name: user.name,
            username: user.username,
            email: user.email,
            contact_email: user.contact_email,
            phone_number: user.phone_number,
            folderName,
            userId: user.id
        });

        // Create folder structure if it doesn't exist
        await createFolderStructure(settings);

        // Create event gallery subfolder
        const userTypeForGallery = event.owner_type === 'artist' ? 'artists' : 'organisers';
        const folderPath = buildUserFolderAbsolutePath(userTypeForGallery, settings.folder_name);
        const eventsPath = path.join(folderPath, 'events');
        const eventFolderName = `${eventId}_${event.name.replace(/\s+/g, '_').toLowerCase()}`;
        const eventFolderPath = path.join(eventsPath, eventFolderName);
        const galleryPath = path.join(eventFolderPath, 'gallery');
        
        if (!fs.existsSync(galleryPath)) {
            fs.mkdirSync(galleryPath, { recursive: true });
            console.log('Created event gallery folder:', galleryPath);
        }

        // Get existing gallery images
        let existingGallery = [];
        if (event.gallery) {
            try {
                // Try to parse as JSON first (new format)
                existingGallery = JSON.parse(event.gallery);
                if (!Array.isArray(existingGallery)) {
                    existingGallery = [];
                }
            } catch (e) {
                // If JSON parsing fails, try comma-separated format (old format)
                if (typeof event.gallery === 'string') {
                    existingGallery = event.gallery.split(',').filter(img => img && img.trim());
                } else {
                    existingGallery = [];
                }
            }
        }

        const uploadedImages = [];

        // Process each uploaded file
        for (let i = 0; i < req.files.length; i++) {
            const file = req.files[i];
            const timestamp = Date.now();
            const fileName = `gallery_${timestamp}_${i}.${file.originalname.split('.').pop()}`;
            const filePath = path.join(galleryPath, fileName);

            // Write file to disk
            fs.writeFileSync(filePath, file.buffer);

            // Generate public URL (same pattern as venue gallery)
            const userType = event.owner_type === 'artist' ? 'artists' : 'organisers';
            const publicUrl = `/${userType}/${settings.folder_name}/events/${eventFolderName}/gallery/${fileName}`;
            uploadedImages.push(publicUrl);
        }

        // Update event with new gallery images
        const updatedGallery = [...existingGallery, ...uploadedImages];
        await event.update({
            gallery: JSON.stringify(updatedGallery)
        });

        res.status(200).json({
            success: true,
            message: "Gallery images uploaded successfully",
            event: {
                id: event.id,
                gallery: updatedGallery
            }
        });

    } catch (error) {
        console.error('Error uploading gallery:', error);
        res.status(500).json({
            success: false,
            message: error.message || "Error uploading gallery images"
        });
    }
});

// Delete event gallery image
router.delete('/:id/gallery', verifyToken, async (req, res) => {
    try {
        const eventId = parseInt(req.params.id);
        const { imagePath } = req.body;
        
        const event = await Event.findByPk(eventId);
        
        if (!event) {
            return res.status(404).json({
                success: false,
                message: "Event not found"
            });
        }

        // Check if user is the event owner
        const user = await User.findByPk(req.user.id);
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User not found"
            });
        }

        // Verify ownership
        let isOwner = false;
        if (event.owner_type === 'artist') {
            const artist = await Artist.findByPk(event.owner_id);
            isOwner = artist && artist.userId === user.id;
        } else if (event.owner_type === 'organiser') {
            const organiser = await Organiser.findByPk(event.owner_id);
            isOwner = organiser && organiser.userId === user.id;
        }

        if (!isOwner) {
            return res.status(403).json({
                success: false,
                message: "You can only delete gallery images from your own events"
            });
        }

        if (!imagePath) {
            return res.status(400).json({
                success: false,
                message: "Image path is required"
            });
        }

        // Get existing gallery images
        let existingGallery = [];
        if (event.gallery) {
            try {
                // Try to parse as JSON first (new format)
                existingGallery = JSON.parse(event.gallery);
                if (!Array.isArray(existingGallery)) {
                    existingGallery = [];
                }
            } catch (e) {
                // If JSON parsing fails, try comma-separated format (old format)
                if (typeof event.gallery === 'string') {
                    existingGallery = event.gallery.split(',').filter(img => img && img.trim());
                } else {
                    existingGallery = [];
                }
            }
        }

        // Remove the image from the gallery array
        const updatedGallery = existingGallery.filter(img => img !== imagePath);

        // Delete the file from disk
        const userType = event.owner_type === 'artist' ? 'artists' : 'organisers';
        const fullImagePath = path.join(UPLOADS_ROOT, imagePath.replace(/^\//, ''));
        if (fs.existsSync(fullImagePath)) {
            fs.unlinkSync(fullImagePath);
        }

        // Update event with updated gallery
        await event.update({
            gallery: JSON.stringify(updatedGallery)
        });

        res.status(200).json({
            success: true,
            message: "Gallery image deleted successfully",
            event: {
                id: event.id,
                gallery: updatedGallery
            }
        });

    } catch (error) {
        console.error('Error deleting gallery image:', error);
        res.status(500).json({
            success: false,
            message: error.message || "Error deleting gallery image"
        });
    }
});

module.exports = router;