const Booking = require("../Models/Booking");
const Service = require("../Models/Service");

// Create Booking
const createBooking = async (req, res) => {
  try {
    const { service, phone, date, time, notes } = req.body;

    if (!service || !phone || !date || !time) {
      return res.status(400).json({
        message: "Service, phone, date and time are required",
      });
    }

    // Find selected service
    const selectedService = await Service.findById(service);

    if (!selectedService) {
      return res.status(404).json({
        message: "Service not found",
      });
    }

    // Create booking
    const booking = new Booking({
      user: req.user.id,
      service: selectedService._id,
      provider: selectedService.provider,
      phone,
      date,
      time,
      notes,
    });

    await booking.save();

    res.status(201).json({
      message: "Booking created successfully",
      booking,
    });
  } catch (error) {
    console.error("Create booking error:", error);

    res.status(500).json({
      message: "Failed to create booking",
    });
  }
};


// Get My Bookings
const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({
      user: req.user.id,//Show me the bookings made by the currently logged-in customer
    })
      .populate("service")//Use the service ID stored in the booking to get the related service details.
      .sort({ createdAt: -1 });

    res.status(200).json(bookings);
  } catch (error) {
    console.error("Get bookings error:", error);

    res.status(500).json({
      message: "Failed to fetch bookings",
    });
  }
};


// Cancel Booking
const cancelBooking = async (req, res) => {
 try {
  // Find the booking using the booking ID from the URL
  // and make sure it belongs to the currently logged-in user
  const booking = await Booking.findOne({
    _id: req.params.id,     // Which booking?
    user: req.user.id,      // Who owns the booking?
  });

    if (!booking) {
      return res.status(404).json({
        message: "Booking not found",
      });
    }

    // Prevent cancelling completed bookings
    if (booking.status === "completed") {
      return res.status(400).json({
        message: "Completed booking cannot be cancelled",
      });
    }

    booking.status = "cancelled";

    await booking.save();

    res.status(200).json({
      message: "Booking cancelled successfully",
      booking,
    });
  } catch (error) {
    console.error("Cancel booking error:", error);

    res.status(500).json({
      message: "Failed to cancel booking",
    });
  }
};

const getProviderBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({
      provider: req.user.id,
    })
      .populate("user", "name email")
      .populate("service")
      .sort({ createdAt: -1 });

    res.status(200).json(bookings);
  } catch (error) {
    console.error("Provider bookings error:", error);

    res.status(500).json({
      message: "Failed to fetch provider bookings",
    });
  }
};

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
        message: "Only pending bookings can be accepted",
      });
    }

    booking.status = "accepted";

    await booking.save();

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
        message: "Only pending bookings can be rejected",
      });
    }

    booking.status = "rejected";

    await booking.save();

    res.status(200).json({
      message: "Booking rejected",
      booking,
    });
  } catch (error) {
    console.error("Reject booking error:", error);

    res.status(500).json({
      message: "Failed to reject booking",
    });
  }
};
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

    booking.status = status;

    await booking.save();

    res.status(200).json({
      message: "Booking status updated successfully",
      booking,
    });
  } catch (error) {
    console.error("Update booking status error:", error);

    res.status(500).json({
      message: "Failed to update booking status",
    });
  }
};

module.exports = {
  createBooking,
  getMyBookings,
  cancelBooking,
  getProviderBookings,
  acceptBooking,
  rejectBooking,
  updateBookingStatus,
};