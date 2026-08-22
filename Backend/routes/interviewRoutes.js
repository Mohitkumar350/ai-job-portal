const express = require("express");
const mongoose = require("mongoose");
const Interview = require("../models/Interview");
const Application = require("../models/Application");
const User = require("../models/User");
const Job = require("../models/Job");
const Notification = require("../models/Notification");
const authMiddleware = require("../middleware/authMiddleware");
const employerMiddleware = require("../middleware/employerMiddleware");

const router = express.Router();
const durations = [30, 45, 60];
const types = ["ONLINE", "IN_PERSON"];

const createNotification = async (data) => {
  try {
    await Notification.create(data);
  } catch (error) {
    console.error("CREATE INTERVIEW NOTIFICATION ERROR:", error);
  }
};

const candidateMiddleware = async (req, res, next) => {
  const user = await User.findById(req.userId).select("role");
  if (!user) return res.status(401).json({ message: "User not found" });
  if (!["user", "candidate", "job_seeker"].includes(user.role))
    return res.status(403).json({ message: "Job seeker access required" });
  next();
};

const validateSchedule = (body) => {
  const date = new Date(body.scheduledAt);
  if (!body.scheduledAt || Number.isNaN(date.getTime()) || date <= new Date())
    return "Interview time must be a valid future date";
  if (!durations.includes(Number(body.duration)))
    return "Duration must be 30, 45, or 60 minutes";
  if (!types.includes(body.interviewType)) return "Invalid interview type";
  if (
    body.interviewType === "ONLINE" &&
    !/^https?:\/\//i.test(String(body.meetingLink || ""))
  )
    return "A valid online meeting link is required";
  if (body.interviewType === "IN_PERSON" && !String(body.location || "").trim())
    return "A location is required for in-person interviews";
  return null;
};

const overlaps = (start, duration, other) => {
  const end = new Date(start).getTime() + Number(duration) * 60000;
  const otherEnd =
    new Date(other.scheduledAt).getTime() + Number(other.duration) * 60000;
  return (
    new Date(start).getTime() < otherEnd &&
    end > new Date(other.scheduledAt).getTime()
  );
};

const ownedInterview = async (id, employerId) => {
  if (!mongoose.Types.ObjectId.isValid(id)) return null;
  return Interview.findOne({ _id: id, employer: employerId }).populate(
    "job application candidate",
    "title company name email phone",
  );
};

router.post("/", authMiddleware, employerMiddleware, async (req, res) => {
  try {
    const { applicationId } = req.body;
    if (!mongoose.Types.ObjectId.isValid(applicationId))
      return res.status(400).json({ message: "Valid application is required" });
    const validationError = validateSchedule(req.body);
    if (validationError)
      return res.status(400).json({ message: validationError });

    const application = await Application.findById(applicationId);
    if (!application || !application.job || !application.applicant)
      return res.status(404).json({ message: "Application not found" });
    if (["REJECTED", "Rejected"].includes(application.status))
      return res
        .status(400)
        .json({
          message: "Cannot schedule an interview for a rejected application",
        });
    const job = await Job.findById(application.job);
    if (!job) return res.status(404).json({ message: "Job not found" });
    if (String(job.createdBy) !== String(req.userId))
      return res
        .status(403)
        .json({ message: "You are not authorized to schedule this interview" });

    const existing = await Interview.find({
      status: "SCHEDULED",
      $or: [{ candidate: application.applicant }, { employer: req.userId }],
    });
    if (
      existing.some((interview) =>
        overlaps(req.body.scheduledAt, req.body.duration, interview),
      )
    )
      return res
        .status(409)
        .json({
          message:
            "Interview time conflicts with an existing scheduled interview",
        });

    const interview = await Interview.create({
      application: application._id,
      job: job._id,
      candidate: application.applicant,
      employer: req.userId,
      scheduledAt: new Date(req.body.scheduledAt),
      duration: Number(req.body.duration),
      interviewType: req.body.interviewType,
      meetingLink:
        req.body.interviewType === "ONLINE" ? req.body.meetingLink.trim() : "",
      location:
        req.body.interviewType === "IN_PERSON" ? req.body.location.trim() : "",
      notes: String(req.body.notes || "").trim(),
    });
    application.status = "INTERVIEW_SCHEDULED";
    await application.save();

    await createNotification({
      recipient: application.applicant,
      type: "INTERVIEW_SCHEDULED",
      title: "Interview Scheduled",
      message: `Your interview for ${job.title} has been scheduled.`,
      relatedInterview: interview._id,
      relatedApplication: application._id,
      relatedJob: job._id,
    });
    res
      .status(201)
      .json({ message: "Interview scheduled successfully", interview });
  } catch (error) {
    console.error("CREATE INTERVIEW ERROR:", error);
    res.status(500).json({ message: "Failed to schedule interview" });
  }
});

