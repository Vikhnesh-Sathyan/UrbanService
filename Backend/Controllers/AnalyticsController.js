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

// =====================================================
// GET BOOKING ACTIVITY
// Groups bookings by date for the admin analytics chart.
// =====================================================

const getBookingActivity = async (req, res) => {
  try {
    const bookingActivity = await Booking.aggregate([
      {
        $group: {
          _id: "$date",
          bookings: {
            $sum: 1,
          },
        },
      },

      {
        $sort: {
          _id: 1,
        },
      },
    ]);

    res.status(200).json({
      success: true,
      data: bookingActivity,
    });
  } catch (error) {
    console.error(
      "Booking activity analytics error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to load booking activity",
    });
  }
};

// =====================================================
// GET BOOKING BREAKDOWN
// Returns booking type and booking status statistics.
// =====================================================

const getBookingBreakdown = async (req, res) => {
  try {
    const [bookingTypes, bookingStatuses] =
      await Promise.all([
        Booking.aggregate([
          {
            $group: {
              _id: "$bookingType",
              count: {
                $sum: 1,
              },
            },
          },
        ]),

        Booking.aggregate([
          {
            $group: {
              _id: "$status",
              count: {
                $sum: 1,
              },
            },
          },
        ]),
      ]);

    res.status(200).json({
      success: true,
      data: {
        bookingTypes,
        bookingStatuses,
      },
    });
  } catch (error) {
    console.error(
      "Booking breakdown analytics error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to load booking breakdown",
    });
  }
};

module.exports = {
  getAdminOverview,
  getBookingActivity,
  getBookingBreakdown,

};