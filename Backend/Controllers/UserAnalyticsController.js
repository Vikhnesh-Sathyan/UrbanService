const mongoose = require("mongoose");
const Booking = require("../Models/Booking");


// =====================================================
// USER OVERVIEW ANALYTICS
// =====================================================

const getMyUserOverview = async (req, res) => {
  try {
    const userId = req.user.id;
    const userObjectId = new mongoose.Types.ObjectId(userId);

    const totalBookings = await Booking.countDocuments({
      user: userObjectId,
    });

    const completedBookings = await Booking.countDocuments({
      user: userObjectId,
      status: "completed",
    });

    const cancelledBookings = await Booking.countDocuments({
      user: userObjectId,
      status: "cancelled",
    });

    const emergencyBookings = await Booking.countDocuments({
      user: userObjectId,
      bookingType: "emergency",
    });

    res.status(200).json({
      success: true,
      data: {
        totalBookings,
        completedBookings,
        cancelledBookings,
        emergencyBookings,
      },
    });
  } catch (error) {
    console.error("User overview analytics error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to load user analytics",
    });
  }
};


// =====================================================
// GET MY BOOKING STATUS OVERVIEW
// Shows how many bookings are in each current status
// =====================================================

const getMyUserBookingStatus = async (req, res) => {
  try {
    const userId = req.user.id;

    const bookingStatus = await Booking.aggregate([
      {
        $match: {
          user: new mongoose.Types.ObjectId(userId),
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

    res.status(200).json({
      success: true,
      data: bookingStatus,
    });

  } catch (error) {
    console.error(
      "User booking status analytics error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to load booking status analytics",
    });
  }
};

// =====================================================
// USER SERVICE USAGE ANALYTICS
// =====================================================

const getMyUserServiceUsage = async (req, res) => {
  try {
    const userId = req.user.id;

    const serviceUsage = await Booking.aggregate([
      {
        $match: {
          user: new mongoose.Types.ObjectId(userId),
        },
      },

      {
        $group: {
          _id: "$service",
          bookingCount: {
            $sum: 1,
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
          bookingCount: 1,
        },
      },

      {
        $sort: {
          bookingCount: -1,
        },
      },
    ]);

    res.status(200).json({
      success: true,
      data: serviceUsage,
    });
  } catch (error) {
    console.error("User service usage analytics error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to load service usage analytics",
    });
  }
};

// Get user's booking type usage: normal vs emergency
const getMyUserBookingType = async (req, res) => {
  try {
    const userId = req.user.id;

    const bookingType = await Booking.aggregate([
      {
        $match: {
          user: new mongoose.Types.ObjectId(userId),
        },
      },
      {
        $group: {
          _id: "$bookingType",
          count: { $sum: 1 },
        },
      },
      {
        $sort: {
          count: -1,
        },
      },
    ]);

    res.status(200).json({
      success: true,
      data: bookingType,
    });
  } catch (error) {
    console.error("User booking type analytics error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to load booking type analytics",
    });
  }
};

module.exports = {
  getMyUserOverview,
  getMyUserBookingStatus,
  getMyUserServiceUsage,
  getMyUserBookingType,
};