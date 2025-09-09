// File: backend/controllers/majesty.controller.js
const db = require("../models");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Majesty = db.majesty;

// Majesty login
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    const majesty = await Majesty.findOne({
      where: {
        username,
        is_active: true,
      },
    });

    if (!majesty) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

    const valid = await bcrypt.compare(password, majesty.password);
    if (!valid) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

    // Update last login
    await majesty.update({ last_login: new Date() });

    const majestyData = majesty.get({ plain: true });
    delete majestyData.password;

    const token = jwt.sign(
      {
        id: majesty.id,
        username: majesty.username,
        role: 'majesty',
        type: 'majesty',
      },
      process.env.JWT_SECRET || 'your_super_secret_jwt_key_here_make_it_long_and_random_123456789',
      { expiresIn: "1d" }
    );

    res.json({
      message: "Majesty login successful",
      token,
      majesty: majestyData,
    });
  } catch (err) {
    console.error("Majesty login error:", err);
    res.status(500).json({
      message: "Login failed",
      error: err.message,
    });
  }
};

// Get majesty profile
exports.getProfile = async (req, res) => {
  try {
    const majesty = await Majesty.findByPk(req.majesty.id, {
      attributes: { exclude: ['password'] }
    });

    if (!majesty) {
      return res.status(404).json({ message: "Majesty not found" });
    }

    res.json(majesty);
  } catch (err) {
    console.error("Get majesty profile error:", err);
    res.status(500).json({
      message: "Failed to fetch profile",
      error: err.message,
    });
  }
};

// Update majesty profile
exports.updateProfile = async (req, res) => {
  try {
    const { full_name, title, email, settings } = req.body;
    const updates = {};

    if (full_name !== undefined) updates.full_name = full_name;
    if (title !== undefined) updates.title = title;
    if (email !== undefined) updates.email = email;
    if (settings !== undefined) updates.settings = settings;

    await Majesty.update(updates, {
      where: { id: req.majesty.id }
    });

    const updatedMajesty = await Majesty.findByPk(req.majesty.id, {
      attributes: { exclude: ['password'] }
    });

    res.json({
      message: "Profile updated successfully",
      majesty: updatedMajesty,
    });
  } catch (err) {
    console.error("Update majesty profile error:", err);
    res.status(500).json({
      message: "Failed to update profile",
      error: err.message,
    });
  }
};

// Change password
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const majesty = await Majesty.findByPk(req.majesty.id);
    if (!majesty) {
      return res.status(404).json({ message: "Majesty not found" });
    }

    const valid = await bcrypt.compare(currentPassword, majesty.password);
    if (!valid) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12);
    await majesty.update({ password: hashedPassword });

    res.json({ message: "Password changed successfully" });
  } catch (err) {
    console.error("Change password error:", err);
    res.status(500).json({
      message: "Failed to change password",
      error: err.message,
    });
  }
};

// Create new majesty (for system setup)
exports.createMajesty = async (req, res) => {
  try {
    const { username, email, password, full_name, title } = req.body;

    // Check if majesty already exists
    const existingMajesty = await Majesty.findOne({
      where: {
        [db.Sequelize.Op.or]: [{ username }, { email }]
      }
    });

    if (existingMajesty) {
      return res.status(400).json({
        message: "Majesty with this username or email already exists"
      });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const majesty = await Majesty.create({
      username,
      email,
      password: hashedPassword,
      full_name,
      title: title || 'Owner',
      is_active: true,
    });

    const majestyData = majesty.get({ plain: true });
    delete majestyData.password;

    res.status(201).json({
      message: "Majesty created successfully",
      majesty: majestyData,
    });
  } catch (err) {
    console.error("Create majesty error:", err);
    res.status(500).json({
      message: "Failed to create majesty",
      error: err.message,
    });
  }
};


