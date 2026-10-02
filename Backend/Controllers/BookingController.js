const Booking = require("../Models/Booking");
const Review = require("../Models/Review");
const Notification = require("../Models/Notification");

//This handles booking operations that are shared between normal and emergency bookings.

// ===============================
// GET MY BOOKINGS
// ===============================
const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({
      user: req.user.id,
    })
      .populate(
        "service",
        "name price category image description"
      )
      .populate(
        "provider",
        "name email"
      )
      .sort({ createdAt: -1 })
      .lean();

    // Get reviews for these bookings
    const bookingIds = bookings.map(
      (booking) => booking._id
    );

    const reviews = await Review.find({
      booking: { $in: bookingIds },
      user: req.user.id,
    }).lean();

    // Attach review data to the corresponding booking
    const bookingsWithReviews = bookings.map(
      (booking) => {
        const review = reviews.find(
          (item) =>
            item.booking.toString() ===
            booking._id.toString()
        );

        return {
          ...booking,
          rating: review?.rating || null,
          review: review?.comment || "",
        };
      }
    );

    res.status(200).json({
      bookings: bookingsWithReviews,
    });
  } catch (error) {
    console.error(
      "Get my bookings error:",
      error
    );

    res.status(500).json({
      message: "Failed to fetch bookings",
    });
  }
};


// ===============================
// GET PROVIDER BOOKINGS
// ===============================
const getProviderBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({
      provider: req.user.id,
    })
      .populate(
        "user",
        "name email"
      )
      .populate(
        "service",
        "name price category image"
      )
      .sort({ createdAt: -1 })
      .lean();

    // Get booking IDs
    const bookingIds = bookings.map(
      (booking) => booking._id
    );

    // Get reviews for these bookings
    const reviews = await Review.find({
      booking: { $in: bookingIds },
      provider: req.user.id,
    }).lean();

    // Attach review data to each booking
    const bookingsWithReviews = bookings.map(
      (booking) => {
        const review = reviews.find(
          (item) =>
            item.booking.toString() ===
            booking._id.toString()
        );

        return {
          ...booking,
          rating: review?.rating || null,
          review: review?.comment || "",
        };
      }
    );

    res.status(200).json({
      bookings: bookingsWithReviews,
    });
  } catch (error) {
    console.error(
      "Get provider bookings error:",
      error
    );

    res.status(500).json({
      message: "Failed to fetch provider bookings",
    });
  }
};

// ===============================
// ACCEPT BOOKING
// ===============================
const acceptBooking = async (req, res) => {
  try {
    const booking = await Booking.findOne({
      _id: req.params.id,
      provider: req.user.id,
    });

    if (!booking) {
      return res.status(404).json({
        message: "Booking not found",
      });
    }

    if (booking.status !== "pending") {
      return res.status(400).json({
        message: `Booking cannot be accepted when status is ${booking.status}`,
      });
    }

    booking.status = "accepted";

    await booking.save();

    // Create notification for the customer
    const notification = await Notification.create({
      recipient: booking.user,
      message: "Your booking has been accepted by the service provider.",
      type: "booking",
    });

    // Send notification instantly through Socket.IO
    const io = req.app.get("io");

    if (io) {
      io.to(`user_${booking.user}`).emit(
        "newNotification",
        notification
      );
    }

    res.status(200).json({
      message: "Booking accepted successfully",
      booking,
    });
  } catch (error) {
    console.error("Accept booking error:", error);

    res.status(500).json({
      message: "Failed to accept booking",
    });
  }
};

// ===============================
// REJECT BOOKING
// ===============================
const rejectBooking = async (req, res) => {
  try {
    const booking = await Booking.findOne({
      _id: req.params.id,
      provider: req.user.id,
    });

    if (!booking) {
      return res.status(404).json({
        message: "Booking not found",
      });
    }

    if (booking.status !== "pending") {
      return res.status(400).json({
        message: `Booking cannot be rejected when status is ${booking.status}`,
      });
    }

    booking.status = "rejected";

    await booking.save();

    res.status(200).json({
      message: "Booking rejected successfully",
      booking,
    });
  } catch (error) {
    console.error("Reject booking error:", error);

    res.status(500).json({
      message: "Failed to reject booking",
    });
  }
};

// ===============================
// UPDATE BOOKING STATUS
// ===============================
const updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const allowedStatuses = [
      "accepted",
      "in_progress",
      "completed",
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        message: "Invalid booking status",
      });
    }

    const booking = await Booking.findOne({
      _id: req.params.id,
      provider: req.user.id,
    });

    if (!booking) {
      return res.status(404).json({
        message: "Booking not found",
      });
    }

    // Allowed status transitions
    const allowedTransitions = {
      pending: ["accepted"],
      accepted: ["in_progress"],
      in_progress: ["completed"],
      rejected: [],
      completed: [],
      cancelled: [],
    };

    const currentStatus = booking.status;

    if (
      !allowedTransitions[currentStatus] ||
      !allowedTransitions[currentStatus].includes(status)
    ) {
      return res.status(400).json({
        message: `Booking cannot move from ${currentStatus} to ${status}`,
      });
    }

    booking.status = status;

    await booking.save();
    
    res.status(200).json({
      message: "Booking status updated successfully",
      booking,
    });
  } catch (error) {
    console.error(
      "Update booking status error:",
      error
    );

    res.status(500).json({
      message: "Failed to update booking status",
    });
  }
};



