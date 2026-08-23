const express = require("express");
const jwt = require("jsonwebtoken");

const { firebaseAdminAuth } = require("../config/firebaseAdmin");
const User = require("../models/User");

const router = express.Router();

// =====================================================
// HELPER - Generate JWT
// =====================================================

const generateJWT = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

// =====================================================
// POST /api/auth/firebase-email-login
// Called after Firebase email/password sign-in
// Body: { idToken, requestedRole? }
// =====================================================

router.post("/firebase-email-login", async (req, res) => {
  try {
    const { idToken, requestedRole } = req.body;

    if (!idToken) {
      return res.status(400).json({ message: "Firebase ID token is required" });
    }

    // Verify Firebase token
    const decoded = await firebaseAdminAuth.verifyIdToken(idToken);

    const { uid, email, name, picture } = decoded;

    if (!email) {
      return res.status(400).json({ message: "Email is required for this login method" });
    }

    // Find or create user
    let user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      // New user — assign requested role or default
      const allowedRoles = ["job_seeker", "employer", "candidate", "user"];
      const role =
        requestedRole && allowedRoles.includes(requestedRole)
          ? requestedRole
          : "job_seeker";

      user = await User.create({
        name: name || email.split("@")[0],
        email: email.toLowerCase(),
        firebaseUid: uid,
        photoURL: picture || "",
        role,
      });
    } else {
      // Existing user — update firebaseUid if missing
      if (!user.firebaseUid) {
        user.firebaseUid = uid;
        await user.save();
      }
    }

    const token = generateJWT(user._id);

    return res.status(200).json({
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        photoURL: user.photoURL,
        resumeURL: user.resumeURL,
        bio: user.bio,
        location: user.location,
        skills: user.skills,
        phone: user.phone,
      },
    });
  } catch (error) {
    console.error("FIREBASE EMAIL LOGIN ERROR:", error);

    if (error.code === "auth/id-token-expired") {
      return res.status(401).json({ message: "Session expired. Please login again." });
    }

    return res.status(500).json({ message: "Login failed. Please try again." });
  }
});

// =====================================================
// POST /api/auth/phone-login
// Called after Firebase phone OTP verification
// Body: { idToken }
// =====================================================

router.post("/phone-login", async (req, res) => {
  try {
    const { idToken } = req.body;

    if (!idToken) {
      return res.status(400).json({ message: "Firebase ID token is required" });
    }

    // Verify Firebase token
    const decoded = await firebaseAdminAuth.verifyIdToken(idToken);

    const { uid, phone_number } = decoded;

    if (!phone_number) {
      return res.status(400).json({ message: "Phone number not found in token" });
    }

    // Find or create user by firebaseUid or phone
    let user = await User.findOne({
      $or: [{ firebaseUid: uid }, { phone: phone_number }],
    });

    if (!user) {
      user = await User.create({
        name: phone_number,
        phone: phone_number,
        firebaseUid: uid,
        role: "job_seeker",
      });
    } else {
      // Sync firebaseUid / phone if needed
      let changed = false;
      if (!user.firebaseUid) { user.firebaseUid = uid; changed = true; }
      if (!user.phone) { user.phone = phone_number; changed = true; }
      if (changed) await user.save();
    }

    const token = generateJWT(user._id);

    return res.status(200).json({
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        photoURL: user.photoURL,
        resumeURL: user.resumeURL,
        bio: user.bio,
        location: user.location,
        skills: user.skills,
        phone: user.phone,
      },
    });
  } catch (error) {
    console.error("PHONE LOGIN ERROR:", error);

    if (error.code === "auth/id-token-expired") {
      return res.status(401).json({ message: "Session expired. Please login again." });
    }

    return res.status(500).json({ message: "Phone login failed. Please try again." });
  }
});

// =====================================================
// EXPORT ROUTER
// =====================================================

module.exports = router;