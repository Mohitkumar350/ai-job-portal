import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import NotificationBell from "../NotificationBell/NotificationBell";

import "./Navbar.css";

function Navbar() {
  const navigate = useNavigate();

  const { currentUser, logout, loading } = useAuth();

  const isLoggedIn = !!currentUser;
  const isAdmin = currentUser?.role === "admin";
  const isEmployer = currentUser?.role === "employer";

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
  // ONLY ADMIN DASHBOARD + LOGOUT
  // =====================================================

  if (isAdmin) {
    return (
      <nav className="navbar admin-navbar">
        <div className="navbar-container">
          {/* ADMIN LOGO */}

          <Link to="/admin" className="navbar-logo">
            MohiJobs
          </Link>

          {/* ADMIN ONLY LINK */}

          <div className="navbar-links admin-links">
            <NavLink
              to="/admin"
              className={({ isActive }) =>
                isActive
                  ? "nav-link admin-nav-link active"
                  : "nav-link admin-nav-link"
              }
            >
              👑 Admin Dashboard
            </NavLink>
          </div>

          {/* ADMIN RIGHT SIDE */}

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

  if (isEmployer) {
    return (
      <nav className="navbar employer-navbar">
        <div className="navbar-container">
          <Link to="/employer/dashboard" className="navbar-logo">
            MohiJobs
          </Link>

          <div className="navbar-links">
            <NavLink to="/employer/dashboard" className="nav-link">
              Employer Dashboard
            </NavLink>
            <NavLink to="/employer/jobs" className="nav-link">
              My Jobs
            </NavLink>
            <NavLink to="/employer/company" className="nav-link">
              Company Profile
            </NavLink>
            <NavLink to="/employer/interviews" className="nav-link">
              Interviews
            </NavLink>
            <NavLink to="/employer/analytics" className="nav-link">
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

        <Link to="/" className="navbar-logo">
          MohiJobs
        </Link>

        {/* NORMAL LINKS */}

        <div className="navbar-links">
          <NavLink to="/" className="nav-link">
            Home
          </NavLink>

          <NavLink to="/jobs" className="nav-link">
            Jobs
          </NavLink>

          <NavLink to="/companies" className="nav-link">
            Companies
          </NavLink>

          <NavLink to="/resume-ai" className="nav-link">
            Resume AI
          </NavLink>

          <NavLink to="/interview-ai" className="nav-link">
            Interview AI
          </NavLink>

          {/* LOGGED-IN USER LINKS */}

          {isLoggedIn && (
            <>
              <NavLink to="/jobs/recommended" className="nav-link">
                🤖 Recommended Jobs
              </NavLink>

              <NavLink to="/profile" className="nav-link">
                Profile
              </NavLink>

              <NavLink to="/dashboard" className="nav-link">
                Dashboard
              </NavLink>

              <NavLink to="/my-applications" className="nav-link">
                My Applications
              </NavLink>

              <NavLink to="/saved-jobs" className="nav-link">
                Saved Jobs
              </NavLink>
            </>
          )}
        </div>

        {/* NORMAL USER RIGHT SIDE */}

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
              <Link to="/login" className="navbar-login">
                Login
              </Link>

              <Link to="/signup" className="navbar-signup">
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
