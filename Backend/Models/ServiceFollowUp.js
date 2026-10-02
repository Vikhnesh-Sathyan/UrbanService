const mongoose = require("mongoose");

// =====================================================
// SERVICE FOLLOW-UP MODEL
// Stores future follow-up reminders for completed services
// =====================================================

const serviceFollowUpSchema = new mongoose.Schema(
  {
    // Customer who should receive the reminder
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Original completed booking
    booking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
      required: true,
    },

    // Service that needs follow-up
    service: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Service",
      required: true,
    },

    // When the follow-up should happen
    followUpDate: {
      type: Date,
      required: true,
    },

    // Current follow-up status
    status: {
      type: String,
      enum: [
        "scheduled",
        "notified",
        "completed",
        "cancelled",
      ],
      default: "scheduled",
    },

    // Prevent repeated notifications
    notificationSent: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "ServiceFollowUp",
  serviceFollowUpSchema
);