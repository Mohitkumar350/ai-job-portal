import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { getMyJobs } from "../../services/jobService";
import { getMyCompany } from "../../services/companyService";
import { getUpcomingInterviews } from "../../services/interviewService";
import { getEmployerAnalytics } from "../../services/analyticsService";
import "./Employer.css";

function EmployerDashboard() {
  const { currentUser } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [error, setError] = useState("");
  const [company, setCompany] = useState(null);
  const [upcomingInterviews, setUpcomingInterviews] = useState(0);
  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    getMyJobs()
      .then((data) => setJobs(data.jobs || []))
      .catch((err) => setError(err.message));
    getMyCompany()
      .then((data) => setCompany(data.company))
      .catch(() => setCompany(null));
    getUpcomingInterviews()
      .then((data) => setUpcomingInterviews((data.interviews || []).length))
      .catch(() => setUpcomingInterviews(0));
    getEmployerAnalytics("all")
      .then(setAnalytics)
      .catch(() => setAnalytics(null));
  }, []);

  const activeJobs = jobs.filter((job) => job.status === "ACTIVE").length;
  const draftJobs = jobs.filter((job) => job.status === "DRAFT").length;

  return (
    <main className="employer-page">
      <div className="employer-header">
        <div>
          <p className="eyebrow">Employer workspace</p>
          <h1>Welcome, {currentUser?.name || "Employer"}</h1>
          <p>Manage your job opportunities from one place.</p>
        </div>
        <Link className="employer-primary-button" to="/employer/jobs/new">
          Post New Job
        </Link>
      </div>
      {error && <p className="employer-error">{error}</p>}
      <section className="employer-stats">
        <div>
          <span>Total Jobs</span>
          <strong>{jobs.length}</strong>
        </div>
        <div>
          <span>Active Jobs</span>
          <strong>{activeJobs}</strong>
        </div>
        <div>
          <span>Draft Jobs</span>
          <strong>{draftJobs}</strong>
        </div>
      </section>
      <section className="employer-section">
        <div className="section-heading">
          <h2>My Jobs</h2>
          <Link to="/employer/jobs">View all</Link>
        </div>
        {jobs.length === 0 ? (
          <div className="employer-empty">
            <h3>No jobs posted yet</h3>
            <p>Create your first job listing to start reaching candidates.</p>
            <Link className="employer-primary-button" to="/employer/jobs/new">
              Create a job
            </Link>
          </div>
        ) : (
          <div className="employer-job-list">
            {jobs.slice(0, 5).map((job) => (
              <article key={job.id}>
                <div>
                  <h3>{job.title}</h3>
                  <p>
                    {job.company} · {job.location}
                  </p>
                </div>
                <span className={`job-status ${job.status.toLowerCase()}`}>
                  {job.status}
                </span>
              </article>
            ))}
          </div>
        )}
      </section>
      <section className="employer-section company-summary">
        <div className="section-heading">
          <h2>Company Profile</h2>
          <Link to="/employer/company">
            {company ? "Edit Company Profile" : "Create Company Profile"}
          </Link>
        </div>
        {company ? (
          <div className="company-summary-content">
            {company.logo && (
              <img src={company.logo} alt="" className="company-logo-preview" />
            )}
            <div>
              <h3>{company.name}</h3>
              <p>
                {company.industry || "Industry not added"} ·{" "}
                {company.location || "Location not added"}
              </p>
              <p>
                Profile completion:{" "}
                {[
                  company.name,
                  company.logo,
                  company.description,
                  company.industry,
                  company.location,
                  company.website,
                ].filter(Boolean).length * 17}
                %
              </p>
            </div>
          </div>
        ) : (
          <div className="employer-empty">
            <p>
              Create a company profile so candidates can learn about your
              organization.
            </p>
            <Link className="employer-primary-button" to="/employer/company">
              Create Company Profile
            </Link>
          </div>
        )}
      </section>
      <section className="employer-section interview-summary">
        <div className="section-heading">
          <h2>Upcoming Interviews</h2>
          <Link to="/employer/interviews">View Interviews</Link>
        </div>
        <div className="company-summary-content">
          <strong>{upcomingInterviews}</strong>
          <span>scheduled interview{upcomingInterviews === 1 ? "" : "s"}</span>
        </div>
      </section>
      <section className="employer-section interview-summary">
        <div className="section-heading">
          <h2>Recruitment Overview</h2>
          <Link to="/employer/analytics">View Analytics</Link>
        </div>
        <div className="company-summary-content">
          <span>
            Applications:{" "}
            <strong>{analytics?.summary?.totalApplications ?? "-"}</strong>
          </span>
          <span>
            Interviews: <strong>{analytics?.summary?.interviews ?? "-"}</strong>
          </span>
          <span>
            Selected: <strong>{analytics?.summary?.selected ?? "-"}</strong>
          </span>
        </div>
      </section>
    </main>
  );
}

export default EmployerDashboard;
