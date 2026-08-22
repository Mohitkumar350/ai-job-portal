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

  return (
    <div className="filter-bar">
      <button
        type="button"
        className="filter-toggle"
        onClick={() => setOpen((value) => !value)}
      >
        Filters
      </button>
      <div className={`filter-controls ${open ? "open" : ""}`}>
        <select value={location} onChange={(e) => setLocation(e.target.value)}>
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

        <select value={jobType} onChange={(e) => setJobType(e.target.value)}>
          <option value="">All Job Types</option>
          <option value="Full-Time">Full-Time</option>
          <option value="Part-Time">Part-Time</option>
          <option value="Internship">Internship</option>
          <option value="Contract">Contract</option>
        </select>

        <select
          value={experience}
          onChange={(e) => setExperience(e.target.value)}
        >
          <option value="">All Experience</option>
          <option value="Fresher">Fresher</option>
          <option value="0-1">0-1 years</option>
          <option value="1-3">1-3 years</option>
          <option value="3-5">3-5 years</option>
          <option value="5+">5+ years</option>
        </select>

        <select value={workMode} onChange={(e) => setWorkMode(e.target.value)}>
          <option value="">All Work Modes</option>
          <option value="Remote">Remote</option>
          <option value="On-site">On-Site</option>
          <option value="Hybrid">Hybrid</option>
        </select>

        <input
          type="number"
          min="0"
          placeholder="Min salary"
          value={minSalary}
          onChange={(e) => setMinSalary(e.target.value)}
        />
        <input
          type="number"
          min="0"
          placeholder="Max salary"
          value={maxSalary}
          onChange={(e) => setMaxSalary(e.target.value)}
        />
        <input
          type="text"
          placeholder="Skill"
          value={skill}
          onChange={(e) => setSkill(e.target.value)}
        />

        <button type="button" onClick={clearFilters}>
          Clear Filters
        </button>
      </div>
    </div>
  );
}

export default FilterBar;
