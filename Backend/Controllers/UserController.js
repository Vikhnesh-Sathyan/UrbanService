const User = require("../Models/User");
const Service = require("../Models/Service");

// ========================================
// GET ALL SERVICE PROVIDERS
// ========================================

const getProviders = async (req, res) => {
  try {
    const providers = await User.find({
      role: "provider",
    }).select("-password");

    const providersWithServices = await Promise.all(
      providers.map(async (provider) => {

        const services = await Service.find({
          provider: provider._id,
        }).select(
          "name price category description status adminComment"
        );

        return {
          _id: provider._id,
          name: provider.name,
          email: provider.email,
          role: provider.role,
          isActive: provider.isActive,
          services: services,
        };
      })
    );

    res.status(200).json({
      providers: providersWithServices,
    });

  } catch (error) {

    console.error(
      "Get providers error:",
      error
    );

    res.status(500).json({
      message: "Failed to fetch providers",
    });
  }
};

module.exports = {
  getProviders,
};