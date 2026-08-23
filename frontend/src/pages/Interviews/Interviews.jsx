import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getMyInterviews } from "../../services/interviewService";
import "./Interviews.css";

function Interviews({ employer = false }) {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadInterviews = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getMyInterviews();

        // Support both:
        // { interviews: [...] }
        // [...]
        if (Array.isArray(data)) {
          setInterviews(data);
        } else if (Array.isArray(data?.interviews)) {
          setInterviews(data.interviews);
        } else {
          setInterviews([]);
        }
      } catch (err) {
        console.error("❌ Failed to load interviews:", err);
        setError(err?.message || "Failed to load interviews.");
      } finally {
        setLoading(false);
      }
    };

    loadInterviews();
  }, []);

  const formatDate = (date) => {
    if (!date) return "Date not available";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "Invalid date";
    }

    return parsedDate.toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatInterviewType = (type) => {
    if (!type) return "Not specified";

    return type
      .replaceAll("_", " ")
      .toLowerCase()
      .replace(/\b\w/g, (letter) => letter.toUpperCase());
  };

  const getStatusClass = (status) => {
    return String(status || "UNKNOWN")
      .toLowerCase()
      .replaceAll(" ", "-");
  };

  return (
    <main className="interviews-page">
      <section className="interviews-container">
        {/* ================= HEADER ================= */}
        <header className="interviews-header">
          <div className="header-content">
            <span className="eyebrow">
              {employer ? "EMPLOYER WORKSPACE" : "CAREER WORKSPACE"}
            </span>

            <h1>{employer ? "Employer Interviews" : "My Interviews"}</h1>

            <p>
              {employer
                ? "Manage and track interviews scheduled with your candidates."
                : "Keep track of your upcoming interviews and conversations."}
            </p>
          </div>

          {!employer && <div className="header-icon">📅</div>}
        </header>

        {/* ================= ERROR ================= */}
        {error && (
          <div className="interview-error">
            <span>⚠️</span>
            <div>
              <strong>Unable to load interviews</strong>
              <p>{error}</p>
            </div>
          </div>
        )}

        {/* ================= LOADING ================= */}
        {loading && (
          <div className="interview-loading">
            <div className="loading-spinner"></div>
            <p>Loading your interviews...</p>
          </div>
        )}

        {/* ================= EMPTY ================= */}
        {!loading && !error && interviews.length === 0 && (
          <div className="interview-empty">
            <div className="empty-icon">📅</div>

            <h2>No interviews yet</h2>

            <p>
              {employer
                ? "Interviews scheduled with candidates will appear here."
                : "Your scheduled interviews will appear here."}
            </p>

            <Link to="/jobs" className="empty-action">
              Browse Jobs
            </Link>
          </div>
        )}

        {/* ================= INTERVIEW LIST ================= */}
        {!loading && interviews.length > 0 && (
          <div className="interview-list">
            {interviews.map((interview) => (
              <article className="interview-card" key={interview._id}>
                {/* Card Top */}
                <div className="card-top">
                  <div className="company-avatar">
                    {(interview.job?.company || "C").charAt(0).toUpperCase()}
                  </div>

                  <div className="job-info">
                    <h2>{interview.job?.title || "Job Interview"}</h2>

                    <p className="company-name">
                      {interview.job?.company || "Company"}
                    </p>
                  </div>

                  <span
                    className={`interview-status ${getStatusClass(
                      interview.status,
                    )}`}
                  >
                    {interview.status || "UNKNOWN"}
                  </span>
                </div>

                {/* Candidate */}
                {employer && (
                  <div className="interview-detail-row">
                    <span className="detail-icon">👤</span>

                    <div>
                      <small>Candidate</small>
                      <strong>
                        {interview.candidate?.name ||
                          interview.candidate?.email ||
                          "Candidate"}
                      </strong>
                    </div>
                  </div>
                )}

                {/* Details */}
                <div className="interview-details">
                  <div className="detail-item">
                    <span className="detail-icon">📅</span>

                    <div>
                      <small>Date & Time</small>
                      <strong>{formatDate(interview.scheduledAt)}</strong>
                    </div>
                  </div>

                  <div className="detail-item">
                    <span className="detail-icon">⏱️</span>

                    <div>
                      <small>Duration</small>
                      <strong>{interview.duration || 0} minutes</strong>
                    </div>
                  </div>

                  <div className="detail-item">
                    <span className="detail-icon">💼</span>

                    <div>
                      <small>Interview Type</small>
                      <strong>
                        {formatInterviewType(interview.interviewType)}
                      </strong>
                    </div>
                  </div>
                </div>

                {/* Bottom */}
                <div className="card-footer">
                  <span className="interview-id">
                    Interview ID:{" "}
                    {interview._id ? `${interview._id.slice(-8)}` : "N/A"}
                  </span>

                  <Link
                    className="view-interview-btn"
                    to={`/interviews/${interview._id}`}
                  >
                    View Details
                    <span>→</span>
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

export default Interviews;
