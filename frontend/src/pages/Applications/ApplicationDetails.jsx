import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getApplication } from "../../services/applicationsService";
import "../MyApplications/MyApplications.css";

const stages = ["APPLIED", "UNDER_REVIEW", "INTERVIEW_SCHEDULED", "SELECTED"];

function ApplicationDetails() {
  const { id } = useParams();
  const [application, setApplication] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    getApplication(id)
      .then(setApplication)
      .catch((err) => setError(err.message));
  }, [id]);

  if (error)
    return (
      <main className="applications-page">
        <div className="application-error">
          <p>{error}</p>
        </div>
      </main>
    );
  if (!application)
    return (
      <main className="applications-page">
        <p>Loading application...</p>
      </main>
    );

  const normalizedStatus =
    {
      Applied: "APPLIED",
      Approved: "SELECTED",
      Rejected: "REJECTED",
    }[application.status] || application.status;
  const currentIndex = stages.indexOf(normalizedStatus);
  const reached = stages.slice(0, currentIndex + 1);
  if (normalizedStatus === "REJECTED") reached.push("REJECTED");

  return (
    <main className="applications-page">
      <div className="applications-header">
        <h1>Application Details</h1>
        <p>
          {application.title} at {application.company}
        </p>
      </div>
      <div className="application-card">
        <h2>{application.title}</h2>
        <h3>{application.company}</h3>
        <p>{application.location}</p>
        <p>
          Applied {new Date(application.createdAt).toLocaleDateString("en-IN")}
        </p>
        <div className="application-timeline">
          {stages.map((stage) => (
            <div
              className={
                reached.includes(stage)
                  ? "timeline-step reached"
                  : "timeline-step"
              }
              key={stage}
            >
              {reached.includes(stage) ? "✓" : "○"} {stage}
            </div>
          ))}
          {normalizedStatus === "REJECTED" && (
            <div className="timeline-step reached rejected">✕ REJECTED</div>
          )}
        </div>
        {application.resume && (
          <p>
            <a href={application.resume} target="_blank" rel="noreferrer">
              View submitted resume
            </a>
          </p>
        )}
        {application.coverLetter && <p>{application.coverLetter}</p>}
        <Link to="/my-applications">Back to My Applications</Link>
      </div>
    </main>
  );
}

export default ApplicationDetails;
