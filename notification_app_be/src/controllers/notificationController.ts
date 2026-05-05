import { Request, Response } from "express";
import { getLogger } from "logging-middleware";

// In-memory storage (in production, this would be a database)
interface Notification {
  id: string;
  title: string;
  message: string;
  type: "info" | "warning" | "error" | "success";
  createdAt: Date;
  read: boolean;
}

let notifications: Notification[] = [];

export const createNotification = async (req: Request, res: Response) => {
  const logger = getLogger();

  try {
    const { title, message, type } = req.body;

    // Log request received
    await logger.debug("backend", "controller", "Creating new notification", {
      title,
      type,
      messageLength: message?.length,
    });

    // Validate input
    if (!title || !message) {
      await logger.warn(
        "backend",
        "controller",
        "Missing required fields for notification",
        {
          hasTitle: !!title,
          hasMessage: !!message,
        },
      );

      return res.status(400).json({
        error: "Missing required fields: title and message are required",
      });
    }

    const notification: Notification = {
      id: Date.now().toString(),
      title,
      message,
      type: type || "info",
      createdAt: new Date(),
      read: false,
    };

    notifications.push(notification);

    // Log success
    await logger.info(
      "backend",
      "controller",
      `Notification created successfully: ${notification.id}`,
      {
        notificationId: notification.id,
        type: notification.type,
      },
    );

    res.status(201).json(notification);
  } catch (error) {
    // Log error
    await logger.error(
      "backend",
      "controller",
      "Failed to create notification",
      {
        error: error instanceof Error ? error.message : String(error),
        body: req.body,
      },
    );

    res.status(500).json({ error: "Internal server error" });
  }
};

export const getNotifications = async (req: Request, res: Response) => {
  const logger = getLogger();

  try {
    await logger.debug("backend", "controller", "Fetching all notifications", {
      count: notifications.length,
    });

    res.json(notifications);
  } catch (error) {
    await logger.error(
      "backend",
      "controller",
      "Failed to fetch notifications",
      {
        error: error instanceof Error ? error.message : String(error),
      },
    );

    res.status(500).json({ error: "Internal server error" });
  }
};

export const getNotificationById = async (req: Request, res: Response) => {
  const logger = getLogger();
  const { id } = req.params;

  try {
    await logger.debug(
      "backend",
      "controller",
      `Fetching notification with ID: ${id}`,
    );

    const notification = notifications.find((n) => n.id === id);

    if (!notification) {
      await logger.warn(
        "backend",
        "controller",
        `Notification not found: ${id}`,
      );
      return res.status(404).json({ error: "Notification not found" });
    }

    res.json(notification);
  } catch (error) {
    await logger.error(
      "backend",
      "controller",
      "Failed to fetch notification",
      {
        notificationId: id,
        error: error instanceof Error ? error.message : String(error),
      },
    );

    res.status(500).json({ error: "Internal server error" });
  }
};
