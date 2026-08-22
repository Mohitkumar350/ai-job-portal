import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  getNotifications,
  getUnreadNotificationCount,
  markAllNotificationsRead,
  markNotificationRead,
} from "../../services/notificationService";
import "./NotificationBell.css";

const relativeTime = (date) => {
  const seconds = Math.max(
    1,
    Math.floor((Date.now() - new Date(date).getTime()) / 1000),
  );
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
};

function NotificationBell() {
  const { currentUser, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unread, setUnread] = useState(0);

  const load = async () => {
    if (!currentUser) return;
    try {
      const [recent, count] = await Promise.all([
        getNotifications(),
        getUnreadNotificationCount(),
      ]);
      setNotifications(recent.notifications || []);
      setUnread(count.count || 0);
    } catch (error) {
      console.error("LOAD NOTIFICATIONS ERROR:", error);
    }
  };

  useEffect(() => {
    load();
  }, [currentUser, location.pathname]);

  const openNotification = async (notification) => {
    if (!notification.read) {
      await markNotificationRead(notification._id).catch(() => undefined);
      setNotifications((items) =>
        items.map((item) =>
          item._id === notification._id ? { ...item, read: true } : item,
        ),
      );
      setUnread((count) => Math.max(0, count - 1));
    }
    setOpen(false);
    if (notification.relatedInterview)
      navigate(`/interviews/${notification.relatedInterview}`);
    else if (notification.relatedApplication)
      navigate(`/applications/${notification.relatedApplication}`);
    else if (notification.relatedJob)
      navigate(`/jobs/${notification.relatedJob}`);
    else if (notification.relatedCompany)
      navigate(`/companies/${notification.relatedCompany}`);
  };

  const markAll = async () => {
    await markAllNotificationsRead();
    setNotifications((items) => items.map((item) => ({ ...item, read: true })));
    setUnread(0);
  };

  if (loading || !currentUser) return null;

  return (
    <div className="notification-wrapper">
      <button
        type="button"
        className="notification-bell"
        onClick={() => setOpen((value) => !value)}
        aria-label="Notifications"
      >
        🔔
        {unread > 0 && (
          <span className="notification-count">
            {unread > 99 ? "99+" : unread}
          </span>
        )}
      </button>
      {open && (
        <div className="notification-dropdown">
          <div className="notification-dropdown-header">
            <strong>Notifications</strong>
            <button type="button" onClick={markAll} disabled={unread === 0}>
              Mark all as read
            </button>
          </div>
          {notifications.length === 0 ? (
            <p className="notification-empty">No notifications yet.</p>
          ) : (
            notifications.slice(0, 5).map((notification) => (
              <button
                type="button"
                className={`notification-item ${notification.read ? "" : "unread"}`}
                key={notification._id}
                onClick={() => openNotification(notification)}
              >
                <span>
                  <strong>{notification.title}</strong>
                  <small>{notification.message}</small>
                </span>
                <time>{relativeTime(notification.createdAt)}</time>
              </button>
            ))
          )}
          <button
            type="button"
            className="notification-view-all"
            onClick={() => {
              setOpen(false);
              navigate("/notifications");
            }}
          >
            View All Notifications
          </button>
        </div>
      )}
    </div>
  );
}

export default NotificationBell;
