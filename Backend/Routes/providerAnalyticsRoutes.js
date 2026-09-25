const express = require("express");

const router = express.Router();

const {
  getMyProviderOverview,
  getMyBookingPerformance,
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

module.exports = router;