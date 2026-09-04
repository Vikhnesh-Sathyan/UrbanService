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
      user: req.user.id,
    })
      .populate("service")
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
    const booking = await Booking.findOne({
      _id: req.params.id,
      user: req.user.id,
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


module.exports = {
  createBooking,
  getMyBookings,
  cancelBooking,
};