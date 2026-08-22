import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  cancelScheduledInterview,
  getScheduledInterview,
} from "../../services/interviewService";
import { useAuth } from "../../context/AuthContext";
import "./Interviews.css";

function InterviewDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [interview, setInterview] = useState(null);
  const [error, setError] = useState("");
  useEffect(() => {
    getScheduledInterview(id)
      .then((data) => setInterview(data.interview))
      .catch((err) => setError(err.message));
  }, [id]);
  const cancel = async () => {
    try {
      const data = await cancelScheduledInterview(id);
      setInterview(data.interview);
    } catch (err) {
      setError(err.message);
    }
  };
  if (error)
    return (
      <main className="interviews-page">
        <p className="interview-error">{error}</p>
      </main>
    );
  if (!interview)
    return (
      <main className="interviews-page">
        <p>Loading interview...</p>
      </main>
    );
  const isEmployer = currentUser?.role === "employer";
  return (
    <main className="interviews-page">
      <div className="interview-detail">
        <Link to={isEmployer ? "/employer/interviews" : "/interviews"}>
          Back to interviews
        </Link>
        <h1>{interview.job?.title || "Interview"}</h1>
        <h2>{interview.job?.company || "Company"}</h2>
        <div className="interview-facts">
          <p>
            <strong>Date and time</strong>
            {new Date(interview.scheduledAt).toLocaleString()}
          </p>
          <p>
            <strong>Duration</strong>
            {interview.duration} minutes
          </p>
          <p>
            <strong>Type</strong>
            {interview.interviewType.replace("_", " ")}
          </p>
          <p>
            <strong>Status</strong>
            {interview.status}
          </p>
          {interview.interviewType === "ONLINE" &&
            interview.meetingLink &&
            interview.status === "SCHEDULED" && (
              <a
                className="interview-link"
                href={interview.meetingLink}
                target="_blank"
                rel="noreferrer"
              >
                Join Interview
              </a>
            )}
          {interview.interviewType === "IN_PERSON" && (
            <p>
              <strong>Location</strong>
              {interview.location}
            </p>
          )}
        </div>
        {interview.notes && (
          <p className="interview-notes">{interview.notes}</p>
        )}
        {isEmployer && interview.status === "SCHEDULED" && (
          <button className="interview-cancel" onClick={cancel}>
            Cancel Interview
          </button>
        )}
      </div>
    </main>
  );
}

export default InterviewDetails;
