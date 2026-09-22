const mongoose = require("mongoose");

const complaintSchema = new mongoose.Schema(
  {
    // Customer who submitted the complaint
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Provider involved in the complaint
    provider: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Booking related to the complaint
    booking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
      required: true,
    },

    // Service related to the complaint
    service: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Service",
      required: true,
    },

    // Reason selected by customer
    reason: {
      type: String,
      enum: [
        "service_quality",
        "provider_no_show",
        "service_not_provided",
        "payment_issue",
        "inappropriate_behavior",
        "other",
      ],
      required: true,
    },

    // Customer's explanation
    description: {
      type: String,
      required: true,
      trim: true,
    },

    // Complaint status
    status: {
      type: String,
      enum: [
        "open",
        "under_review",
        "resolved",
        "rejected",
      ],
      default: "open",
    },

    // Action taken by admin
    adminAction: {
      type: String,
      enum: [
        "none",
        "warning",
        "provider_blocked",
      ],
      default: "none",
    },

    // Admin's response
    adminResponse: {
      type: String,
      default: "",
      trim: true,
    },

    // When admin reviewed the complaint
    reviewedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "Complaint",
  complaintSchema
);