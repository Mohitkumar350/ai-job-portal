import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { deleteJob, getMyJobs } from "../../services/jobService";
import "./Employer.css";

function EmployerJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const loadJobs = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getMyJobs();
      setJobs(data.jobs || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadJobs();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this job?")) return;
    try {
      await deleteJob(id);
      setMessage("Job deleted successfully.");
      await loadJobs();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <main className="employer-page">
      <div className="employer-header">
        <div>
          <p className="eyebrow">Employer workspace</p>
          <h1>My Jobs</h1>
          <p>Review and manage your job listings.</p>
        </div>
        <Link className="employer-primary-button" to="/employer/jobs/new">
          Post New Job
        </Link>
      </div>
      {message && <p className="employer-success">{message}</p>}
      {error && <p className="employer-error">{error}</p>}
      {loading ? (
        <p>Loading jobs...</p>
      ) : jobs.length === 0 ? (
        <div className="employer-empty">
          <h3>No jobs posted yet</h3>
          <Link className="employer-primary-button" to="/employer/jobs/new">
            Create a job
          </Link>
        </div>
      ) : (
        <div className="employer-table">
          {jobs.map((job) => (
            <article key={job.id}>
              <div>
                <h3>{job.title}</h3>
                <p>
                  {job.company} · {job.location} · {job.type} · {job.workMode}
                </p>
                <span className={`job-status ${job.status.toLowerCase()}`}>
                  {job.status}
                </span>
              </div>
              <div className="employer-actions">
                <Link to={`/jobs/${job.id}`}>View</Link>
                <Link to={`/employer/jobs/${job.id}/edit`}>Edit</Link>
                <Link to={`/employer/jobs/${job.id}/applicants`}>
                  Applicants
                </Link>
                <button type="button" onClick={() => handleDelete(job.id)}>
                  Delete
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </main>
  );
}

export default EmployerJobs;
