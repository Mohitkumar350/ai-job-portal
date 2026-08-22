import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { createScheduledInterview } from "../../services/interviewService";
import "./Employer.css";

function ScheduleInterview() {
  const { applicationId } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    scheduledAt: "",
    duration: "30",
    interviewType: "ONLINE",
    meetingLink: "",
    location: "",
    notes: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const update = (event) =>
    setForm((previous) => ({
      ...previous,
      [event.target.name]: event.target.value,
    }));
  const submit = async (event) => {
    event.preventDefault();
    setError("");
    if (
      !form.scheduledAt ||
      (form.interviewType === "ONLINE" && !form.meetingLink.trim()) ||
      (form.interviewType === "IN_PERSON" && !form.location.trim())
    ) {
      setError("Please complete the interview details.");
      return;
    }
    try {
      setLoading(true);
      await createScheduledInterview({
        applicationId,
        ...form,
        scheduledAt: new Date(form.scheduledAt).toISOString(),
      });
      navigate("/employer/interviews");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <main className="employer-page">
      <div className="employer-header">
        <div>
          <p className="eyebrow">Employer workspace</p>
          <h1>Schedule Interview</h1>
          <p>The candidate and job are taken from the application.</p>
        </div>
        <Link to="/employer/jobs">Back to My Jobs</Link>
      </div>
      <form className="job-form" onSubmit={submit}>
        {error && <p className="employer-error">{error}</p>}
        <label>
          Date and time
          <input
            name="scheduledAt"
            type="datetime-local"
            value={form.scheduledAt}
            onChange={update}
            min={new Date().toISOString().slice(0, 16)}
            required
          />
        </label>
        <label>
          Duration
          <select name="duration" value={form.duration} onChange={update}>
            <option value="30">30 minutes</option>
            <option value="45">45 minutes</option>
            <option value="60">60 minutes</option>
          </select>
        </label>
        <label>
          Interview type
          <select
            name="interviewType"
            value={form.interviewType}
            onChange={update}
          >
            <option value="ONLINE">Online</option>
            <option value="IN_PERSON">In person</option>
          </select>
        </label>
        {form.interviewType === "ONLINE" ? (
          <label>
            Meeting link
            <input
              name="meetingLink"
              type="url"
              placeholder="https://meet.example.com/..."
              value={form.meetingLink}
              onChange={update}
            />
          </label>
        ) : (
          <label>
            Location
            <input name="location" value={form.location} onChange={update} />
          </label>
        )}
        <label>
          Notes
          <textarea
            name="notes"
            maxLength="2000"
            value={form.notes}
            onChange={update}
          />
        </label>
        <button className="employer-primary-button" disabled={loading}>
          {loading ? "Scheduling..." : "Schedule Interview"}
        </button>
      </form>
    </main>
  );
}

export default ScheduleInterview;
