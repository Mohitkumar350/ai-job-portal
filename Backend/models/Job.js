const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    company: { type: String, required: true, trim: true },
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      index: true,
    },
    description: { type: String, required: true, trim: true },
    location: { type: String, required: true, trim: true },
    salaryMin: { type: Number, min: 0 },
    salaryMax: { type: Number, min: 0 },
    experience: { type: String, required: true, trim: true },
    employmentType: {
      type: String,
      required: true,
      enum: ["Full-Time", "Part-Time", "Internship", "Contract"],
    },
    workMode: {
      type: String,
      required: true,
      enum: ["Remote", "On-site", "Hybrid"],
    },
    skills: { type: [String], default: [] },
    requirements: { type: [String], default: [] },
    benefits: { type: [String], default: [] },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    status: {
      type: String,
      enum: ["ACTIVE", "CLOSED", "DRAFT"],
      default: "ACTIVE",
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Job", jobSchema);
