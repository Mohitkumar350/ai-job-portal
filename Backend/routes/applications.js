const express = require("express");
const mongoose = require("mongoose");

const Application = require("../models/Application");
const User = require("../models/User");
const Job = require("../models/Job");
const authMiddleware = require("../middleware/authMiddleware");
const Notification = require("../models/Notification");

const router = express.Router();

const createNotification = async (data) => {
  try {
    await Notification.create(data);
  } catch (error) {
    console.error("CREATE NOTIFICATION ERROR:", error);
  }
};

const seekerMiddleware = async (req, res, next) => {
  const user = await User.findById(req.userId);
  if (!user) return res.status(401).json({ message: "User not found" });
  if (!["user", "candidate", "job_seeker"].includes(user.role)) {
    return res.status(403).json({ message: "Only job seekers can apply" });
  }
  req.applicant = user;
  next();
};

const employerMiddleware = async (req, res, next) => {
  const user = await User.findById(req.userId).select("role");
  if (!user) return res.status(401).json({ message: "User not found" });
  if (user.role !== "employer") {
    return res.status(403).json({ message: "Employer access required" });
  }
  req.employer = user;
  next();
};

// =====================================================
// ADMIN MIDDLEWARE
// =====================================================

const adminMiddleware = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(401).json({
        message: "User not found",
      });
    }

    console.log("ADMIN CHECK:");
    console.log("USER:", user.email);
    console.log("ROLE:", user.role);

    if (user.role !== "admin") {
      return res.status(403).json({
        message: "Admin access required",
      });
    }

    req.admin = user;

    next();
  } catch (error) {
    console.error("ADMIN MIDDLEWARE ERROR:", error);

    return res.status(500).json({
      message: "Failed to verify admin",
    });
  }
};

// =====================================================
// POST - APPLY FOR JOB
// POST /api/applications
// =====================================================

router.post("/", authMiddleware, seekerMiddleware, async (req, res) => {
  try {
    console.log("=================================");
    console.log("NEW APPLICATION");
    console.log("USER ID:", req.userId);
    console.log("BODY:", req.body);

    const { jobId, title, company, location, fullName, phone, coverLetter } =
      req.body;

    const applicant = req.applicant;

    let employerJob = null;
    if (mongoose.Types.ObjectId.isValid(String(jobId))) {
      employerJob = await Job.findById(jobId);
      if (!employerJob)
        return res.status(404).json({ message: "Job not found" });
      if (employerJob.status !== "ACTIVE") {
        return res
          .status(400)
          .json({ message: "This job is no longer accepting applications" });
      }
    }

    // -----------------------------
    // VALIDATE REQUIRED FIELDS
    // -----------------------------

    if (
      jobId === undefined ||
      !title ||
      !company ||
      !location ||
      !fullName ||
      !phone
    ) {
      return res.status(400).json({
        message: "Please provide all required application details",
      });
    }

    // -----------------------------
    // CHECK DUPLICATE APPLICATION
    // -----------------------------

    const existingApplication = await Application.findOne({
      userId: req.userId,
      jobId: { $in: [String(jobId), Number(jobId)] },
    });

    if (existingApplication) {
      return res.status(409).json({
        message: "You have already applied for this job",
      });
    }

    // -----------------------------
    // CREATE APPLICATION
    // -----------------------------

    const application = await Application.create({
      userId: req.userId,
      jobId: String(jobId),
      job: employerJob?._id,
      applicant: applicant._id,
      employer: employerJob?.createdBy,
      resume: applicant.resumeURL || "",
      title: employerJob?.title || title.trim(),
      company: employerJob?.company || company.trim(),
      location: employerJob?.location || location.trim(),
      fullName: fullName.trim(),
      phone: phone.trim(),
      coverLetter: coverLetter ? coverLetter.trim() : "",
      status: "APPLIED",
    });

    if (employerJob?.createdBy) {
      await createNotification({
        recipient: employerJob.createdBy,
        type: "APPLICATION_RECEIVED",
        title: "New Application Received",
        message: `A candidate has applied for your ${employerJob.title} position.`,
        relatedJob: employerJob._id,
        relatedApplication: application._id,
      });
    }

    console.log("APPLICATION CREATED:", application._id);
    console.log("STATUS:", application.status);
    console.log("=================================");

    return res.status(201).json({
      message: "Application submitted successfully",
      application,
    });
  } catch (error) {
    console.error("CREATE APPLICATION ERROR:", error);

    // Duplicate index
    if (error.code === 11000) {
      return res.status(409).json({
        message: "You have already applied for this job",
      });
    }

    return res.status(500).json({
      message: error.message || "Failed to submit application",
    });
  }
});

// =====================================================
// GET - MY APPLICATIONS
// GET /api/applications
// =====================================================

router.get("/", authMiddleware, async (req, res) => {
  try {
    console.log("=================================");
    console.log("GET MY APPLICATIONS");
    console.log("USER ID:", req.userId);

    const applications = await Application.find({
      userId: req.userId,
    }).sort({
      createdAt: -1,
    });

    console.log("APPLICATION COUNT:", applications.length);
    console.log("=================================");

    return res.status(200).json({
      applications,
    });
  } catch (error) {
    console.error("GET APPLICATIONS ERROR:", error);

    return res.status(500).json({
      message: error.message || "Failed to get applications",
    });
  }
});

router.get("/my-applications", authMiddleware, async (req, res) => {
  try {
    const applications = await Application.find({ userId: req.userId }).sort({
      createdAt: -1,
    });
    return res.status(200).json({ applications });
  } catch (error) {
    console.error("GET MY APPLICATIONS ERROR:", error);
    return res.status(500).json({ message: "Failed to get applications" });
  }
});

