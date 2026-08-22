const express = require("express");
const mongoose = require("mongoose");
const Job = require("../models/Job");
const authMiddleware = require("../middleware/authMiddleware");
const employerMiddleware = require("../middleware/employerMiddleware");
const Company = require("../models/Company");

const router = express.Router();
const JOB_API = "https://himalayas.app/jobs/api?limit=50&offset=0";

const findExternalJob = (jobs, id) => {
  const fallbackMatch = /^live-(\d+)$/.exec(String(id));

  if (fallbackMatch) {
    return jobs[Number(fallbackMatch[1])];
  }

  return jobs.find((job) => String(job.id) === String(id));
};

const normalizeType = (value) =>
  ({
    "Full Time": "Full-Time",
    "Full-time": "Full-Time",
    "Part Time": "Part-Time",
    "Part-time": "Part-Time",
    Remote: "Remote",
  })[value] || value;

const normalizeWorkMode = (value) => (value === "On-Site" ? "On-site" : value);

const parseSalary = (value) => {
  const numbers = String(value || "").match(/\d[\d,]*/g);
  return numbers ? numbers.map((item) => Number(item.replace(/,/g, ""))) : [];
};

const matchesSearch = (job, query) => {
  if (!query) return true;
  const searchable = [
    job.title,
    job.company,
    job.description,
    job.location,
    ...(job.skills || []),
  ]
    .join(" ")
    .toLowerCase();
  return searchable.includes(query.toLowerCase());
};

const matchesSalary = (job, minSalary, maxSalary) => {
  const salaryValues =
    job.salaryMin !== undefined
      ? [job.salaryMin, job.salaryMax].filter((value) => value !== undefined)
      : parseSalary(job.salary);
  if ((minSalary || maxSalary) && salaryValues.length === 0) return false;
  if (minSalary && Math.max(...salaryValues) < minSalary) return false;
  if (maxSalary && Math.min(...salaryValues) > maxSalary) return false;
  return true;
};

const matchesFilters = (job, filters) =>
  matchesSearch(job, filters.query) &&
  (!filters.location ||
    String(job.location || "")
      .toLowerCase()
      .includes(filters.location.toLowerCase())) &&
  (!filters.type || normalizeType(job.type) === filters.type) &&
  (!filters.workMode ||
    String(job.workMode || job.location || "")
      .toLowerCase()
      .includes(filters.workMode.toLowerCase())) &&
  (!filters.experience ||
    String(job.experience || "")
      .toLowerCase()
      .includes(filters.experience.toLowerCase())) &&
  (!filters.skill ||
    (job.skills || []).some((skill) =>
      String(skill).toLowerCase().includes(filters.skill.toLowerCase()),
    )) &&
  matchesSalary(job, filters.minSalary, filters.maxSalary);

const splitLines = (value) => {
  if (Array.isArray(value))
    return value
      .map(String)
      .map((item) => item.trim())
      .filter(Boolean);
  return String(value || "")
    .split(/\r?\n|,/)
    .map((item) => item.trim())
    .filter(Boolean);
};

const validateJob = (body) => {
  const required = [
    "title",
    "company",
    "description",
    "location",
    "experience",
    "employmentType",
    "workMode",
  ];
  const missing = required.filter((field) => !String(body[field] || "").trim());
  if (missing.length) return `Missing required fields: ${missing.join(", ")}`;
  if (
    !Job.schema.path("employmentType").enumValues.includes(body.employmentType)
  )
    return "Invalid employment type";
  if (!Job.schema.path("workMode").enumValues.includes(body.workMode))
    return "Invalid work mode";
  if (
    body.salaryMin !== undefined &&
    body.salaryMin !== "" &&
    Number(body.salaryMin) < 0
  )
    return "Salary minimum cannot be negative";
  if (
    body.salaryMax !== undefined &&
    body.salaryMax !== "" &&
    Number(body.salaryMax) < 0
  )
    return "Salary maximum cannot be negative";
  if (
    body.salaryMin !== undefined &&
    body.salaryMax !== undefined &&
    body.salaryMin !== "" &&
    body.salaryMax !== "" &&
    Number(body.salaryMin) > Number(body.salaryMax)
  )
    return "Salary minimum cannot exceed salary maximum";
  return null;
};

