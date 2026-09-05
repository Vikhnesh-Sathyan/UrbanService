const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      enum: ["user", "provider", "admin"],
      default: "user",
    },
    availability: {
  days: {
    type: [String],
    default: []
  },
  startTime: {
    type: String,
    default: "09:00"
  },
  endTime: {
    type: String,
    default: "18:00"
  }
}
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

module.exports = User;