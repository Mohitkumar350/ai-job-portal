import { useEffect, useState } from "react";
import "./Profile.css";

function Profile() {
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    role: "user",
    photoURL: "",
    phone: "",
    location: "",
    bio: "",
    resumeURL: "",
  });

  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // =====================================================
  // FETCH PROFILE
  // =====================================================

  const fetchUser = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      if (!token) {
        setError("Please login first.");
        return;
      }

      const response = await fetch(
        `${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/user/profile`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await response.json();

      console.log("PROFILE RESPONSE:", data);

      if (!response.ok) {
        throw new Error(data.message || "Unable to fetch profile");
      }

      const user = data.user;

      setUserData({
        name: user.name || "",
        email: user.email || "",
        role: user.role || "user",
        photoURL: user.photoURL || "",
        phone: user.phone || "",
        location: user.location || "",
        bio: user.bio || "",
        resumeURL: user.resumeURL || "",
      });
    } catch (error) {
      console.error("PROFILE ERROR:", error);
      setError(error.message || "Unable to load profile");
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // LOAD PROFILE
  // =====================================================

  useEffect(() => {
    fetchUser();
  }, []);

  // =====================================================
  // INPUT CHANGE
  // =====================================================

  const handleChange = (event) => {
    const { name, value } = event.target;

    setUserData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };
  const handlePhotoChange = (event) => {
    const file = event.target.files[0];

    if (!file) return;

    // Only images
    if (!file.type.startsWith("image/")) {
      setError("Please select an image file.");
      return;
    }

    // Max 2MB
    if (file.size > 2 * 1024 * 1024) {
      setError("Image size must be less than 2MB.");
      return;
    }

    const reader = new FileReader();

    reader.onloadend = () => {
      setUserData((previous) => ({
        ...previous,
        photoURL: reader.result,
      }));
    };

    reader.readAsDataURL(file);
  };
  // =====================================================
  // SAVE PROFILE
  // =====================================================

  const handleSave = async () => {
    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const token = localStorage.getItem("token");

      if (!token) {
        setError("Please login first.");
        return;
      }

      // Name validation
      if (!userData.name.trim()) {
        setError("Name cannot be empty.");
        return;
      }

      console.log("SENDING PROFILE DATA:", {
        name: userData.name,
        phone: userData.phone,
        location: userData.location,
        bio: userData.bio,
        resumeURL: userData.resumeURL,
        photoURL: userData.photoURL,
      });

      // =================================================
      // UPDATE DATABASE
      // =================================================

      const response = await fetch(
        `${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/user/profile`,
        {
          method: "PUT",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify({
            name: userData.name.trim(),
            phone: userData.phone.trim(),
            location: userData.location.trim(),
            bio: userData.bio.trim(),
            resumeURL: userData.resumeURL.trim(),
            photoURL: userData.photoURL.trim(),
          }),
        },
      );

      const data = await response.json();

      console.log("UPDATE RESPONSE:", data);

      if (!response.ok) {
        throw new Error(data.message || "Profile update failed");
      }

      // =================================================
      // UPDATE UI WITH SERVER DATA
      // =================================================

      if (data.user) {
        setUserData({
          name: data.user.name || "",
          email: data.user.email || "",
          role: data.user.role || "user",
          photoURL: data.user.photoURL || "",
          phone: data.user.phone || "",
          location: data.user.location || "",
          bio: data.user.bio || "",
          resumeURL: data.user.resumeURL || "",
        });

        // =================================================
        // UPDATE LOCAL STORAGE
        // =================================================

        const oldUser = localStorage.getItem("user");

        if (oldUser) {
          const parsedUser = JSON.parse(oldUser);

          const updatedUser = {
            ...parsedUser,
            ...data.user,
          };

          localStorage.setItem("user", JSON.stringify(updatedUser));
        }
      }

      // =================================================
      // SUCCESS
      // =================================================

      setSuccess("Profile updated successfully! 🎉");

      // Exit edit mode
      setEditing(false);

      console.log("PROFILE UPDATED SUCCESSFULLY");
    } catch (error) {
      console.error("SAVE PROFILE ERROR:", error);

      setError(error.message || "Unable to update profile");
    } finally {
      setSaving(false);
    }
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="profile-page">
        <div className="profile-card">
          <h2>Loading Profile...</h2>
          <p>Please wait...</p>
        </div>
      </div>
    );
  }

  // =====================================================
  // ERROR
  // =====================================================

  if (error && !userData.email) {
    return (
      <div className="profile-page">
        <div className="profile-card">
          <h2>Profile Error</h2>

          <p>{error}</p>

          <button className="edit-btn" onClick={fetchUser}>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // =====================================================
  // PROFILE
  // =====================================================

  return (
    <div className="profile-page">
      <div className="profile-card">
        {/* PROFILE IMAGE */}

        <div className="profile-image-container">
          <img
            className="profile-img"
            src={
              userData.photoURL ||
              `https://ui-avatars.com/api/?name=${encodeURIComponent(
                userData.name || "User",
              )}&background=2563eb&color=ffffff&size=150`
            }
            alt="Profile"
          />
        </div>

        {/* SUCCESS */}

        {success && <div className="profile-success">✅ {success}</div>}

        {/* ERROR */}

        {error && userData.email && (
          <div className="profile-error-message">❌ {error}</div>
        )}

        {/* =================================================
            EDIT MODE
        ================================================= */}

        {editing ? (
          <div className="profile-edit-form">
            {/* NAME */}

            <div className="form-group">
              <label htmlFor="name">Full Name</label>

              <input
                id="name"
                name="name"
                type="text"
                placeholder="Enter your full name"
                value={userData.name}
                onChange={handleChange}
              />
            </div>

            {/* EMAIL */}

            <div className="form-group">
              <label htmlFor="email">Email</label>

              <input id="email" type="email" value={userData.email} disabled />

              <small>Email cannot be changed.</small>
            </div>

            {/* PHONE */}

            <div className="form-group">
              <label htmlFor="phone">Phone</label>

              <input
                id="phone"
                name="phone"
                type="tel"
                placeholder="Enter phone number"
                value={userData.phone}
                onChange={handleChange}
              />
            </div>

            {/* LOCATION */}

            <div className="form-group">
              <label htmlFor="location">Location</label>

              <input
                id="location"
                name="location"
                type="text"
                placeholder="e.g. Bareilly, Uttar Pradesh"
                value={userData.location}
                onChange={handleChange}
              />
            </div>

            {/* BIO */}

            <div className="form-group">
              <label htmlFor="bio">Bio</label>

              <textarea
                id="bio"
                name="bio"
                rows="5"
                placeholder="Tell something about yourself..."
                value={userData.bio}
                onChange={handleChange}
              />
            </div>

            {/* RESUME */}

            <div className="form-group">
              <label htmlFor="resumeURL">Resume Link</label>

              <input
                id="resumeURL"
                name="resumeURL"
                type="url"
                placeholder="https://..."
                value={userData.resumeURL}
                onChange={handleChange}
              />
            </div>

            {/* PHOTO */}

            <div className="form-group">
              <label htmlFor="photo">Profile Photo</label>

              <input
                id="photo"
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
              />

              <small>
                Select a profile photo from your computer. Maximum size: 2MB.
              </small>
            </div>

            {/* ROLE */}

            <div className="profile-role-display">
              <span>Account Role</span>

              <strong>{userData.role}</strong>
            </div>

            <div className="profile-actions">
              <button
                type="button"
                className="save-btn"
                onClick={handleSave}
                disabled={saving}
              >
                {saving ? "Saving..." : "💾 Save Changes"}
              </button>
            </div>
          </div>
        ) : (
          /* =================================================
             VIEW MODE
          ================================================= */

          <div className="profile-view">
            <h2>{userData.name || "User"}</h2>

            <p className="profile-email">{userData.email}</p>

            <span className="role">{userData.role}</span>

            {/* PROFILE INFORMATION */}

            <div className="profile-info">
              <div className="profile-info-item">
                <span>📱</span>

                <div>
                  <strong>Phone</strong>

                  <p>{userData.phone || "Not Added"}</p>
                </div>
              </div>

              <div className="profile-info-item">
                <span>📍</span>

                <div>
                  <strong>Location</strong>

                  <p>{userData.location || "Not Added"}</p>
                </div>
              </div>

              <div className="profile-info-item">
                <span>📝</span>

                <div>
                  <strong>Bio</strong>

                  <p>{userData.bio || "No bio yet."}</p>
                </div>
              </div>
            </div>

            {/* RESUME */}

            {userData.resumeURL && (
              <a
                href={userData.resumeURL}
                target="_blank"
                rel="noreferrer"
                className="resume-btn"
              >
                📄 View Resume
              </a>
            )}

            {/* EDIT */}

            <button
              type="button"
              className="edit-btn"
              onClick={() => {
                setEditing(true);
                setError("");
                setSuccess("");
              }}
            >
              ✏️ Edit Profile
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Profile;
