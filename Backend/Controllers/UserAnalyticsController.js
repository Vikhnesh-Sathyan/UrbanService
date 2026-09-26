const mongoose = require("mongoose");

const Booking = require("../Models/Booking");


// =====================================================
// GET MY USER OVERVIEW
// Returns analytics for the logged-in customer.
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


module.exports = {
  getMyUserOverview,
};