import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";

import { FaHeart } from "react-icons/fa";

import { useSavedJobs } from "../../context/SavedJobsContext";
import { useAuth } from "../../context/AuthContext";
import { getUserApplications } from "../../services/applicationsService";

import jobs from "../../data/jobs";

import "./JobDetails.css";

function JobDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { toggleSavedJob, isSaved } = useSavedJobs();
  const { currentUser } = useAuth();

  const [job, setJob] = useState(() =>
    jobs.find((item) => item.id === Number(id)),
  );
  const [loading, setLoading] = useState(!job);
  const [alreadyApplied, setAlreadyApplied] = useState(false);

  useEffect(() => {
    if (job) return undefined;

    fetch(`http://localhost:5000/api/jobs/${id}`)
      .then((response) => {
        if (!response.ok) throw new Error("Job not found");
        return response.json();
      })
      .then((data) => setJob(data.job))
      .catch(() => setJob(null))
      .finally(() => setLoading(false));

    return undefined;
  }, [id, job]);

  useEffect(() => {
    if (!currentUser || currentUser.role === "employer" || !job)
      return undefined;
    getUserApplications()
      .then((applications) =>
        setAlreadyApplied(
          applications.some(
            (application) => String(application.jobId) === String(job.id),
          ),
        ),
      )
      .catch(() => setAlreadyApplied(false));
    return undefined;
  }, [currentUser, job]);

  if (loading) {
    return (
      <div className="job-not-found">
        <p>Loading job...</p>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="job-not-found">
        <h2>Job Not Found</h2>

        <p>
          The job opportunity you are looking for does not exist or has expired.
        </p>

        <button onClick={() => navigate("/jobs")} className="back-btn">
          ← Back to Jobs
        </button>
      </div>
    );
  }

  const saved = isSaved(job.id);

  const handleSave = async () => {
    if (!currentUser) {
      alert("Please login first.");
      navigate("/login");
      return;
    }

    await toggleSavedJob(job);
  };

  return (
    <div className="job-details-page">
      <div className="job-details-card">
        {/* HEADER */}
        <div className="job-header">
          <div className="company-logo">
            {job.logo ? (
              <img src={job.logo} alt={job.company} />
            ) : (
              <span>{job.company?.charAt(0)}</span>
            )}
          </div>

          <div>
            <h1>{job.title}</h1>

            {job.companyId ? (
              <Link className="company-name" to={`/companies/${job.companyId}`}>
                {job.company}
              </Link>
            ) : (
              <span className="company-name">{job.company}</span>
            )}
          </div>
        </div>

        {/* INFO */}
        <div className="job-info">
          <div className="info-box">
            <span>📍</span>

            <div>
              <strong>Location</strong>
              <p>{job.location}</p>
            </div>
          </div>

          <div className="info-box">
            <span>💰</span>

            <div>
              <strong>Salary</strong>
              <p>{job.salary}</p>
            </div>
          </div>

          <div className="info-box">
            <span>💼</span>

            <div>
              <strong>Experience</strong>
              <p>{job.experience}</p>
            </div>
          </div>

          <div className="info-box">
            <span>🏢</span>

            <div>
              <strong>Job Type</strong>
              <p>{job.type}</p>
            </div>
          </div>
        </div>

        {/* SKILLS */}
        <div className="details-section">
          <h2>Required Skills</h2>

          <div className="detail-skills">
            {job.skills?.map((skill, index) => (
              <span key={`${skill}-${index}`}>{skill}</span>
            ))}
          </div>
        </div>

        {/* DESCRIPTION */}
        <div className="details-section">
          <h2>Job Description</h2>

          <p className="description-text">
            {job.description || "No description available for this job."}
          </p>
        </div>

        {/* RESPONSIBILITIES */}
        {job.responsibilities?.length > 0 && (
          <div className="details-section">
            <h2>Key Responsibilities</h2>

            <ul className="details-list">
              {job.responsibilities.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>
        )}

        {/* REQUIREMENTS */}
        {job.requirements?.length > 0 && (
          <div className="details-section">
            <h2>Requirements & Qualifications</h2>

            <ul className="details-list">
              {job.requirements.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>
        )}

        {/* ACTIONS */}
        <div className="action-buttons">
          <button onClick={() => navigate("/jobs")} className="back-btn">
            ← Back to Jobs
          </button>

          <button
            onClick={handleSave}
            className={`save-job-btn ${saved ? "saved" : ""}`}
          >
            <FaHeart />

            {saved ? "Saved Job" : "Save Job"}
          </button>

          {currentUser?.role !== "employer" &&
            (alreadyApplied ? (
              <button className="apply-btn" disabled>
                Already Applied
              </button>
            ) : job.status && job.status !== "ACTIVE" ? (
              <button className="apply-btn" disabled>
                Applications Closed
              </button>
            ) : (
              <Link to={`/apply/${job.id}`} className="apply-btn">
                Apply Now
              </Link>
            ))}
        </div>
      </div>
    </div>
  );
}

export default JobDetails;
