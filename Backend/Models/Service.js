const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema({

  name: String,

  price: Number,

  description: String,

  category: String,

  // Service tag selected by provider
  tag: {
    type: String,
    default: "",
  },

  image: String,

  status: {
    type: String,
    enum: [
      "pending",
      "approved",
      "changes_requested",
      "rejected",
    ],
    default: "pending",
  },

  adminComment: {
    type: String,
    default: "",
  },

  detailedDescription: String,

  // Provider who created the service
  provider: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

});

module.exports = mongoose.model("Service", serviceSchema);