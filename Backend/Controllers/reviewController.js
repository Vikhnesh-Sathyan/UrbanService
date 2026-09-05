const Review = require("../Models/Review");
const Booking = require("../Models/Booking");

// Create Review
const createReview = async (req, res) => {
  try {
    const { bookingId, rating, comment } = req.body;

    // 1. Validate input
    if (!bookingId || !rating || !comment) {
      return res.status(400).json({
        message: "Booking, rating and comment are required",
      });
    }

    // 2. Validate rating
    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        message: "Rating must be between 1 and 5",
      });
    }

    // 3. Find booking belonging to current user
    const booking = await Booking.findOne({
      _id: bookingId,
      user: req.user.id,
    });

    if (!booking) {
      return res.status(404).json({
        message: "Booking not found",
      });
    }

    // 4. Review only completed bookings
    if (booking.status !== "completed") {
      return res.status(400).json({
        message: "You can review only completed bookings",
      });
    }

    // 5. Check if review already exists
    const existingReview = await Review.findOne({
      booking: booking._id,
    });

    if (existingReview) {
      return res.status(409).json({
        message: "You have already reviewed this booking",
      });
    }

    // 6. Create review
    const review = new Review({
      booking: booking._id,
      user: req.user.id,
      provider: booking.provider,
      service: booking.service,
      rating,
      comment,
    });

    await review.save();

    res.status(201).json({
      message: "Review submitted successfully",
      review,
    });

  } catch (error) {
    console.error("Create review error:", error);

    res.status(500).json({
      message: "Failed to submit review",
    });
  }
};


// Get Provider Reviews
const getProviderReviews = async (req, res) => {
  try {
    const reviews = await Review.find({
      provider: req.params.providerId,
    })
      .populate("user", "name")
      .populate("service", "name")
      .sort({ createdAt: -1 });

    res.status(200).json({
      reviews,
    });

  } catch (error) {
    console.error("Get provider reviews error:", error);

    res.status(500).json({
      message: "Failed to fetch reviews",
    });
  }
};


module.exports = {
  createReview,
  getProviderReviews,
};