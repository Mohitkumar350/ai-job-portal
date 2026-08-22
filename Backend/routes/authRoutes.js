const { firebaseAdminAuth } = require("../config/firebaseAdmin");
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/User");

const router = express.Router();

// =====================================================
// TEST
// =====================================================

router.get("/test", (req, res) => {
  res.json({
    message: "Auth route is working!",
  });
});

// =====================================================
// REGISTER
// =====================================================

router.post("/register", async (req, res) => {
  try {
    return res.status(410).json({
      message: "Email registration now uses Firebase Authentication.",
    });

    console.log("=================================");
    console.log("REGISTER BODY:", req.body);

    const { name, email, password } = req.body;

    // Validate
    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Please provide name, email and password",
      });
    }

    // Normalize email
    const normalizedEmail = email.trim().toLowerCase();

    // Check existing user
    const existingUser = await User.findOne({
      email: normalizedEmail,
    });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({
      name: name.trim(),

      email: normalizedEmail,

      password: hashedPassword,

      // New users are normal users
      role: "user",
    });

    console.log("USER CREATED SUCCESSFULLY");

    console.log("ID:", user._id);

    console.log("NAME:", user.name);

    console.log("EMAIL:", user.email);

    console.log("ROLE:", user.role);

    console.log("=================================");

    return res.status(201).json({
      message: "User registered successfully",

      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("REGISTER ERROR:", error);

    return res.status(500).json({
      message: "Server error",
    });
  }
});

// =====================================================
// LOGIN
// =====================================================

router.post("/login", async (req, res) => {
  try {
    return res.status(410).json({
      message: "Email login now uses Firebase Authentication.",
    });

    console.log("=================================");
    console.log("LOGIN BODY:", req.body);

    const { email, password } = req.body;

    // Validate
    if (!email || !password) {
      return res.status(400).json({
        message: "Please provide email and password",
      });
    }

    // Normalize email
    const normalizedEmail = email.trim().toLowerCase();

    // Find user
    const user = await User.findOne({
      email: normalizedEmail,
    });

    console.log("USER FOUND:", user ? user.email : "NO");

    if (!user) {
      return res.status(401).json({
        message: "User not found",
      });
    }

    // Compare password
    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    console.log("PASSWORD MATCH:", isPasswordCorrect);

    if (!isPasswordCorrect) {
      return res.status(401).json({
        message: "Password incorrect",
      });
    }

    // ==========================================
    // JWT
    // ==========================================

    const token = jwt.sign(
      {
        userId: user._id,
        role: user.role,
      },

      process.env.JWT_SECRET,

      {
        expiresIn: "7d",
      },
    );

    console.log("USER ROLE:", user.role);

    console.log("LOGIN SUCCESS");

    console.log("=================================");

    // ==========================================
    // RESPONSE
    // ==========================================

    return res.status(200).json({
      message: "Login successful",

      token,

      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("LOGIN ERROR:", error);

    return res.status(500).json({
      message: "Server error",
    });
  }
});

// =====================================================
// VERIFIED FIREBASE EMAIL LOGIN
// POST /api/auth/firebase-email-login
// =====================================================

router.post("/firebase-email-login", async (req, res) => {
  try {
    const { idToken } = req.body;

    if (!idToken) {
      return res.status(400).json({ message: "Firebase ID token is required" });
    }

    const decodedToken = await firebaseAdminAuth.verifyIdToken(idToken);

    if (!decodedToken.email || decodedToken.email_verified !== true) {
      return res.status(403).json({
        message: "Please verify your email before logging in.",
      });
    }

    const normalizedEmail = decodedToken.email.trim().toLowerCase();
    const allowedRequestedRoles = new Set(["job_seeker", "employer"]);
    const requestedRole = allowedRequestedRoles.has(req.body.requestedRole)
      ? req.body.requestedRole
      : "job_seeker";
    let user = await User.findOne({
      $or: [{ firebaseUid: decodedToken.uid }, { email: normalizedEmail }],
    });

    if (!user) {
      user = await User.create({
        name: decodedToken.name || normalizedEmail.split("@")[0],
        email: normalizedEmail,
        firebaseUid: decodedToken.uid,
        role: requestedRole,
      });
    } else if (!user.firebaseUid) {
      user.firebaseUid = decodedToken.uid;
      await user.save();
    }

    const token = jwt.sign(
      { userId: user._id.toString() },
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
    );

    return res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email || normalizedEmail,
        phone: user.phone || "",
        role: user.role,
        emailVerified: true,
        photoURL: user.photoURL || "",
        location: user.location || "",
        bio: user.bio || "",
      },
    });
  } catch (error) {
    console.error("FIREBASE EMAIL LOGIN ERROR:", error);
    return res
      .status(401)
      .json({ message: "Unable to verify your Firebase login." });
  }
});

// =====================================================
// PHONE OTP LOGIN
// POST /api/auth/phone-login
// =====================================================

router.post("/phone-login", async (req, res) => {
  try {
    const { idToken } = req.body;

    if (!idToken) {
      return res.status(400).json({
        message: "Firebase ID token is required",
      });
    }

    // =================================================
    // VERIFY FIREBASE ID TOKEN
    // =================================================

    const decodedToken = await firebaseAdminAuth.verifyIdToken(idToken);

    const firebaseUid = decodedToken.uid;
    const phoneNumber = decodedToken.phone_number;

    if (!firebaseUid || !phoneNumber) {
      return res.status(401).json({
        message: "Firebase account does not contain a verified phone number",
      });
    }

    console.log("🔥 FIREBASE USER VERIFIED");
    console.log("Firebase UID:", firebaseUid);
    console.log("Phone:", phoneNumber);

    // =================================================
    // FIND EXISTING MONGODB USER
    // =================================================

    let user = await User.findOne({
      $or: [{ firebaseUid: firebaseUid }, { phone: phoneNumber }],
    });

    // =================================================
    // CREATE USER IF NOT FOUND
    // =================================================

    if (!user) {
      user = await User.create({
        name: "Phone User",
        phone: phoneNumber,
        firebaseUid: firebaseUid,
        role: "user",
      });

      console.log("✅ NEW PHONE USER CREATED:", user._id);
    } else {
      // Keep Firebase UID synced
      if (!user.firebaseUid) {
        user.firebaseUid = firebaseUid;
        await user.save();
      }

      console.log("✅ EXISTING MONGODB USER FOUND:", user._id);
    }

    // =================================================
    // CREATE YOUR EXISTING JWT
    // =================================================

    const token = jwt.sign(
      {
        userId: user._id.toString(),
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      },
    );

    // =================================================
    // RESPONSE
    // =================================================

    return res.status(200).json({
      message: "Phone login successful",

      token,

      user: {
        id: user._id,
        name: user.name,
        email: user.email || "",
        phone: user.phone || "",
        role: user.role,
        photoURL: user.photoURL || "",
        location: user.location || "",
        bio: user.bio || "",
      },
    });
  } catch (error) {
    console.error("PHONE LOGIN ERROR:", error);

    return res.status(401).json({
      message: error.message || "Phone authentication failed",
    });
  }
});
module.exports = router;
