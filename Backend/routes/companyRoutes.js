const express = require("express");
const mongoose = require("mongoose");
const Company = require("../models/Company");
const Job = require("../models/Job");
const authMiddleware = require("../middleware/authMiddleware");
const employerMiddleware = require("../middleware/employerMiddleware");

const router = express.Router();
const companySizes = ["1-10", "11-50", "51-200", "201-500", "501+"];

const validateCompany = (body) => {
  if (!String(body.name || "").trim()) return "Company name is required";
  if (body.description && body.description.length > 2000)
    return "Description must be 2000 characters or less";
  if (body.website) {
    try {
      const url = new URL(body.website);
      if (!["http:", "https:"].includes(url.protocol))
        return "Website must use http or https";
    } catch {
      return "Please enter a valid website URL";
    }
  }
  if (
    body.contactEmail &&
    !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(body.contactEmail)
  )
    return "Please enter a valid contact email";
  if (body.companySize && !companySizes.includes(body.companySize))
    return "Invalid company size";
  if (body.foundedYear !== undefined && body.foundedYear !== "") {
    const year = Number(body.foundedYear);
    if (
      !Number.isInteger(year) ||
      year < 1800 ||
      year > new Date().getFullYear()
    )
      return "Invalid founded year";
  }
  if (body.logo && !/^data:image\/(jpeg|jpg|png|webp);base64,/i.test(body.logo))
    return "Logo must be a JPG, PNG, or WEBP image";
  if (body.logo && body.logo.length > 700000)
    return "Logo must be smaller than 500KB";
  return null;
};

const cleanCompany = (company) => ({
  id: company._id,
  owner: company.owner,
  name: company.name,
  logo: company.logo,
  description: company.description,
  industry: company.industry,
  location: company.location,
  website: company.website,
  companySize: company.companySize,
  foundedYear: company.foundedYear,
  contactEmail: company.contactEmail,
  createdAt: company.createdAt,
  updatedAt: company.updatedAt,
});

const companyPayload = (body) => ({
  name: String(body.name || "").trim(),
  logo: body.logo || "",
  description: String(body.description || "").trim(),
  industry: String(body.industry || "").trim(),
  location: String(body.location || "").trim(),
  website: String(body.website || "").trim(),
  companySize: String(body.companySize || "").trim(),
  foundedYear: body.foundedYear === "" ? undefined : body.foundedYear,
  contactEmail: String(body.contactEmail || "")
    .trim()
    .toLowerCase(),
});

router.get("/me", authMiddleware, employerMiddleware, async (req, res) => {
  const company = await Company.findOne({ owner: req.userId });
  res.json({ company: company ? cleanCompany(company) : null });
});

router.post("/", authMiddleware, employerMiddleware, async (req, res) => {
  const error = validateCompany(req.body);
  if (error) return res.status(400).json({ message: error });
  if (await Company.exists({ owner: req.userId }))
    return res.status(409).json({ message: "Company profile already exists" });
  const company = await Company.create({
    ...companyPayload(req.body),
    owner: req.userId,
  });
  res
    .status(201)
    .json({
      message: "Company profile created successfully",
      company: cleanCompany(company),
    });
});

router.put("/me", authMiddleware, employerMiddleware, async (req, res) => {
  const error = validateCompany(req.body);
  if (error) return res.status(400).json({ message: error });
  const company = await Company.findOne({ owner: req.userId });
  if (!company)
    return res.status(404).json({ message: "Company profile not found" });
  Object.assign(company, companyPayload(req.body));
  await company.save();
  res.json({
    message: "Company profile updated successfully",
    company: cleanCompany(company),
  });
});

router.get("/:id", async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id))
    return res.status(404).json({ message: "Company not found" });
  const company = await Company.findById(req.params.id);
  if (!company) return res.status(404).json({ message: "Company not found" });
  const jobs = await Job.find({
    companyId: company._id,
    status: "ACTIVE",
  }).sort({ createdAt: -1 });
  res.json({ company: cleanCompany(company), jobs });
});

module.exports = router;
