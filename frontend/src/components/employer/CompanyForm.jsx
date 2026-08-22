import { useState } from "react";

const initialCompany = {
  name: "",
  industry: "",
  description: "",
  location: "",
  website: "",
  companySize: "",
  foundedYear: "",
  contactEmail: "",
  logo: "",
};

function CompanyForm({ initialValues = initialCompany, onSubmit }) {
  const [form, setForm] = useState({ ...initialCompany, ...initialValues });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const update = (event) =>
    setForm((previous) => ({
      ...previous,
      [event.target.name]: event.target.value,
    }));

  const handleLogo = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      setError("Logo must be JPG, PNG, or WEBP.");
      return;
    }
    if (file.size > 500 * 1024) {
      setError("Logo must be smaller than 500KB.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () =>
      setForm((previous) => ({ ...previous, logo: reader.result }));
    reader.readAsDataURL(file);
  };

  const submit = async (event) => {
    event.preventDefault();
    setError("");
    if (!form.name.trim()) {
      setError("Company name is required.");
      return;
    }
    if (form.website && !/^https?:\/\//i.test(form.website)) {
      setError("Website must start with http:// or https://.");
      return;
    }
    if (
      form.contactEmail &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(form.contactEmail)
    ) {
      setError("Please enter a valid contact email.");
      return;
    }
    try {
      setLoading(true);
      await onSubmit(form);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="job-form company-form" onSubmit={submit}>
      {error && <p className="employer-error">{error}</p>}
      <div className="job-form-grid">
        <label>
          Company Name
          <input name="name" value={form.name} onChange={update} required />
        </label>
        <label>
          Industry
          <input name="industry" value={form.industry} onChange={update} />
        </label>
        <label>
          Location
          <input name="location" value={form.location} onChange={update} />
        </label>
        <label>
          Company Size
          <select name="companySize" value={form.companySize} onChange={update}>
            <option value="">Select size</option>
            {["1-10", "11-50", "51-200", "201-500", "501+"].map((size) => (
              <option key={size}>{size}</option>
            ))}
          </select>
        </label>
        <label>
          Website
          <input
            name="website"
            type="url"
            placeholder="https://example.com"
            value={form.website}
            onChange={update}
          />
        </label>
        <label>
          Founded Year
          <input
            name="foundedYear"
            type="number"
            min="1800"
            max={new Date().getFullYear()}
            value={form.foundedYear}
            onChange={update}
          />
        </label>
        <label>
          Contact Email
          <input
            name="contactEmail"
            type="email"
            value={form.contactEmail}
            onChange={update}
          />
        </label>
        <label>
          Company Logo
          <input
            type="file"
            accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
            onChange={handleLogo}
          />
        </label>
      </div>
      <label>
        Description
        <textarea
          name="description"
          maxLength="2000"
          value={form.description}
          onChange={update}
        />
      </label>
      {form.logo && (
        <img
          className="company-logo-preview"
          src={form.logo}
          alt="Company logo preview"
        />
      )}
      <button className="employer-primary-button" disabled={loading}>
        {loading ? "Saving..." : "Save Company Profile"}
      </button>
    </form>
  );
}

export default CompanyForm;