// =====================================================
// EMPLOYER - GET APPLICANTS FOR OWN JOB
// GET /api/applications/job/:jobId
// =====================================================

router.get(
  "/job/:jobId",
  authMiddleware,
  employerMiddleware,
  async (req, res) => {
    try {
      if (!mongoose.Types.ObjectId.isValid(req.params.jobId)) {
        return res.status(404).json({ message: "Job not found" });
      }

      const job = await Job.findById(req.params.jobId);
      if (!job) return res.status(404).json({ message: "Job not found" });
      if (String(job.createdBy) !== String(req.userId)) {
        return res
          .status(403)
          .json({ message: "You cannot view applicants for this job" });
      }

      const applications = await Application.find({ job: job._id })
        .populate("applicant", "name email phone resumeURL")
        .sort({ createdAt: -1 });

      return res.status(200).json({ applications });
    } catch (error) {
      console.error("GET APPLICANTS ERROR:", error);
      return res.status(500).json({ message: "Failed to load applicants" });
    }
  },
);

// =====================================================
// GET - SINGLE APPLICATION
// GET /api/applications/:id
// =====================================================

router.get("/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    // Validate MongoDB ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid application ID",
      });
    }

    const application = await Application.findOne({
      _id: id,
      $or: [{ userId: req.userId }, { applicant: req.userId }],
    });

    if (!application) {
      return res.status(404).json({
        message: "Application not found",
      });
    }

    return res.status(200).json({
      application,
    });
  } catch (error) {
    console.error("GET APPLICATION ERROR:", error);

    return res.status(500).json({
      message: error.message || "Failed to get application",
    });
  }
});

// =====================================================
// ADMIN - UPDATE APPLICATION STATUS
//
// PATCH /api/applications/:id/status
//
// Allowed:
// Applied
// Approved
// Rejected
// =====================================================

router.patch("/:id/status", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    console.log("=================================");
    console.log("UPDATE APPLICATION STATUS");
    console.log("APPLICATION ID:", id);
    console.log("NEW STATUS:", status);

    // -----------------------------
    // VALIDATE APPLICATION ID
    // -----------------------------

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid application ID",
      });
    }

    // -----------------------------
    // ALLOWED STATUSES
    // -----------------------------

    const allowedStatuses = [
      "APPLIED",
      "UNDER_REVIEW",
      "INTERVIEW_SCHEDULED",
      "SELECTED",
      "REJECTED",
      "Applied",
      "Approved",
      "Rejected",
    ];

    if (!status) {
      return res.status(400).json({
        message: "Status is required",
      });
    }

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        message: "Invalid application status",
        allowedStatuses,
      });
    }

    // -----------------------------
    // FIND APPLICATION
    // -----------------------------

    const application = await Application.findById(id);

    if (!application) {
      return res.status(404).json({
        message: "Application not found",
      });
    }

    const requester = await User.findById(req.userId).select("role");
    const isAdmin = requester?.role === "admin";
    const ownsJob =
      application.employer &&
      String(application.employer) === String(req.userId);

    if (!isAdmin && !ownsJob) {
      return res.status(403).json({
        message: "You are not authorized to manage this application",
      });
    }

    console.log("OLD STATUS:", application.status);

    // -----------------------------
    // UPDATE STATUS
    // -----------------------------

    application.status = status;

    await application.save();

    if (!isAdmin && requester?.role === "employer" && application.userId) {
      const statusNotification = {
        UNDER_REVIEW: {
          type: "APPLICATION_STATUS_CHANGED",
          title: "Application Under Review",
          message: "Your application is now under review.",
        },
        SELECTED: {
          type: "JOB_SELECTED",
          title: "Application Selected",
          message: "Congratulations! Your application has been selected.",
        },
        REJECTED: {
          type: "JOB_REJECTED",
          title: "Application Status Updated",
          message: "Your application status has been updated.",
        },
        INTERVIEW_SCHEDULED: {
          type: "APPLICATION_STATUS_CHANGED",
          title: "Application Moved to Interview",
          message: "Your application has moved to the interview stage.",
        },
      }[status];

      if (statusNotification) {
        await createNotification({
          recipient: application.userId,
          ...statusNotification,
          relatedJob: application.job,
          relatedApplication: application._id,
        });
      }
    }

    console.log("NEW STATUS:", application.status);
    console.log("STATUS UPDATED SUCCESSFULLY");
    console.log("=================================");

    return res.status(200).json({
      message: `Application ${status.toLowerCase()} successfully`,
      application,
    });
  } catch (error) {
    console.error("UPDATE APPLICATION STATUS ERROR:", error);

    return res.status(500).json({
      message: error.message || "Failed to update application status",
    });
  }
});

// =====================================================
// DELETE - CANCEL APPLICATION
// DELETE /api/applications/:id
// =====================================================

router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    // Validate MongoDB ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid application ID",
      });
    }

    const application = await Application.findOneAndDelete({
      _id: id,
      userId: req.userId,
    });

    if (!application) {
      return res.status(404).json({
        message: "Application not found",
      });
    }

    console.log("APPLICATION DELETED:", application._id);

    return res.status(200).json({
      message: "Application deleted successfully",
    });
  } catch (error) {
    console.error("DELETE APPLICATION ERROR:", error);

    return res.status(500).json({
      message: error.message || "Failed to delete application",
    });
  }
});

// =====================================================
// EXPORT ROUTER
// =====================================================

module.exports = router;
