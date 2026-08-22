const express = require("express");
const jwt = require("jsonwebtoken");
const SavedJob = require("../models/SavedJob");

const router = express.Router();

// ===============================
// AUTH MIDDLEWARE
// ===============================
const authMiddleware = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        message: "Authentication required",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.userId = decoded.userId;

    next();
  } catch (error) {
    return res.status(401).json({
      message: "Invalid or expired token",
    });
  }
};

// ===============================
// GET SAVED JOBS
// ===============================
router.get("/", authMiddleware, async (req, res) => {
  try {
    const jobs = await SavedJob.find({
      userId: req.userId,
    }).sort({ createdAt: -1 });

    res.json(jobs);
  } catch (error) {
    console.error("GET SAVED JOBS ERROR:", error);

    res.status(500).json({
      message: "Failed to get saved jobs",
    });
  }
});

// ===============================
// SAVE JOB
// ===============================
router.post("/", authMiddleware, async (req, res) => {
  try {
    const {
      jobId,
      title,
      company,
      location,
      salary,
      experience,
      type,
      skills,
      posted,
    } = req.body;

    const normalizedJobId = String(jobId);

    const existingJob = await SavedJob.findOne({
      userId: req.userId,
      jobId: normalizedJobId,
    });

    if (existingJob) {
      return res.status(400).json({
        message: "Job already saved",
      });
    }

    const savedJob = await SavedJob.create({
      userId: req.userId,
      jobId: normalizedJobId,
      title,
      company,
      location,
      salary,
      experience,
      type,
      skills,
      posted,
    });

    res.status(201).json({
      message: "Job saved successfully",
      job: savedJob,
    });
  } catch (error) {
    console.error("SAVE JOB ERROR:", error);

    res.status(500).json({
      message: "Failed to save job",
    });
  }
});

// ===============================
// DELETE SAVED JOB
// ===============================
router.delete("/:jobId", authMiddleware, async (req, res) => {
  try {
    await SavedJob.findOneAndDelete({
      userId: req.userId,
      jobId: String(req.params.jobId),
    });

    res.json({
      message: "Job removed successfully",
    });
  } catch (error) {
    console.error("REMOVE SAVED JOB ERROR:", error);

    res.status(500).json({
      message: "Failed to remove job",
    });
  }
});

module.exports = router;
