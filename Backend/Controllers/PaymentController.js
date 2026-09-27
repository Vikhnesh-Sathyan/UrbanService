const Stripe = require("stripe");
const Booking = require("../Models/Booking");
const Payment = require("../Models/Payment");

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// ==========================================
// CREATE PAYMENT INTENT
// ==========================================

const createPaymentIntent = async (req, res) => {
  try {
    // Get only booking ID from frontend
    const { bookingId } = req.body;

    // Check booking ID
    if (!bookingId) {
      return res.status(400).json({
        success: false,
        message: "Booking ID is required",
      });
    }

    // Find booking and service price
    const booking = await Booking.findById(bookingId).populate(
      "service",
      "name price"
    );

    // Check booking
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    // Make sure the booking belongs to logged-in user
    if (
      booking.user.toString() !==
      req.user.id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message:
          "You are not allowed to pay for this booking",
      });
    }

    // Get price directly from database
    const amount = Number(booking.service?.price);

    // Check valid service price
    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid service price",
      });
    }

    // ==========================================
    // CREATE STRIPE PAYMENT INTENT
    // ==========================================

    const paymentIntent =
      await stripe.paymentIntents.create({
        amount: Math.round(amount * 100),
        currency: "inr",

        automatic_payment_methods: {
          enabled: true,
        },

        metadata: {
          bookingId: booking._id.toString(),
          userId: req.user.id.toString(),
        },
      });

      await Payment.findOneAndUpdate(
  { stripePaymentIntentId: paymentIntent.id },
  {
    user: req.user.id,
    booking: booking._id,
    amount,
    currency: "inr",
    stripePaymentIntentId: paymentIntent.id,
    status: "pending",
  },
  {
    upsert: true,
    new: true,
  }
);

    // Send client secret to frontend
    res.status(200).json({
      success: true,
      clientSecret:
        paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
      amount,
    });
  } catch (error) {
    console.error(
      "Create payment intent error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to create payment intent",
    });
  }
};

module.exports = {
  createPaymentIntent,
};