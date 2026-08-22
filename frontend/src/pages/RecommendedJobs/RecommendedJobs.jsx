import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getRecommendedJobs } from "../../services/recommendationService";
import "./RecommendedJobs.css";

function RecommendedJobs() {
  const [recommendations, setRecommendations] = useState([]);
  const [hasProfileData, setHasProfileData] = useState(true);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadRecommendations = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getRecommendedJobs();
      setHasProfileData(data.hasProfileData);
      setMessage(data.message || "");
      setRecommendations(data.recommendations || []);
    } catch (err) {
      console.error(err);
      setError(
        "Unable to load AI recommendations. Please check your connection.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRecommendations();
  }, []);

  const getScoreColor = (score) => {
    if (score >= 85) return "#16a34a";
    if (score >= 70) return "#2563eb";
    if (score >= 50) return "#d97706";
    return "#dc2626";
  };

  return (
    <div className="recommended-page">
      <div className="recommended-header">
        <div className="badge">🤖 AI MATCH ENGINE</div>
        <h1>Personalized Job Recommendations</h1>
        <p>
          AI-driven matching based on your verified profile skills, work
          preferences, and career experience.
        </p>
      </div>

      {loading ? (
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Analyzing active jobs with AI Match Engine...</p>
        </div>
      ) : error ? (
        <div className="error-card">
          <p>⚠️ {error}</p>
          <button onClick={loadRecommendations} className="retry-btn">
            Retry
          </button>
        </div>
      ) : !hasProfileData ? (
        <div className="empty-profile-card">
          <div className="empty-icon">📄</div>
          <h2>Profile Skills Needed</h2>
          <p>
            {message ||
              "Upload your resume or add your skills in your profile to get high-accuracy match scores."}
          </p>
          <div className="empty-actions">
            <Link to="/resume-ai" className="btn-primary">
              🤖 Analyze Resume with AI
            </Link>
            <Link to="/profile" className="btn-secondary">
              ✏️ Complete Profile
            </Link>
          </div>
        </div>
      ) : recommendations.length === 0 ? (
        <div className="no-matches-card">
          <h2>No matching jobs found right now</h2>
          <p>Check back soon as employers post new positions daily.</p>
          <Link to="/jobs" className="btn-primary">
            Browse All Jobs
          </Link>
        </div>
      ) : (
        <div className="recommendations-list">
          <div className="recommendations-summary">
            <span>
              ✨ Found <strong>{recommendations.length}</strong> AI matched
              opportunities for you
            </span>
          </div>

          <div className="cards-grid">
            {recommendations.map((job) => (
              <div key={job.id} className="rec-card">
                <div className="rec-card-top">
                  <div className="job-info">
                    <h2>{job.title}</h2>
                    <span className="company-name">{job.company}</span>
                    <div className="meta-tags">
                      <span>📍 {job.location}</span>
                      <span>💼 {job.type || "Full-Time"}</span>
                      <span>🏢 {job.workMode || "On-site"}</span>
                      {job.salary && <span>💰 {job.salary}</span>}
                    </div>
                  </div>

                  <div
                    className="match-score-badge"
                    style={{ borderColor: getScoreColor(job.matchScore) }}
                  >
                    <span
                      className="score-number"
                      style={{ color: getScoreColor(job.matchScore) }}
                    >
                      {job.matchScore}%
                    </span>
                    <span className="score-label">AI MATCH</span>
                  </div>
                </div>

                <div className="rec-explanation">
                  <span className="exp-icon">💡</span>
                  <span className="exp-text">{job.matchExplanation}</span>
                </div>

                {job.matchedSkills?.length > 0 && (
                  <div className="skills-section">
                    <span className="skills-label">Matched Skills:</span>
                    <div className="skills-chips">
                      {job.matchedSkills.map((skill, idx) => (
                        <span key={idx} className="chip chip-matched">
                          ✓ {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {job.missingSkills?.length > 0 && (
                  <div className="skills-section">
                    <span className="skills-label">Missing Skills:</span>
                    <div className="skills-chips">
                      {job.missingSkills.map((skill, idx) => (
                        <span key={idx} className="chip chip-missing">
                          + {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="rec-card-footer">
                  <Link to={`/jobs/${job.id}`} className="details-btn">
                    View Details
                  </Link>

                  {job.hasApplied ? (
                    <button className="applied-btn" disabled>
                      ✓ Applied
                    </button>
                  ) : (
                    <Link to={`/apply/${job.id}`} className="apply-btn">
                      Apply Now 🚀
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default RecommendedJobs;
