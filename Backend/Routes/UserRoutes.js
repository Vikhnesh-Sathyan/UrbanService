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
// BROWSE PROVIDERS
// ========================================

// User can view all providers
router.get(
  "/providers",
  authMiddleware,
  roleMiddleware("user" , "admin"),
  getProviders
);


// ========================================
// VIEW PROVIDER PROFILE
// ========================================

// User can view a specific provider
router.get(
  "/providers/:id",
  authMiddleware,
  roleMiddleware("user", "admin"),
  getProviderProfile
);


module.exports = router;