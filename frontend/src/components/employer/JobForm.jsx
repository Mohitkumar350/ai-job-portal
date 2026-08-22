import { useState } from "react";

const initialJob = {
  title: "",
  company: "",
  description: "",
  location: "",
  salaryMin: "",
  salaryMax: "",
  experience: "",
  employmentType: "Full-Time",
  workMode: "On-site",
  skills: "",
  requirements: "",
  benefits: "",
};

function JobForm({ initialValues = initialJob, onSubmit, submitLabel }) {
  const [form, setForm] = useState({
    ...initialJob,
    ...initialValues,
    skills: (initialValues.skills || []).join(", "),
    requirements: (initialValues.requirements || []).join("\n"),
    benefits: (initialValues.benefits || []).join("\n"),
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
    const required = [
      "title",
      "company",
      "description",
      "location",
      "experience",
    ];
    if (required.some((field) => !form[field].trim())) {
      setError("Please complete all required fields.");
      return;
    }
    if (
      form.salaryMin &&
      form.salaryMax &&
      Number(form.salaryMin) > Number(form.salaryMax)
    ) {
      setError("Salary minimum cannot exceed salary maximum.");
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

  const fields = [
    ["title", "Job Title"],
    ["company", "Company"],
    ["location", "Location"],
    ["experience", "Experience"],
  ];
  return (
    <form className="job-form" onSubmit={submit}>
      {error && <p className="employer-error">{error}</p>}
      <div className="job-form-grid">
        {fields.map(([name, label]) => (
          <label key={name}>
            {label}
            <input name={name} value={form[name]} onChange={update} required />
          </label>
        ))}
        <label>
          Salary Min
          <input
            name="salaryMin"
            type="number"
            min="0"
            value={form.salaryMin}
            onChange={update}
          />
        </label>
        <label>
          Salary Max
          <input
            name="salaryMax"
            type="number"
            min="0"
            value={form.salaryMax}
            onChange={update}
          />
        </label>
        <label>
          Employment Type
          <select
            name="employmentType"
            value={form.employmentType}
            onChange={update}
          >
            {["Full-Time", "Part-Time", "Internship", "Contract"].map(
              (item) => (
                <option key={item}>{item}</option>
              ),
            )}
          </select>
        </label>
        <label>
          Work Mode
          <select name="workMode" value={form.workMode} onChange={update}>
            {["Remote", "On-site", "Hybrid"].map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </label>
      </div>
      <label>
        Description
        <textarea
          name="description"
          value={form.description}
          onChange={update}
          required
        />
      </label>
      <label>
        Skills <span className="field-hint">comma separated</span>
        <input name="skills" value={form.skills} onChange={update} />
      </label>
      <label>
        Requirements
        <textarea
          name="requirements"
          value={form.requirements}
          onChange={update}
        />
      </label>
      <label>
        Benefits
        <textarea name="benefits" value={form.benefits} onChange={update} />
      </label>
      <button className="employer-primary-button" disabled={loading}>
        {loading ? "Saving..." : submitLabel}
      </button>
    </form>
  );
}

export { initialJob };
export default JobForm;
