import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";

import { auth } from "../../firebase";
import { useAuth } from "../../context/AuthContext";

import "./PhoneLogin.css";

function PhoneLogin() {
  const navigate = useNavigate();

  const { login } = useAuth();

  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");

  const [confirmationResult, setConfirmationResult] = useState(null);

  const [otpSent, setOtpSent] = useState(false);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const [success, setSuccess] = useState("");

  const recaptchaRef = useRef(null);

  // =====================================================
  // CLEANUP
  // =====================================================

  useEffect(() => {
    return () => {
      try {
        if (recaptchaRef.current) {
          recaptchaRef.current.clear();
          recaptchaRef.current = null;
        }
      } catch (cleanupError) {
        console.error("RECAPTCHA CLEANUP ERROR:", cleanupError);
      }
    };
  }, []);

  // =====================================================
  // CREATE RECAPTCHA
  // =====================================================

  const createRecaptcha = () => {
    try {
      if (recaptchaRef.current) {
        return recaptchaRef.current;
      }

      const verifier = new RecaptchaVerifier(auth, "recaptcha-container", {
        size: "normal",

        callback: () => {
          console.log("✅ reCAPTCHA verified");
        },

        "expired-callback": () => {
          console.log("⚠️ reCAPTCHA expired");
        },
      });

      recaptchaRef.current = verifier;

      return verifier;
    } catch (error) {
      console.error("CREATE RECAPTCHA ERROR:", error);

      throw new Error("Unable to initialize reCAPTCHA.");
    }
  };

  // =====================================================
  // SEND OTP
  // =====================================================

  const handleSendOTP = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    const fullPhoneNumber = phone.trim();

    if (!fullPhoneNumber) {
      setError("Please enter a phone number.");
      return;
    }

    if (!fullPhoneNumber.startsWith("+")) {
      setError("Enter phone number with country code. Example: +16505553434");
      return;
    }

    try {
      setLoading(true);

      console.log("📱 Sending OTP to:", fullPhoneNumber);

      const appVerifier = createRecaptcha();

      const result = await signInWithPhoneNumber(
        auth,
        fullPhoneNumber,
        appVerifier,
      );

      setConfirmationResult(result);
      setOtpSent(true);

      setSuccess("OTP request successful. Enter your verification code.");

      console.log("✅ OTP REQUEST SUCCESS");
    } catch (error) {
      console.error("SEND OTP ERROR:", error);

      if (error?.code === "auth/operation-not-allowed") {
        setError(
          "Phone authentication is not enabled for this Firebase project.",
        );
      } else if (error?.code === "auth/billing-not-enabled") {
        setError(
          "Real SMS requires billing. Use a Firebase test phone number for development.",
        );
      } else if (error?.code === "auth/invalid-phone-number") {
        setError("Invalid phone number.");
      } else {
        setError(error?.message || "Unable to send OTP.");
      }

      try {
        if (recaptchaRef.current) {
          recaptchaRef.current.clear();
          recaptchaRef.current = null;
        }
      } catch (cleanupError) {
        console.error("RECAPTCHA RESET ERROR:", cleanupError);
      }
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // VERIFY OTP + BACKEND LOGIN
  // =====================================================

  const handleVerifyOTP = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (!confirmationResult) {
      setError("Please request OTP first.");
      return;
    }

    if (otp.length !== 6) {
      setError("Please enter the 6-digit verification code.");
      return;
    }

    try {
      setLoading(true);

      console.log("🔐 Verifying Firebase OTP...");

      // =================================================
      // STEP 1 - FIREBASE VERIFY OTP
      // =================================================

      const result = await confirmationResult.confirm(otp);

      const firebaseUser = result.user;

      console.log("✅ FIREBASE USER:", firebaseUser);

      console.log("✅ PHONE:", firebaseUser.phoneNumber);

      // =================================================
      // STEP 2 - GET FIREBASE ID TOKEN
      // =================================================

      const firebaseToken = await firebaseUser.getIdToken();

      console.log("✅ FIREBASE ID TOKEN RECEIVED");

      // =================================================
      // STEP 3 - SEND TOKEN TO BACKEND
      // =================================================

      const response = await fetch(
        "http://localhost:5000/api/auth/phone-login",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            idToken: firebaseToken,
          }),
        },
      );

      let data;

      try {
        data = await response.json();
      } catch (jsonError) {
        throw new Error("Backend returned an invalid response.");
      }

      console.log("PHONE LOGIN STATUS:", response.status);

      console.log("PHONE LOGIN RESPONSE:", data);

      // =================================================
      // STEP 4 - BACKEND ERROR
      // =================================================

      if (!response.ok) {
        throw new Error(data.message || "Phone login failed.");
      }

      // =================================================
      // STEP 5 - CHECK JWT + USER
      // =================================================

      if (!data.token) {
        throw new Error("Backend did not return a JWT token.");
      }

      if (!data.user) {
        throw new Error("Backend did not return user information.");
      }

      // =================================================
      // STEP 6 - SAVE AUTH CONTEXT
      // =================================================

      const loginSuccess = login(data.user, data.token);

      if (loginSuccess === false) {
        throw new Error("Unable to save login session.");
      }

      console.log("✅ PHONE LOGIN SUCCESS");

      console.log("USER:", data.user);

      console.log("ROLE:", data.user.role);

      setSuccess("Phone login successful! 🎉");

      // =================================================
      // STEP 7 - ROLE BASED REDIRECT
      // =================================================

      if (data.user.role === "admin") {
        console.log("ADMIN PHONE LOGIN → /admin");

        navigate("/admin", {
          replace: true,
        });

        return;
      }

      console.log("USER PHONE LOGIN → /dashboard");

      navigate("/dashboard", {
        replace: true,
      });
    } catch (error) {
      console.error("PHONE LOGIN ERROR:", error);

      if (error?.code === "auth/invalid-verification-code") {
        setError("Invalid verification code.");
      } else if (error?.code === "auth/code-expired") {
        setError("Verification code expired. Please request a new OTP.");
      } else {
        setError(error?.message || "Phone login failed.");
      }
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // CHANGE NUMBER
  // =====================================================

  const changeNumber = () => {
    setPhone("");
    setOtp("");
    setOtpSent(false);

    setConfirmationResult(null);

    setError("");
    setSuccess("");

    try {
      if (recaptchaRef.current) {
        recaptchaRef.current.clear();
        recaptchaRef.current = null;
      }
    } catch (error) {
      console.error("RECAPTCHA CLEAR ERROR:", error);
    }
  };

  // =====================================================
  // UI
  // =====================================================

  return (
    <div className="phone-login-page">
      <div className="phone-login-card">
        {/* HEADER */}

        <div className="phone-login-header">
          <div className="phone-login-icon">📱</div>

          <h1>Phone Login</h1>

          <p>Login securely using OTP</p>
        </div>

        {/* ERROR */}

        {error && <div className="phone-error">❌ {error}</div>}

        {/* SUCCESS */}

        {success && <div className="phone-success">✅ {success}</div>}

        {/* SEND OTP */}

        {!otpSent ? (
          <form onSubmit={handleSendOTP} className="phone-form">
            <label htmlFor="phone">Phone Number</label>

            <input
              id="phone"
              type="tel"
              placeholder="+16505553434"
              value={phone}
              onChange={(event) => {
                setPhone(event.target.value);

                setError("");
                setSuccess("");
              }}
              autoComplete="tel"
              required
            />

            <p className="phone-help">
              Use the exact fictional test number configured in Firebase Console
              during development.
            </p>

            {/* RECAPTCHA */}

            <div id="recaptcha-container" className="recaptcha-container"></div>

            <button type="submit" className="otp-btn" disabled={loading}>
              {loading ? "Sending OTP..." : "Send OTP"}
            </button>
          </form>
        ) : (
          /* VERIFY OTP */

          <form onSubmit={handleVerifyOTP} className="phone-form">
            <label htmlFor="otp">Enter Verification Code</label>

            <input
              id="otp"
              type="text"
              inputMode="numeric"
              placeholder="Enter 6-digit code"
              value={otp}
              onChange={(event) => {
                const value = event.target.value.replace(/\D/g, "");

                setOtp(value.slice(0, 6));

                setError("");
              }}
              maxLength={6}
              autoComplete="one-time-code"
              className="otp-input"
              required
            />

            <p className="phone-help">
              Number: <strong>{phone}</strong>
            </p>

            <button
              type="submit"
              className="otp-btn"
              disabled={loading || otp.length !== 6}
            >
              {loading ? "Logging in..." : "Verify & Login"}
            </button>

            <button
              type="button"
              className="change-number-btn"
              onClick={changeNumber}
              disabled={loading}
            >
              ← Change Number
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default PhoneLogin;
