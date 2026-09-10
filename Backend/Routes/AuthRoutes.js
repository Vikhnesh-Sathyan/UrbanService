const express = require("express");

const {
  registerUser,
  loginUser,
  updateAvailability,
} = require("../Controllers/AuthController");

const router = express.Router();

const authMiddleware = require("../Middleware/AuthMiddleware");
const roleMiddleware = require("../Middleware/roleMiddleware");

// Register
router.post("/register", registerUser);

// Login
router.post("/login", loginUser);


router.put(
  "/availability",
  authMiddleware,
  roleMiddleware("provider"),
  updateAvailability
);

module.exports = router;