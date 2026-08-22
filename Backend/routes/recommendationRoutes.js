const express = require("express");
const mongoose = require("mongoose");
const Job = require("../models/Job");
const User = require("../models/User");
const Application = require("../models/Application");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

const normalizeText = (text) =>
  String(text || "")
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter(Boolean);

// =====================================================
// GET /api/recommendations/jobs
// =====================================================

router.get("/jobs", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const userSkills = (user.skills || []).map((s) => s.trim().toLowerCase());
    const userBio = user.bio || "";
    const userLocation = (user.location || "").toLowerCase().trim();

    // Check if user has sufficient profile/skills data
    const hasProfileData = userSkills.length > 0 || userBio.trim().length > 10;

    // Fetch active jobs from DB
    const dbJobs = await Job.find({ status: "ACTIVE" }).sort({ createdAt: -1 }).lean();

    // Fetch user's existing applications to mark applied status
    const userApplications = await Application.find({ userId: req.userId }).select("jobId").lean();
    const appliedJobIds = new Set(userApplications.map((app) => String(app.jobId)));

    if (!hasProfileData) {
      return res.json({
        hasProfileData: false,
        message: "Upload your resume or add skills to your profile to get personalized AI job recommendations.",
        recommendations: [],
      });
    }

    const userSkillSet = new Set(userSkills);
    const userBioTokens = new Set(normalizeText(userBio));

    const recommendations = dbJobs.map((job) => {
      const jobSkills = (job.skills || []).map((s) => s.trim().toLowerCase());
      const jobReqs = (job.requirements || []).flatMap(normalizeText);
      const allJobSkillTerms = [...new Set([...jobSkills, ...jobReqs])];

      // 1. Skill Match Score (60%)
      let matchedSkills = [];
      let missingSkills = [];

      if (jobSkills.length > 0) {
        matchedSkills = jobSkills.filter(
          (skill) =>
            userSkillSet.has(skill) ||
            userSkills.some((us) => us.includes(skill) || skill.includes(us)) ||
            userBioTokens.has(skill),
        );
        missingSkills = jobSkills.filter((skill) => !matchedSkills.includes(skill));
      } else {
        matchedSkills = userSkills.filter((skill) =>
          normalizeText(job.description + " " + job.title).includes(skill),
        );
      }

      const skillRatio =
        jobSkills.length > 0
          ? matchedSkills.length / jobSkills.length
          : matchedSkills.length > 0
            ? 0.75
            : 0.3;
      const skillScore = Math.min(100, Math.round(skillRatio * 100));

      // 2. Role Relevance Score (20%)
      const jobTitleTokens = normalizeText(job.title);
      const titleMatchCount = jobTitleTokens.filter(
        (token) => userBioTokens.has(token) || userSkills.some((s) => s.includes(token)),
      ).length;
      const roleScore =
        jobTitleTokens.length > 0
          ? Math.min(
              100,
              Math.round(
                (titleMatchCount / jobTitleTokens.length) * 100 +
                  (titleMatchCount > 0 ? 30 : 10),
              ),
            )
          : 50;

      // 3. Experience Compatibility (10%)
      let expScore = 70; // baseline
      const jobExp = String(job.experience || "").toLowerCase();
      if (
        userBio.toLowerCase().includes(jobExp) ||
        jobExp.includes("fresher") ||
        jobExp.includes("entry")
      ) {
        expScore = 95;
      }

      // 4. Location / Work Mode Compatibility (10%)
      let locScore = 60;
      if (job.workMode === "Remote") {
        locScore = 100;
      } else if (
        userLocation &&
        String(job.location || "").toLowerCase().includes(userLocation)
      ) {
        locScore = 100;
      }

      // Weighted Composite Match Score (0 - 100%)
      const finalScore = Math.min(
        99,
        Math.max(
          15,
          Math.round(
            skillScore * 0.6 +
              roleScore * 0.2 +
              expScore * 0.1 +
              locScore * 0.1,
          ),
        ),
      );

      // Generate "Why this job matches"
      const matchReasons = [];
      if (matchedSkills.length > 0) {
        matchReasons.push(
          `Matches ${matchedSkills.length} of your core skill${matchedSkills.length > 1 ? "s" : ""} (${matchedSkills.slice(0, 3).join(", ")})`,
        );
      }
      if (job.workMode === "Remote") {
        matchReasons.push("Offers remote flexibility");
      } else if (
        userLocation &&
        String(job.location || "").toLowerCase().includes(userLocation)
      ) {
        matchReasons.push(`Located in your preferred area (${job.location})`);
      }
      if (roleScore >= 60) {
        matchReasons.push("Strong alignment with your career background");
      }

      const matchExplanation =
        matchReasons.length > 0
          ? matchReasons.join(" • ")
          : "Matches general requirements for this career track";

      return {
        id: job._id,
        title: job.title,
        company: job.company,
        location: job.location,
        salary:
          job.salaryMin || job.salaryMax
            ? `${job.salaryMin || ""} - ${job.salaryMax || ""}`
            : "Competitive",
        experience: job.experience,
        type: job.employmentType,
        workMode: job.workMode,
        skills: job.skills,
        description: job.description,
        posted: job.createdAt,
        matchScore: finalScore,
        matchedSkills,
        missingSkills,
        matchExplanation,
        hasApplied: appliedJobIds.has(String(job._id)),
      };
    });

    // Sort by match score descending
    recommendations.sort((a, b) => b.matchScore - a.matchScore);

    res.json({
      hasProfileData: true,
      totalRecommendations: recommendations.length,
      recommendations,
    });
  } catch (error) {
    console.error("RECOMMENDATIONS ERROR:", error);
    res.status(500).json({ message: "Failed to generate job recommendations" });
  }
});

module.exports = router;