// ===============================
// ADD BOOKING REVIEW
// ===============================
const addBookingReview = async (req, res) => {
  try {
    const { rating, review } = req.body;

// Validate rating
if (!rating || rating < 1 || rating > 5) {
  return res.status(400).json({
    message: "Rating must be between 1 and 5",
  });
}

// Validate review comment
if (!review || !review.trim()) {
  return res.status(400).json({
    message: "Please write a review",
  });
}

    // Find customer's own booking
    const booking = await Booking.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!booking) {
      return res.status(404).json({
        message: "Booking not found",
      });
    }

    // Only completed bookings can be reviewed
    if (booking.status !== "completed") {
      return res.status(400).json({
        message: "Only completed bookings can be reviewed",
      });
    }

    // Check whether this booking already has a review
    const existingReview = await Review.findOne({
      booking: booking._id,
    });

    if (existingReview) {
      return res.status(400).json({
        message: "This booking has already been reviewed",
      });
    }

    // Create review document
    const newReview = new Review({
      booking: booking._id,
      user: req.user.id,
      provider: booking.provider,
      service: booking.service,
      rating: Number(rating),
      comment: review.trim(),
    });

    await newReview.save();

    res.status(201).json({
      message: "Review submitted successfully",
      review: newReview,
    });

  } catch (error) {
    // Handles duplicate booking review
    if (error.code === 11000) {
      return res.status(409).json({
        message: "This booking has already been reviewed",
      });
    }

    console.error("Add review error:", error);

    res.status(500).json({
      message: "Failed to submit review",
    });
  }
};



// ===============================
// GET ALL BOOKINGS - ADMIN
// ===============================
const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate(
        "user",
        "name email"
      )
      .populate(
        "service",
        "name price category image"
      )
      .populate(
        "provider",
        "name email"
      )
      .sort({ createdAt: -1 });

    res.status(200).json({
      bookings,
    });

  } catch (error) {
    console.error(
      "Get all bookings error:",
      error
    );

    res.status(500).json({
      message: "Failed to fetch bookings",
    });
  }
};

const getUserBookings = async (req, res) => {
  try {
    const { userId } = req.params;

    const bookings = await Booking.find({
      user: userId,
    })
      .populate("service", "name price category image")
      .populate("provider", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      bookings,
    });
  } catch (error) {
    console.error("Get user bookings error:", error);

    res.status(500).json({
      message: "Failed to fetch user bookings",
    });
  }
};

// ===============================
// UPDATE PROVIDER LOCATION
// ===============================
const updateProviderLocation = async (req, res) => {
  try {
    const { latitude, longitude } = req.body;

    // Validate location values
    if (
      latitude === undefined ||
      longitude === undefined
    ) {
      return res.status(400).json({
        message: "Latitude and longitude are required",
      });
    }

    // Validate that values are numbers
    if (
      typeof latitude !== "number" ||
      typeof longitude !== "number"
    ) {
      return res.status(400).json({
        message: "Latitude and longitude must be numbers",
      });
    }

    // Validate latitude range
    if (latitude < -90 || latitude > 90) {
      return res.status(400).json({
        message: "Invalid latitude",
      });
    }

    // Validate longitude range
    if (longitude < -180 || longitude > 180) {
      return res.status(400).json({
        message: "Invalid longitude",
      });
    }

    // Find provider's own booking
    const booking = await Booking.findOne({
      _id: req.params.id,
      provider: req.user.id,
    });

    if (!booking) {
      return res.status(404).json({
        message: "Booking not found",
      });
    }

    // Location tracking only during active job
    if (booking.status !== "in_progress") {
      return res.status(400).json({
        message:
          "Location can only be updated when the booking is in progress",
      });
    }

    // Update latest provider location
    booking.tracking.latitude = latitude;
    booking.tracking.longitude = longitude;
    booking.tracking.updatedAt = new Date();

    await booking.save();

    res.status(200).json({
      message: "Provider location updated successfully",
      tracking: booking.tracking,
    });
  } catch (error) {
    console.error(
      "Update provider location error:",
      error
    );

    res.status(500).json({
      message: "Failed to update provider location",
    });
  }
};

// ===============================
// GET PROVIDER LOCATION
// ===============================
const getProviderLocation = async (req, res) => {
  try {
    // Find customer's own booking
    const booking = await Booking.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!booking) {
      return res.status(404).json({
        message: "Booking not found",
      });
    }

    // Tracking is available only while job is active
    if (booking.status !== "in_progress") {
      return res.status(400).json({
        message:
          "Provider location is available only when the booking is in progress",
      });
    }

    // Check whether provider has shared a location yet
    if (
      booking.tracking.latitude === null ||
      booking.tracking.longitude === null
    ) {
      return res.status(404).json({
        message: "Provider location is not available yet",
      });
    }

    res.status(200).json({
      tracking: booking.tracking,
    });
  } catch (error) {
    console.error(
      "Get provider location error:",
      error
    );

    res.status(500).json({
      message: "Failed to fetch provider location",
    });
  }
};



// ===============================
// EXPORTS
// ===============================
module.exports = {
  getMyBookings,
  getProviderBookings,
  acceptBooking,
  rejectBooking,
  updateBookingStatus,
  updateProviderLocation,
  getProviderLocation,
  addBookingReview,
  getAllBookings,
  getUserBookings,
};