// File: backend/routes/admin.routes.js
const express = require("express");
const router = express.Router();
const adminController = require("../controllers/admin.controller");
const { verifyMajestyToken } = require("../middleware/majesty.middleware");

// All admin routes require Majesty authentication
router.use(verifyMajestyToken);

// Dashboard statistics
router.get("/stats", adminController.getDashboardStats);

// Entity management routes
// Users CRUD
router.get("/users", adminController.getUsers);
router.get("/users/:id", adminController.getUser);
router.post("/users", adminController.createUser);
router.put("/users/:id", adminController.updateUser);
router.delete("/users/:id", adminController.deleteUser);

// Artists CRUD
router.get("/artists", adminController.getArtists);
router.get("/artists/:id", adminController.getArtist);
router.post("/artists", adminController.createArtist);
router.put("/artists/:id", adminController.updateArtist);
router.delete("/artists/:id", adminController.deleteArtist);

// Organisers CRUD
router.get("/organisers", adminController.getOrganisers);
router.get("/organisers/:id", adminController.getOrganiser);
router.post("/organisers", adminController.createOrganiser);
router.put("/organisers/:id", adminController.updateOrganiser);
router.delete("/organisers/:id", adminController.deleteOrganiser);

// Venues CRUD
router.get("/venues", adminController.getVenues);
router.get("/venues/:id", adminController.getVenue);
router.post("/venues", adminController.createVenue);
router.put("/venues/:id", adminController.updateVenue);
router.delete("/venues/:id", adminController.deleteVenue);

// Events CRUD
router.get("/events", adminController.getEvents);
router.get("/events/:id", adminController.getEvent);
router.post("/events", adminController.createEvent);
router.put("/events/:id", adminController.updateEvent);
router.delete("/events/:id", adminController.deleteEvent);

module.exports = router;
