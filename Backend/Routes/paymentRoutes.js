const express = require("express");

const {
  createPaymentIntent,
} = require("../Controllers/PaymentController");

const authMiddleware = require("../Middleware/authMiddleware");
const roleMiddleware = require("../Middleware/roleMiddleware");

const router = express.Router();

// Create Stripe Payment Intent
router.post(
  "/create-payment-intent",
  authMiddleware,
  roleMiddleware("user"),
  createPaymentIntent
);

module.exports = router;