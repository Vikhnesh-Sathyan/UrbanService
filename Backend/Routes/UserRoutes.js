const express = require("express");

const authMiddleware = require("../Middleware/AuthMiddleware");
const roleMiddleware = require("../Middleware/roleMiddleware");

const {
  getProviders,
  getProfile,
  updateProfile,
  getProviderProfile,
  blockProvider,
  unblockProvider,
  getUsers,
  getUserDetails,
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

// ========================================
// BLOCK / UNBLOCK PROVIDER
// ========================================

// Admin can block a provider
router.patch(
  "/providers/:id/block",
  authMiddleware,
  roleMiddleware("admin"),
  blockProvider
);

// Admin can unblock a provider
router.patch(
  "/providers/:id/unblock",
  authMiddleware,
  roleMiddleware("admin"),
  unblockProvider
);

//Admin view user profile
router.get(
  "/",
  authMiddleware,
  roleMiddleware("admin"),
  getUsers
);

router.get(
  "/",
  authMiddleware,
  roleMiddleware("admin"),
  getUsers
);

router.get(
  "/:id",
  authMiddleware,
  roleMiddleware("admin"),
  getUserDetails
);

module.exports = router;