const API_URL = `${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/jobs`;

async function request(path = "", options = {}) {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Job request failed");
  return data;
}

export const getMyJobs = () => request("/my-jobs");
export const getJob = (id) => request(`/${id}`);
export const createJob = (job) =>
  request("", { method: "POST", body: JSON.stringify(job) });
export const updateJob = (id, job) =>
  request(`/${id}`, { method: "PUT", body: JSON.stringify(job) });
export const deleteJob = (id) => request(`/${id}`, { method: "DELETE" });
