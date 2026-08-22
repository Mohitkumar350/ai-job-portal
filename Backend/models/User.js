const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    // ==========================================
    // BASIC USER INFORMATION
    // ==========================================

    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: false,
      unique: true,
      sparse: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: false,
      default: "",
    },

    // ==========================================
    // FIREBASE PHONE AUTH
    // ==========================================

    firebaseUid: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
    },

    phone: {
      type: String,
      default: "",
      trim: true,
    },

    // ==========================================
    // ROLE
    // ==========================================

    role: {
      type: String,
      enum: ["user", "admin", "candidate", "job_seeker", "employer"],
      default: "job_seeker",
    },

    // ==========================================
    // PROFILE INFORMATION
    // ==========================================

    location: {
      type: String,
      default: "",
      trim: true,
    },

    bio: {
      type: String,
      default: "",
      trim: true,
    },

    photoURL: {
      type: String,
      default: "",
      trim: true,
    },

    resumeURL: {
      type: String,
      default: "",
      trim: true,
    },

    skills: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("User", userSchema);
