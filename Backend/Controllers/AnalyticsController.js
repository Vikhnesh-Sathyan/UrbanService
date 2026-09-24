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

// =====================================================
// GET SERVICE ANALYTICS
// Returns the number of bookings for each service.
// =====================================================

const getServiceAnalytics = async (req, res) => {
  try {
    const serviceAnalytics = await Booking.aggregate([
      // Group bookings by service
      {
        $group: {
          _id: "$service",
          bookingCount: {
            $sum: 1,
          },
        },
      },

      // Show service information
      {
        $lookup: {
          from: "services",
          localField: "_id",
          foreignField: "_id",
          as: "service",
        },
      },

      // Convert service array into object
      {
        $unwind: {
          path: "$service",
          preserveNullAndEmptyArrays: true,
        },
      },

      // Return clean analytics data
      {
        $project: {
          _id: 0,
          serviceId: "$_id",
          serviceName: {
            $ifNull: [
              "$service.name",
              "$service.title",
            ],
          },
          bookingCount: 1,
        },
      },

      // Most booked services first
      {
        $sort: {
          bookingCount: -1,
        },
      },
    ]);

    res.status(200).json({
      success: true,
      data: serviceAnalytics,
    });
  } catch (error) {
    console.error(
      "Service analytics error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to load service analytics",
    });
  }
};

// =====================================================
// GET PROVIDER ANALYTICS
// Returns provider summary and completed booking
// performance for the admin dashboard.
// =====================================================

const getProviderAnalytics = async (req, res) => {
  try {
    // -------------------------------------------------
    // PROVIDER SUMMARY
    // -------------------------------------------------

    const totalProviders = await User.countDocuments({
      role: "provider",
    });

    const activeProviders = await User.countDocuments({
      role: "provider",
      isActive: true,
    });

    const blockedProviders = await User.countDocuments({
      role: "provider",
      isActive: false,
    });


    // -------------------------------------------------
    // PROVIDER PERFORMANCE
    // -------------------------------------------------

    const providerPerformance = await Booking.aggregate([
      // Only completed bookings count toward
      // provider performance.
      {
        $match: {
          status: "completed",
        },
      },

      // Group completed bookings by provider.
      {
        $group: {
          _id: "$provider",
          completedBookings: {
            $sum: 1,
          },
        },
      },

      // Get provider information.
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "provider",
        },
      },

      // Convert provider array into object.
      {
        $unwind: {
          path: "$provider",
          preserveNullAndEmptyArrays: false,
        },
      },

      // Return only required analytics data.
      {
        $project: {
          _id: 0,
          providerId: "$_id",
          providerName: "$provider.name",
          completedBookings: 1,
        },
      },

      // Highest completed bookings first.
      {
        $sort: {
          completedBookings: -1,
        },
      },
    ]);


    // -------------------------------------------------
    // RESPONSE
    // -------------------------------------------------

    res.status(200).json({
      success: true,

      data: {
        summary: {
          totalProviders,
          activeProviders,
          blockedProviders,
        },

        performance: providerPerformance,
      },
    });

  } catch (error) {

    console.error(
      "Provider analytics error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to load provider analytics",
    });
  }
};

module.exports = {
  getAdminOverview,
  getBookingActivity,
  getBookingBreakdown,
  getServiceAnalytics,
  getProviderAnalytics,


};