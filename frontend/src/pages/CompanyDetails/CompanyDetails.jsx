import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { FaMapMarkerAlt, FaBriefcase, FaHeart } from "react-icons/fa";

import jobs from "../../data/jobs";
import { useSavedJobs } from "../../context/SavedJobsContext";
import { useAuth } from "../../context/AuthContext";
import { getCompany } from "../../services/companyService";

import "./CompanyDetails.css";

function CompanyDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { isSaved, toggleSavedJob } = useSavedJobs();
  const { currentUser } = useAuth();

  // Find selected job/company
  const selectedJob = jobs.find((job) => job.id === Number(id));
  const [company, setCompany] = useState(null);
  const [companyJobs, setCompanyJobs] = useState([]);
  const [loading, setLoading] = useState(!selectedJob);

  useEffect(() => {
    if (selectedJob) return undefined;
    getCompany(id)
      .then((data) => {
        setCompany(data.company);
        setCompanyJobs(
          (data.jobs || []).map((job) => ({
            ...job,
            id: job._id,
            salary:
              job.salaryMin || job.salaryMax
                ? `${job.salaryMin || ""} - ${job.salaryMax || ""}`
                : "Salary not specified",
            type: job.employmentType,
          })),
        );
      })
      .catch(() => setCompany(null))
      .finally(() => setLoading(false));
    return undefined;
  }, [id, selectedJob]);

  if (loading)
    return (
      <div className="company-not-found">
        <p>Loading company...</p>
      </div>
    );

  const companyName = company?.name || selectedJob?.company;
  const companyLogo = company?.logo || selectedJob?.logo;
  const companyLocation = company?.location || selectedJob?.location;
  const companyType = company?.industry || selectedJob?.type;
  const companyDescription =
    company?.description ||
    `Explore career opportunities and available positions at ${companyName}.`;

  if (!selectedJob && !company) {
    return (
      <div className="company-not-found">
        <h2>Company Not Found</h2>
        <p>The company you are looking for does not exist.</p>

        <button onClick={() => navigate("/companies")}>
          ← Back to Companies
        </button>
      </div>
    );
  }

  const visibleCompanyJobs = selectedJob
    ? jobs.filter((job) => job.company === selectedJob.company)
    : companyJobs;

  const handleSave = async (job) => {
    if (!currentUser) {
      alert("Please login first.");
      navigate("/login");
      return;
    }

    await toggleSavedJob(job);
  };

  return (
    <section className="company-details-page">
      {/* ==============================
          BACK BUTTON
      ============================== */}

      <button
        className="company-back-btn"
        onClick={() => navigate("/companies")}
      >
        ← Back to Companies
      </button>

      {/* ==============================
          COMPANY HERO
      ============================== */}

      <div className="company-hero">
        <div className="company-hero-logo">
          {companyLogo ? (
            <img src={companyLogo} alt={companyName} />
          ) : (
            <span>{companyName?.charAt(0)}</span>
          )}
        </div>

        <div className="company-hero-content">
          <h1>{companyName}</h1>

          <p className="company-description">{companyDescription}</p>

          <div className="company-meta">
            <span>
              <FaMapMarkerAlt />
              {companyLocation || "Location not specified"}
            </span>

            <span>
              <FaBriefcase />
              {companyType || "Company"}
            </span>
          </div>
        </div>
      </div>

      {/* ==============================
          COMPANY STATS
      ============================== */}

      <div className="company-stats">
        <div className="stat-card">
          <h2>{visibleCompanyJobs.length}</h2>
          <p>Open Positions</p>
        </div>

        <div className="stat-card">
          <h2>{companyType || "-"}</h2>
          <p>Job Type</p>
        </div>

        <div className="stat-card">
          <h2>AI</h2>
          <p>Powered Portal</p>
        </div>
      </div>

      {company && (
        <div className="company-profile-facts">
          {company.website && (
            <a href={company.website} target="_blank" rel="noreferrer">
              Visit website
            </a>
          )}
          {company.companySize && (
            <span>Company size: {company.companySize}</span>
          )}
          {company.foundedYear && <span>Founded: {company.foundedYear}</span>}
        </div>
      )}

      {/* ==============================
          JOBS SECTION
      ============================== */}

      <div className="company-jobs-section">
        <div className="section-heading">
          <div>
            <h2>Open Positions</h2>

            <p>Current opportunities at {companyName}</p>
          </div>

          <span>{visibleCompanyJobs.length} Jobs</span>
        </div>

        <div className="company-jobs-grid">
          {visibleCompanyJobs.map((job) => {
            const saved = isSaved(job.id);

            return (
              <div className="company-job-card" key={job.id}>
                {/* Save Button */}

                <button
                  className={
                    saved ? "company-save-btn saved" : "company-save-btn"
                  }
                  onClick={() => handleSave(job)}
                  title={saved ? "Remove from saved jobs" : "Save job"}
                >
                  <FaHeart />
                </button>

                {/* Job Content */}

                <h3>{job.title}</h3>

                <h4>{job.company}</h4>

                <div className="job-meta">
                  <span>📍 {job.location}</span>

                  <span>💰 {job.salary}</span>

                  <span>💼 {job.experience}</span>
                </div>

                {/* Skills */}

                <div className="company-job-skills">
                  {job.skills?.map((skill) => (
                    <span key={skill}>{skill}</span>
                  ))}
                </div>

                {/* Actions */}

                <div className="company-job-actions">
                  <Link to={`/jobs/${job.id}`} className="view-job-btn">
                    View Details
                  </Link>

                  <Link to={`/apply/${job.id}`} className="apply-job-btn">
                    Apply Now
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default CompanyDetails;
