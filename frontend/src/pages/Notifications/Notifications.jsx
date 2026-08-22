import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  deleteNotification,
  getNotifications,
  markAllNotificationsRead,
  markNotificationRead,
} from "../../services/notificationService";
import "./Notifications.css";

function Notifications() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getNotifications();
      setNotifications(data.notifications || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const markRead = async (id) => {
    await markNotificationRead(id);
    setNotifications((items) =>
      items.map((item) => (item._id === id ? { ...item, read: true } : item)),
    );
  };
  const markAll = async () => {
    await markAllNotificationsRead();
    setNotifications((items) => items.map((item) => ({ ...item, read: true })));
  };
  const remove = async (id) => {
    await deleteNotification(id);
    setNotifications((items) => items.filter((item) => item._id !== id));
  };
  const open = async (item) => {
    if (!item.read) await markRead(item._id);
    if (item.relatedInterview) navigate(`/interviews/${item.relatedInterview}`);
    else if (item.relatedApplication)
      navigate(`/applications/${item.relatedApplication}`);
    else if (item.relatedJob) navigate(`/jobs/${item.relatedJob}`);
    else if (item.relatedCompany) navigate(`/companies/${item.relatedCompany}`);
  };
  const visible =
    filter === "unread"
      ? notifications.filter((item) => !item.read)
      : notifications;

  return (
    <main className="notifications-page">
      <div className="notifications-header">
        <div>
          <p className="eyebrow">Inbox</p>
          <h1>Notifications</h1>
          <p>Updates about your jobs and applications.</p>
        </div>
        <button
          type="button"
          onClick={markAll}
          disabled={!notifications.some((item) => !item.read)}
        >
          Mark all as read
        </button>
      </div>
      <div className="notification-filters">
        <button
          className={filter === "all" ? "active" : ""}
          onClick={() => setFilter("all")}
        >
          All
        </button>
        <button
          className={filter === "unread" ? "active" : ""}
          onClick={() => setFilter("unread")}
        >
          Unread
        </button>
      </div>
      {error && <p className="notification-page-error">{error}</p>}
      {loading ? (
        <p>Loading notifications...</p>
      ) : visible.length === 0 ? (
        <div className="notification-page-empty">
          <h2>No notifications yet.</h2>
          <p>Important application updates will appear here.</p>
        </div>
      ) : (
        <div className="notification-list">
          {visible.map((item) => (
            <article
              className={
                item.read ? "notification-row" : "notification-row unread"
              }
              key={item._id}
            >
              <button type="button" onClick={() => open(item)}>
                <strong>{item.title}</strong>
                <p>{item.message}</p>
                <time>{new Date(item.createdAt).toLocaleString("en-IN")}</time>
              </button>
              <div>
                <button
                  type="button"
                  onClick={() => markRead(item._id)}
                  disabled={item.read}
                >
                  Mark read
                </button>
                <button type="button" onClick={() => remove(item._id)}>
                  Delete
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </main>
  );
}

export default Notifications;
