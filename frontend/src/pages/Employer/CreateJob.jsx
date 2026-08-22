import { useNavigate } from "react-router-dom";
import JobForm from "../../components/employer/JobForm";
import { createJob } from "../../services/jobService";
import "./Employer.css";

function CreateJob() {
  const navigate = useNavigate();
  return (
    <main className="employer-page">
      <div className="employer-header">
        <div>
          <p className="eyebrow">Employer workspace</p>
          <h1>Post New Job</h1>
          <p>Create a clear listing for the right candidates.</p>
        </div>
      </div>
      <JobForm
        submitLabel="Create Job"
        onSubmit={async (form) => {
          await createJob(form);
          navigate("/employer/jobs");
        }}
      />
    </main>
  );
}

export default CreateJob;