const formatSalaryInINR = (min, max) => {
  if (!min && !max) return "Competitive (Best in Industry)";
  const toLPA = (val) => {
    if (!val) return "";
    if (val >= 100000)
      return `₹${(val / 100000).toFixed(1).replace(/\.0$/, "")} LPA`;
    return `₹${val.toLocaleString("en-IN")}`;
  };
  if (min && max) return `${toLPA(min)} - ${toLPA(max)}`;
  if (min) return `From ${toLPA(min)}`;
  return `Up to ${toLPA(max)}`;
};

const normalizeJob = (job) => ({
  id: job._id,
  title: job.title,
  company: job.company,
  location: job.location,
  salary: formatSalaryInINR(job.salaryMin, job.salaryMax),
  experience: job.experience,
  type: job.employmentType,
  workMode: job.workMode,
  skills: job.skills,
  description: job.description,
  requirements: job.requirements,
  benefits: job.benefits,
  status: job.status,
  posted: job.createdAt,
  applyUrl: "#",
  createdBy: job.createdBy,
  companyId: job.companyId,
});

router.get("/", async (req, res) => {
  try {
    const page = Math.max(1, Number.parseInt(req.query.page, 10) || 1);
    const limit = Math.min(
      50,
      Math.max(1, Number.parseInt(req.query.limit, 10) || 12),
    );
    const filters = {
      query: String(req.query.keyword || req.query.q || "").trim(),
      location: String(req.query.location || "").trim(),
      type: normalizeType(
        String(req.query.type || req.query.employmentType || "").trim(),
      ),
      workMode: normalizeWorkMode(String(req.query.workMode || "").trim()),
      experience: String(req.query.experience || "").trim(),
      skill: String(req.query.skills || req.query.skill || "").trim(),
      minSalary:
        Number(req.query.minSalary) > 0 ? Number(req.query.minSalary) : 0,
      maxSalary:
        Number(req.query.maxSalary) > 0 ? Number(req.query.maxSalary) : 0,
    };
    const response = await fetch(JOB_API);
    const data = response.ok ? await response.json() : { jobs: [] };
    const liveJobs = (data.jobs || []).map((job, index) => ({
      id: job.id || `live-${index}`,
      title: job.title || "Software Engineer",
      company: job.companyName || job.company?.name || "Global Tech",
      logo: job.companyLogo || job.company?.logo || "",
      location: "Remote (India / Global)",
      salary: job.salary ? `₹${job.salary}` : "₹15 - ₹30 LPA (Equivalent)",
      experience: job.seniority || "2-5 Years",
      type: job.employmentType || "Full-Time",
      skills: job.skills || ["React", "Node.js", "JavaScript"],
      posted: job.publishedAt || job.createdAt || "Recently",
      featured: false,
      description:
        job.description ||
        "Exciting developer opportunity with a high-growth engineering team.",
      requirements: [],
      responsibilities: [],
      applyUrl: job.applicationLink || job.url || "#",
    }));
    const employerJobs = await Job.find({ status: "ACTIVE" })
      .sort({ createdAt: -1 })
      .lean();
    const normalizedEmployerJobs = employerJobs.map(normalizeJob);
    const filteredJobs = [...normalizedEmployerJobs, ...liveJobs].filter(
      (job) => matchesFilters(job, filters),
    );
    const sort = ["oldest", "salary-asc", "salary-desc", "newest"].includes(
      req.query.sort,
    )
      ? req.query.sort
      : "newest";
    filteredJobs.sort((first, second) => {
      if (sort === "oldest")
        return new Date(first.posted || 0) - new Date(second.posted || 0);
      if (sort === "salary-asc" || sort === "salary-desc") {
        const firstSalary = Math.max(...parseSalary(first.salary), 0);
        const secondSalary = Math.max(...parseSalary(second.salary), 0);
        return sort === "salary-asc"
          ? firstSalary - secondSalary
          : secondSalary - firstSalary;
      }
      return new Date(second.posted || 0) - new Date(first.posted || 0);
    });
    const totalJobs = filteredJobs.length;
    const totalPages = Math.ceil(totalJobs / limit);
    const start = (page - 1) * limit;
    const jobs = filteredJobs.slice(start, start + limit);
    res.json({
      success: true,
      count: jobs.length,
      totalJobs,
      currentPage: page,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1 && totalPages > 0,
      jobs,
    });
  } catch (error) {
    console.error("JOB LIST ERROR:", error);
    res.status(500).json({ success: false, message: "Failed to fetch jobs" });
  }
});

