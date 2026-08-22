const express = require("express");
const mongoose = require("mongoose");
const Job = require("../models/Job");
const Application = require("../models/Application");
const Interview = require("../models/Interview");
const authMiddleware = require("../middleware/authMiddleware");
const employerMiddleware = require("../middleware/employerMiddleware");

const router = express.Router();
const ranges = new Set(["7d", "30d", "90d", "all"]);
const statuses = [
  "APPLIED",
  "UNDER_REVIEW",
  "INTERVIEW_SCHEDULED",
  "SELECTED",
  "REJECTED",
];

router.get(
  "/employer",
  authMiddleware,
  employerMiddleware,
  async (req, res) => {
    try {
      const range = ranges.has(req.query.range) ? req.query.range : "all";
      const jobs = await Job.find({ createdBy: req.userId })
        .select("_id title company status createdAt")
        .lean();
      const jobIds = jobs.map((job) => job._id);
      const since =
        range === "all"
          ? null
          : new Date(Date.now() - Number(range.replace("d", "")) * 86400000);
      const applicationMatch = {
        $or: [
          { job: { $in: jobIds } },
          { employer: new mongoose.Types.ObjectId(req.userId) },
        ],
      };
      if (since) applicationMatch.createdAt = { $gte: since };

      const applications = await Application.find(applicationMatch)
        .select("job jobId status title company createdAt")
        .lean();
      const normalizeStatus = (status) =>
        ({ Applied: "APPLIED", Approved: "SELECTED", Rejected: "REJECTED" })[
          status
        ] || status;
      const statusCounts = Object.fromEntries(
        statuses.map((status) => [status, 0]),
      );
      const perJob = Object.fromEntries(
        jobs.map((job) => [
          String(job._id),
          {
            jobId: job._id,
            title: job.title,
            company: job.company,
            applications: 0,
            interviews: 0,
            selected: 0,
          },
        ]),
      );
      applications.forEach((application) => {
        const status = normalizeStatus(application.status);
        if (statusCounts[status] !== undefined) statusCounts[status] += 1;
        const job = application.job && perJob[String(application.job)];
        if (job) {
          job.applications += 1;
          if (status === "SELECTED") job.selected += 1;
        }
      });

      const interviewMatch = {
        employer: new mongoose.Types.ObjectId(req.userId),
      };
      if (since) interviewMatch.createdAt = { $gte: since };
      const interviews = await Interview.find(interviewMatch)
        .select("job status scheduledAt createdAt")
        .lean();
      const interviewCounts = {
        total: interviews.length,
        upcoming: 0,
        completed: 0,
        cancelled: 0,
      };
      const now = new Date();
      interviews.forEach((interview) => {
        if (interview.status === "COMPLETED") interviewCounts.completed += 1;
        if (interview.status === "CANCELLED") interviewCounts.cancelled += 1;
        if (
          interview.status === "SCHEDULED" &&
          new Date(interview.scheduledAt) >= now
        )
          interviewCounts.upcoming += 1;
        const job = interview.job && perJob[String(interview.job)];
        if (job && interview.status !== "CANCELLED") job.interviews += 1;
      });

      const trendDays = range === "all" ? 7 : Number(range.replace("d", ""));
      const trendStart =
        since || new Date(Date.now() - (trendDays - 1) * 86400000);
      const trendMap = {};
      for (let index = 0; index < trendDays; index += 1) {
        const date = new Date(trendStart);
        date.setDate(trendStart.getDate() + index);
        trendMap[date.toISOString().slice(0, 10)] = 0;
      }
      applications.forEach((application) => {
        const key = new Date(application.createdAt).toISOString().slice(0, 10);
        if (trendMap[key] !== undefined) trendMap[key] += 1;
      });

      const totalApplications = applications.length;
      const selected = statusCounts.SELECTED;
      const interviewScheduled = statusCounts.INTERVIEW_SCHEDULED;
      res.json({
        range,
        summary: {
          totalJobs: jobs.length,
          activeJobs: jobs.filter((job) => job.status === "ACTIVE").length,
          totalApplications,
          underReview: statusCounts.UNDER_REVIEW,
          interviews: interviewCounts.total,
          selected,
          rejected: statusCounts.REJECTED,
          selectionRate: totalApplications
            ? Number(((selected / totalApplications) * 100).toFixed(1))
            : 0,
          interviewRate: totalApplications
            ? Number(
                ((interviewScheduled / totalApplications) * 100).toFixed(1),
              )
            : 0,
        },
        statuses: statusCounts,
        interviews: interviewCounts,
        jobs: Object.values(perJob),
        trend: Object.entries(trendMap).map(([date, applicationsCount]) => ({
          date,
          applications: applicationsCount,
        })),
      });
    } catch (error) {
      console.error("EMPLOYER ANALYTICS ERROR:", error);
      res.status(500).json({ message: "Unable to load analytics" });
    }
  },
);

module.exports = router;
