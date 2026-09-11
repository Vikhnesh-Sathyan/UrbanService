const express = require("express");

const authMiddleware = require("../Middleware/AuthMiddleware");
const roleMiddleware = require("../Middleware/roleMiddleware");

const {
  getProviders,
  getProfile,
  updateProfile,
  getProviderProfile,
} = require("../Controllers/UserController");

const router = express.Router();


// ========================================
// USER PROFILE
// ========================================

// Logged-in user can view their profile
router.get(
  "/profile",
  authMiddleware,
  getProfile
);


// Logged-in user can update their profile
router.put(
  "/profile",
  authMiddleware,
  updateProfile
);

// ========================================
// USER VIEW PROVIDER PROFILE
// ========================================

router.get(
  "/providers/:id",
  authMiddleware,
  roleMiddleware("user"),
  getProviderProfile
);

// ========================================
// ADMIN
// ========================================

// Admin can view providers
router.get(
  "/providers",
  authMiddleware,
  roleMiddleware("admin"),
  getProviders
);


module.exports = router;