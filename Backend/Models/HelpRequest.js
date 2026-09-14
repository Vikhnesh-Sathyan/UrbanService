const mongoose = require("mongoose");

const helpRequestSchema = new mongoose.Schema(
  {
    // Provider who is requesting help
    provider: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Provider email
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },

    // Provider's message
    message: {
      type: String,
      required: true,
      trim: true,
    },

    // Request status
    status: {
      type: String,
      enum: ["open", "in_progress", "resolved"],
      default: "open",
    },

    // Admin response
    adminResponse: {
      type: String,
      default: "",
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const HelpRequest = mongoose.model(
  "HelpRequest",
  helpRequestSchema
);

module.exports = HelpRequest;