import { Routes, Route } from "react-router-dom";

import RoleRoute from "../components/RoleRoute/RoleRoute";
import MainLayout from "../layouts/MainLayout";

import Home from "../pages/Home/Home";
import Jobs from "../pages/Jobs/Jobs";
import Companies from "../pages/Companies/Companies";
import Dashboard from "../pages/Dashboard/Dashboard";
import SavedJobs from "../pages/SavedJobs/SavedJobs";
import ResumeAI from "../pages/ResumeAI/ResumeAI";
import InterviewAI from "../pages/InterviewAI/InterviewAI";

import Login from "../pages/Login/Login";
import Signup from "../pages/Signup/Signup";

import JobDetails from "../pages/JobDetails/JobDetails";
import NotFound from "../pages/NotFound/NotFound";

import Profile from "../pages/Profile/Profile";
import ApplyJob from "../pages/ApplyJob/ApplyJob";
import MyApplications from "../pages/MyApplications/MyApplications";
import CompanyDetails from "../pages/CompanyDetails/CompanyDetails";

import AdminDashboard from "../pages/Admin/adminDashboard";
import EmployerDashboard from "../pages/Employer/EmployerDashboard";
import EmployerJobs from "../pages/Employer/EmployerJobs";
import CreateJob from "../pages/Employer/CreateJob";
import EditJob from "../pages/Employer/EditJob";
import Applicants from "../pages/Employer/Applicants";
import ApplicationDetails from "../pages/Applications/ApplicationDetails";
import CompanyProfile from "../pages/Employer/CompanyProfile";
import Notifications from "../pages/Notifications/Notifications";
import ScheduleInterview from "../pages/Employer/ScheduleInterview";
import Interviews from "../pages/Interviews/Interviews";
import InterviewDetails from "../pages/Interviews/InterviewDetails";
import Analytics from "../pages/Employer/Analytics";
import RecommendedJobs from "../pages/RecommendedJobs/RecommendedJobs";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        {/* HOME */}

        <Route index element={<Home />} />

        {/* PUBLIC */}

        <Route path="login" element={<Login />} />

        <Route path="signup" element={<Signup />} />

        <Route path="jobs" element={<Jobs />} />

        <Route path="jobs/:id" element={<JobDetails />} />

        <Route path="companies" element={<Companies />} />

        <Route path="companies/:id" element={<CompanyDetails />} />

        {/* ADMIN */}

        <Route
          path="admin"
          element={
            <RoleRoute allowedRoles={["admin"]}>
              <AdminDashboard />
            </RoleRoute>
          }
        />

        {/* EMPLOYER */}

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

        {/* JOB SEEKER & INTERVIEWS */}

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

        {/* PROTECTED */}

        <Route
          path="dashboard"
          element={
            <RoleRoute allowedRoles={["user", "candidate", "job_seeker"]}>
              <Dashboard />
            </RoleRoute>
          }
        />

        <Route
          path="profile"
          element={
            <RoleRoute allowedRoles={["user", "candidate", "job_seeker"]}>
              <Profile />
            </RoleRoute>
          }
        />

        <Route
          path="apply/:id"
          element={
            <RoleRoute allowedRoles={["user", "candidate", "job_seeker"]}>
              <ApplyJob />
            </RoleRoute>
          }
        />

        <Route
          path="my-applications"
          element={
            <RoleRoute allowedRoles={["user", "candidate", "job_seeker"]}>
              <MyApplications />
            </RoleRoute>
          }
        />

        <Route
          path="saved-jobs"
          element={
            <RoleRoute allowedRoles={["user", "candidate", "job_seeker"]}>
              <SavedJobs />
            </RoleRoute>
          }
        />

        <Route path="resume-ai" element={<ResumeAI />} />

        <Route path="interview-ai" element={<InterviewAI />} />

        {/* 404 */}

        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

export default AppRoutes;