router.get("/upcoming", authMiddleware, async (req, res) => {
  const user = await User.findById(req.userId).select("role");
  const field = user?.role === "employer" ? "employer" : "candidate";
  const interviews = await Interview.find({
    [field]: req.userId,
    status: "SCHEDULED",
    scheduledAt: { $gte: new Date() },
  })
    .populate("job", "title company")
    .populate("candidate", "name email")
    .sort({ scheduledAt: 1 });
  res.json({ interviews });
});

router.get("/my", authMiddleware, async (req, res) => {
  const user = await User.findById(req.userId).select("role");
  const field = user?.role === "employer" ? "employer" : "candidate";
  const interviews = await Interview.find({ [field]: req.userId })
    .populate("job", "title company")
    .populate("candidate", "name email")
    .sort({ scheduledAt: 1 });
  res.json({ interviews });
});

router.get("/:id", authMiddleware, async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id))
    return res.status(404).json({ message: "Interview not found" });
  const interview = await Interview.findOne({
    _id: req.params.id,
    $or: [{ candidate: req.userId }, { employer: req.userId }],
  })
    .populate("job", "title company location")
    .populate("candidate", "name email")
    .populate("employer", "name email");
  if (!interview)
    return res.status(404).json({ message: "Interview not found" });
  res.json({ interview });
});

router.patch("/:id", authMiddleware, employerMiddleware, async (req, res) => {
  try {
    const interview = await ownedInterview(req.params.id, req.userId);
    if (!interview)
      return res.status(404).json({ message: "Interview not found" });
    if (interview.status !== "SCHEDULED")
      return res
        .status(400)
        .json({ message: "Only scheduled interviews can be updated" });
    const body = {
      scheduledAt: req.body.scheduledAt || interview.scheduledAt,
      duration: req.body.duration || interview.duration,
      interviewType: req.body.interviewType || interview.interviewType,
      meetingLink: req.body.meetingLink ?? interview.meetingLink,
      location: req.body.location ?? interview.location,
    };
    const validationError = validateSchedule(body);
    if (validationError)
      return res.status(400).json({ message: validationError });
    const existing = await Interview.find({
      _id: { $ne: interview._id },
      status: "SCHEDULED",
      $or: [{ candidate: interview.candidate }, { employer: req.userId }],
    });
    if (
      existing.some((item) => overlaps(body.scheduledAt, body.duration, item))
    )
      return res
        .status(409)
        .json({
          message:
            "Interview time conflicts with an existing scheduled interview",
        });
    Object.assign(interview, {
      ...body,
      scheduledAt: new Date(body.scheduledAt),
      duration: Number(body.duration),
      meetingLink:
        body.interviewType === "ONLINE" ? body.meetingLink.trim() : "",
      location: body.interviewType === "IN_PERSON" ? body.location.trim() : "",
    });
    await interview.save();
    res.json({ message: "Interview updated successfully", interview });
  } catch (error) {
    console.error("UPDATE INTERVIEW ERROR:", error);
    res.status(500).json({ message: "Failed to update interview" });
  }
});

router.patch(
  "/:id/cancel",
  authMiddleware,
  employerMiddleware,
  async (req, res) => {
    const interview = await Interview.findOne({
      _id: req.params.id,
      employer: req.userId,
    });
    if (!interview)
      return res.status(404).json({ message: "Interview not found" });
    if (interview.status !== "SCHEDULED")
      return res
        .status(400)
        .json({ message: "Interview is no longer scheduled" });
    interview.status = "CANCELLED";
    await interview.save();
    await createNotification({
      recipient: interview.candidate,
      type: "INTERVIEW_CANCELLED",
      title: "Interview Cancelled",
      message: "Your interview has been cancelled.",
      relatedInterview: interview._id,
      relatedApplication: interview.application,
      relatedJob: interview.job,
    });
    res.json({ message: "Interview cancelled successfully", interview });
  },
);

module.exports = router;
