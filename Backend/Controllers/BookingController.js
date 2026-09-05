const Booking = require("../Models/Booking");
const Service = require("../Models/Service");
const User = require("../Models/User");

// =====================================================
// CREATE BOOKING
// =====================================================

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

    // IMPORTANT:
    // Check service exists BEFORE accessing selectedService.provider
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

    // 6. Find provider
    const provider = await User.findById(selectedService.provider);

    if (!provider) {
      return res.status(404).json({
        message: "Provider not found",
      });
    }

    // 7. Prevent provider from booking their own service
    if (selectedService.provider.toString() === req.user.id) {
      return res.status(400).json({
        message: "You cannot book your own service",
      });
    }

    // =================================================
    // PROVIDER AVAILABILITY
    // =================================================

    // 8. Get booking day
    const dayNames = [
      "sunday",
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
    ];

    const bookingDay = dayNames[selectedDate.getDay()];

    // 9. Check provider working days
    if (
      !provider.availability ||
      !provider.availability.days ||
      !provider.availability.days.includes(bookingDay)
    ) {
      return res.status(400).json({
        message: `Provider is not available on ${bookingDay}`,
      });
    }

    // 10. Check working hours
    const startTime = provider.availability.startTime;
    const endTime = provider.availability.endTime;

    if (!startTime || !endTime) {
      return res.status(400).json({
        message: "Provider availability is not configured",
      });
    }

    // Time must be in HH:mm format
    if (time < startTime || time >= endTime) {
      return res.status(400).json({
        message: `Provider is available only between ${startTime} and ${endTime}`,
      });
    }

    // =================================================
    // DUPLICATE TIME SLOT
    // =================================================

    // 11. Check whether provider is already booked
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

    // =================================================
    // CREATE BOOKING
    // =================================================

    // 12. Create booking
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


// =====================================================
// GET MY BOOKINGS
// =====================================================

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
      .sort({ createdAt: -1 });

    res.status(200).json({
      bookings,
    });

  } catch (error) {
    console.error("Get bookings error:", error);

    res.status(500).json({
      message: "Failed to fetch bookings",
    });
  }
};


// =====================================================
// CANCEL BOOKING
// =====================================================

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

    // Customer can cancel only these statuses
    const cancellableStatuses = [
      "pending",
      "accepted",
    ];

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


// =====================================================
// GET PROVIDER BOOKINGS
// =====================================================

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
      .sort({ createdAt: -1 });

    res.status(200).json({
      bookings,
    });

  } catch (error) {
    console.error("Provider bookings error:", error);

    res.status(500).json({
      message: "Failed to fetch provider bookings",
    });
  }
};


// =====================================================
// ACCEPT BOOKING
// =====================================================

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


// =====================================================
// REJECT BOOKING
// =====================================================

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


// =====================================================
// UPDATE BOOKING STATUS
// =====================================================

const updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const allowedStatuses = [
      "accepted",
      "in_progress",
      "completed",
    ];

    // 1. Validate requested status
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        message: "Invalid booking status",
      });
    }

    // 2. Find provider's booking
    const booking = await Booking.findOne({
      _id: req.params.id,
      provider: req.user.id,
    });

    if (!booking) {
      return res.status(404).json({
        message: "Booking not found",
      });
    }

    // 3. Current status
    const currentStatus = booking.status;

    // 4. Allowed transitions
    const allowedTransitions = {
      pending: ["accepted"],
      accepted: ["in_progress"],
      in_progress: ["completed"],
      rejected: [],
      completed: [],
      cancelled: [],
    };

    // 5. Check transition
    if (!allowedTransitions[currentStatus].includes(status)) {
      return res.status(400).json({
        message: `Cannot change booking status from ${currentStatus} to ${status}`,
      });
    }

    // 6. Update status
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


// =====================================================
// EXPORTS
// =====================================================

module.exports = {
  createBooking,
  getMyBookings,
  cancelBooking,
  getProviderBookings,
  acceptBooking,
  rejectBooking,
  updateBookingStatus,
};