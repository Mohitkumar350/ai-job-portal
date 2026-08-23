import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";
import NotificationBell from "../NotificationBell/NotificationBell";

import "./Navbar.css";

function Navbar() {
  const navigate = useNavigate();
  const { currentUser, logout, loading } = useAuth();

  const [menuOpen, setMenuOpen] = useState(false);

  const isLoggedIn = !!currentUser;
  const isAdmin = currentUser?.role === "admin";
  const isEmployer = currentUser?.role === "employer";

  const closeMenu = () => {
    setMenuOpen(false);
  };

  // =====================================================
  // LOGOUT
  // =====================================================

  const handleLogout = () => {
    try {
      if (logout) {
        logout();
      }
    } catch (error) {
      console.error("LOGOUT ERROR:", error);
    }

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setMenuOpen(false);

    navigate("/login", {
      replace: true,
    });
  };

  // =====================================================
  // AUTH LOADING
  // =====================================================

  if (loading) {
    return null;
  }

  // =====================================================
  // ADMIN NAVBAR
  // =====================================================

  if (isAdmin) {
    return (
      <nav className="navbar admin-navbar">
        <div className="navbar-container">
          <Link to="/admin" className="navbar-logo" onClick={closeMenu}>
            MohiJobs
          </Link>

          {/* MOBILE MENU BUTTON */}
          <button
            type="button"
            className="mobile-menu-button"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle navigation"
          >
            {menuOpen ? "✕" : "☰"}
          </button>

          <div
            className={`navbar-links admin-links ${
              menuOpen ? "mobile-menu-open" : ""
            }`}
          >
            <NavLink
              to="/admin"
              className="nav-link admin-nav-link"
              onClick={closeMenu}
            >
              👑 Admin Dashboard
            </NavLink>
          </div>

          <div className="navbar-right">
            <NotificationBell />

            <div className="admin-user-info">
              <span className="navbar-username">{currentUser.name}</span>

              <span className="admin-role-badge">ADMIN</span>
            </div>

            <button
              type="button"
              className="navbar-logout"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        </div>
      </nav>
    );
  }

  // =====================================================
  // EMPLOYER NAVBAR
  // =====================================================

  if (isEmployer) {
    return (
      <nav className="navbar employer-navbar">
        <div className="navbar-container">
          <Link
            to="/employer/dashboard"
            className="navbar-logo"
            onClick={closeMenu}
          >
            MohiJobs
          </Link>

          {/* MOBILE MENU BUTTON */}
          <button
            type="button"
            className="mobile-menu-button"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle navigation"
          >
            {menuOpen ? "✕" : "☰"}
          </button>

          <div className={`navbar-links ${menuOpen ? "mobile-menu-open" : ""}`}>
            <NavLink
              to="/employer/dashboard"
              className="nav-link"
              onClick={closeMenu}
            >
              Employer Dashboard
            </NavLink>

            <NavLink
              to="/employer/jobs"
              className="nav-link"
              onClick={closeMenu}
            >
              My Jobs
            </NavLink>

            <NavLink
              to="/employer/company"
              className="nav-link"
              onClick={closeMenu}
            >
              Company Profile
            </NavLink>

            <NavLink
              to="/employer/interviews"
              className="nav-link"
              onClick={closeMenu}
            >
              Interviews
            </NavLink>

            <NavLink
              to="/employer/analytics"
              className="nav-link"
              onClick={closeMenu}
            >
              Analytics
            </NavLink>
          </div>

          <div className="navbar-right">
            <NotificationBell />

            <span className="navbar-username">{currentUser.name}</span>

            <button
              type="button"
              className="navbar-logout"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        </div>
      </nav>
    );
  }

  // =====================================================
  // NORMAL USER / GUEST NAVBAR
  // =====================================================

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* LOGO */}

        <Link to="/" className="navbar-logo" onClick={closeMenu}>
          MohiJobs
        </Link>

        {/* MOBILE MENU BUTTON */}

        <button
          type="button"
          className="mobile-menu-button"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle navigation"
        >
          {menuOpen ? "✕" : "☰"}
        </button>

        {/* NAV LINKS */}

        <div className={`navbar-links ${menuOpen ? "mobile-menu-open" : ""}`}>
          <NavLink to="/" className="nav-link" onClick={closeMenu}>
            Home
          </NavLink>

          <NavLink to="/jobs" className="nav-link" onClick={closeMenu}>
            Jobs
          </NavLink>

          <NavLink to="/companies" className="nav-link" onClick={closeMenu}>
            Companies
          </NavLink>

          <NavLink to="/resume-ai" className="nav-link" onClick={closeMenu}>
            Resume AI
          </NavLink>

          <NavLink to="/interview-ai" className="nav-link" onClick={closeMenu}>
            Interview AI
          </NavLink>

          {isLoggedIn && (
            <>
              <NavLink
                to="/jobs/recommended"
                className="nav-link"
                onClick={closeMenu}
              >
                🤖 Recommended Jobs
              </NavLink>

              <NavLink to="/profile" className="nav-link" onClick={closeMenu}>
                Profile
              </NavLink>

              <NavLink to="/dashboard" className="nav-link" onClick={closeMenu}>
                Dashboard
              </NavLink>

              <NavLink
                to="/my-applications"
                className="nav-link"
                onClick={closeMenu}
              >
                My Applications
              </NavLink>

              <NavLink
                to="/saved-jobs"
                className="nav-link"
                onClick={closeMenu}
              >
                Saved Jobs
              </NavLink>
            </>
          )}
        </div>

        {/* RIGHT SIDE */}

        <div className="navbar-right">
          {isLoggedIn ? (
            <>
              <NotificationBell />

              <span className="navbar-username">{currentUser.name}</span>

              <button
                type="button"
                className="navbar-logout"
                onClick={handleLogout}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="navbar-login" onClick={closeMenu}>
                Login
              </Link>

              <Link to="/signup" className="navbar-signup" onClick={closeMenu}>
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
