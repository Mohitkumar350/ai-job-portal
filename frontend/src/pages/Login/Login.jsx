import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  sendEmailVerification,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { useAuth } from "../../context/AuthContext";
import { auth } from "../../firebase";
import "./Login.css";

function Login() {
  const navigate = useNavigate();

  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [resendCooldown, setResendCooldown] = useState(0);

  useEffect(() => {
    if (resendCooldown <= 0) return undefined;

    const timer = window.setInterval(() => {
      setResendCooldown((seconds) => Math.max(seconds - 1, 0));
    }, 1000);

    return () => window.clearInterval(timer);
  }, [resendCooldown]);

  // ==========================================
  // HANDLE INPUT
  // ==========================================

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setError("");
    setSuccessMsg("");
  };

  // ==========================================
  // LOGIN
  // ==========================================

  const handleLogin = async (event) => {
    event.preventDefault();

    setError("");
    setSuccessMsg("");

    // ------------------------------------------
    // VALIDATION
    // ------------------------------------------

    const cleanEmail = formData.email.trim().toLowerCase();

    if (!cleanEmail || !formData.password) {
      setError("Please enter email and password.");
      return;
    }

    try {
      setLoading(true);

      const credential = await signInWithEmailAndPassword(
        auth,
        cleanEmail,
        formData.password,
      );
      const user = credential.user;

      await user.reload();

      if (!user.emailVerified) {
        await signOut(auth);
        throw new Error(
          "Please verify your email before logging in. Check your inbox and Spam/Junk folder.",
        );
      }

      const firebaseToken = await credential.user.getIdToken(true);
      const requestedRole = localStorage.getItem(`signup-role:${cleanEmail}`);
      const response = await fetch(
        `${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/auth/firebase-email-login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ idToken: firebaseToken, requestedRole }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed.");
      }

      if (!data.token || !data.user) {
        throw new Error("Login response was incomplete.");
      }

      console.log("LOGIN USER:", data.user);

      console.log("USER ROLE:", data.user.role);

      // ========================================
      // UPDATE AUTH CONTEXT
      // ========================================

      const loginSuccess = login(data.user, data.token);

      if (loginSuccess === false) {
        throw new Error("Unable to save login session.");
      }

      localStorage.removeItem(`signup-role:${cleanEmail}`);

      // ========================================
      // REDIRECT BY ROLE
      // ========================================

      if (data.user.role === "admin") {
        navigate("/admin", { replace: true });
        return;
      }

      if (data.user.role === "employer") {
        navigate("/employer/dashboard", { replace: true });
        return;
      }

      navigate("/dashboard", { replace: true });
    } catch (error) {
      console.error("LOGIN ERROR:", error);

      const messages = {
        "auth/invalid-credential": "Email or password is incorrect.",
        "auth/user-not-found": "Email or password is incorrect.",
        "auth/wrong-password": "Email or password is incorrect.",
        "auth/too-many-requests": "Too many attempts. Please try again later.",
        "auth/invalid-email": "Please enter a valid email address.",
      };

      setError(
        messages[error.code] ||
          error.message ||
          "Unable to login. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResendVerification = async () => {
    const cleanEmail = formData.email.trim().toLowerCase();

    if (!cleanEmail || !formData.password || resendCooldown > 0) return;

    try {
      setLoading(true);
      setError("");
      setSuccessMsg("");

      const credential = await signInWithEmailAndPassword(
        auth,
        cleanEmail,
        formData.password,
      );
      const user = credential.user;

      await user.reload();

      if (user.emailVerified) {
        await signOut(auth);
        setSuccessMsg("Your email is already verified! You can now log in.");
        return;
      }

      const actionCodeSettings = {
        url: `${window.location.origin}/login`,
        handleCodeInApp: false,
      };

      await sendEmailVerification(user, actionCodeSettings);
      await signOut(auth);
      setResendCooldown(30);
      setSuccessMsg(
        "Verification email sent! Please check your Inbox, Spam/Junk, and Promotions folders.",
      );
    } catch (error) {
      const messages = {
        "auth/invalid-credential": "Email or password is incorrect.",
        "auth/user-not-found": "Email or password is incorrect.",
        "auth/wrong-password": "Email or password is incorrect.",
        "auth/too-many-requests": "Too many attempts. Please try again later.",
      };

      setError(messages[error.code] || "Unable to resend verification email.");
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // UI
  // ==========================================

  return (
    <div className="login-page">
      {/* ======================================
          LEFT SIDE
      ====================================== */}

      <div className="login-left">
        <div className="login-card">
          {/* HEADER */}

          <div className="login-header">
            <div className="login-icon">🔐</div>

            <h1>Welcome Back 👋</h1>

            <p>Login to your MohiJobs account</p>
          </div>

          {/* ERROR & SUCCESS MESSAGES */}

          {error && <div className="login-error">❌ {error}</div>}
          {successMsg && (
            <div
              style={{
                color: "#16a34a",
                backgroundColor: "#f0fdf4",
                border: "1px solid #bbf7d0",
                borderRadius: "8px",
                padding: "10px 14px",
                marginBottom: "16px",
                fontSize: "0.9rem",
                textAlign: "center",
              }}
            >
              ✅ {successMsg}
            </div>
          )}

          <div style={{ marginBottom: "16px", textAlign: "center" }}>
            <button
              type="button"
              className="resend-verification-btn"
              onClick={handleResendVerification}
              disabled={loading || resendCooldown > 0}
            >
              {resendCooldown > 0
                ? `Resend available in ${resendCooldown}s`
                : "Resend verification email"}
            </button>
          </div>

          {/* FORM */}

          <form onSubmit={handleLogin}>
            {/* EMAIL */}

            <div className="login-form-group">
              <label htmlFor="email">Email Address</label>

              <div className="input-wrapper">
                <span className="input-icon">✉️</span>

                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  autoComplete="email"
                  required
                />
              </div>
            </div>

            {/* PASSWORD */}

            <div className="login-form-group">
              <label htmlFor="password">Password</label>

              <div className="input-wrapper">
                <span className="input-icon">🔒</span>

                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  autoComplete="current-password"
                  required
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword((previous) => !previous)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? "🙈" : "👁️"}
                </button>
              </div>
            </div>

            {/* LOGIN BUTTON */}

            <button type="submit" className="login-btn" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          {/* REGISTER */}

          <div className="register-link">
            <span>Don't have an account?</span>

            <Link to="/signup">Create Account</Link>
          </div>
        </div>
      </div>

      {/* ======================================
          RIGHT SIDE
      ====================================== */}

      <div className="login-right">
        <div className="login-right-content">
          <div className="hero-logo">🤖</div>

          <h2>
            Build Your Career
            <br />
            With AI 🚀
          </h2>

          <p className="hero-description">
            Discover opportunities, improve your resume and prepare for
            interviews with powerful AI-powered tools.
          </p>

          {/* FEATURES */}

          <div className="login-features">
            <div className="login-feature">
              <div className="feature-icon">💼</div>

              <div>
                <h3>Find Jobs</h3>

                <p>Discover jobs that match your skills and career goals.</p>
              </div>
            </div>

            <div className="login-feature">
              <div className="feature-icon">🤖</div>

              <div>
                <h3>Resume AI</h3>

                <p>Analyze and improve your resume with AI.</p>
              </div>
            </div>

            <div className="login-feature">
              <div className="feature-icon">🎯</div>

              <div>
                <h3>Interview AI</h3>

                <p>Practice technical interviews before the real one.</p>
              </div>
            </div>

            <div className="login-feature">
              <div className="feature-icon">📊</div>

              <div>
                <h3>Track Applications</h3>

                <p>Keep your job applications organized in one place.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
