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

    // Count services belonging to this provider.

    const totalServices = await Service.countDocuments({
      provider: providerId,
    });

    // -------------------------------------------------
    // PROVIDER BOOKINGS
    // -------------------------------------------------

    // Counts this provider's bookings.

    const totalBookings = await Booking.countDocuments({
      provider: providerId,
    });

    // -------------------------------------------------
    // COMPLETED BOOKINGS
    // -------------------------------------------------

    const completedBookings = await Booking.countDocuments({
      provider: providerId,

      // Counts only bookings where:

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

// =====================================================
// GET MY BOOKING PERFORMANCE
// Returns the logged-in provider's bookings grouped by
// booking status, along with the count for each status.
// =====================================================

const getMyBookingPerformance = async (req, res) => {
  try {
    // Get the logged-in provider's ID from the verified JWT.
    const providerId = req.user.id;

    // Filter only bookings that belong to this provider.
    // ObjectId is used because MongoDB stores the provider
    // reference as an ObjectId.
    const bookingPerformance = await Booking.aggregate([
      {
        $match: {
          provider: new mongoose.Types.ObjectId(providerId),
        },
      },

      // Group the provider's bookings by their status
      // such as pending, accepted, completed, or rejected.
      {
        $group: {
          _id: "$status",

          // Count how many bookings are in each status group.
          count: {
            $sum: 1,
          },
        },
      },

      // Sort the status groups from highest booking count
      // to lowest booking count.
      {
        $sort: {
          count: -1,
        },
      },
    ]);

    // Send the booking performance data back to the frontend.
    res.status(200).json({
      success: true,
      data: bookingPerformance,
    });
  } catch (error) {
    // Log the error for backend debugging.
    console.error(
      "Provider booking performance error:",
      error
    );

    // Send a safe error response to the frontend.
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

// =====================================================
// GET MY EMERGENCY ANALYTICS
// Returns emergency booking statistics for the
// currently logged-in provider.
// =====================================================

const getMyEmergencyAnalytics = async (req, res) => {
  try {
    // Get the logged-in provider's ID from the verified JWT.
    const providerId = req.user.id;

    // Fetch only this provider's emergency bookings.
    // Only status and date are needed for the analytics.
    const emergencyBookings = await Booking.find({
      provider: providerId,
      bookingType: "emergency",
    }).select("status date");

    // Count all emergency bookings returned from the database.
    const totalEmergencyBookings = emergencyBookings.length;

    // Keep only completed bookings and count them.
    const completedEmergencyBookings = emergencyBookings.filter(
      (booking) => booking.status === "completed"
    ).length;

    // Keep only pending bookings and count them.
    const pendingEmergencyBookings = emergencyBookings.filter(
      (booking) => booking.status === "pending"
    ).length;

    // Keep only accepted bookings and count them.
    const acceptedEmergencyBookings = emergencyBookings.filter(
      (booking) => booking.status === "accepted"
    ).length;

    // Keep only in-progress bookings and count them.
    const inProgressEmergencyBookings = emergencyBookings.filter(
      (booking) => booking.status === "in_progress"
    ).length;

    // Calculate the percentage of emergency bookings
    // that have been completed.
    // If there are no bookings, return 0 instead of
    // dividing by zero.
    const completionRate =
      totalEmergencyBookings > 0
        ? Math.round(
            (completedEmergencyBookings /
              totalEmergencyBookings) *
              100
          )
        : 0;

    // Send all emergency analytics to the frontend.
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
    // Log the error for backend debugging.
    console.error("Provider emergency analytics error:", error);

    // Send a safe error response to the frontend.
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

