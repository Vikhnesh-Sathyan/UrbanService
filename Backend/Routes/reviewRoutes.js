const express = require("express");

const {
  createReview,
  getProviderReviews,
} = require("../Controllers/reviewController");

const authMiddleware = require("../Middleware/AuthMiddleware");
const roleMiddleware = require("../Middleware/roleMiddleware");

const router = express.Router();

router.post(
  "/",
  authMiddleware,
  roleMiddleware("user"),
  createReview
);

router.get(
  "/provider/:providerId",
  getProviderReviews
);

module.exports = router;