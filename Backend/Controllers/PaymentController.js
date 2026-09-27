const Stripe = require("stripe");
const Booking = require("../Models/Booking");

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// ==========================================
// CREATE PAYMENT INTENT
// ==========================================

const createPaymentIntent = async (req, res) => {
  try {
    const { bookingId, amount } = req.body;

    // Check required data
    if (!bookingId || !amount) {
      return res.status(400).json({
        success: false,
        message: "Booking ID and amount are required",
      });
    }

    // Find booking
    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    // Make sure the booking belongs to the logged-in user
    if (booking.user.toString() !== req.user.id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to pay for this booking",
      });
    }

    // Create Stripe Payment Intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(Number(amount) * 100),
      currency: "inr",

      automatic_payment_methods: {
        enabled: true,
      },

      metadata: {
        bookingId: booking._id.toString(),
        userId: req.user.id.toString(),
      },
    });

    res.status(200).json({
      success: true,
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    });
  } catch (error) {
    console.error("Create payment intent error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create payment intent",
    });
  }
};

module.exports = {
  createPaymentIntent,
};