const express = require("express");
const User = require("../models/User");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// =====================================================
// GET PROFILE
// GET /api/user/profile
// =====================================================

router.get("/profile", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.status(200).json({
      user,
    });
  } catch (error) {
    console.error("GET PROFILE ERROR:", error);

    res.status(500).json({
      message: "Failed to load profile",
    });
  }
});

// =====================================================
// UPDATE PROFILE
// PUT /api/user/profile
// =====================================================

router.put("/profile", authMiddleware, async (req, res) => {
  try {
    const { name, phone, location, bio, resumeURL, photoURL } = req.body;

    console.log("USER ID:", req.userId);
    console.log("PROFILE UPDATE DATA:", req.body);

    // Find user
    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // =================================================
    // NAME
    // =================================================

    if (name !== undefined) {
      if (!name.trim()) {
        return res.status(400).json({
          message: "Name cannot be empty",
        });
      }

      user.name = name.trim();
    }

    // =================================================
    // PHONE
    // =================================================

    if (phone !== undefined) {
      user.phone = phone.trim();
    }

    // =================================================
    // LOCATION
    // =================================================

    if (location !== undefined) {
      user.location = location.trim();
    }

    // =================================================
    // BIO
    // =================================================

    if (bio !== undefined) {
      user.bio = bio.trim();
    }

    // =================================================
    // RESUME
    // =================================================

    if (resumeURL !== undefined) {
      user.resumeURL = resumeURL.trim();
    }

    // =================================================
    // PHOTO
    // =================================================

    if (photoURL !== undefined) {
      user.photoURL = photoURL.trim();
    }

    // =================================================
    // SAVE TO MONGODB
    // =================================================

    await user.save();

    console.log("✅ PROFILE UPDATED:", user.email);

    // =================================================
    // RESPONSE
    // =================================================

    res.status(200).json({
      message: "Profile updated successfully",

      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        location: user.location,
        bio: user.bio,
        resumeURL: user.resumeURL,
        photoURL: user.photoURL,
      },
    });
  } catch (error) {
    console.error("❌ UPDATE PROFILE ERROR:", error);

    res.status(500).json({
      message: "Failed to update profile",
      error: error.message,
    });
  }
});

module.exports = router;
