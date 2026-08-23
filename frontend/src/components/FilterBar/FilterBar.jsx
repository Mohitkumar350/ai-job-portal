import { useState } from "react";
import "./FilterBar.css";

function FilterBar({
  location,
  setLocation,
  jobType,
  setJobType,
  workMode,
  setWorkMode,
  experience,
  setExperience,
  minSalary,
  setMinSalary,
  maxSalary,
  setMaxSalary,
  skill,
  setSkill,
  clearFilters,
}) {
  const [open, setOpen] = useState(false);

  const handleClear = () => {
    clearFilters();
    setOpen(false);
  };

  return (
    <div className="filter-bar">
      {/* MOBILE FILTER BUTTON */}
      <button
        type="button"
        className="filter-toggle"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
      >
        {open ? "✕ Hide Filters" : "☰ Filters"}
      </button>

      {/* FILTER CONTROLS */}
      <div className={`filter-controls ${open ? "open" : ""}`}>
        {/* LOCATION */}
        <select
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          aria-label="Location"
        >
          <option value="">All Locations (India)</option>
          <option value="Bengaluru">Bengaluru / Bangalore</option>
          <option value="Hyderabad">Hyderabad</option>
          <option value="Pune">Pune</option>
          <option value="Mumbai">Mumbai</option>
          <option value="Delhi">Delhi NCR</option>
          <option value="Gurgaon">Gurgaon</option>
          <option value="Noida">Noida</option>
          <option value="Chennai">Chennai</option>
          <option value="Remote">Remote (India)</option>
        </select>

        {/* JOB TYPE */}
        <select
          value={jobType}
          onChange={(e) => setJobType(e.target.value)}
          aria-label="Job Type"
        >
          <option value="">All Job Types</option>
          <option value="Full-Time">Full-Time</option>
          <option value="Part-Time">Part-Time</option>
          <option value="Internship">Internship</option>
          <option value="Contract">Contract</option>
        </select>

        {/* EXPERIENCE */}
        <select
          value={experience}
          onChange={(e) => setExperience(e.target.value)}
          aria-label="Experience"
        >
          <option value="">All Experience</option>
          <option value="Fresher">Fresher</option>
          <option value="0-1">0-1 years</option>
          <option value="1-3">1-3 years</option>
          <option value="3-5">3-5 years</option>
          <option value="5+">5+ years</option>
        </select>

        {/* WORK MODE */}
        <select
          value={workMode}
          onChange={(e) => setWorkMode(e.target.value)}
          aria-label="Work Mode"
        >
          <option value="">All Work Modes</option>
          <option value="Remote">Remote</option>
          <option value="On-site">On-Site</option>
          <option value="Hybrid">Hybrid</option>
        </select>

        {/* MIN SALARY */}
        <input
          type="number"
          min="0"
          placeholder="Min salary"
          value={minSalary}
          onChange={(e) => setMinSalary(e.target.value)}
          aria-label="Minimum salary"
        />

        {/* MAX SALARY */}
        <input
          type="number"
          min="0"
          placeholder="Max salary"
          value={maxSalary}
          onChange={(e) => setMaxSalary(e.target.value)}
          aria-label="Maximum salary"
        />

        {/* SKILL */}
        <input
          type="text"
          placeholder="Skill"
          value={skill}
          onChange={(e) => setSkill(e.target.value)}
          aria-label="Skill"
        />

        {/* CLEAR */}
        <button
          type="button"
          className="clear-filter-button"
          onClick={handleClear}
        >
          Clear Filters
        </button>
      </div>
    </div>
  );
}

export default FilterBar;
