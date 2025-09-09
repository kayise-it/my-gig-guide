// File: backend/routes/majesty.routes.js
const express = require("express");
const router = express.Router();
const majestyController = require("../controllers/majesty.controller");
const { verifyMajestyToken } = require("../middleware/majesty.middleware");

// Public routes
router.post("/login", majestyController.login);

// Protected routes (require majesty token)
router.get("/profile", verifyMajestyToken, majestyController.getProfile);
router.put("/profile", verifyMajestyToken, majestyController.updateProfile);
router.put("/change-password", verifyMajestyToken, majestyController.changePassword);

// System setup route (for creating initial majesty)
router.post("/create", majestyController.createMajesty);

module.exports = router;
