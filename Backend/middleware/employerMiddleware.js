const User = require("../models/User");

const employerMiddleware = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId).select("role");

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    if (user.role !== "employer") {
      return res.status(403).json({ message: "Employer access required" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("EMPLOYER MIDDLEWARE ERROR:", error);
    return res.status(500).json({ message: "Failed to verify employer" });
  }
};

module.exports = employerMiddleware;
