const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: [
        "APPLICATION_RECEIVED",
        "APPLICATION_STATUS_CHANGED",
        "JOB_APPLICATION_SUBMITTED",
        "JOB_SELECTED",
        "JOB_REJECTED",
        "COMPANY_UPDATE",
        "INTERVIEW_SCHEDULED",
        "INTERVIEW_CANCELLED",
        "INTERVIEW_SCHEDULED",
        "INTERVIEW_CANCELLED",
      ],
      required: true,
    },
    title: { type: String, required: true, trim: true },
    message: { type: String, required: true, trim: true },
    relatedJob: { type: mongoose.Schema.Types.ObjectId, ref: "Job" },
    relatedApplication: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Application",
    },
    relatedCompany: { type: mongoose.Schema.Types.ObjectId, ref: "Company" },
    relatedInterview: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Interview",
    },
    relatedInterview: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Interview",
    },
    read: { type: Boolean, default: false },
  },
  { timestamps: true },
);

notificationSchema.index({ recipient: 1, read: 1, createdAt: -1 });

module.exports = mongoose.model("Notification", notificationSchema);
