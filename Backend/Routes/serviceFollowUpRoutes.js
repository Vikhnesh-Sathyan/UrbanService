const express = require("express");

const {
  scheduleServiceFollowUp,
} = require("../Controllers/ServiceFollowUpController");

const authMiddleware = require("../Middleware/AuthMiddleware");
const roleMiddleware = require("../Middleware/roleMiddleware");

const router = express.Router();

// Provider schedules a follow-up for a completed booking
router.post(
  "/",
  authMiddleware,
  roleMiddleware("provider"),
  scheduleServiceFollowUp
);

module.exports = router;