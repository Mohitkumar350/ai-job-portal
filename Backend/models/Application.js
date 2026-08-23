const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    jobId: { type: String, required: true },

    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
    },

    applicant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    employer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    resume: { type: String, default: "" },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    company: {
      type: String,
      required: true,
      trim: true,
    },

    location: {
      type: String,
      required: true,
      trim: true,
    },

    fullName: {
      type: String,
      required: true,
      trim: true,
    },

    phone: {
      type: String,
      required: true,
      trim: true,
    },

    coverLetter: {
      type: String,
      default: "",
      trim: true,
    },

    status: {
      type: String,
      enum: [
        "APPLIED",
        "UNDER_REVIEW",
        "INTERVIEW_SCHEDULED",
        "SELECTED",
        "REJECTED",
        "Applied",
        "Approved",
        "Rejected",
      ],
      default: "APPLIED",
    },
  },
  {
    timestamps: true,
  },
);

// Prevent duplicate application
applicationSchema.index(
  {
    userId: 1,
    jobId: 1,
  },
  {
    unique: true,
  },
);

module.exports =
  mongoose.models.Application ||
  mongoose.model("Application", applicationSchema);
