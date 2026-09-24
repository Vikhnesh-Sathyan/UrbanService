// =====================================================
// ANALYTICS ROUTES
// =====================================================

const express = require("express");

const router = express.Router();

const {
  getAdminOverview,
  getBookingActivity,
  getBookingBreakdown,
  getServiceAnalytics,
  getProviderAnalytics,

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

router.get(
  "/admin/booking-breakdown",
  authMiddleware,
  roleMiddleware("admin"),
  getBookingBreakdown
);

// =====================================================
// ADMIN → SERVICE ANALYTICS
// =====================================================

router.get(
  "/admin/services",
  authMiddleware,
  roleMiddleware("admin"),
  getServiceAnalytics
);

// =====================================================
// ADMIN → PROVIDER ANALYTICS
// =====================================================

router.get(
  "/admin/providers",
  authMiddleware,
  roleMiddleware("admin"),
  getProviderAnalytics
);

module.exports = router;