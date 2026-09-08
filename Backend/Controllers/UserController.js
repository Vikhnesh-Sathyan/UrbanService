const User = require("../Models/User");

// Get all service providers
const getProviders = async (req, res) => {
  try {
    const providers = await User.find({
      role: "provider",
    }).select("-password");

    res.status(200).json({
      providers,
    });

  } catch (error) {
    console.error("Get providers error:", error);

    res.status(500).json({
      message: "Failed to fetch providers",
    });
  }
};

module.exports = {
  getProviders,
};