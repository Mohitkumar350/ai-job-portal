const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");

// ===============================
// ROUTES
// ===============================

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const savedJobRoutes = require("./routes/savedJobRoutes");
const applicationsRoutes = require("./routes/applications");
const adminRoutes = require("./routes/adminRoutes");
const jobRoutes = require("./routes/jobRoutes");
const companyRoutes = require("./routes/companyRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const interviewRoutes = require("./routes/interviewRoutes");
const analyticsRoutes = require("./routes/analyticsRoutes");
const recommendationRoutes = require("./routes/recommendationRoutes");

const app = express();

// ===============================
// CORS CONFIGURATION
// ===============================

const allowedOrigins = [
  // Local development
  "http://localhost:5173",
  "http://localhost:3000",

  // Vercel production
  "https://ai-job-portal-ehk1-two.vercel.app",

  // Render environment variable
  process.env.CLIENT_URL,
].filter(Boolean);

console.log("=================================");
console.log("Allowed CORS Origins:");
console.log(allowedOrigins);
console.log("=================================");

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests from Postman, curl, mobile apps etc.
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      console.log("❌ CORS BLOCKED:", origin);

      return callback(new Error(`CORS blocked for origin: ${origin}`));
    },

    credentials: true,

    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],

    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

// ===============================
// BODY PARSER
// ===============================

app.use(
  express.json({
    limit: "2mb",
  }),
);

app.use(
  express.urlencoded({
    extended: true,
    limit: "2mb",
  }),
);

// ===============================
// SECURITY HEADERS
// ===============================

app.use((req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");

  res.setHeader("X-Frame-Options", "DENY");

  res.setHeader("X-XSS-Protection", "1; mode=block");

  next();
});

// ===============================
// ROOT ROUTE
// ===============================

app.get("/", (req, res) => {
  res.status(200).send("🚀 MohiJobs backend is running!");
});

// ===============================
// HEALTH CHECK
// ===============================

app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "MohiJobs API is healthy",
  });
});

// ===============================
// API ROUTES
// ===============================

app.use("/api/auth", authRoutes);

app.use("/api/user", userRoutes);

app.use("/api/saved-jobs", savedJobRoutes);

app.use("/api/applications", applicationsRoutes);

app.use("/api/admin", adminRoutes);

app.use("/api/jobs", jobRoutes);

app.use("/api/company", companyRoutes);

app.use("/api/notifications", notificationRoutes);

app.use("/api/interviews", interviewRoutes);

app.use("/api/analytics", analyticsRoutes);

app.use("/api/recommendations", recommendationRoutes);

// ===============================
// API 404 HANDLER
// ===============================

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
});

// ===============================
// GLOBAL ERROR HANDLER
// ===============================

app.use((err, req, res, next) => {
  console.error("❌ Unhandled Server Error:", err);

  const status = err.status || 500;

  const message =
    process.env.NODE_ENV === "production"
      ? "Internal Server Error"
      : err.message || "Internal Server Error";

  res.status(status).json({
    success: false,
    message,
  });
});

// ===============================
// SERVER START
// ===============================

const PORT = process.env.PORT || 5000;

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 MohiJobs server running on port ${PORT}`);

      console.log(`🌐 Port: ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("❌ Database connection failed:", error);

    process.exit(1);
  });
