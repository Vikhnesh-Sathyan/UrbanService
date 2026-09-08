const express = require("express");

const authMiddleware = require("../Middleware/AuthMiddleware");
const roleMiddleware = require("../Middleware/roleMiddleware");

const {
  getProviders,
} = require("../Controllers/UserController");

const router = express.Router();

// Admin can view providers
router.get(
  "/providers",
  authMiddleware,
  roleMiddleware("admin"),
  getProviders
);

module.exports = router;