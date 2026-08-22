const mongoose = require("mongoose");

const savedJobSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    jobId: {
      type: String,
      required: true,
    },

    title: {
      type: String,
      required: true,
    },

    company: {
      type: String,
      required: true,
    },

    location: {
      type: String,
      default: "",
    },

    salary: {
      type: String,
      default: "",
    },

    experience: {
      type: String,
      default: "",
    },

    type: {
      type: String,
      default: "",
    },

    skills: {
      type: [String],
      default: [],
    },

    posted: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  },
);

savedJobSchema.index(
  {
    userId: 1,
    jobId: 1,
  },
  {
    unique: true,
  },
);

module.exports = mongoose.model("SavedJob", savedJobSchema);
