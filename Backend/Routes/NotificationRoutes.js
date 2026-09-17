const express = require("express");

const {
  getMyNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
} = require("../Controllers/NotificationController");

const authMiddleware = require("../Middleware/AuthMiddleware");

const router = express.Router();

// Get logged-in user's notifications
router.get(
  "/",
  authMiddleware,
  getMyNotifications
);

// Mark one notification as read
router.patch(
  "/:id/read",
  authMiddleware,
  markNotificationAsRead
);

// Mark all notifications as read
router.patch(
  "/read-all",
  authMiddleware,
  markAllNotificationsAsRead
);

module.exports = router;