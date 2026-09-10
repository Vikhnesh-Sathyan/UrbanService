const express = require("express");

const {
  getAvailability,
  updateAvailability,
} = require("../Controllers/availabilityController");

const authMiddleware = require("../Middleware/AuthMiddleware");
const roleMiddleware = require("../Middleware/roleMiddleware");

const router = express.Router();

router.get(
  "/",
  authMiddleware,
  roleMiddleware("provider"),
  getAvailability
);

router.put(
  "/",
  authMiddleware,
  roleMiddleware("provider"),
  updateAvailability
);

module.exports = router;