const API_URL = "http://localhost:5000/api/applications";
const ADMIN_API_URL = "http://localhost:5000/api/admin";

// =====================================================
// APPLY FOR JOB
// =====================================================

export const applyForJob = async (jobId, applicationData) => {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Please login first.");
  }

  const response = await fetch(API_URL, {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },

    body: JSON.stringify({
      jobId,
      ...applicationData,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    const error = new Error(data.message || "Failed to submit application");
    error.status = response.status;
    throw error;
  }

  return data;
};

export const getApplication = async (id) => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("Please login first.");
  const response = await fetch(`${API_URL}/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await response.json();
  if (!response.ok)
    throw new Error(data.message || "Failed to load application");
  return data.application;
};

export const getJobApplicants = async (jobId) => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("Please login first.");
  const response = await fetch(`${API_URL}/job/${jobId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await response.json();
  if (!response.ok)
    throw new Error(data.message || "Failed to load applicants");
  return data.applications || [];
};

// =====================================================
// GET MY APPLICATIONS
// =====================================================

export const getUserApplications = async () => {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Please login first.");
  }

  const response = await fetch(API_URL, {
    method: "GET",

    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  let data;

  try {
    data = await response.json();
  } catch (error) {
    throw new Error(`Server returned invalid response (${response.status})`);
  }

  console.log("GET APPLICATIONS STATUS:", response.status);

  console.log("GET APPLICATIONS RESPONSE:", data);

  if (!response.ok) {
    throw new Error(data.message || "Failed to get applications");
  }

  return data.applications || [];
};

// =====================================================
// ALIAS
// =====================================================

export const getMyApplications = getUserApplications;

// =====================================================
// ADMIN - GET ALL APPLICATIONS
// =====================================================

export const getAllApplications = async () => {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Please login first.");
  }

  const response = await fetch(`${ADMIN_API_URL}/applications`, {
    method: "GET",

    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  let data;

  try {
    data = await response.json();
  } catch (error) {
    throw new Error(`Server returned invalid response (${response.status})`);
  }

  console.log("ADMIN APPLICATIONS STATUS:", response.status);

  console.log("ADMIN APPLICATIONS RESPONSE:", data);

  if (!response.ok) {
    throw new Error(data.message || "Failed to get all applications");
  }

  return data.applications || [];
};

// =====================================================
// ADMIN - APPROVE / REJECT APPLICATION
// =====================================================

export const updateApplicationStatus = async (id, status) => {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Please login first.");
  }

  const response = await fetch(`${API_URL}/${id}/status`, {
    method: "PATCH",

    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },

    body: JSON.stringify({
      status,
    }),
  });

  let data;

  try {
    data = await response.json();
  } catch (error) {
    throw new Error(`Server returned invalid response (${response.status})`);
  }

  console.log("UPDATE APPLICATION STATUS:", response.status);

  console.log("UPDATE APPLICATION RESPONSE:", data);

  if (!response.ok) {
    throw new Error(data.message || "Failed to update application status");
  }

  return data;
};

// =====================================================
// DELETE MY APPLICATION
// =====================================================

export const deleteApplication = async (id) => {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Please login first.");
  }

  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",

    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  let data;

  try {
    data = await response.json();
  } catch (error) {
    throw new Error(`Server returned invalid response (${response.status})`);
  }

  console.log("DELETE APPLICATION STATUS:", response.status);

  console.log("DELETE APPLICATION RESPONSE:", data);

  if (!response.ok) {
    throw new Error(data.message || "Failed to delete application");
  }

  return data;
};
