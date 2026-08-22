const API_URL = "http://localhost:5000/api/analytics";

export async function getEmployerAnalytics(range = "all") {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("Please login first.");
  const response = await fetch(`${API_URL}/employer?range=${range}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Unable to load analytics");
  return data;
}
