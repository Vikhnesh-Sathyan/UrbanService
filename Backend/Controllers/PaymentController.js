
const Stripe = require("stripe");
const Booking = require("../Models/Booking");
const Payment = require("../Models/Payment");

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// ==========================================
// CREATE PAYMENT INTENT
// ==========================================

// ==========================================
// CREATE PAYMENT INTENT
// ==========================================

const createPaymentIntent = async (req, res) => {
  try {
    // Get booking ID from frontend
    const { bookingId } = req.body;

    // Check booking ID
    if (!bookingId) {
      return res.status(400).json({
        success: false,
        message: "Booking ID is required",
      });
    }

    // ==========================================
    // FIND BOOKING + SERVICE PRICE
    // ==========================================

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

    // ==========================================
    // CHECK BOOKING OWNERSHIP
    // ==========================================

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

    // ==========================================
    // CHECK ALREADY SUCCESSFUL PAYMENT
    // ==========================================

    const successfulPayment = await Payment.findOne({
      booking: booking._id,
      user: req.user.id,
      status: "succeeded",
    });

    // Payment already completed
    if (successfulPayment) {
      return res.status(409).json({
        success: false,
        message: "This booking has already been paid",
      });
    }

    // ==========================================
    // CHECK EXISTING PENDING PAYMENT
    // ==========================================

    const existingPayment = await Payment.findOne({
      booking: booking._id,
      user: req.user.id,
      status: "pending",
    }).sort({ createdAt: -1 });

    // ==========================================
    // REUSE EXISTING STRIPE PAYMENT INTENT
    // ==========================================

    if (existingPayment) {
      try {
        const existingIntent =
          await stripe.paymentIntents.retrieve(
            existingPayment.stripePaymentIntentId
          );

        // Reuse if payment is still active
        if (
          existingIntent.status !== "canceled" &&
          existingIntent.status !== "succeeded"
        ) {
          return res.status(200).json({
            success: true,
            clientSecret: existingIntent.client_secret,
            paymentIntentId: existingIntent.id,
            amount: existingPayment.amount,
            reused: true,
          });
        }
      } catch (error) {
        console.error(
          "Existing PaymentIntent retrieval error:",
          error.message
        );
      }
    }

    // ==========================================
    // GET PRICE FROM DATABASE
    // ==========================================

    const amount = Number(booking.service?.price);

    // Check valid service price
    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid service price",
      });
    }

    // ==========================================
    // CREATE NEW STRIPE PAYMENT INTENT
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

    // ==========================================
    // SAVE PAYMENT RECORD
    // ==========================================

    await Payment.findOneAndUpdate(
      {
        stripePaymentIntentId: paymentIntent.id,
      },
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

    // ==========================================
    // SEND CLIENT SECRET TO FRONTEND
    // ==========================================

    return res.status(200).json({
      success: true,
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
      amount,
      reused: false,
    });
  } catch (error) {
    console.error(
      "Create payment intent error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to create payment intent",
    });
  }
};

// ==========================================
// GET PAYMENT STATUS
// ==========================================

const getPaymentStatus = async (req, res) => {
  try {
    const { bookingId } = req.params;

    // Check booking ID
    if (!bookingId) {
      return res.status(400).json({
        success: false,
        message: "Booking ID is required",
      });
    }

    /*
      First check whether this booking already has
      a successful payment.

      This prevents a newer pending payment record
      from hiding an earlier successful payment.
    */

    const successfulPayment = await Payment.findOne({
      booking: bookingId,
      user: req.user.id,
      status: "succeeded",
    }).sort({ updatedAt: -1 });

    // ==========================================
    // SUCCESSFUL PAYMENT FOUND
    // ==========================================

    if (successfulPayment) {
      return res.status(200).json({
        success: true,
        payment: {
          id: successfulPayment._id,
          booking: successfulPayment.booking,
          amount: successfulPayment.amount,
          currency: successfulPayment.currency,
          stripePaymentIntentId:
            successfulPayment.stripePaymentIntentId,
          status: successfulPayment.status,
          createdAt: successfulPayment.createdAt,
        },
      });
    }

    /*
      No successful payment found.

      Now check the latest payment record.
      This can be pending or failed.
    */

    const latestPayment = await Payment.findOne({
      booking: bookingId,
      user: req.user.id,
    }).sort({ createdAt: -1 });

    // ==========================================
    // NO PAYMENT FOUND
    // ==========================================

    if (!latestPayment) {
      return res.status(404).json({
        success: false,
        message: "Payment not found",
      });
    }

    // ==========================================
    // RETURN LATEST PAYMENT
    // ==========================================

    return res.status(200).json({
      success: true,
      payment: {
        id: latestPayment._id,
        booking: latestPayment.booking,
        amount: latestPayment.amount,
        currency: latestPayment.currency,
        stripePaymentIntentId:
          latestPayment.stripePaymentIntentId,
        status: latestPayment.status,
        createdAt: latestPayment.createdAt,
      },
    });
  } catch (error) {
    console.error(
      "Get payment status error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to get payment status",
    });
  }
};

// ==========================================
// REFUND PAYMENT
// ==========================================

