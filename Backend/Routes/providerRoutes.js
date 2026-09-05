const express = require("express");

const {
  updateAvailability,
  getAvailability,
} = require("../Controllers/providerController");

const authMiddleware = require("../Middleware/AuthMiddleware");
const roleMiddleware = require("../Middleware/roleMiddleware");

const router = express.Router();

router.get(
  "/availability",
  authMiddleware,
  roleMiddleware("provider"),
  getAvailability
);

router.put(
  "/availability",
  authMiddleware,
  roleMiddleware("provider"),
  updateAvailability
);

module.exports = router;