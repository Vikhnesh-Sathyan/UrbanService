const express = require("express");

const {
  createPaymentIntent,
  getPaymentStatus,
} = require("../Controllers/PaymentController");

const authMiddleware = require("../Middleware/AuthMiddleware");
const roleMiddleware = require("../Middleware/roleMiddleware");

const router = express.Router();

// Create Stripe Payment Intent
router.post(
  "/create-payment-intent",
  authMiddleware,
  roleMiddleware("user"),
  createPaymentIntent
);

router.get(
  "/booking/:bookingId",
  authMiddleware,
  roleMiddleware("user"),
  getPaymentStatus
);

module.exports = router;