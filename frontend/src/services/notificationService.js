const API_URL = "http://localhost:5000/api/notifications";

async function request(path = "", options = {}) {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("Please login first.");
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...(options.headers || {}),
    },
  });
  const data = await response.json();
  if (!response.ok)
    throw new Error(data.message || "Notification request failed");
  return data;
}

export const getNotifications = () => request();
export const getUnreadNotificationCount = () => request("/unread");
export const markNotificationRead = (id) =>
  request(`/${id}/read`, { method: "PATCH" });
export const markAllNotificationsRead = () =>
  request("/read-all", { method: "PATCH" });
export const deleteNotification = (id) =>
  request(`/${id}`, { method: "DELETE" });
