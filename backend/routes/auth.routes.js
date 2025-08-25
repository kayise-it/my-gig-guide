// File: backend/routes/auth.routes.js
const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");
const { verifyToken } = require("../middleware/auth.middleware");

router.get("/:id", authController.getMe);
router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/logout", verifyToken, authController.logout);
router.post("/check-email", authController.checkEmail);
router.post("/reset-password", authController.resetPassword);


module.exports = router;