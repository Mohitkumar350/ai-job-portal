import { useEffect, useState } from "react";

import "./FeaturedJobs.css";

import JobCard from "../JobCard/JobCard";
import FilterBar from "../FilterBar/FilterBar";

function FeaturedJobs() {
  const [jobs, setJobs] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");

  const [location, setLocation] = useState("All");

  const [jobType, setJobType] = useState("All");

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  // =====================================================
  // FETCH JOBS
  // =====================================================

  const fetchJobs = async () => {
    try {
      setLoading(true);

      setError("");

      const response = await fetch("http://localhost:5000/api/jobs");

      const data = await response.json();

      console.log("🔥 JOBS FROM BACKEND:", data);

      if (!response.ok) {
        throw new Error(data.message || "Failed to load jobs");
      }

      setJobs(data.jobs || []);
    } catch (error) {
      console.error("❌ FETCH JOBS ERROR:", error);

      setError("Unable to load jobs. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // LOAD JOBS
  // =====================================================

  useEffect(() => {
    fetchJobs();
  }, []);

  // =====================================================
  // CLEAR FILTERS
  // =====================================================

  const clearFilters = () => {
    setSearchTerm("");

    setLocation("All");

    setJobType("All");
  };

  // =====================================================
  // FILTER JOBS
  // =====================================================

  const filteredJobs = jobs.filter((job) => {
    const search = searchTerm.toLowerCase().trim();

    const matchesSearch =
      !search ||
      job.title?.toLowerCase().includes(search) ||
      job.company?.toLowerCase().includes(search) ||
      job.skills?.some((skill) => skill.toLowerCase().includes(search));

    const matchesLocation =
      location === "All" ||
      job.location?.toLowerCase().includes(location.toLowerCase());

    const matchesJobType =
      jobType === "All" ||
      job.type?.toLowerCase().includes(jobType.toLowerCase());

    return matchesSearch && matchesLocation && matchesJobType;
  });

  // =====================================================
  // UI
  // =====================================================

  return (
    <section className="featured-jobs">
      <div className="featured-header">
        <span className="section-badge">✨ LIVE JOBS</span>

        <h2>
          Latest <span>Job Opportunities</span>
        </h2>

        <p>Discover fresh opportunities from companies hiring right now.</p>
      </div>

      <FilterBar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        location={location}
        setLocation={setLocation}
        jobType={jobType}
        setJobType={setJobType}
        clearFilters={clearFilters}
      />

      {/* =================================================
          LOADING
      ================================================= */}

      {loading && (
        <div className="jobs-status">
          <div className="job-spinner"></div>

          <h3>Finding fresh jobs...</h3>

          <p>We're fetching the latest opportunities.</p>
        </div>
      )}

      {/* =================================================
          ERROR
      ================================================= */}

      {!loading && error && (
        <div className="jobs-status error">
          <h3>😕 Something went wrong</h3>

          <p>{error}</p>

          <button onClick={fetchJobs} className="retry-jobs-btn">
            Try Again
          </button>
        </div>
      )}

      {/* =================================================
          JOBS
      ================================================= */}

      {!loading && !error && filteredJobs.length > 0 && (
        <div className="jobs-grid">
          {filteredJobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      )}

      {/* =================================================
          NO JOBS
      ================================================= */}

      {!loading && !error && filteredJobs.length === 0 && (
        <div className="jobs-status">
          <h3>🔍 No jobs found</h3>

          <p>Try changing your search or filters.</p>

          <button onClick={clearFilters} className="retry-jobs-btn">
            Clear Filters
          </button>
        </div>
      )}
    </section>
  );
}

export default FeaturedJobs;
