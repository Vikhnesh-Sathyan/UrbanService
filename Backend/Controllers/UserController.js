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
          status: "approved",
        }).select(
          "name price category description status"
        );

        return {
          _id: provider._id,

          name: provider.name,

          // EMAIL
          email: provider.email,

          phone: provider.phone,

          professionalDescription:
            provider.professionalDescription,

          experience:
            provider.experience,

          location:
            provider.location,

          availability:
            provider.availability,

          isActive:
            provider.isActive,

          services,
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


// ========================================
// GET MY PROFILE
// ========================================

const getProfile = async (req, res) => {
  try {

    const user = await User.findById(req.user.id)
      .select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.status(200).json({
      user,
    });

  } catch (error) {

    console.error(
      "Get profile error:",
      error
    );

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

        // EMAIL
        email: provider.email,

        phone: provider.phone,

        professionalDescription:
          provider.professionalDescription,

        experience:
          provider.experience,

        location:
          provider.location,

        availability:
          provider.availability,
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
      coordinates,
      emergencyContact,
    } = req.body;

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

// Save GPS coordinates
if (coordinates !== undefined) {
  if (
    Array.isArray(coordinates) &&
    coordinates.length === 2
  ) {
    user.location.coordinates = [
      Number(coordinates[0]), // longitude
      Number(coordinates[1]), // latitude
    ];
  }
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


    // ====================================
    // SAVE
    // ====================================

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
// GET SINGLE PROVIDER PROFILE - ADMIN
// ========================================

const getAdminProviderProfile = async (req, res) => {

  try {

    const { id } = req.params;


    // ====================================
    // FIND PROVIDER
    // ====================================

    const provider = await User.findOne({
      _id: id,
      role: "provider",
    }).select("-password");


    if (!provider) {
      return res.status(404).json({
        message: "Provider not found",
      });
    }


    // ====================================
    // GET ALL SERVICES
    // ====================================

    const services = await Service.find({
      provider: provider._id,
    }).select(
      "name price category description tag image detailedDescription status adminComment"
    );


    // ====================================
    // RESPONSE
    // ====================================

    res.status(200).json({

      provider: {

        _id: provider._id,

        name: provider.name,

        // EMAIL
        email: provider.email,

        phone: provider.phone,

        role: provider.role,

        professionalDescription:
          provider.professionalDescription,

        experience:
          provider.experience,

        location:
          provider.location,

        availability:
          provider.availability,

        isActive:
          provider.isActive,
      },

      services,
    });


  } catch (error) {

    console.error(
      "Get admin provider profile error:",
      error
    );

    res.status(500).json({
      message: "Failed to fetch provider profile",
    });
  }
};

// ========================================
// BLOCK PROVIDER
// ========================================

const blockProvider = async (req, res) => {
  try {
    const { id } = req.params;

    const provider = await User.findOne({
      _id: id,
      role: "provider",
    });

    if (!provider) {
      return res.status(404).json({
        message: "Provider not found",
      });
    }

    // Already blocked
    if (provider.isActive === false) {
      return res.status(400).json({
        message: "Provider is already blocked",
      });
    }

    // Block provider
    provider.isActive = false;

    await provider.save();

    res.status(200).json({
      message: "Provider blocked successfully",
      provider: {
        _id: provider._id,
        name: provider.name,
        email: provider.email,
        isActive: provider.isActive,
      },
    });

  } catch (error) {
    console.error(
      "Block provider error:",
      error
    );

    res.status(500).json({
      message: "Failed to block provider",
    });
  }
};

// ========================================
// UNBLOCK PROVIDER
// ========================================

const unblockProvider = async (req, res) => {
  try {
    const { id } = req.params;

    const provider = await User.findOne({
      _id: id,
      role: "provider",
    });

    if (!provider) {
      return res.status(404).json({
        message: "Provider not found",
      });
    }

    // Already active
    if (provider.isActive !== false) {
      return res.status(400).json({
        message: "Provider is already active",
      });
    }

    // Unblock provider
    provider.isActive = true;

    await provider.save();

    res.status(200).json({
      message: "Provider unblocked successfully",
      provider: {
        _id: provider._id,
        name: provider.name,
        email: provider.email,
        isActive: provider.isActive,
      },
    });

  } catch (error) {
    console.error(
      "Unblock provider error:",
      error
    );

    res.status(500).json({
      message: "Failed to unblock provider",
    });
  }
};

const getUsers = async (req, res) => {
  try {
    const users = await User.find(
      { role: "user" },
      {
        name: 1,
        email: 1,
        phone: 1,
        location: 1,
        createdAt: 1,
        isActive: 1,
      }
    ).sort({ createdAt: -1 });

    res.status(200).json({
      users,
    });
  } catch (error) {
    console.error("Get users error:", error);

    res.status(500).json({
      message: "Failed to fetch users",
    });
  }
};

const getUserDetails = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findOne(
      {
        _id: id,
        role: "user",
      },
      {
        password: 0,
      }
    );

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.status(200).json({
      user,
    });
  } catch (error) {
    console.error("Get user details error:", error);

    res.status(500).json({
      message: "Failed to fetch user details",
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
  getAdminProviderProfile,
  blockProvider,
  unblockProvider,
  getUsers,
  getUserDetails,
};