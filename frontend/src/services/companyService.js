const API_URL = "http://localhost:5000/api/company";

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
  if (!response.ok) throw new Error(data.message || "Company request failed");
  return data;
}

export const getMyCompany = () => request("/me");
export const createCompany = (company) =>
  request("", { method: "POST", body: JSON.stringify(company) });
export const updateCompany = (company) =>
  request("/me", { method: "PUT", body: JSON.stringify(company) });
export const getCompany = (id) => request(`/${id}`);
