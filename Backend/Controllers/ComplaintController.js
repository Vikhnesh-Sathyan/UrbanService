const Complaint = require("../Models/Complaint");
const Booking = require("../Models/Booking");
const User = require("../Models/User");

// =====================================================
// CUSTOMER
// Create a complaint for a completed booking
// =====================================================

const createComplaint = async (req, res) => {
  try {
    const {
      booking,
      reason,
      description,
    } = req.body;

    if (!booking || !reason || !description?.trim()) {
      return res.status(400).json({
        message: "Booking, reason and description are required",
      });
    }

    const selectedBooking = await Booking.findById(booking);

    if (!selectedBooking) {
      return res.status(404).json({
        message: "Booking not found",
      });
    }

    if (
      selectedBooking.user.toString() !==
      req.user.id.toString()
    ) {
      return res.status(403).json({
        message: "You can only report your own bookings",
      });
    }

    if (selectedBooking.status !== "completed") {
      return res.status(400).json({
        message:
          "You can report an issue only for completed bookings",
      });
    }

    const existingComplaint = await Complaint.findOne({
      booking: selectedBooking._id,
      customer: req.user.id,
    });

    if (existingComplaint) {
      return res.status(400).json({
        message:
          "A complaint has already been submitted for this booking",
      });
    }

    const complaint = new Complaint({
      customer: req.user.id,
      provider: selectedBooking.provider,
      booking: selectedBooking._id,
      service: selectedBooking.service,
      reason,
      description: description.trim(),
    });

    await complaint.save();

    res.status(201).json({
      message: "Complaint submitted successfully",
      complaint,
    });
  } catch (error) {
    console.error("Create complaint error:", error);

    res.status(500).json({
      message: "Failed to submit complaint",
    });
  }
};



// CUSTOMER
const getMyComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find({
      customer: req.user.id,
    })
      .populate("provider", "name email phone isActive")
      .populate("booking", "date time status bookingType")
      .populate("service", "name title price")
      .sort({ createdAt: -1 });

    res.status(200).json({
      complaints,
    });
  } catch (error) {
    console.error("Get my complaints error:", error);

    res.status(500).json({
      message: "Failed to fetch your complaints",
    });
  }
};

// =====================================================
// ADMIN
// Get all complaints
// =====================================================

const getAllComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find()
      .populate("customer", "name email phone")
      .populate("provider", "name email phone isActive")
      .populate("booking", "date time status bookingType")
      .populate("service", "title price")
      .sort({ createdAt: -1 });

    res.status(200).json({
      complaints,
    });
  } catch (error) {
    console.error("Get all complaints error:", error);

    res.status(500).json({
      message: "Failed to fetch complaints",
    });
  }
};

// =====================================================
// ADMIN
// Get single complaint
// =====================================================

const getComplaintById = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id)
      .populate("customer", "name email phone")
      .populate("provider", "name email phone isActive")
      .populate("booking")
      .populate("service");

    if (!complaint) {
      return res.status(404).json({
        message: "Complaint not found",
      });
    }

    res.status(200).json({
      complaint,
    });
  } catch (error) {
    console.error("Get complaint error:", error);

    res.status(500).json({
      message: "Failed to fetch complaint",
    });
  }
};

// =====================================================
// ADMIN
// Update complaint
// =====================================================

const updateComplaint = async (req, res) => {
  try {
    const {
      status,
      adminAction,
      adminResponse,
    } = req.body;

    const complaint = await Complaint.findById(
      req.params.id
    );

    if (!complaint) {
      return res.status(404).json({
        message: "Complaint not found",
      });
    }

    // Update status if provided
    if (status) {
      const allowedStatuses = [
        "open",
        "under_review",
        "resolved",
        "rejected",
      ];

      if (!allowedStatuses.includes(status)) {
        return res.status(400).json({
          message: "Invalid complaint status",
        });
      }

      complaint.status = status;
    }

    // Update admin action if provided
    if (adminAction) {
      const allowedActions = [
        "none",
        "warning",
        "provider_blocked",
      ];

      if (!allowedActions.includes(adminAction)) {
        return res.status(400).json({
          message: "Invalid admin action",
        });
      }

      complaint.adminAction = adminAction;
    }

    // Update admin response
    if (adminResponse !== undefined) {
      complaint.adminResponse = adminResponse.trim();
    }

    // Add review timestamp when admin handles complaint
    if (
      status === "under_review" ||
      status === "resolved" ||
      status === "rejected" ||
      adminAction === "warning" ||
      adminAction === "provider_blocked"
    ) {
      complaint.reviewedAt = new Date();
    }

    // If admin chooses provider_blocked,
    // deactivate the provider.
    if (adminAction === "provider_blocked") {
      const provider = await User.findById(
        complaint.provider
      );

      if (!provider) {
        return res.status(404).json({
          message: "Provider not found",
        });
      }

      if (provider.role !== "provider") {
        return res.status(400).json({
          message: "Complaint provider is invalid",
        });
      }

      provider.isActive = false;

      await provider.save();
    }

    await complaint.save();

    res.status(200).json({
      message: "Complaint updated successfully",
      complaint,
    });
  } catch (error) {
    console.error("Update complaint error:", error);

    res.status(500).json({
      message: "Failed to update complaint",
    });
  }
};

module.exports = {
  createComplaint,
  getAllComplaints,
  getComplaintById,
  updateComplaint,
  getMyComplaints,
};