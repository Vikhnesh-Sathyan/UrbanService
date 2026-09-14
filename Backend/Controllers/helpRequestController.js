const HelpRequest = require("../Models/HelpRequest");
const User = require("../Models/User");

// ========================================
// CREATE HELP REQUEST
// ========================================

const createHelpRequest = async (req, res) => {
  try {
    const { email, message } = req.body;

    // Validate fields
    if (!email || !message) {
      return res.status(400).json({
        message: "Email and message are required",
      });
    }

    // Find provider using email
    const provider = await User.findOne({
      email: email.toLowerCase(),
      role: "provider",
    });

    if (!provider) {
      return res.status(404).json({
        message: "Provider not found",
      });
    }

    // Create help request
    const helpRequest = await HelpRequest.create({
      provider: provider._id,
      email: provider.email,
      message,
    });

    res.status(201).json({
      message: "Help request submitted successfully",
      helpRequest,
    });

  } catch (error) {
    console.error(
      "Create help request error:",
      error
    );

    res.status(500).json({
      message: "Failed to submit help request",
    });
  }
};


// ========================================
// GET ALL HELP REQUESTS - ADMIN
// ========================================

const getHelpRequests = async (req, res) => {
  try {

    const helpRequests = await HelpRequest.find()
      .populate(
        "provider",
        "name email phone isActive"
      )
      .sort({ createdAt: -1 });

    res.status(200).json({
      helpRequests,
    });

  } catch (error) {
    console.error(
      "Get help requests error:",
      error
    );

    res.status(500).json({
      message: "Failed to fetch help requests",
    });
  }
};


// ========================================
// ADMIN RESPOND TO HELP REQUEST
// ========================================

const respondToHelpRequest = async (req, res) => {
  try {

    const { id } = req.params;
    const { adminResponse, status } = req.body;

    if (!adminResponse) {
      return res.status(400).json({
        message: "Admin response is required",
      });
    }

    const helpRequest =
      await HelpRequest.findByIdAndUpdate(
        id,
        {
          adminResponse,
          status: status || "in_progress",
        },
        {
          new: true,
        }
      ).populate(
        "provider",
        "name email phone isActive"
      );

    if (!helpRequest) {
      return res.status(404).json({
        message: "Help request not found",
      });
    }

    res.status(200).json({
      message: "Response sent successfully",
      helpRequest,
    });

  } catch (error) {
    console.error(
      "Respond to help request error:",
      error
    );

    res.status(500).json({
      message: "Failed to respond to help request",
    });
  }
};


// ========================================
// EXPORTS
// ========================================

module.exports = {
  createHelpRequest,
  getHelpRequests,
  respondToHelpRequest,
};