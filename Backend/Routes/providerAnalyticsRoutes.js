const express = require("express");

const router = express.Router();

const {
  getMyProviderOverview,
  getMyBookingPerformance,
  getMyBookingActivity,
} = require("../Controllers/ProviderAnalyticsController");

const authMiddleware = require("../Middleware/authMiddleware");
const roleMiddleware = require("../Middleware/roleMiddleware");

// =====================================================
// PROVIDER OVERVIEW
// =====================================================

router.get(
  "/overview",
  authMiddleware,
  roleMiddleware("provider"),
  getMyProviderOverview
);

// =====================================================
// PROVIDER BOOKING PERFORMANCE
// =====================================================

router.get(
  "/booking-performance",
  authMiddleware,
  roleMiddleware("provider"),
  getMyBookingPerformance
);

// Get provider booking activity by date
router.get(
  "/booking-activity",
  authMiddleware,
  roleMiddleware("provider"),
  getMyBookingActivity
);

module.exports = router;