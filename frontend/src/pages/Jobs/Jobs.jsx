import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import SearchBar from "../../components/SearchBar/SearchBar";
import FilterBar from "../../components/FilterBar/FilterBar";
import JobCard from "../../components/JobCard/JobCard";
import "./Jobs.css";

function Jobs() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [jobs, setJobs] = useState([]);
  const [searchTerm, setSearchTerm] = useState(
    searchParams.get("keyword") || "",
  );
  const [location, setLocation] = useState(searchParams.get("location") || "");
  const [jobType, setJobType] = useState(searchParams.get("type") || "");
  const [workMode, setWorkMode] = useState(searchParams.get("workMode") || "");
  const [experience, setExperience] = useState(
    searchParams.get("experience") || "",
  );
  const [minSalary, setMinSalary] = useState(
    searchParams.get("minSalary") || "",
  );
  const [maxSalary, setMaxSalary] = useState(
    searchParams.get("maxSalary") || "",
  );
  const [skill, setSkill] = useState(searchParams.get("skills") || "");
  const [sort, setSort] = useState(searchParams.get("sort") || "newest");
  const [page, setPage] = useState(
    Math.max(1, Number(searchParams.get("page")) || 1),
  );
  const [totalPages, setTotalPages] = useState(0);
  const [totalJobs, setTotalJobs] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setSearchTerm(searchParams.get("keyword") || "");
    setLocation(searchParams.get("location") || "");
    setJobType(searchParams.get("type") || "");
    setWorkMode(searchParams.get("workMode") || "");
    setExperience(searchParams.get("experience") || "");
    setMinSalary(searchParams.get("minSalary") || "");
    setMaxSalary(searchParams.get("maxSalary") || "");
    setSkill(searchParams.get("skills") || "");
    setSort(searchParams.get("sort") || "newest");
    setPage(Math.max(1, Number(searchParams.get("page")) || 1));
  }, [searchParams]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const params = new URLSearchParams();
      const values = {
        keyword: searchTerm,
        location,
        type: jobType,
        workMode,
        experience,
        minSalary,
        maxSalary,
        skills: skill,
        sort,
        page: String(page),
        limit: "12",
      };
      Object.entries(values).forEach(([key, value]) => {
        if (value) params.set(key, value);
      });
      setSearchParams(params, { replace: true });
      setLoading(true);
      setError("");
      fetch(
        `${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/jobs?${params}`,
      )
        .then((response) => {
          if (!response.ok) throw new Error("Unable to load jobs");
          return response.json();
        })
        .then((data) => {
          setJobs(Array.isArray(data.jobs) ? data.jobs : []);
          setTotalJobs(data.totalJobs || 0);
          setTotalPages(data.totalPages || 0);
        })
        .catch(() => {
          setJobs([]);
          setError("Unable to load jobs. Please try again.");
        })
        .finally(() => setLoading(false));
    }, 400);
    return () => window.clearTimeout(timer);
  }, [
    searchTerm,
    location,
    jobType,
    workMode,
    experience,
    minSalary,
    maxSalary,
    skill,
    sort,
    page,
    setSearchParams,
  ]);

  const clearFilters = () => {
    setSearchTerm("");
    setLocation("");
    setJobType("");
    setWorkMode("");
    setExperience("");
    setMinSalary("");
    setMaxSalary("");
    setSkill("");
    setSort("newest");
    setPage(1);
  };

  const removeFilter = (setter) => {
    setter("");
    setPage(1);
  };
  const filters = [
    ["keyword", searchTerm, setSearchTerm],
    ["location", location, setLocation],
    ["type", jobType, setJobType],
    ["workMode", workMode, setWorkMode],
    ["experience", experience, setExperience],
    ["minSalary", minSalary, setMinSalary],
    ["maxSalary", maxSalary, setMaxSalary],
    ["skills", skill, setSkill],
  ];

  return (
    <section className="jobs-page">
      <div className="jobs-header">
        <h1>Find Your Dream Job</h1>
        <p>Search thousands of AI-powered job opportunities.</p>
        <div style={{ marginTop: "14px" }}>
          <Link
            to="/jobs/recommended"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              background: "linear-gradient(135deg, #1e40af, #6d28d9)",
              color: "#fff",
              padding: "8px 18px",
              borderRadius: "9999px",
              fontSize: "0.88rem",
              fontWeight: 600,
              textDecoration: "none",
              boxShadow: "0 2px 8px rgba(37, 99, 235, 0.25)",
            }}
          >
            ✨ View Personalized AI Job Recommendations →
          </Link>
        </div>
      </div>

      <SearchBar
        searchTerm={searchTerm}
        setSearchTerm={(value) => {
          setSearchTerm(value);
          setPage(1);
        }}
      />

      <FilterBar
        location={location}
        setLocation={(value) => {
          setLocation(value);
          setPage(1);
        }}
        jobType={jobType}
        setJobType={(value) => {
          setJobType(value);
          setPage(1);
        }}
        workMode={workMode}
        setWorkMode={(value) => {
          setWorkMode(value);
          setPage(1);
        }}
        experience={experience}
        setExperience={(value) => {
          setExperience(value);
          setPage(1);
        }}
        minSalary={minSalary}
        setMinSalary={(value) => {
          setMinSalary(value);
          setPage(1);
        }}
        maxSalary={maxSalary}
        setMaxSalary={(value) => {
          setMaxSalary(value);
          setPage(1);
        }}
        skill={skill}
        setSkill={(value) => {
          setSkill(value);
          setPage(1);
        }}
        clearFilters={clearFilters}
      />
      <div className="jobs-toolbar">
        <h3 className="job-count">
          {loading ? "Loading jobs..." : `${totalJobs} Jobs Found`}
        </h3>
        <select
          value={sort}
          onChange={(event) => {
            setSort(event.target.value);
            setPage(1);
          }}
          aria-label="Sort jobs"
        >
          <option value="newest">Newest</option>
          <option value="oldest">Oldest</option>
          <option value="salary-desc">Salary: High to Low</option>
          <option value="salary-asc">Salary: Low to High</option>
          <option value="best-match">Best Match</option>
        </select>
      </div>
      <div className="active-filters">
        {filters
          .filter(([, value]) => value)
          .map(([key, value, setter]) => (
            <button
              type="button"
              key={key}
              onClick={() => removeFilter(setter)}
            >
              {value} ×
            </button>
          ))}
      </div>
      {error ? (
        <div className="no-jobs">
          <h2>Unable to load jobs.</h2>
          <button type="button" onClick={() => setPage(page)}>
            Retry
          </button>
        </div>
      ) : loading ? (
        <div className="jobs-grid">
          {[1, 2, 3, 4].map((item) => (
            <div className="job-skeleton" key={item} />
          ))}
        </div>
      ) : jobs.length > 0 ? (
        <div className="jobs-grid">
          {jobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      ) : (
        <div className="no-jobs">
          <h2>No jobs found.</h2>
          <p>Try another keyword or location.</p>
          <button type="button" onClick={clearFilters}>
            Clear Filters
          </button>
        </div>
      )}
      {!loading && totalPages > 1 && (
        <div className="pagination">
          <button
            type="button"
            disabled={page <= 1}
            onClick={() => setPage((value) => value - 1)}
          >
            Previous
          </button>
          <span>
            Page {page} of {totalPages}
          </span>
          <button
            type="button"
            disabled={page >= totalPages}
            onClick={() => setPage((value) => value + 1)}
          >
            Next
          </button>
        </div>
      )}
    </section>
  );
}

export default Jobs;
