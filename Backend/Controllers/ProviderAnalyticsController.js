// =====================================================
// PROVIDER ANALYTICS CONTROLLER
// Provides analytics for the logged-in provider.
// =====================================================

const mongoose = require("mongoose");

const User = require("../Models/User");
const Booking = require("../Models/Booking");
const Service = require("../Models/Service");

// =====================================================
// GET MY PROVIDER OVERVIEW
// =====================================================

const getMyProviderOverview = async (req, res) => {
  try {
    // Logged-in provider ID comes from JWT middleware.
    const providerId = req.user.id;

    // -------------------------------------------------
    // PROVIDER SERVICES
    // -------------------------------------------------

    const totalServices = await Service.countDocuments({
      provider: providerId,
    });

    // -------------------------------------------------
    // PROVIDER BOOKINGS
    // -------------------------------------------------

    const totalBookings = await Booking.countDocuments({
      provider: providerId,
    });

    // -------------------------------------------------
    // COMPLETED BOOKINGS
    // -------------------------------------------------

    const completedBookings = await Booking.countDocuments({
      provider: providerId,
      status: "completed",
    });

    // -------------------------------------------------
    // CALCULATE COMPLETION RATE
    // -------------------------------------------------

    const completionRate =
      totalBookings > 0
        ? Math.round(
            (completedBookings / totalBookings) * 100
          )
        : 0;

    // -------------------------------------------------
    // PROVIDER DETAILS
    // -------------------------------------------------

    const provider = await User.findById(providerId).select(
      "name email isActive"
    );

    // -------------------------------------------------
    // RESPONSE
    // -------------------------------------------------

    res.status(200).json({
      success: true,

      data: {
        provider: {
          name: provider?.name || "",
          email: provider?.email || "",
          isActive: provider?.isActive ?? false,
        },

        totalServices,
        totalBookings,
        completedBookings,
        completionRate,
      },
    });
  } catch (error) {
    console.error(
      "Provider overview analytics error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to load provider analytics",
    });
  }
};

// =====================================================
// GET MY BOOKING PERFORMANCE
// Returns booking status statistics for the logged-in
// provider.
// =====================================================

const getMyBookingPerformance = async (req, res) => {
  try {
    // Logged-in provider ID from JWT
    const providerId = req.user.id;

    // -------------------------------------------------
    // GROUP PROVIDER BOOKINGS BY STATUS
    // -------------------------------------------------

    const bookingPerformance = await Booking.aggregate([
      {
        $match: {
          provider: new mongoose.Types.ObjectId(providerId),
        },
      },

      {
        $group: {
          _id: "$status",

          count: {
            $sum: 1,
          },
        },
      },

      {
        $sort: {
          count: -1,
        },
      },
    ]);

    // -------------------------------------------------
    // RESPONSE
    // -------------------------------------------------

    res.status(200).json({
      success: true,
      data: bookingPerformance,
    });
  } catch (error) {
    console.error(
      "Provider booking performance error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to load booking performance",
    });
  }
};


// =====================================================
// GET MY BOOKING ACTIVITY
// Groups provider bookings by booking date.
// Used for the Booking Activity chart.
// =====================================================

const getMyBookingActivity = async (req, res) => {
  try {
    const providerId = req.user.id;

    const bookingActivity = await Booking.aggregate([
      {
        $match: {
          provider: new mongoose.Types.ObjectId(providerId),
        },
      },

      {
        $group: {
          _id: "$date",
          count: { $sum: 1 },
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
    console.error("Provider booking activity error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to load booking activity",
    });
  }
};

// =====================================================
// GET MY SERVICE PERFORMANCE
// Shows booking performance for each service owned by
// the logged-in provider.
// =====================================================

const getMyServicePerformance = async (req, res) => {
  try {
    const providerId = req.user.id;

    const servicePerformance = await Booking.aggregate([
      {
        $match: {
          provider: new mongoose.Types.ObjectId(providerId),
        },
      },

      {
        $group: {
          _id: "$service",
          totalBookings: { $sum: 1 },

          completedBookings: {
            $sum: {
              $cond: [
                { $eq: ["$status", "completed"] },
                1,
                0,
              ],
            },
          },
        },
      },

      {
        $lookup: {
          from: "services",
          localField: "_id",
          foreignField: "_id",
          as: "service",
        },
      },

      {
        $unwind: "$service",
      },

      {
        $project: {
          _id: 1,
          serviceName: "$service.name",
          totalBookings: 1,
          completedBookings: 1,

          completionRate: {
            $cond: [
              { $gt: ["$totalBookings", 0] },
              {
                $round: [
                  {
                    $multiply: [
                      {
                        $divide: [
                          "$completedBookings",
                          "$totalBookings",
                        ],
                      },
                      100,
                    ],
                  },
                  0,
                ],
              },
              0,
            ],
          },
        },
      },

      {
        $sort: {
          totalBookings: -1,
        },
      },
    ]);

    res.status(200).json({
      success: true,
      data: servicePerformance,
    });
  } catch (error) {
    console.error("Provider service performance error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to load service performance",
    });
  }
};

// =====================================================
// GET MY EMERGENCY ANALYTICS
// Shows emergency booking performance for the provider.
// =====================================================

const getMyEmergencyAnalytics = async (req, res) => {
  try {
    const providerId = req.user.id;

    const emergencyBookings = await Booking.find({
      provider: providerId,
      bookingType: "emergency",
    }).select("status date");

    const totalEmergencyBookings = emergencyBookings.length;

    const completedEmergencyBookings = emergencyBookings.filter(
      (booking) => booking.status === "completed"
    ).length;

    const pendingEmergencyBookings = emergencyBookings.filter(
      (booking) => booking.status === "pending"
    ).length;

    const acceptedEmergencyBookings = emergencyBookings.filter(
      (booking) => booking.status === "accepted"
    ).length;

    const inProgressEmergencyBookings = emergencyBookings.filter(
      (booking) => booking.status === "in_progress"
    ).length;

    const completionRate =
      totalEmergencyBookings > 0
        ? Math.round(
            (completedEmergencyBookings /
              totalEmergencyBookings) *
              100
          )
        : 0;

    res.status(200).json({
      success: true,
      data: {
        totalEmergencyBookings,
        completedEmergencyBookings,
        pendingEmergencyBookings,
        acceptedEmergencyBookings,
        inProgressEmergencyBookings,
        completionRate,
      },
    });
  } catch (error) {
    console.error("Provider emergency analytics error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to load emergency analytics",
    });
  }
};

module.exports = {
  getMyProviderOverview,
  getMyBookingPerformance,
  getMyBookingActivity,
  getMyServicePerformance,
  getMyEmergencyAnalytics,
};

