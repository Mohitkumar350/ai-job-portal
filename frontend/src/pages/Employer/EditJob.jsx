import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import JobForm from "../../components/employer/JobForm";
import { getJob, updateJob } from "../../services/jobService";
import "./Employer.css";

function EditJob() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    getJob(id)
      .then((data) => setJob(data.job))
      .catch((err) => setError(err.message));
  }, [id]);

  if (error)
    return (
      <main className="employer-page">
        <p className="employer-error">{error}</p>
      </main>
    );
  if (!job)
    return (
      <main className="employer-page">
        <p>Loading job...</p>
      </main>
    );

  return (
    <main className="employer-page">
      <div className="employer-header">
        <div>
          <p className="eyebrow">Employer workspace</p>
          <h1>Edit Job</h1>
        </div>
      </div>
      <JobForm
        initialValues={job}
        submitLabel="Save Changes"
        onSubmit={async (form) => {
          await updateJob(id, form);
          navigate("/employer/jobs");
        }}
      />
    </main>
  );
}

export default EditJob;
