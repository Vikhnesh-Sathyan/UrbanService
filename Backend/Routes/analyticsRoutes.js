// =====================================================
// ANALYTICS ROUTES
// =====================================================

const express = require("express");

const router = express.Router();

const {
  getAdminOverview,
  getBookingActivity,
} = require("../Controllers/AnalyticsController");

const authMiddleware = require("../Middleware/AuthMiddleware");
const roleMiddleware = require("../Middleware/roleMiddleware");

// =====================================================
// ADMIN ANALYTICS
// =====================================================

router.get(
  "/admin/overview",
  authMiddleware,
  roleMiddleware("admin"),
  getAdminOverview
);

router.get(
  "/admin/bookings",
  authMiddleware,
  roleMiddleware("admin"),
  getBookingActivity
);

module.exports = router;