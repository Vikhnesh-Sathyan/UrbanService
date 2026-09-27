const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    // User who made the payment
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Booking associated with this payment
    booking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
      required: true,
    },

    // Amount paid
    amount: {
      type: Number,
      required: true,
    },

    // Currency used for payment
    currency: {
      type: String,
      default: "inr",
    },

    // Stripe Payment Intent ID
    stripePaymentIntentId: {
      type: String,
      required: true,
    },

    // Current payment status
    status: {
      type: String,
      enum: ["pending", "succeeded", "failed", "refunded"],
      default: "pending",
    },
  },
  { timestamps: true }
);

const Payment = mongoose.model("Payment", paymentSchema);

module.exports = Payment;