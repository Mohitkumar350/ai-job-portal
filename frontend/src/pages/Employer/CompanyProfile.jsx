import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CompanyForm from "../../components/employer/CompanyForm";
import {
  createCompany,
  getMyCompany,
  updateCompany,
} from "../../services/companyService";
import "./Employer.css";

function CompanyProfile() {
  const navigate = useNavigate();
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getMyCompany()
      .then((data) => setCompany(data.company))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading)
    return (
      <main className="employer-page">
        <p>Loading company profile...</p>
      </main>
    );
  if (error)
    return (
      <main className="employer-page">
        <p className="employer-error">{error}</p>
      </main>
    );

  return (
    <main className="employer-page">
      <div className="employer-header">
        <div>
          <p className="eyebrow">Employer workspace</p>
          <h1>{company ? "Edit Company Profile" : "Create Company Profile"}</h1>
          <p>Help candidates learn about your organization.</p>
        </div>
      </div>
      <CompanyForm
        initialValues={company || undefined}
        onSubmit={async (form) => {
          if (company) await updateCompany(form);
          else await createCompany(form);
          navigate("/employer/dashboard");
        }}
      />
    </main>
  );
}

export default CompanyProfile;
