const mongoose = require("mongoose");

const companySchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },
    name: { type: String, required: true, trim: true },
    logo: { type: String, default: "" },
    description: { type: String, default: "", trim: true, maxlength: 2000 },
    industry: { type: String, default: "", trim: true },
    location: { type: String, default: "", trim: true },
    website: { type: String, default: "", trim: true },
    companySize: { type: String, default: "", trim: true },
    foundedYear: { type: Number, min: 1800, max: new Date().getFullYear() },
    contactEmail: { type: String, default: "", trim: true, lowercase: true },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Company", companySchema);
