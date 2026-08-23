import { Routes, Route } from "react-router-dom";

import RoleRoute from "../components/RoleRoute/RoleRoute";
import MainLayout from "../layouts/MainLayout";

// ==============================
// PUBLIC PAGES
// ==============================
import Home from "../pages/Home/Home";
import Jobs from "../pages/Jobs/Jobs";
import Companies from "../pages/Companies/Companies";
import Login from "../pages/Login/Login";
import Signup from "../pages/Signup/Signup";
import JobDetails from "../pages/JobDetails/JobDetails";
import CompanyDetails from "../pages/CompanyDetails/CompanyDetails";

// ==============================
// JOB SEEKER PAGES
// ==============================
import Dashboard from "../pages/Dashboard/Dashboard";
import SavedJobs from "../pages/SavedJobs/SavedJobs";
import Profile from "../pages/Profile/Profile";
import ApplyJob from "../pages/ApplyJob/ApplyJob";
import MyApplications from "../pages/MyApplications/MyApplications";
import RecommendedJobs from "../pages/RecommendedJobs/RecommendedJobs";

// ==============================
// AI PAGES
// ==============================
import ResumeAI from "../pages/ResumeAI/ResumeAI";
import InterviewAI from "../pages/InterviewAI/InterviewAI";

// ==============================
// ADMIN
// ==============================
import AdminDashboard from "../pages/Admin/adminDashboard";

// ==============================
// EMPLOYER
// ==============================
import EmployerDashboard from "../pages/Employer/EmployerDashboard";
import EmployerJobs from "../pages/Employer/EmployerJobs";
import CreateJob from "../pages/Employer/CreateJob";
import EditJob from "../pages/Employer/EditJob";
import Applicants from "../pages/Employer/Applicants";
import CompanyProfile from "../pages/Employer/CompanyProfile";
import ScheduleInterview from "../pages/Employer/ScheduleInterview";
import Analytics from "../pages/Employer/Analytics";

// ==============================
// APPLICATIONS
// ==============================
import ApplicationDetails from "../pages/Applications/ApplicationDetails";

// ==============================
// NOTIFICATIONS
// ==============================
import Notifications from "../pages/Notifications/Notifications";

// ==============================
// INTERVIEWS
// ==============================
import Interviews from "../pages/Interviews/Interviews";
import InterviewDetails from "../pages/Interviews/InterviewDetails";

