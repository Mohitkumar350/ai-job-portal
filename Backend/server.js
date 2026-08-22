const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");

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

// Security & CORS configuration
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  process.env.CLIENT_URL,
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or curl) or if in allowedOrigins
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  }),
);
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true, limit: "2mb" }));

// Security Headers Middleware
app.use((req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("X-XSS-Protection", "1; mode=block");
  next();
});

// API Routes
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

app.get("/", (req, res) => {
  res.send("🚀 MohiJobs backend is running!");
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error("Unhandled Server Error:", err);
  const status = err.status || 500;
  const message =
    process.env.NODE_ENV === "production"
      ? "Internal Server Error"
      : err.message || "Internal Server Error";
  res.status(status).json({ success: false, message });
});

const PORT = process.env.PORT || 5000;

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error("❌ Database connection failed:", error);
  });
