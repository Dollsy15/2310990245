import { Router } from "express";
import {
  createNotification,
  getNotifications,
  getNotificationById,
} from "../controllers/notificationController";

const router = Router();

router.post("/", createNotification);
router.get("/", getNotifications);
router.get("/:id", getNotificationById);

export default router;
