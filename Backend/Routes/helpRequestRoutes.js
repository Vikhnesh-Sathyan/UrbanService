const express = require("express");

const {
  createHelpRequest,
  getHelpRequests,
  respondToHelpRequest,
} = require("../Controllers/helpRequestController");

const authMiddleware = require("../Middleware/AuthMiddleware");
const roleMiddleware = require("../Middleware/roleMiddleware");

const router = express.Router();

// ========================================
// PROVIDER - CREATE HELP REQUEST
// ========================================

// No authentication required
// because blocked providers cannot login
router.post(
  "/help",
  createHelpRequest
);


// ========================================
// ADMIN - GET ALL HELP REQUESTS
// ========================================

router.get(
  "/help",
  authMiddleware,
  roleMiddleware("admin"),
  getHelpRequests
);


// ========================================
// ADMIN - RESPOND TO HELP REQUEST
// ========================================

router.patch(
  "/help/:id/respond",
  authMiddleware,
  roleMiddleware("admin"),
  respondToHelpRequest
);


module.exports = router;