function AppRoutes() {
  return (
    <Routes>
      {/* =====================================================
          MAIN LAYOUT
      ===================================================== */}

      <Route path="/" element={<MainLayout />}>
        {/* =====================================================
            PUBLIC ROUTES
        ===================================================== */}

        <Route index element={<Home />} />

        <Route path="login" element={<Login />} />

        <Route path="signup" element={<Signup />} />

        <Route path="jobs" element={<Jobs />} />

        <Route path="jobs/:id" element={<JobDetails />} />

        <Route path="companies" element={<Companies />} />

        <Route path="companies/:id" element={<CompanyDetails />} />

        {/* =====================================================
            ADMIN ROUTE
        ===================================================== */}

        <Route
          path="admin"
          element={
            <RoleRoute allowedRoles={["admin"]}>
              <AdminDashboard />
            </RoleRoute>
          }
        />

        {/* =====================================================
            EMPLOYER ROUTES
        ===================================================== */}

        <Route
          path="employer/dashboard"
          element={
            <RoleRoute allowedRoles={["employer"]}>
              <EmployerDashboard />
            </RoleRoute>
          }
        />

        <Route
          path="employer/jobs"
          element={
            <RoleRoute allowedRoles={["employer"]}>
              <EmployerJobs />
            </RoleRoute>
          }
        />

        <Route
          path="employer/jobs/new"
          element={
            <RoleRoute allowedRoles={["employer"]}>
              <CreateJob />
            </RoleRoute>
          }
        />

        <Route
          path="employer/jobs/:id/edit"
          element={
            <RoleRoute allowedRoles={["employer"]}>
              <EditJob />
            </RoleRoute>
          }
        />

        <Route
          path="employer/jobs/:jobId/applicants"
          element={
            <RoleRoute allowedRoles={["employer"]}>
              <Applicants />
            </RoleRoute>
          }
        />

        <Route
          path="employer/company"
          element={
            <RoleRoute allowedRoles={["employer"]}>
              <CompanyProfile />
            </RoleRoute>
          }
        />

        <Route
          path="employer/applications/:applicationId/interview"
          element={
            <RoleRoute allowedRoles={["employer"]}>
              <ScheduleInterview />
            </RoleRoute>
          }
        />

        <Route
          path="employer/interviews"
          element={
            <RoleRoute allowedRoles={["employer"]}>
              <Interviews employer />
            </RoleRoute>
          }
        />

        <Route
          path="employer/analytics"
          element={
            <RoleRoute allowedRoles={["employer"]}>
              <Analytics />
            </RoleRoute>
          }
        />

        {/* =====================================================
            JOB SEEKER - RECOMMENDED JOBS
        ===================================================== */}

        <Route
          path="jobs/recommended"
          element={
            <RoleRoute allowedRoles={["user", "candidate", "job_seeker"]}>
              <RecommendedJobs />
            </RoleRoute>
          }
        />

        <Route
          path="dashboard/recommended-jobs"
          element={
            <RoleRoute allowedRoles={["user", "candidate", "job_seeker"]}>
              <RecommendedJobs />
            </RoleRoute>
          }
        />

        {/* =====================================================
            JOB SEEKER - INTERVIEWS
        ===================================================== */}

        <Route
          path="interviews"
          element={
            <RoleRoute allowedRoles={["user", "candidate", "job_seeker"]}>
              <Interviews />
            </RoleRoute>
          }
        />

        <Route
          path="interviews/:id"
          element={
            <RoleRoute
              allowedRoles={["user", "candidate", "job_seeker", "employer"]}
            >
              <InterviewDetails />
            </RoleRoute>
          }
        />

        {/* =====================================================
            APPLICATION DETAILS
        ===================================================== */}

        <Route
          path="applications/:id"
          element={
            <RoleRoute
              allowedRoles={["user", "candidate", "job_seeker", "employer"]}
            >
              <ApplicationDetails />
            </RoleRoute>
          }
        />

        {/* =====================================================
            NOTIFICATIONS
        ===================================================== */}

        <Route
          path="notifications"
          element={
            <RoleRoute
              allowedRoles={[
                "admin",
                "employer",
                "user",
                "candidate",
                "job_seeker",
              ]}
            >
              <Notifications />
            </RoleRoute>
          }
        />

        {/* =====================================================
            JOB SEEKER DASHBOARD
        ===================================================== */}

        <Route
          path="dashboard"
          element={
            <RoleRoute allowedRoles={["user", "candidate", "job_seeker"]}>
              <Dashboard />
            </RoleRoute>
          }
        />

        {/* =====================================================
            JOB SEEKER PROFILE
        ===================================================== */}

        <Route
          path="profile"
          element={
            <RoleRoute allowedRoles={["user", "candidate", "job_seeker"]}>
              <Profile />
            </RoleRoute>
          }
        />

        {/* =====================================================
            APPLY JOB
        ===================================================== */}

        <Route
          path="apply/:id"
          element={
            <RoleRoute allowedRoles={["user", "candidate", "job_seeker"]}>
              <ApplyJob />
            </RoleRoute>
          }
        />

        {/* =====================================================
            MY APPLICATIONS
        ===================================================== */}

        <Route
          path="my-applications"
          element={
            <RoleRoute allowedRoles={["user", "candidate", "job_seeker"]}>
              <MyApplications />
            </RoleRoute>
          }
        />

        {/* =====================================================
            SAVED JOBS
        ===================================================== */}

        <Route
          path="saved-jobs"
          element={
            <RoleRoute allowedRoles={["user", "candidate", "job_seeker"]}>
              <SavedJobs />
            </RoleRoute>
          }
        />

        {/* =====================================================
            🔐 AI FEATURES
            LOGIN REQUIRED
            JOB SEEKER ONLY
        ===================================================== */}

        <Route
          path="resume-ai"
          element={
            <RoleRoute allowedRoles={["user", "candidate", "job_seeker"]}>
              <ResumeAI />
            </RoleRoute>
          }
        />

        <Route
          path="interview-ai"
          element={
            <RoleRoute allowedRoles={["user", "candidate", "job_seeker"]}>
              <InterviewAI />
            </RoleRoute>
          }
        />
      </Route>
    </Routes>
  );
}

export default AppRoutes;
