
const API_URL = "http://localhost:5000/api/admin";

// ==========================================
// GET ALL USERS
// ==========================================

export const getAllUsers = async () => {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Please login first.");
  }

  const response = await fetch(`${API_URL}/users`, {
    method: "GET",

    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  const data = await response.json();

  console.log("GET USERS STATUS:", response.status);
  console.log("GET USERS RESPONSE:", data);

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to fetch users"
    );
  }

  return data;
};

// ==========================================
// DELETE USER
// ==========================================

export const deleteUser = async (id) => {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Please login first.");
  }

  const response = await fetch(
    `${API_URL}/users/${id}`,
    {
      method: "DELETE",

      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );

  const data = await response.json();

  console.log("DELETE USER STATUS:", response.status);
  console.log("DELETE USER RESPONSE:", data);

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to delete user"
    );
  }

  return data;
};

// ==========================================
// GET ADMIN STATISTICS
// ==========================================

export const getAdminStats = async () => {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Please login first.");
  }

  const response = await fetch(
    `${API_URL}/stats`,
    {
      method: "GET",

      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );

  const data = await response.json();

  console.log("ADMIN STATS STATUS:", response.status);
  console.log("ADMIN STATS RESPONSE:", data);

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to fetch admin statistics"
    );
  }

  return data;
};
