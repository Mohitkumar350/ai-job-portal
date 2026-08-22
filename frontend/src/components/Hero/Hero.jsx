import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Hero.css";

function Hero() {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();

    if (search.trim()) {
      navigate(`/jobs?search=${encodeURIComponent(search.trim())}`);
    } else {
      navigate("/jobs");
    }
  };

  return (
    <section className="hero">
      {/* Background Decorations */}
      <div className="hero-glow hero-glow-one"></div>
      <div className="hero-glow hero-glow-two"></div>

      <div className="hero-container">
        {/* LEFT CONTENT */}
        <div className="hero-content">
          {/* AI Badge */}
          <div className="hero-badge">
            <span className="badge-dot"></span>
            AI-Powered Job Search
          </div>

          {/* Heading */}
          <h1 className="hero-title">
            Find Your
            <span> Dream Job</span>
            <br />
            with AI
          </h1>

          {/* Description */}
          <p className="hero-description">
            Discover opportunities that match your skills, experience, and
            career goals. Let AI help you find the right job faster.
          </p>

          {/* Search */}
          <form className="hero-search" onSubmit={handleSearch}>
            <div className="search-icon">🔍</div>

            <input
              type="text"
              placeholder="Search jobs, skills, or companies..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <button type="submit">Search Jobs</button>
          </form>

          {/* Popular Searches */}
          <div className="popular-searches">
            <span>Popular:</span>

            <button
              type="button"
              onClick={() => {
                setSearch("Frontend Developer");
                navigate("/jobs?search=Frontend%20Developer");
              }}
            >
              Frontend Developer
            </button>

            <button
              type="button"
              onClick={() => {
                setSearch("React Developer");
                navigate("/jobs?search=React%20Developer");
              }}
            >
              React Developer
            </button>

            <button
              type="button"
              onClick={() => {
                setSearch("Java Developer");
                navigate("/jobs?search=Java%20Developer");
              }}
            >
              Java Developer
            </button>
          </div>

          {/* Stats */}
          <div className="hero-stats">
            <div className="hero-stat">
              <strong>10K+</strong>
              <span>Jobs</span>
            </div>

            <div className="stat-divider"></div>

            <div className="hero-stat">
              <strong>500+</strong>
              <span>Companies</span>
            </div>

            <div className="stat-divider"></div>

            <div className="hero-stat">
              <strong>50K+</strong>
              <span>Candidates</span>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="hero-visual">
          {/* Main AI Circle */}
          <div className="ai-circle">
            <div className="ai-circle-inner">
              <span>AI</span>
              <small>SMART</small>
            </div>
          </div>

          {/* Floating Card 1 */}
          <div className="floating-card card-one">
            <div className="floating-icon">💼</div>

            <div>
              <strong>10K+</strong>
              <span>Active Jobs</span>
            </div>
          </div>

          {/* Floating Card 2 */}
          <div className="floating-card card-two">
            <div className="floating-icon">🎯</div>

            <div>
              <strong>95%</strong>
              <span>Match Rate</span>
            </div>
          </div>

          {/* Floating Card 3 */}
          <div className="floating-card card-three">
            <div className="company-mini-logo">G</div>

            <div>
              <strong>Google</strong>
              <span>Hiring Now</span>
            </div>

            <div className="online-dot"></div>
          </div>

          {/* Dots */}
          <div className="visual-dot dot-one"></div>
          <div className="visual-dot dot-two"></div>
          <div className="visual-dot dot-three"></div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
