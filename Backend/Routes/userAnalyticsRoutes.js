const express = require("express");
const router = express.Router();

const {
  getMyUserOverview,
  getMyUserBookingStatus,
  getMyUserServiceUsage,
  getMyUserBookingType,
} = require("../Controllers/UserAnalyticsController");

const authMiddleware = require("../Middleware/authMiddleware");
const roleMiddleware = require("../Middleware/roleMiddleware");

router.get(
  "/overview",
  authMiddleware,
  roleMiddleware("user"),
  getMyUserOverview
);

router.get(
  "/booking-status",
  authMiddleware,
  roleMiddleware("user"),
  getMyUserBookingStatus
);

router.get(
  "/service-usage",
  authMiddleware,
  roleMiddleware("user"),
  getMyUserServiceUsage
);

// Booking type analytics: normal vs emergency
router.get(
  "/booking-type",
  authMiddleware,
  roleMiddleware("user"),
  getMyUserBookingType
);

module.exports = router;