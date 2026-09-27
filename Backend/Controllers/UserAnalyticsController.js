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
// USER BOOKING ACTIVITY
// =====================================================

const getMyUserBookingActivity = async (req, res) => {
  try {
    const userId = req.user.id;

    const bookingActivity = await Booking.aggregate([
      {
        $match: {
          user: new mongoose.Types.ObjectId(userId),
        },
      },
      {
        $group: {
          _id: "$date",
          count: {
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
    console.error("User booking activity error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to load booking activity",
    });
  }
};


module.exports = {
  getMyUserOverview,
  getMyUserBookingActivity,
};