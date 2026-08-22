const mongoose = require("mongoose");

const interviewSchema = new mongoose.Schema(
  {
    application: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Application",
      required: true,
    },
    job: { type: mongoose.Schema.Types.ObjectId, ref: "Job", required: true },
    candidate: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    employer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    scheduledAt: { type: Date, required: true },
    duration: { type: Number, enum: [30, 45, 60], default: 30 },
    interviewType: {
      type: String,
      enum: ["ONLINE", "IN_PERSON"],
      required: true,
    },
    meetingLink: { type: String, default: "" },
    location: { type: String, default: "" },
    notes: { type: String, default: "", maxlength: 2000 },
    status: {
      type: String,
      enum: ["SCHEDULED", "COMPLETED", "CANCELLED"],
      default: "SCHEDULED",
    },
  },
  { timestamps: true },
);

interviewSchema.index({ candidate: 1, scheduledAt: 1, status: 1 });
interviewSchema.index({ employer: 1, scheduledAt: 1, status: 1 });

module.exports = mongoose.model("Interview", interviewSchema);
