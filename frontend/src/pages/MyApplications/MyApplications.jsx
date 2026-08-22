import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import {
  getUserApplications,
  deleteApplication,
} from "../../services/applicationsService";

import "./MyApplications.css";

function MyApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ==========================================
  // LOAD APPLICATIONS
  // ==========================================

  const loadApplications = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getUserApplications();

      setApplications(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("LOAD APPLICATIONS ERROR:", error);

      setError(error.message || "Unable to load applications.");
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // LOAD WHEN PAGE OPENS
  // ==========================================

  useEffect(() => {
    loadApplications();
  }, []);

  // ==========================================
  // DELETE APPLICATION
  // ==========================================

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to cancel this application?",
    );

    if (!confirmDelete) {
      return;
    }

    try {
      await deleteApplication(id);

      setApplications((prev) =>
        prev.filter((application) => application._id !== id),
      );

      alert("Application cancelled successfully.");
    } catch (error) {
      console.error("DELETE APPLICATION ERROR:", error);

      alert(error.message || "Failed to cancel application.");
    }
  };

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="applications-page">
        <div className="applications-header">
          <h1>📋 My Applications</h1>

          <p>Loading your applications...</p>
        </div>
      </div>
    );
  }

  // ==========================================
  // ERROR
  // ==========================================

  if (error) {
    return (
      <div className="applications-page">
        <div className="applications-header">
          <h1>📋 My Applications</h1>

          <div className="application-error">
            <h2>Unable to Load Applications</h2>

            <p>{error}</p>

            <button className="retry-btn" onClick={loadApplications}>
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // PAGE
  // ==========================================

  return (
    <div className="applications-page">
      <div className="applications-header">
        <h1>📋 My Applications</h1>

        <p>
          You have <strong>{applications.length}</strong> application
          {applications.length !== 1 ? "s" : ""}.
        </p>
      </div>

      {/* ======================================
          EMPTY STATE
      ====================================== */}

      {applications.length === 0 ? (
        <div className="empty">
          <div className="empty-icon">📭</div>

          <h2>No Applications Yet</h2>

          <p>
            You haven't applied for any jobs yet. Find a job and submit your
            first application.
          </p>
        </div>
      ) : (
        /* ====================================
           APPLICATION GRID
        ==================================== */

        <div className="applications-grid">
          {applications.map((application) => {
            const status = application.status || "Applied";

            const statusClass = status.toLowerCase().replace(/\s+/g, "-");

            return (
              <div className="application-card" key={application._id}>
                {/* HEADER */}

                <div className="application-top">
                  <div>
                    <h2>{application.title}</h2>

                    <h3>{application.company}</h3>
                  </div>

                  <span className={`status ${statusClass}`}>{status}</span>
                </div>

                {/* INFORMATION */}

                <div className="application-info">
                  <p>
                    <strong>📍 Location:</strong>{" "}
                    {application.location || "Not specified"}
                  </p>

                  <p>
                    <strong>👤 Applicant:</strong>{" "}
                    {application.fullName || "Not specified"}
                  </p>

                  <p>
                    <strong>📞 Phone:</strong>{" "}
                    {application.phone || "Not specified"}
                  </p>

                  {application.coverLetter && (
                    <p>
                      <strong>📝 Cover Letter:</strong>{" "}
                      {application.coverLetter}
                    </p>
                  )}
                </div>

                {/* DATE */}

                {application.createdAt && (
                  <p className="application-date">
                    Applied on{" "}
                    {new Date(application.createdAt).toLocaleDateString(
                      "en-IN",
                      {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      },
                    )}
                  </p>
                )}

                {/* ACTION */}

                <div className="application-actions">
                  <Link to={`/applications/${application._id}`}>
                    View Details
                  </Link>
                  <button
                    className="delete-application-btn"
                    onClick={() => handleDelete(application._id)}
                  >
                    Cancel Application
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default MyApplications;
