import React, { useState, useEffect } from "react";
import { initializeLogger, getLogger, getConfig } from "logging-middleware";
import "./App.css";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: "info" | "warning" | "error" | "success";
  createdAt: string;
  read: boolean;
}

const App: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [type, setType] = useState<"info" | "warning" | "error" | "success">(
    "info",
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize logger on component mount
  useEffect(() => {
    const initLogger = async () => {
      try {
        const config = getConfig();
        initializeLogger();

        const logger = getLogger();
        await logger.info(
          "frontend",
          "component",
          "Notification App initialized successfully",
        );
      } catch (err) {
        console.error("Failed to initialize logger:", err);
      }
    };

    initLogger();
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    const logger = getLogger();
    setLoading(true);

    try {
      await logger.debug(
        "frontend",
        "api",
        "Fetching notifications from backend",
      );

      const response = await fetch("http://localhost:3000/api/notifications");
      const data = await response.json();

      setNotifications(data);
      await logger.info(
        "frontend",
        "api",
        `Successfully fetched ${data.length} notifications`,
      );
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      setError("Failed to fetch notifications");

      await logger.error("frontend", "api", "Failed to fetch notifications", {
        error: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  const createNotification = async (e: React.FormEvent) => {
    e.preventDefault();
    const logger = getLogger();

    if (!title.trim() || !message.trim()) {
      await logger.warn(
        "frontend",
        "component",
        "Attempted to create notification with empty fields",
      );
      setError("Title and message are required");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await logger.debug("frontend", "api", "Creating new notification", {
        title,
        type,
        messageLength: message.length,
      });

      const response = await fetch("http://localhost:3000/api/notifications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, message, type }),
      });

      if (!response.ok) {
        throw new Error("Failed to create notification");
      }

      const newNotification = await response.json();
      setNotifications([newNotification, ...notifications]);
      setTitle("");
      setMessage("");

      await logger.info(
        "frontend",
        "api",
        `Notification created successfully: ${newNotification.id}`,
        {
          notificationId: newNotification.id,
          type,
        },
      );
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      setError("Failed to create notification");

      await logger.error("frontend", "api", "Failed to create notification", {
        error: errorMessage,
        title,
        type,
      });
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id: string) => {
    const logger = getLogger();
    await logger.debug(
      "frontend",
      "component",
      `Marking notification ${id} as read`,
    );

    setNotifications(
      notifications.map((notif) =>
        notif.id === id ? { ...notif, read: true } : notif,
      ),
    );
  };

  const getTypeClass = (type: string) => {
    switch (type) {
      case "success":
        return "notification-success";
      case "error":
        return "notification-error";
      case "warning":
        return "notification-warning";
      default:
        return "notification-info";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "success":
        return "✅";
      case "error":
        return "❌";
      case "warning":
        return "⚠️";
      default:
        return "ℹ️";
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>📢 Notification System</h1>
        <p>Create and manage your notifications</p>
      </header>

      <div className="app-container">
        <div className="create-section">
          <h2>Create New Notification</h2>

          <form onSubmit={createNotification} className="notification-form">
            <div className="form-group">
              <label htmlFor="title">Title *</label>
              <input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter notification title"
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="message">Message *</label>
              <textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Enter notification message"
                rows={4}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="type">Type</label>
              <select
                id="type"
                value={type}
                onChange={(e) => setType(e.target.value as any)}
                className="form-input"
              >
                <option value="info">ℹ️ Info</option>
                <option value="success">✅ Success</option>
                <option value="warning">⚠️ Warning</option>
                <option value="error">❌ Error</option>
              </select>
            </div>

            {error && <div className="error-message">{error}</div>}

            <button type="submit" disabled={loading} className="submit-button">
              {loading ? "Creating..." : "Create Notification"}
            </button>
          </form>
        </div>

        <div className="notifications-section">
          <h2>
            Notifications
            <span className="notification-count">{notifications.length}</span>
          </h2>

          {loading && !notifications.length ? (
            <div className="loading">Loading notifications...</div>
          ) : notifications.length === 0 ? (
            <div className="empty-state">
              <p>No notifications yet</p>
              <p>Create your first notification using the form!</p>
            </div>
          ) : (
            <div className="notifications-list">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`notification-card ${getTypeClass(notification.type)} ${notification.read ? "read" : "unread"}`}
                  onClick={() =>
                    !notification.read && markAsRead(notification.id)
                  }
                >
                  <div className="notification-header">
                    <span className="notification-icon">
                      {getTypeIcon(notification.type)}
                    </span>
                    <h3 className="notification-title">{notification.title}</h3>
                    {!notification.read && (
                      <span className="unread-badge">New</span>
                    )}
                  </div>
                  <p className="notification-message">{notification.message}</p>
                  <div className="notification-footer">
                    <span className="notification-date">
                      {new Date(notification.createdAt).toLocaleString()}
                    </span>
                    <span
                      className={`notification-type ${getTypeClass(notification.type)}`}
                    >
                      {notification.type}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;
