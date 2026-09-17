const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    // User who should receive the notification
    recipient: { //who should receive the notification.
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Notification message
    message: {
      type: String,
      required: true,
      trim: true,
    },

    // Type of notification
    type: {
      type: String,
      enum: [
        "booking",
        "service",
        "review",
        "account",
        "help",
        "general",
      ],
      default: "general",
    },

    // Whether the user has opened/read it
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "Notification",
  notificationSchema
);