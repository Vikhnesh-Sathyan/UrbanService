const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    // ========================================
    // BASIC USER DETAILS
    // ========================================

    // User name
    name: {
      type: String,
      required: true,
      trim: true,
    },

    // User email
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    // Hashed password
    password: {
      type: String,
      required: true,
    },

    // User role
    role: {
      type: String,
      enum: ["user", "provider", "admin"],
      default: "user",
    },

    // Phone number
    phone: {
      type: String,
      default: "",
      trim: true,
    },
    //Proffessional description
    professionalDescription: {
      type: String,
      default: "",
      trim: true,
    },

    // ========================================
    // LOCATION
    // ========================================

    // City and state entered by the user/provider
    location: {
      city: {
        type: String,
        default: "",
        trim: true,
      },

      state: {
        type: String,
        default: "",
        trim: true,
      },

      // [longitude, latitude]
      // Can be used later for location-based features
      coordinates: {
        type: [Number],
        default: [0, 0],
      },
    },

    // ========================================
    // EMERGENCY CONTACT
    // ========================================

    emergencyContact: {
      name: {
        type: String,
        default: "",
        trim: true,
      },

      phone: {
        type: String,
        default: "",
        trim: true,
      },

      relationship: {
        type: String,
        default: "",
        trim: true,
      },
    },

    // ========================================
    // PROVIDER AVAILABILITY
    // ========================================

    // Used by providers to define their working schedule
    availability: {
      days: {
        type: [String],
        enum: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
          "Sunday",
        ],
        default: [],
      },

      startTime: {
        type: String,
        default: "09:00",
      },

      endTime: {
        type: String,
        default: "18:00",
      },
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

module.exports = User;