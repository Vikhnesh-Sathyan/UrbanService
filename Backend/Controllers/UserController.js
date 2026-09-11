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
    console.error("Get providers error:", error);

    res.status(500).json({
      message: "Failed to fetch providers",
    });
  }
};


// ========================================
// GET MY PROFILE
// ========================================

const getProfile = async (req, res) => {
  try {

    // Get currently logged-in user
    const user = await User.findById(req.user.id)
      .select("-password");

    // User not found
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.status(200).json({
      user,
    });

  } catch (error) {
    console.error("Get profile error:", error);

    res.status(500).json({
      message: "Failed to fetch profile",
    });
  }
};


// ========================================
// GET PROVIDER PROFILE FOR USER
// ========================================

const getProviderProfile = async (req, res) => {
  try {
    const provider = await User.findOne({
      _id: req.params.id,
      role: "provider",
    }).select("-password");

    if (!provider) {
      return res.status(404).json({
        message: "Provider not found",
      });
    }

    const services = await Service.find({
      provider: provider._id,
      status: "approved",
    }).select(
      "name price description category tag image detailedDescription"
    );

    res.status(200).json({
      provider: {
        _id: provider._id,
        name: provider.name,
        phone: provider.phone,

        professionalDescription:
        provider.professionalDescription,
        
        experience: provider.experience,
        location: provider.location,
        availability: provider.availability,
      },

      services,
    });

  } catch (error) {
    console.error(
      "Get provider profile error:",
      error
    );

    res.status(500).json({
      message: "Failed to fetch provider profile",
    });
  }
};

// ========================================
// UPDATE MY PROFILE
// ========================================

const updateProfile = async (req, res) => {
  try {
    const {
      name,
      phone,
      professionalDescription,
      experience,
      city,
      state,
      emergencyContact,
    } = req.body;

    // Find logged-in user
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // ====================================
    // BASIC DETAILS
    // ====================================

    if (name !== undefined) {
      user.name = name.trim();
    }

    if (phone !== undefined) {
      user.phone = phone.trim();
    }

    // ====================================
    // PROFESSIONAL DESCRIPTION
    // ====================================

    if (professionalDescription !== undefined) {
      user.professionalDescription =
        professionalDescription.trim();
    }
    // ====================================
    // EXPERIENCE
    // ====================================

    if (experience !== undefined) {
      user.experience = experience.trim();
    }

    // ====================================
    // LOCATION
    // ====================================

    if (city !== undefined) {
      user.location.city = city.trim();
    }

    if (state !== undefined) {
      user.location.state = state.trim();
    }

    // ====================================
    // EMERGENCY CONTACT
    // ====================================

    if (emergencyContact !== undefined) {

      if (emergencyContact.name !== undefined) {
        user.emergencyContact.name =
          emergencyContact.name.trim();
      }

      if (emergencyContact.phone !== undefined) {
        user.emergencyContact.phone =
          emergencyContact.phone.trim();
      }

      if (emergencyContact.relationship !== undefined) {
        user.emergencyContact.relationship =
          emergencyContact.relationship.trim();
      }
    }

    // Save changes
    await user.save();

    // Get updated user
    const updatedUser = await User.findById(req.user.id)
      .select("-password");

    res.status(200).json({
      message: "Profile updated successfully",
      user: updatedUser,
    });

  } catch (error) {
    console.error(
      "Update profile error:",
      error
    );

    res.status(500).json({
      message: "Failed to update profile",
    });
  }
};



// ========================================
// EXPORTS
// ========================================

module.exports = {
  getProviders,
  getProfile,
  updateProfile,
  getProviderProfile,
};