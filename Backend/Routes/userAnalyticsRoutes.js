const express = require("express");

const router = express.Router();

const {
  getMyUserOverview,
} = require("../Controllers/UserAnalyticsController");

const authMiddleware = require("../Middleware/authMiddleware");
const roleMiddleware = require("../Middleware/roleMiddleware");


// =====================================================
// GET USER ANALYTICS OVERVIEW
// =====================================================

router.get(
  "/overview",
  authMiddleware,
  roleMiddleware("user"),
  getMyUserOverview
);


module.exports = router;