const mongoose = require("mongoose");

// =====================================================
// MATERIAL PREPARATION MODEL
// Stores materials required and prepared by the provider
// =====================================================

const materialPreparationSchema = new mongoose.Schema(
  {
    booking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
      required: true,
      unique: true,
    },

    provider: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

  materials: [
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    quantity: {
      type: Number,
      required: true,
      min: 1,
    },

    unit: {
      type: String,
      default: "piece",
      trim: true,
    },

    // Shows who added this material
    source: {
      type: String,
      enum: ["admin", "provider"],
      default: "provider",
    },

    status: {
      type: String,
      enum: [
        "available",
        "need_to_buy",
        "ready",
      ],
      default: "available",
    },
  },
],

    preparationStatus: {
      type: String,
      enum: [
        "pending",
        "preparing",
        "ready",
      ],
      default: "pending",
    },

    providerNotes: {
      type: String,
      default: "",
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "MaterialPreparation",
  materialPreparationSchema
);