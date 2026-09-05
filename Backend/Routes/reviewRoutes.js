const express = require("express");

const {
  createReview,
  getProviderReviews,
  getProviderRating,
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

router.get(
  "/provider/:providerId/rating",
  getProviderRating
);

module.exports = router;