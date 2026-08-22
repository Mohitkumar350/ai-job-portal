import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useSavedJobs } from "../../context/SavedJobsContext";
import { getUserApplications } from "../../services/applicationsService";
import { getUpcomingInterviews } from "../../services/interviewService";

import { FaBriefcase, FaHeart, FaRobot, FaUserCircle } from "react-icons/fa";

import "./Dashboard.css";

function Dashboard() {
  const { currentUser } = useAuth();
  const { savedJobs } = useSavedJobs();

  const [applications, setApplications] = useState([]);
  const [upcomingInterviews, setUpcomingInterviews] = useState([]);

  useEffect(() => {
    const loadApplications = async () => {
      if (!currentUser) return;

      try {
        const data = await getUserApplications(currentUser.uid);
        setApplications(data);
      } catch (error) {
        console.log(error);
      }
    };

    loadApplications();
    getUpcomingInterviews()
      .then((data) => setUpcomingInterviews(data.interviews || []))
      .catch(() => setUpcomingInterviews([]));
  }, [currentUser]);

  return (
    <div className="dashboard">
      {/* Header */}
      <div className="dashboard-header">
        <h1>Welcome, {currentUser?.displayName || "Candidate"} 👋</h1>

        <p>Manage your applications and AI career tools.</p>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        <div className="stat-card">
          <FaBriefcase className="stat-icon" />
          <h2>{applications.length}</h2>
          <p>Applications</p>
        </div>

        <div className="stat-card">
          <FaHeart className="stat-icon" />
          <h2>{savedJobs.length}</h2>
          <p>Saved Jobs</p>
        </div>

        <div className="stat-card">
          <FaRobot className="stat-icon" />
          <h2>82%</h2>
          <p>Resume Score</p>
        </div>

        <div className="stat-card">
          <FaUserCircle className="stat-icon" />
          <h2>76%</h2>
          <p>Interview Score</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions">
        <h2>Quick Actions</h2>

        <div className="action-grid">
          <Link to="/jobs/recommended" className="action-btn" style={{ background: "linear-gradient(135deg, #2563eb, #7c3aed)", color: "#fff" }}>
            🤖 AI Recommended Jobs
          </Link>

          <Link to="/jobs" className="action-btn">
            Browse Jobs
          </Link>

          <Link to="/saved-jobs" className="action-btn">
            Saved Jobs
          </Link>

          <Link to="/my-applications" className="action-btn">
            My Applications
          </Link>

          <Link to="/resume-ai" className="action-btn">
            Resume AI
          </Link>

          <Link to="/interview-ai" className="action-btn">
            Interview AI
          </Link>

          <Link to="/profile" className="action-btn">
            My Profile
          </Link>
          <Link to="/interviews" className="action-btn">
            Interviews ({upcomingInterviews.length})
          </Link>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="recent-section">
        <h2>Recent Activity</h2>

        <div className="activity-card">
          <p>💼 Applications: {applications.length}</p>
          <p>❤️ Saved Jobs: {savedJobs.length}</p>
          <p>📄 Complete your profile to increase visibility.</p>
          <p>🤖 Improve your resume with Resume AI.</p>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
