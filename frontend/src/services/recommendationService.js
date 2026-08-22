const API_URL = "http://localhost:5000/api/recommendations";

export const getRecommendedJobs = async () => {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_URL}/jobs`, {
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Failed to load job recommendations");
  }
  return data;
};
