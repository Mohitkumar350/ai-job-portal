import { Link, useNavigate } from "react-router-dom";
import { FaHeart } from "react-icons/fa";

import { useSavedJobs } from "../../context/SavedJobsContext";
import { useAuth } from "../../context/AuthContext";

import "./JobCard.css";

function JobCard({ job }) {
  const navigate = useNavigate();
  const { isSaved, toggleSavedJob } = useSavedJobs();
  const { currentUser } = useAuth();

  const saved = isSaved(job.id);

  // ==========================================
  // SAVE JOB
  // ==========================================

  const handleSave = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!currentUser) {
      alert("Please login first.");
      return;
    }

    await toggleSavedJob(job);
  };

  // ==========================================
  // APPLY JOB
  // ==========================================

  const handleApply = () => {
    if (!currentUser) {
      alert("Please login first.");
      return;
    }

    navigate(`/apply/${job.id}`);
  };

  return (
    <div className="job-card">
      {/* SAVE BUTTON */}
      <button
        type="button"
        onClick={handleSave}
        className={`save-btn ${saved ? "saved" : ""}`}
        title={saved ? "Remove from saved jobs" : "Save job"}
      >
        <FaHeart />
      </button>

      {/* LOGO */}
      {job.logo && (
        <div className="job-logo">
          <img src={job.logo} alt={job.company} />
        </div>
      )}

      {/* JOB TITLE */}
      <h2>{job.title}</h2>

      {/* COMPANY */}
      <h3>
        {job.companyId ? (
          <Link to={`/companies/${job.companyId}`}>{job.company}</Link>
        ) : (
          job.company
        )}
      </h3>

      {/* INFORMATION */}
      <p>📍 {job.location}</p>

      <p>💰 {job.salary}</p>

      <p>💼 {job.experience}</p>

      {job.type && <p>🏢 {job.type}</p>}

      {job.posted && <p>🕒 {job.posted}</p>}

      {/* SKILLS */}
      <div className="skills">
        {job.skills?.map((skill, index) => (
          <span key={`${skill}-${index}`}>{skill}</span>
        ))}
      </div>

      {/* ACTIONS */}
      <div className="job-actions">
        <Link to={`/jobs/${job.id}`} className="details-btn">
          View Details
        </Link>

        <button type="button" className="apply-btn" onClick={handleApply}>
          Apply Now
        </button>
      </div>
    </div>
  );
}

export default JobCard;
