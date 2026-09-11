const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
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

    // User location
    location: {
      // User enters this manually
      city: {
        type: String,
        default: "",
        trim: true,
      },

      // User enters this manually
      state: {
        type: String,
        default: "",
        trim: true,
      },

      // Used later for location-based features
      // [longitude, latitude]
      coordinates: {
        type: [Number],
        default: [0, 0],
      },
    },

    // Emergency contact
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

    // Provider availability
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