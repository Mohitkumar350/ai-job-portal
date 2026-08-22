import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signOut,
  updateProfile,
} from "firebase/auth";

import { FaUser, FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";

import { auth } from "../../firebase";
import { isDisposableEmail, isValidEmail } from "../../utils/isDisposableEmail";

import "./Signup.css";

function Signup() {
  const navigate = useNavigate();

  const [fullName, setFullName] = useState("");

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const [confirmPassword, setConfirmPassword] = useState("");

  const [role, setRole] = useState("job_seeker");

  const [showPassword, setShowPassword] = useState(false);

  const [agreeTerms, setAgreeTerms] = useState(false);

  const [error, setError] = useState("");

  const [loading, setLoading] = useState(false);

  const handleSignup = async (e) => {
    e.preventDefault();

    setError("");

    const cleanName = fullName.trim();
    const cleanEmail = email.trim().toLowerCase();

    if (!cleanName || !cleanEmail || !password || !confirmPassword) {
      setError("Please complete all fields.");
      return;
    }

    if (!isValidEmail(cleanEmail)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (isDisposableEmail(cleanEmail)) {
      setError(
        "Temporary or disposable email addresses are not allowed. Please use a valid personal email.",
      );
      return;
    }

    if (!agreeTerms) {
      setError("Please agree to the Terms & Conditions.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const credential = await createUserWithEmailAndPassword(
        auth,
        cleanEmail,
        password,
      );

      await updateProfile(credential.user, { displayName: cleanName });
      const actionCodeSettings = {
        url: `${window.location.origin}/login`,
        handleCodeInApp: false,
      };
      await sendEmailVerification(credential.user, actionCodeSettings);
      await signOut(auth);

      localStorage.setItem(`signup-role:${cleanEmail}`, role);

      alert("Account created. A verification email has been sent. Please check your Inbox and Spam/Junk folder before logging in.");
      navigate("/login");
    } catch (error) {
      console.error("Signup error:", error);

      const messages = {
        "auth/email-already-in-use":
          "An account already exists with this email.",
        "auth/invalid-email": "Please enter a valid email address.",
        "auth/weak-password": "Password must be at least 6 characters.",
      };

      setError(messages[error.code] || "Unable to create your account.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="signup-page">
      <div className="signup-card">
        <div className="signup-header">
          <h1>Create Account 🚀</h1>

          <p>Join the AI-powered career portal today</p>
        </div>

        {error && (
          <div
            style={{
              color: "#ef4444",
              marginBottom: "15px",
              textAlign: "center",
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSignup} className="signup-form">
          {/* Name */}

          <div className="input-box">
            <FaUser className="icon" />

            <input
              type="text"
              placeholder="Full Name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          </div>

          {/* Email */}

          <div className="input-box">
            <FaEnvelope className="icon" />

            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Password */}

          <div className="input-box">
            <FaLock className="icon" />

            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              minLength={6}
              required
            />

            <span
              className="eye"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          {/* Confirm Password */}

          <div className="input-box">
            <FaLock className="icon" />

            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              minLength={6}
              required
            />
          </div>

          {/* Role */}

          <div className="input-box">
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              aria-label="Choose account type"
            >
              <option value="job_seeker">Job Seeker</option>
              <option value="employer">Employer</option>
            </select>
          </div>

          {/* Terms */}

          <div className="terms">
            <label>
              <input
                type="checkbox"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
              />
              I agree to the Terms & Conditions
            </label>
          </div>

          {/* Submit */}

          <button type="submit" className="signup-btn" disabled={loading}>
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        <p className="login-link">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </section>
  );
}

export default Signup;
