const express = require("express");
const router = express.Router();

const {
  getMyUserOverview,
  getMyUserBookingActivity,
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
  "/booking-activity",
  authMiddleware,
  roleMiddleware("user"),
  getMyUserBookingActivity
);


module.exports = router;