router.get("/my-jobs", authMiddleware, employerMiddleware, async (req, res) => {
  const jobs = await Job.find({ createdBy: req.userId }).sort({
    createdAt: -1,
  });
  res.json({ jobs: jobs.map(normalizeJob) });
});

router.get("/:id", async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    try {
      const response = await fetch(JOB_API);
      const data = response.ok ? await response.json() : { jobs: [] };
      const externalJob = findExternalJob(data.jobs || [], req.params.id);
      if (externalJob) {
        return res.json({
          job: {
            id: externalJob.id,
            title: externalJob.title || "Job Opportunity",
            company:
              externalJob.companyName || externalJob.company?.name || "Company",
            logo: externalJob.companyLogo || externalJob.company?.logo || "",
            location: externalJob.location || "Remote",
            salary: externalJob.salary || "Salary not specified",
            experience: externalJob.seniority || "Not specified",
            type: externalJob.employmentType || "Full-time",
            skills: externalJob.skills || [],
            posted:
              externalJob.publishedAt || externalJob.createdAt || "Recently",
            description: externalJob.description || "No description available.",
            requirements: [],
            responsibilities: [],
            applyUrl: externalJob.applicationLink || externalJob.url || "#",
          },
        });
      }
    } catch (error) {
      console.error("EXTERNAL JOB DETAILS ERROR:", error);
    }
    return res.status(404).json({ message: "Job not found" });
  }
  const job = await Job.findById(req.params.id);
  if (!job) return res.status(404).json({ message: "Job not found" });
  res.json({ job: normalizeJob(job) });
});

router.post("/", authMiddleware, employerMiddleware, async (req, res) => {
  const validationError = validateJob(req.body);
  if (validationError)
    return res.status(400).json({ message: validationError });
  const job = await Job.create({
    ...req.body,
    salaryMin: req.body.salaryMin === "" ? undefined : req.body.salaryMin,
    salaryMax: req.body.salaryMax === "" ? undefined : req.body.salaryMax,
    skills: splitLines(req.body.skills),
    requirements: splitLines(req.body.requirements),
    benefits: splitLines(req.body.benefits),
    createdBy: req.userId,
    companyId: (await Company.findOne({ owner: req.userId }))?._id,
    status: "ACTIVE",
  });
  res
    .status(201)
    .json({ message: "Job created successfully", job: normalizeJob(job) });
});

router.put("/:id", authMiddleware, employerMiddleware, async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id))
    return res.status(404).json({ message: "Job not found" });
  const validationError = validateJob(req.body);
  if (validationError)
    return res.status(400).json({ message: validationError });
  const job = await Job.findById(req.params.id);
  if (!job) return res.status(404).json({ message: "Job not found" });
  if (String(job.createdBy) !== String(req.userId))
    return res
      .status(403)
      .json({ message: "You can modify only your own jobs" });
  Object.assign(job, {
    ...req.body,
    salaryMin: req.body.salaryMin === "" ? undefined : req.body.salaryMin,
    salaryMax: req.body.salaryMax === "" ? undefined : req.body.salaryMax,
    skills: splitLines(req.body.skills),
    requirements: splitLines(req.body.requirements),
    benefits: splitLines(req.body.benefits),
    companyId: (await Company.findOne({ owner: req.userId }))?._id,
  });
  await job.save();
  res.json({ message: "Job updated successfully", job: normalizeJob(job) });
});

router.delete("/:id", authMiddleware, employerMiddleware, async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id))
    return res.status(404).json({ message: "Job not found" });
  const job = await Job.findById(req.params.id);
  if (!job) return res.status(404).json({ message: "Job not found" });
  if (String(job.createdBy) !== String(req.userId))
    return res
      .status(403)
      .json({ message: "You can delete only your own jobs" });
  await job.deleteOne();
  res.json({ message: "Job deleted successfully" });
});

module.exports = router;
