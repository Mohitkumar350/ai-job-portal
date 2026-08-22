import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getMyInterviews } from "../../services/interviewService";
import "./Interviews.css";

function Interviews({ employer = false }) {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  useEffect(() => {
    getMyInterviews()
      .then((data) => setInterviews(data.interviews || []))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);
  return (
    <main className="interviews-page">
      <div className="interviews-header">
        <div>
          <p className="eyebrow">
            {employer ? "Employer workspace" : "Career workspace"}
          </p>
          <h1>{employer ? "Employer Interviews" : "My Interviews"}</h1>
          <p>
            {employer
              ? "Manage interviews for your candidates."
              : "Keep track of your upcoming conversations."}
          </p>
        </div>
      </div>
      {error && <p className="interview-error">{error}</p>}
      {loading ? (
        <p>Loading interviews...</p>
      ) : interviews.length === 0 ? (
        <div className="interview-empty">
          <h2>No interviews yet</h2>
          <p>Scheduled interviews will appear here.</p>
        </div>
      ) : (
        <div className="interview-list">
          {interviews.map((interview) => (
            <article className="interview-card" key={interview._id}>
              <div>
                <h2>{interview.job?.title || "Job interview"}</h2>
                <p>{interview.job?.company || "Company"}</p>
                {employer && (
                  <p>
                    Candidate:{" "}
                    {interview.candidate?.name ||
                      interview.candidate?.email ||
                      "Candidate"}
                  </p>
                )}
                <p>{new Date(interview.scheduledAt).toLocaleString()}</p>
                <p>
                  {interview.duration} minutes ·{" "}
                  {interview.interviewType.replace("_", " ")}
                </p>
                <span
                  className={`interview-status ${interview.status.toLowerCase()}`}
                >
                  {interview.status}
                </span>
              </div>
              <Link
                className="interview-link"
                to={`/interviews/${interview._id}`}
              >
                View
              </Link>
            </article>
          ))}
        </div>
      )}
    </main>
  );
}

export default Interviews;
