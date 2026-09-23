// =====================================================
// ADMIN ANALYTICS CONTROLLER
// Provides platform-level analytics for the admin dashboard.
// =====================================================

const User = require("../Models/User");
const Booking = require("../Models/Booking");
const Complaint = require("../Models/Complaint");

// =====================================================
// GET ADMIN OVERVIEW
// =====================================================

const getAdminOverview = async (req, res) => {
  try {
    const [
      totalUsers,
      totalProviders,
      totalBookings,
      completedBookings,
      emergencyBookings,
      activeProviders,
      blockedProviders,
      totalComplaints,
    ] = await Promise.all([
      // Total customers
      User.countDocuments({
        role: "user",
      }),

      // Total providers
      User.countDocuments({
        role: "provider",
      }),

      // All bookings
      Booking.countDocuments(),

      // Completed bookings
      Booking.countDocuments({
        status: "completed",
      }),

      // Emergency bookings
      Booking.countDocuments({
        bookingType: "emergency",
      }),

      // Active providers
      User.countDocuments({
        role: "provider",
        isActive: true,
      }),

      // Blocked providers
      User.countDocuments({
        role: "provider",
        isActive: false,
      }),

      // All complaints
      Complaint.countDocuments(),
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalUsers,
        totalProviders,
        totalBookings,
        completedBookings,
        emergencyBookings,
        activeProviders,
        blockedProviders,
        totalComplaints,
      },
    });
  } catch (error) {
    console.error(
      "Admin analytics overview error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to load admin analytics",
    });
  }
};

module.exports = {
  getAdminOverview,
};