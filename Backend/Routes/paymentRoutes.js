const express = require("express");

const {
  createPaymentIntent,
  getPaymentStatus,
  refundPayment,
  getPaymentHistory,
  getProviderEarnings,
} = require("../Controllers/PaymentController");

const authMiddleware = require("../Middleware/authMiddleware");
const roleMiddleware = require("../Middleware/roleMiddleware");

const router = express.Router();

// ==========================================
// CREATE PAYMENT
// ==========================================

router.post(
  "/create-payment-intent",
  authMiddleware,
  roleMiddleware("user"),
  createPaymentIntent
);

// ==========================================
// GET PAYMENT STATUS
// ==========================================

router.get(
  "/booking/:bookingId",
  authMiddleware,
  roleMiddleware("user"),
  getPaymentStatus
);

// ==========================================
// REFUND PAYMENT
// ==========================================

router.post(
  "/refund/:paymentId",
  authMiddleware,
  roleMiddleware("user"),
  refundPayment
);

// ==========================================
// GET PAYMENT HISTORY
// ==========================================

router.get(
  "/history",
  authMiddleware,
  roleMiddleware("user"),
  getPaymentHistory
);

// =====================================================
// PROVIDER EARNINGS
// =====================================================

router.get(
  "/provider/earnings",
  authMiddleware,
  roleMiddleware("provider"),
  getProviderEarnings
);

module.exports = router;