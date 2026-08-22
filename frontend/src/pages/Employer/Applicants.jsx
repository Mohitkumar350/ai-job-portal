import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  getJobApplicants,
  updateApplicationStatus,
} from "../../services/applicationsService";
import "./Employer.css";

const statuses = [
  "APPLIED",
  "UNDER_REVIEW",
  "INTERVIEW_SCHEDULED",
  "SELECTED",
  "REJECTED",
];

function Applicants() {
  const { jobId } = useParams();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getJobApplicants(jobId)
      .then(setApplications)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [jobId]);

  const changeStatus = async (id, status) => {
    try {
      const data = await updateApplicationStatus(id, status);
      setApplications((items) =>
        items.map((item) => (item._id === id ? data.application : item)),
      );
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <main className="employer-page">
      <div className="employer-header">
        <div>
          <p className="eyebrow">Employer workspace</p>
          <h1>Applicants</h1>
          <p>Review candidates for this job.</p>
        </div>
        <Link to="/employer/jobs">Back to My Jobs</Link>
      </div>
      {error && <p className="employer-error">{error}</p>}
      {loading ? (
        <p>Loading applicants...</p>
      ) : applications.length === 0 ? (
        <div className="employer-empty">
          <h3>No applications yet</h3>
          <p>Applications for this job will appear here.</p>
        </div>
      ) : (
        <div className="employer-table">
          {applications.map((application) => {
            const candidate = application.applicant || {};
            return (
              <article key={application._id}>
                <div>
                  <h3>{candidate.name || application.fullName}</h3>
                  <p>
                    {candidate.email || "Email unavailable"} ·{" "}
                    {application.phone}
                  </p>
                  <p>
                    Applied{" "}
                    {application.createdAt
                      ? new Date(application.createdAt).toLocaleDateString(
                          "en-IN",
                        )
                      : "recently"}
                  </p>
                  <Link to={`/applications/${application._id}`}>
                    View application
                  </Link>
                  <Link
                    to={`/employer/applications/${application._id}/interview`}
                  >
                    Schedule Interview
                  </Link>
                  {application.resume && (
                    <a
                      href={application.resume}
                      target="_blank"
                      rel="noreferrer"
                    >
                      View resume
                    </a>
                  )}
                  {application.coverLetter && (
                    <p>
                      {application.coverLetter.slice(0, 160)}
                      {application.coverLetter.length > 160 ? "..." : ""}
                    </p>
                  )}
                </div>
                <label className="status-control">
                  Status
                  <select
                    value={application.status}
                    onChange={(event) =>
                      changeStatus(application._id, event.target.value)
                    }
                  >
                    {statuses.map((status) => (
                      <option key={status}>{status}</option>
                    ))}
                  </select>
                </label>
              </article>
            );
          })}
        </div>
      )}
    </main>
  );
}

export default Applicants;
