import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import { applyForJob } from "../../services/applicationsService";
import jobs from "../../data/jobs";

import "./ApplyJob.css";

function ApplyJob() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [job, setJob] = useState(() =>
    jobs.find((item) => String(item.id) === String(id)),
  );
  const [jobLoading, setJobLoading] = useState(!job);

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [coverLetter, setCoverLetter] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (job) return undefined;
    fetch(`http://localhost:5000/api/jobs/${id}`)
      .then((response) => {
        if (!response.ok) throw new Error("Job not found");
        return response.json();
      })
      .then((data) => setJob(data.job))
      .catch(() => setJob(null))
      .finally(() => setJobLoading(false));
    return undefined;
  }, [id, job]);

  if (jobLoading) {
    return <h2>Loading job...</h2>;
  }

  if (!job) {
    return <h2>Job Not Found</h2>;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    // Check login
    if (!token || !storedUser) {
      alert("Please login first.");
      navigate("/login");
      return;
    }

    let user;

    try {
      user = JSON.parse(storedUser);
    } catch (error) {
      console.error("Invalid user data:", error);

      localStorage.removeItem("token");
      localStorage.removeItem("user");

      navigate("/login");
      return;
    }

    setLoading(true);

    try {
      await applyForJob(job.id, {
        title: job.title,
        company: job.company,
        location: job.location,
        fullName,
        phone,
        coverLetter,
      });

      alert("Application Submitted Successfully! 🎉");

      navigate("/my-applications");
    } catch (error) {
      console.error("Application error:", error);

      if (error.message?.toLowerCase().includes("token")) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        alert("Session expired. Please login again.");

        navigate("/login");
        return;
      }

      if (error.status === 409) {
        alert("You have already applied for this job.");
      } else {
        alert(error.message || "Something went wrong.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="apply-page">
      <div className="apply-card">
        <h1>Apply for {job.title}</h1>

        <p>{job.company}</p>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Full Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />

          <input
            type="tel"
            placeholder="Phone Number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />

          <textarea
            placeholder="Cover Letter"
            rows="6"
            value={coverLetter}
            onChange={(e) => setCoverLetter(e.target.value)}
          />

          <button type="submit" disabled={loading}>
            {loading ? "Submitting..." : "Submit Application"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default ApplyJob;
