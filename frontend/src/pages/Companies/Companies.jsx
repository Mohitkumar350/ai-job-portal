import { Link } from "react-router-dom";
import jobs from "../../data/jobs";
import "./Companies.css";

function Companies() {
  // Get unique companies
  const companies = [
    ...new Map(jobs.map((job) => [job.company, job])).values(),
  ];

  return (
    <section className="companies-page">
      {/* ================= HEADER ================= */}
      <div className="companies-header">
        <span className="companies-badge">🏢 Top Companies</span>

        <h1>
          Explore <span>Top Hiring Companies</span>
        </h1>

        <p>
          Discover leading companies and explore exciting career opportunities
          with them.
        </p>
      </div>

      {/* ================= COMPANY COUNT ================= */}
      <div className="companies-stats">
        <div className="stat-box">
          <strong>{companies.length}+</strong>
          <span>Companies Hiring</span>
        </div>

        <div className="stat-box">
          <strong>{jobs.length}+</strong>
          <span>Open Positions</span>
        </div>

        <div className="stat-box">
          <strong>100%</strong>
          <span>Verified Jobs</span>
        </div>
      </div>

      {/* ================= COMPANY GRID ================= */}
      <div className="companies-grid">
        {companies.map((company) => (
          <Link
            key={company.company}
            to={`/companies/${company.id}`}
            className="company-card"
          >
            {/* Card Top */}
            <div className="company-card-top">
              <div className="company-logo-wrapper">
                {company.logo ? (
                  <img
                    src={company.logo}
                    alt={company.company}
                    className="company-logo"
                  />
                ) : (
                  <span className="company-letter">
                    {company.company.charAt(0)}
                  </span>
                )}
              </div>

              <span className="verified">✓ Verified</span>
            </div>

            {/* Company Info */}
            <div className="company-info">
              <h2>{company.company}</h2>

              <p className="company-location">📍 {company.location}</p>

              <span className="company-type">{company.type}</span>
            </div>

            {/* Footer */}
            <div className="company-card-footer">
              <span>💼 Hiring Now</span>

              <span className="view-company">View Jobs →</span>
            </div>
          </Link>
        ))}
      </div>

      {/* ================= BOTTOM CTA ================= */}
      <div className="companies-cta">
        <div>
          <h2>Ready to find your next opportunity?</h2>

          <p>Explore thousands of jobs from top companies.</p>
        </div>

        <Link to="/jobs" className="explore-jobs-btn">
          Explore Jobs →
        </Link>
      </div>
    </section>
  );
}

export default Companies;
