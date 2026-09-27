const Stripe = require("stripe");
const Payment = require("../Models/Payment");
const Booking = require("../Models/Booking");

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// ==========================================
// STRIPE WEBHOOK
// ==========================================

//Verify the request is really from Stripe
const handleStripeWebhook = async (req, res) => {
  const signature = req.headers["stripe-signature"];

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (error) {
    console.error(
      "Stripe webhook signature verification failed:",
      error.message
    );

    return res.status(400).send(`Webhook Error: ${error.message}`);
  }

  try {
    // ==========================================
    // PAYMENT SUCCEEDED
    // ==========================================

    if (event.type === "payment_intent.succeeded") {
      const paymentIntent = event.data.object;

      const bookingId =
        paymentIntent.metadata?.bookingId;

      const userId =
        paymentIntent.metadata?.userId;

      if (!bookingId || !userId) {
        console.error(
          "Missing bookingId or userId in Stripe metadata"
        );

        return res.json({ received: true });
      }

      // Find booking
      const booking = await Booking.findById(
        bookingId
      );

      if (!booking) {
        console.error(
          "Booking not found:",
          bookingId
        );

        return res.json({ received: true });
      }

      // ==========================================
      // CREATE / UPDATE PAYMENT
      // ==========================================

      await Payment.findOneAndUpdate(
        {
          stripePaymentIntentId:
            paymentIntent.id,
        },
        {
          user: userId,
          booking: bookingId,
          amount:
            paymentIntent.amount / 100,
          currency:
            paymentIntent.currency,
          stripePaymentIntentId:
            paymentIntent.id,
          status: "succeeded",
        },
        {
          upsert: true,
          new: true,
        }
      );

      console.log(
        "✅ Payment recorded:",
        paymentIntent.id
      );
    }

    // ==========================================
    // PAYMENT FAILED
    // ==========================================

    if (
      event.type ===
      "payment_intent.payment_failed"
    ) {
      const paymentIntent =
        event.data.object;

      await Payment.findOneAndUpdate(
        {
          stripePaymentIntentId:
            paymentIntent.id,
        },
        {
          status: "failed",
        }
      );

      console.log(
        "❌ Payment failed:",
        paymentIntent.id
      );
    }

    // Stripe expects a successful response
    res.json({ received: true });
  } catch (error) {
    console.error(
      "Stripe webhook processing error:",
      error
    );

    res.status(500).json({
      received: false,
    });
  }
};

module.exports = {
  handleStripeWebhook,
};