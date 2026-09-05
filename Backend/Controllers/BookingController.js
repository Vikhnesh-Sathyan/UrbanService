// Create Booking
const Booking = require("../Models/Booking");
const Service = require("../Models/Service");

// Create Booking
const createBooking = async (req, res) => {
  try {
    const { service, phone, date, time, notes } = req.body;

    // 1. Validate required fields
    if (!service || !phone || !date || !time) {
      return res.status(400).json({
        message: "Service, phone, date and time are required",
      });
    }

    // 2. Validate booking date
    const selectedDate = new Date(date);

    if (isNaN(selectedDate.getTime())) {
      return res.status(400).json({
        message: "Invalid booking date",
      });
    }

    const today = new Date();

    today.setHours(0, 0, 0, 0);
    selectedDate.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
      return res.status(400).json({
        message: "Booking date cannot be in the past",
      });
    }

    // 3. Find selected service
    const selectedService = await Service.findById(service);

    if (!selectedService) {
      return res.status(404).json({
        message: "Service not found",
      });
    }

    // 4. Only approved services can be booked
    if (selectedService.status !== "approved") {
      return res.status(400).json({
        message: "This service is not available for booking",
      });
    }

    // 5. Make sure service has a provider
    if (!selectedService.provider) {
      return res.status(400).json({
        message: "This service does not have a provider",
      });
    }

    // 6. Prevent provider from booking their own service
    if (selectedService.provider.toString() === req.user.id) {
      return res.status(400).json({
        message: "You cannot book your own service",
      });
    }

    // 7. Check whether the time slot is already booked
    const existingBooking = await Booking.findOne({
      provider: selectedService.provider,
      date,
      time,
      status: {
        $in: ["pending", "accepted", "in_progress"],
      },
    });

    if (existingBooking) {
      return res.status(409).json({
        message: "This time slot is already booked",
      });
    }

    // 8. Create booking
    const booking = new Booking({
      user: req.user.id,
      service: selectedService._id,
      provider: selectedService.provider,
      phone,
      date,
      time,
      notes: notes || "",
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
    const booking = await Booking.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!booking) {
      return res.status(404).json({
        message: "Booking not found",
      });
    }

    const cancellableStatuses = ["pending", "accepted"];

    if (!cancellableStatuses.includes(booking.status)) {
      return res.status(400).json({
        message: `Booking cannot be cancelled when status is ${booking.status}`,
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

    // Validate requested status
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        message: "Invalid booking status",
      });
    }

    // Find provider's booking
    const booking = await Booking.findOne({
      _id: req.params.id,
      provider: req.user.id,
    });

    if (!booking) {
      return res.status(404).json({
        message: "Booking not found",
      });
    }

    // Current status
    const currentStatus = booking.status;

    // Allowed status transitions
    const allowedTransitions = {
      pending: ["accepted"],
      accepted: ["in_progress"],
      in_progress: ["completed"],
      rejected: [],
      completed: [],
      cancelled: [],
    };

    // Check whether transition is allowed
    if (!allowedTransitions[currentStatus].includes(status)) {
      return res.status(400).json({
        message: `Cannot change booking status from ${currentStatus} to ${status}`,
      });
    }

    // Update status
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