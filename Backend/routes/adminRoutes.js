const express = require("express");
const jwt = require("jsonwebtoken");

const User = require("../models/User");
const Application = require("../models/Application");

const router = express.Router();

// =====================================================
// ADMIN AUTH MIDDLEWARE
// =====================================================

const adminMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    // Check token
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Authentication required",
      });
    }

    // Get token
    const token = authHeader.split(" ")[1];

    // Verify JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Check userId
    if (!decoded.userId) {
      return res.status(401).json({
        message: "Invalid token",
      });
    }

    // Find user
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(401).json({
        message: "User not found",
      });
    }

    // Check admin role
    if (user.role !== "admin") {
      return res.status(403).json({
        message: "Admin access required",
      });
    }

    // Save user in request
    req.user = user;
    req.userId = user._id;

    next();
  } catch (error) {
    console.error("ADMIN AUTH ERROR:", error);

    return res.status(401).json({
      message: "Invalid or expired token",
    });
  }
};

// =====================================================
// TEST ADMIN ROUTE
// GET /api/admin/test
// =====================================================

router.get("/test", adminMiddleware, (req, res) => {
  res.status(200).json({
    message: "Admin route is working",
    admin: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role,
    },
  });
});

// =====================================================
// GET ALL USERS
// GET /api/admin/users
// =====================================================

router.get("/users", adminMiddleware, async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({
      createdAt: -1,
    });

    return res.status(200).json({
      users,
    });
  } catch (error) {
    console.error("GET ALL USERS ERROR:", error);

    return res.status(500).json({
      message: "Failed to fetch users",
    });
  }
});

// =====================================================
// DELETE USER
// DELETE /api/admin/users/:id
// =====================================================

router.delete("/users/:id", adminMiddleware, async (req, res) => {
  try {
    const userId = req.params.id;

    // Prevent admin from deleting himself
    if (String(userId) === String(req.user._id)) {
      return res.status(400).json({
        message: "You cannot delete your own admin account",
      });
    }

    // Find user
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // Delete user
    await User.findByIdAndDelete(userId);

    // Optional:
    // Delete user's applications
    await Application.deleteMany({
      userId: userId,
    });

    return res.status(200).json({
      message: "User deleted successfully",
      userId,
    });
  } catch (error) {
    console.error("DELETE USER ERROR:", error);

    return res.status(500).json({
      message: "Failed to delete user",
    });
  }
});

// =====================================================
// ADMIN STATISTICS
// GET /api/admin/stats
// =====================================================

router.get("/stats", adminMiddleware, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();

    const totalApplications = await Application.countDocuments();

    const totalAdmins = await User.countDocuments({
      role: "admin",
    });

    const totalNormalUsers = await User.countDocuments({
      role: {
        $ne: "admin",
      },
    });

    const pendingApplications = await Application.countDocuments({
      $or: [
        {
          status: "Applied",
        },
        {
          status: {
            $exists: false,
          },
        },
      ],
    });

    const approvedApplications = await Application.countDocuments({
      status: "Approved",
    });

    const rejectedApplications = await Application.countDocuments({
      status: "Rejected",
    });

    return res.status(200).json({
      totalUsers,
      totalApplications,
      totalAdmins,
      totalNormalUsers,
      pendingApplications,
      approvedApplications,
      rejectedApplications,
    });
  } catch (error) {
    console.error("ADMIN STATS ERROR:", error);

    return res.status(500).json({
      message: "Failed to fetch admin statistics",
    });
  }
});

// =====================================================
// GET ALL APPLICATIONS FOR ADMIN
// GET /api/admin/applications
// =====================================================

router.get("/applications", adminMiddleware, async (req, res) => {
  try {
    const applications = await Application.find().sort({
      createdAt: -1,
    });

    return res.status(200).json({
      applications,
    });
  } catch (error) {
    console.error("GET ADMIN APPLICATIONS ERROR:", error);

    return res.status(500).json({
      message: "Failed to fetch applications",
    });
  }
});

// =====================================================
// EXPORT ROUTER
// =====================================================

module.exports = router;
