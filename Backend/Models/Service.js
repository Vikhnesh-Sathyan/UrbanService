const mongoose = require("mongoose");

// Create the structure (schema) for a Service document.
const serviceSchema = new mongoose.Schema({
  // Name of the service.
  // Example: "AC Repair"
  name: String,

  price: Number,
  description: String,
  category: String,
  image: String,
  status: { type: String, default: "pending" },

  detailedDescription: String,

 // Stores the ID of the provider who created this service.
  provider: {

    // The provider's ID is a MongoDB ObjectId.
    type: mongoose.Schema.Types.ObjectId,

    // This ID belongs to a User document.
    ref: "User",

    // Every service must have a provider.
    required: true,
  },
});

module.exports = mongoose.model("Service", serviceSchema);
