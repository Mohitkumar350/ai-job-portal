import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getAllUsers, deleteUser } from "../../services/adminService";
import {
  getAllApplications,
  updateApplicationStatus,
} from "../../services/applicationsService";
import "./adminDashboard.css";

function adminDashboard() {
  const navigate = useNavigate();
  const { currentUser, loading: authLoading } = useAuth();

  const [users, setUsers] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [applicationsLoading, setApplicationsLoading] = useState(true);
  const [error, setError] = useState("");
  const [applicationError, setApplicationError] = useState("");
  const [actionLoading, setActionLoading] = useState(null);

  // =====================================================
  // ADMIN CHECK
  // =====================================================

  useEffect(() => {
    if (!authLoading) {
      if (!currentUser) {
        navigate("/login");
        return;
      }

      if (currentUser.role !== "admin") {
        navigate("/");
      }
    }
  }, [currentUser, authLoading, navigate]);

  // =====================================================
  // LOAD USERS
  // =====================================================

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getAllUsers();

      console.log("ADMIN USERS:", data);

      if (Array.isArray(data)) {
        setUsers(data);
      } else if (Array.isArray(data.users)) {
        setUsers(data.users);
      } else {
        setUsers([]);
      }
    } catch (error) {
      console.error("LOAD USERS ERROR:", error);
      setError(error.message || "Failed to load registered users.");
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // LOAD ALL APPLICATIONS
  // =====================================================

  const loadApplications = async () => {
    try {
      setApplicationsLoading(true);
      setApplicationError("");

      const data = await getAllApplications();

      console.log("ADMIN APPLICATIONS:", data);

      if (Array.isArray(data)) {
        setApplications(data);
      } else if (Array.isArray(data.applications)) {
        setApplications(data.applications);
      } else {
        setApplications([]);
      }
    } catch (error) {
      console.error("LOAD ADMIN APPLICATIONS ERROR:", error);
      setApplicationError(error.message || "Failed to load applications.");
    } finally {
      setApplicationsLoading(false);
    }
  };

  // =====================================================
  // LOAD EVERYTHING
  // =====================================================

  const loadAdminData = async () => {
    await Promise.all([loadUsers(), loadApplications()]);
  };

  // =====================================================
  // INITIAL LOAD
  // =====================================================

  useEffect(() => {
    if (!authLoading && currentUser && currentUser.role === "admin") {
      loadAdminData();
    }
  }, [authLoading, currentUser]);

  // =====================================================
  // DELETE USER
  // =====================================================

  const handleDeleteUser = async (userId) => {
    if (String(userId) === String(currentUser?.id || currentUser?._id)) {
      alert("You cannot delete your own admin account.");
      return;
    }

    const user = users.find(
      (item) => String(item._id || item.id) === String(userId),
    );

    const confirmDelete = window.confirm(
      `Are you sure you want to delete ${user?.name || "this user"}?`,
    );

    if (!confirmDelete) {
      return;
    }

    try {
      setActionLoading(userId);

      await deleteUser(userId);

      setUsers((prev) =>
        prev.filter((item) => String(item._id || item.id) !== String(userId)),
      );

      alert("User deleted successfully.");
    } catch (error) {
      console.error("DELETE USER ERROR:", error);
      alert(error.message || "Failed to delete user.");
    } finally {
      setActionLoading(null);
    }
  };

  // =====================================================
  // APPROVE / REJECT APPLICATION
  // =====================================================

  const handleApplicationStatus = async (applicationId, status) => {
    const action = status === "Approved" ? "approve" : "reject";

    const confirmAction = window.confirm(
      `Are you sure you want to ${action} this application?`,
    );

    if (!confirmAction) {
      return;
    }

    try {
      setActionLoading(applicationId);

      const data = await updateApplicationStatus(applicationId, status);

      console.log("APPLICATION STATUS UPDATED:", data);

      setApplications((prev) =>
        prev.map((application) =>
          String(application._id) === String(applicationId)
            ? {
                ...application,
                status,
              }
            : application,
        ),
      );

      alert(
        status === "Approved"
          ? "Application approved successfully!"
          : "Application rejected successfully!",
      );
    } catch (error) {
      console.error("APPLICATION STATUS ERROR:", error);

      alert(error.message || "Failed to update application status.");
    } finally {
      setActionLoading(null);
    }
  };

  // =====================================================
  // REFRESH
  // =====================================================

  const handleRefresh = () => {
    loadAdminData();
  };

  // =====================================================
  // AUTH LOADING
  // =====================================================

  if (authLoading) {
    return (
      <div className="admin-page-loading">
        <div className="admin-loader"></div>
        <p>Checking admin access...</p>
      </div>
    );
  }

  // =====================================================
  // NOT ADMIN
  // =====================================================

  if (!currentUser || currentUser.role !== "admin") {
    return null;
  }

  // =====================================================
  // STATISTICS
  // =====================================================

  const totalUsers = users.length;
  const totalApplications = applications.length;

  const totalAdmins = users.filter((user) => user.role === "admin").length;

  const totalNormalUsers = users.filter((user) => user.role !== "admin").length;

  const pendingApplications = applications.filter(
    (application) =>
      !application.status ||
      application.status === "Applied" ||
      application.status === "Pending",
  ).length;

  const approvedApplications = applications.filter(
    (application) => application.status === "Approved",
  ).length;

  const rejectedApplications = applications.filter(
    (application) => application.status === "Rejected",
  ).length;

  // =====================================================
  // PAGE
  // =====================================================

  return (
    <div className="admin-page">
      {/* HEADER */}

      <div className="admin-header">
        <div>
          <span className="admin-badge">👑 ADMIN PANEL</span>

          <h1>Welcome, {currentUser.name} 👑</h1>

          <p>Manage your MohiJobs from here.</p>
        </div>

        <button
          className="admin-refresh-btn"
          onClick={handleRefresh}
          disabled={loading || applicationsLoading}
        >
          🔄 Refresh
        </button>
      </div>

      {/* STATISTICS */}

      <div className="admin-stats">
        <div className="admin-stat-card">
          <div className="stat-icon">👥</div>

          <div>
            <h2>{totalUsers}</h2>
            <p>Total Users</p>
          </div>
        </div>

        <div className="admin-stat-card">
          <div className="stat-icon">📋</div>

          <div>
            <h2>{totalApplications}</h2>
            <p>Total Applications</p>
          </div>
        </div>

        <div className="admin-stat-card">
          <div className="stat-icon">👑</div>

          <div>
            <h2>{totalAdmins}</h2>
            <p>Admins</p>
          </div>
        </div>

        <div className="admin-stat-card">
          <div className="stat-icon">👤</div>

          <div>
            <h2>{totalNormalUsers}</h2>
            <p>Normal Users</p>
          </div>
        </div>
      </div>

      {/* APPLICATION STATUS SUMMARY */}

      <div className="application-summary">
        <div className="summary-card pending-summary">
          <span>⏳</span>

          <div>
            <strong>{pendingApplications}</strong>

            <small>Pending</small>
          </div>
        </div>

        <div className="summary-card approved-summary">
          <span>✅</span>

          <div>
            <strong>{approvedApplications}</strong>

            <small>Approved</small>
          </div>
        </div>

        <div className="summary-card rejected-summary">
          <span>❌</span>

          <div>
            <strong>{rejectedApplications}</strong>

            <small>Rejected</small>
          </div>
        </div>
      </div>

      {/* ADMIN INFORMATION */}

      <div className="admin-info-card">
        <div className="section-heading">
          <div>
            <h2>👑 Admin Information</h2>
            <p>Your administrator account</p>
          </div>
        </div>

        <div className="admin-info-grid">
          <div className="admin-info-item">
            <span>Name</span>
            <strong>{currentUser.name}</strong>
          </div>

          <div className="admin-info-item">
            <span>Email</span>
            <strong>{currentUser.email}</strong>
          </div>

          <div className="admin-info-item">
            <span>Role</span>
            <strong className="role-admin">{currentUser.role}</strong>
          </div>
        </div>
      </div>

      {/* USERS */}

      <div className="admin-section">
        <div className="section-heading">
          <div>
            <h2>👥 Registered Users</h2>
            <p>All users registered on your portal.</p>
          </div>

          <span className="section-count">{totalUsers} Users</span>
        </div>

        {loading ? (
          <div className="section-loading">
            <div className="admin-loader"></div>
            <p>Loading users...</p>
          </div>
        ) : error ? (
          <div className="admin-error">
            <p>{error}</p>

            <button onClick={loadUsers} className="retry-btn">
              Try Again
            </button>
          </div>
        ) : users.length === 0 ? (
          <div className="empty-admin">
            <span>👤</span>
            <h3>No users found</h3>
          </div>
        ) : (
          <div className="users-table-wrapper">
            <table className="users-table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {users.map((user) => {
                  const userId = user._id || user.id;

                  const currentUserId = currentUser.id || currentUser._id;

                  const isCurrentUser =
                    String(userId) === String(currentUserId);

                  return (
                    <tr key={userId}>
                      <td>
                        <div className="table-user">
                          <div className="user-avatar">
                            {user.name?.charAt(0).toUpperCase()}
                          </div>

                          <strong>{user.name}</strong>
                        </div>
                      </td>

                      <td>{user.email}</td>

                      <td>
                        <span
                          className={`user-role-badge ${
                            user.role === "admin" ? "admin-role" : "user-role"
                          }`}
                        >
                          {user.role}
                        </span>
                      </td>

                      <td>
                        {isCurrentUser ? (
                          <span className="current-account">
                            Current Account
                          </span>
                        ) : (
                          <button
                            className="delete-user-btn"
                            onClick={() => handleDeleteUser(userId)}
                            disabled={actionLoading === userId}
                          >
                            {actionLoading === userId
                              ? "Deleting..."
                              : "Delete"}
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* APPLICATIONS */}

      <div className="admin-section applications-section">
        <div className="section-heading">
          <div>
            <h2>📋 Applications</h2>

            <p>Review and manage job applications.</p>
          </div>

          <span className="section-count">
            {totalApplications} Applications
          </span>
        </div>

        {applicationsLoading ? (
          <div className="section-loading">
            <div className="admin-loader"></div>
            <p>Loading applications...</p>
          </div>
        ) : applicationError ? (
          <div className="admin-error">
            <p>{applicationError}</p>

            <button onClick={loadApplications} className="retry-btn">
              Try Again
            </button>
          </div>
        ) : applications.length === 0 ? (
          <div className="empty-admin">
            <div className="empty-admin-icon">📭</div>

            <h3>No applications yet</h3>

            <p>Job applications will appear here when users apply for jobs.</p>
          </div>
        ) : (
          <div className="admin-applications-list">
            {applications.map((application) => {
              const status = application.status || "Applied";

              const isLoading = actionLoading === application._id;

              return (
                <div className="admin-application-card" key={application._id}>
                  {/* APPLICATION HEADER */}

                  <div className="application-header">
                    <div>
                      <h3>{application.title || "Job Application"}</h3>

                      <p className="application-company">
                        {application.company || "Company"}
                      </p>
                    </div>

                    <span
                      className={`application-status ${status
                        .toLowerCase()
                        .replace(/\s+/g, "-")}`}
                    >
                      {status}
                    </span>
                  </div>

                  {/* APPLICATION DETAILS */}

                  <div className="application-details">
                    <div className="application-detail">
                      <span>👤 Applicant</span>

                      <strong>{application.fullName || "Not provided"}</strong>
                    </div>

                    <div className="application-detail">
                      <span>📞 Phone</span>

                      <strong>{application.phone || "Not provided"}</strong>
                    </div>

                    <div className="application-detail">
                      <span>📍 Location</span>

                      <strong>{application.location || "Not provided"}</strong>
                    </div>

                    <div className="application-detail">
                      <span>📅 Applied</span>

                      <strong>
                        {application.createdAt
                          ? new Date(application.createdAt).toLocaleDateString(
                              "en-IN",
                              {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              },
                            )
                          : "Unknown"}
                      </strong>
                    </div>
                  </div>

                  {/* COVER LETTER */}

                  {application.coverLetter && (
                    <div className="cover-letter">
                      <strong>📝 Cover Letter</strong>

                      <p>{application.coverLetter}</p>
                    </div>
                  )}

                  {/* APPROVE / REJECT */}

                  <div className="application-actions">
                    {status !== "Approved" && (
                      <button
                        className="approve-btn"
                        onClick={() =>
                          handleApplicationStatus(application._id, "Approved")
                        }
                        disabled={isLoading}
                      >
                        {isLoading ? "Updating..." : "✅ Approve"}
                      </button>
                    )}

                    {status !== "Rejected" && (
                      <button
                        className="reject-btn"
                        onClick={() =>
                          handleApplicationStatus(application._id, "Rejected")
                        }
                        disabled={isLoading}
                      >
                        {isLoading ? "Updating..." : "❌ Reject"}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default adminDashboard;
