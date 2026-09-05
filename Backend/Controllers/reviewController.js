const mongoose = require("mongoose");

const Review = require("../Models/Review");
const Booking = require("../Models/Booking");

// CREATE REVIEW
const createReview = async (req, res) => {
  try {
    const { bookingId, rating, comment } = req.body;

    // Required fields
    if (!bookingId || rating === undefined || !comment) {
      return res.status(400).json({
        message: "Booking, rating and comment are required",
      });
    }

    // Validate booking ID
    if (!mongoose.isValidObjectId(bookingId)) {
      return res.status(400).json({
        message: "Invalid booking ID",
      });
    }

    // Validate rating
    const numericRating = Number(rating);

    if (
      !Number.isFinite(numericRating) ||
      numericRating < 1 ||
      numericRating > 5
    ) {
      return res.status(400).json({
        message: "Rating must be between 1 and 5",
      });
    }

    // Validate comment
    const cleanComment = comment.trim();

    if (!cleanComment) {
      return res.status(400).json({
        message: "Comment cannot be empty",
      });
    }

    if (cleanComment.length > 500) {
      return res.status(400).json({
        message: "Comment cannot exceed 500 characters",
      });
    }

    // Find user's booking
    const booking = await Booking.findOne({
      _id: bookingId,
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
        message: "You can review only completed bookings",
      });
    }

    // Check duplicate review
    const existingReview = await Review.findOne({
      booking: booking._id,
    });

    if (existingReview) {
      return res.status(409).json({
        message: "You have already reviewed this booking",
      });
    }

    // Create review
    const review = new Review({
      booking: booking._id,
      user: req.user.id,
      provider: booking.provider,
      service: booking.service,
      rating: numericRating,
      comment: cleanComment,
    });

    await review.save();

    res.status(201).json({
      message: "Review submitted successfully",
      review,
    });
  } catch (error) {
    // Handles unique booking constraint safely
    if (error.code === 11000) {
      return res.status(409).json({
        message: "You have already reviewed this booking",
      });
    }

    console.error("Create review error:", error);

    res.status(500).json({
      message: "Failed to submit review",
    });
  }
};


// GET PROVIDER REVIEWS
const getProviderReviews = async (req, res) => {
  try {
    const { providerId } = req.params;

    // Validate provider ID
    if (!mongoose.isValidObjectId(providerId)) {
      return res.status(400).json({
        message: "Invalid provider ID",
      });
    }

    const reviews = await Review.find({
      provider: providerId,
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


// GET PROVIDER RATING SUMMARY
const getProviderRating = async (req, res) => {
  try {
    const { providerId } = req.params;

    // Validate provider ID
    if (!mongoose.isValidObjectId(providerId)) {
      return res.status(400).json({
        message: "Invalid provider ID",
      });
    }

    const result = await Review.aggregate([
      {
        $match: {
          provider: new mongoose.Types.ObjectId(providerId),
        },
      },
      {
        $group: {
          _id: "$provider",
          averageRating: {
            $avg: "$rating",
          },
          totalReviews: {
            $sum: 1,
          },
        },
      },
    ]);

    // No reviews
    if (result.length === 0) {
      return res.status(200).json({
        averageRating: 0,
        totalReviews: 0,
      });
    }

    res.status(200).json({
      averageRating: Number(result[0].averageRating.toFixed(1)),
      totalReviews: result[0].totalReviews,
    });
  } catch (error) {
    console.error("Get provider rating error:", error);

    res.status(500).json({
      message: "Failed to fetch provider rating",
    });
  }
};


module.exports = {
  createReview,
  getProviderReviews,
  getProviderRating,
};