const refundPayment = async (req, res) => {
  try {
    const { paymentId } = req.params;

    // Check payment ID
    if (!paymentId) {
      return res.status(400).json({
        success: false,
        message: "Payment ID is required",
      });
    }

    // Find payment belonging to logged-in user
    const payment = await Payment.findOne({
      _id: paymentId,
      user: req.user.id,
    });

    // Check payment
    if (!payment) {
      return res.status(404).json({
        success: false,
        message: "Payment not found",
      });
    }

    // Only successful payments can be refunded
    if (payment.status !== "succeeded") {
      return res.status(400).json({
        success: false,
        message: "Only successful payments can be refunded",
      });
    }

    // ==========================================
    // CREATE STRIPE REFUND
    // ==========================================

    const refund = await stripe.refunds.create({
      payment_intent: payment.stripePaymentIntentId,
    });

    // ==========================================
    // UPDATE PAYMENT STATUS
    // ==========================================

    payment.status = "refunded";

    await payment.save();

    // ==========================================
    // SEND RESPONSE
    // ==========================================

    return res.status(200).json({
      success: true,
      message: "Payment refunded successfully",
      refundId: refund.id,
      payment: {
        id: payment._id,
        booking: payment.booking,
        amount: payment.amount,
        currency: payment.currency,
        status: payment.status,
      },
    });
  } catch (error) {
    console.error(
      "Refund payment error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to refund payment",
    });
  }
};

// ==========================================
// GET PAYMENT HISTORY
// ==========================================

const getPaymentHistory = async (req, res) => {
  try {
    // Find all payments of logged-in user
    const payments = await Payment.find({
      user: req.user.id,
    })
      .populate({
        path: "booking",
        select: "date time bookingType service provider",
        populate: [
          {
            path: "service",
            select: "name",
          },
          {
            path: "provider",
            select: "name",
          },
        ],
      })
      .sort({ createdAt: -1 });

    // ==========================================
    // SEND PAYMENT HISTORY
    // ==========================================

    return res.status(200).json({
      success: true,
      payments,
    });
  } catch (error) {
    console.error(
      "Get payment history error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to get payment history",
    });
  }
};

// =====================================================
// GET PROVIDER EARNINGS
// =====================================================

const getProviderEarnings = async (req, res) => {
  try {
    const providerId = req.user.id;

    // Get all payments and connect them with their booking
    const payments = await Payment.find({
      status: { $in: ["succeeded", "refunded"] },
    })
      .populate({
        path: "booking",
        select: "provider",
      })
      .lean();

    // Keep only payments belonging to this provider
    const providerPayments = payments.filter(
      (payment) =>
        payment.booking &&
        payment.booking.provider &&
        payment.booking.provider.toString() ===
          providerId.toString()
    );

    // Calculate earnings
    const totalPaid = providerPayments
      .filter((payment) => payment.status === "succeeded")
      .reduce(
        (total, payment) => total + payment.amount,
        0
      );

    const totalRefunded = providerPayments
      .filter((payment) => payment.status === "refunded")
      .reduce(
        (total, payment) => total + payment.amount,
        0
      );

    const netEarnings =
      totalPaid - totalRefunded;

    return res.status(200).json({
      success: true,
      earnings: {
        totalPaid,
        totalRefunded,
        netEarnings,
        successfulPayments:
          providerPayments.filter(
            (payment) =>
              payment.status === "succeeded"
          ).length,
        refundedPayments:
          providerPayments.filter(
            (payment) =>
              payment.status === "refunded"
          ).length,
      },
    });
  } catch (error) {
    console.error(
      "Get provider earnings error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to get provider earnings",
    });
  }
};

// =====================================================
// GET PAYMENT RECEIPT
// =====================================================

const getPaymentReceipt = async (req, res) => {
  try {
    const { paymentId } = req.params;

    if (!paymentId) {
      return res.status(400).json({
        success: false,
        message: "Payment ID is required",
      });
    }

    const payment = await Payment.findOne({
      _id: paymentId,
      user: req.user.id,
    })
      .populate({
        path: "booking",
        select:
          "date time bookingType phone notes service provider",
        populate: [
          {
            path: "service",
            select: "name price",
          },
          {
            path: "provider",
            select: "name",
          },
        ],
      })
      .lean();

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: "Payment not found",
      });
    }

    return res.status(200).json({
      success: true,
      receipt: {
        paymentId: payment._id,
        stripePaymentIntentId:
          payment.stripePaymentIntentId,
        amount: payment.amount,
        currency: payment.currency,
        status: payment.status,
        paymentDate: payment.createdAt,

        booking: payment.booking
          ? {
              date: payment.booking.date,
              time: payment.booking.time,
              bookingType:
                payment.booking.bookingType,

              service:
                payment.booking.service?.name ||
                "Service",

              provider:
                payment.booking.provider?.name ||
                "Provider",
            }
          : null,
      },
    });
  } catch (error) {
    console.error(
      "Get payment receipt error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to get payment receipt",
    });
  }
};
// ==========================================
// EXPORT CONTROLLERS
// ==========================================

module.exports = {
  createPaymentIntent,
  getPaymentStatus,
  refundPayment,
  getPaymentHistory,
  getProviderEarnings,
  getPaymentReceipt,
};
