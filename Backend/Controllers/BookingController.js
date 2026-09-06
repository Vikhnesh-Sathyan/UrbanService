const Booking = require("../Models/Booking");
const Service = require("../Models/Service");
const User = require("../Models/User");

// =====================================================
// CREATE BOOKING
// =====================================================

const createBooking = async (req, res) => {
  try {
    const {
      service,
      phone,
      date,
      time,
      notes,
    } = req.body;

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

    // Remove time from date comparison
    const today = new Date();

    today.setHours(0, 0, 0, 0);
    selectedDate.setHours(0, 0, 0, 0);

    // Prevent past dates
    if (selectedDate < today) {
      return res.status(400).json({
        message: "Booking date cannot be in the past",
      });
    }

    // =================================================
    // FIND SERVICE
    // =================================================

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

    // =================================================
    // FIND PROVIDER
    // =================================================

    // 6. Find provider
    const provider = await User.findOne({
      _id: selectedService.provider,
      role: "provider",
    });

    if (!provider) {
      return res.status(404).json({
        message: "Provider not found",
      });
    }

    // =================================================
    // PREVENT SELF BOOKING
    // =================================================

    // 7. Provider cannot book own service
    if (
      selectedService.provider.toString() ===
      req.user.id.toString()
    ) {
      return res.status(400).json({
        message: "You cannot book your own service",
      });
    }

    // =================================================
    // PROVIDER AVAILABILITY
    // =================================================

    // 8. Check availability configuration
    if (
      !provider.availability ||
      !provider.availability.days ||
      provider.availability.days.length === 0
    ) {
      return res.status(400).json({
        message: "Provider availability is not configured",
      });
    }

    // 9. Get booking day
    const dayNames = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];

    const bookingDay = dayNames[selectedDate.getDay()];

    // 10. Check working day
    if (
      !provider.availability.days.includes(
        bookingDay
      )
    ) {
      return res.status(400).json({
        message: `Provider is not available on ${bookingDay}`,
      });
    }

    // =================================================
    // VALIDATE BOOKING TIME
    // =================================================

    const startTime =
      provider.availability.startTime;

    const endTime =
      provider.availability.endTime;

    if (!startTime || !endTime) {
      return res.status(400).json({
        message: "Provider availability is not configured",
      });
    }

    // Validate HH:mm format
    const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;

    if (!timeRegex.test(time)) {
      return res.status(400).json({
        message: "Invalid booking time format. Use HH:mm",
      });
    }

    if (!timeRegex.test(startTime)) {
      return res.status(400).json({
        message: "Provider start time is invalid",
      });
    }

    if (!timeRegex.test(endTime)) {
      return res.status(400).json({
        message: "Provider end time is invalid",
      });
    }

    // Convert time to minutes
    const convertToMinutes = (timeValue) => {
      const [hours, minutes] =
        timeValue.split(":").map(Number);

      return hours * 60 + minutes;
    };

    const bookingMinutes =
      convertToMinutes(time);

    const startMinutes =
      convertToMinutes(startTime);

    const endMinutes =
      convertToMinutes(endTime);

    // Make sure provider schedule itself is valid
    if (startMinutes >= endMinutes) {
      return res.status(400).json({
        message:
          "Provider availability time configuration is invalid",
      });
    }

    // Check booking time
    if (
      bookingMinutes < startMinutes ||
      bookingMinutes >= endMinutes
    ) {
      return res.status(400).json({
        message: `Provider is available only between ${startTime} and ${endTime}`,
      });
    }

    // =================================================
    // DUPLICATE TIME SLOT
    // =================================================

    // 11. Check whether provider already has
    // an active booking for this date/time
    const existingBooking = await Booking.findOne({
      provider: selectedService.provider,
      date: date,
      time: time,
      status: {
        $in: [
          "pending",
          "accepted",
          "in_progress",
        ],
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

    // =================================================
    // RESPONSE
    // =================================================

    res.status(201).json({
      message: "Booking created successfully",
      booking,
    });

  } catch (error) {
    console.error(
      "Create booking error:",
      error
    );

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
      .sort({
        createdAt: -1,
      });

    res.status(200).json({
      bookings,
    });

  } catch (error) {
    console.error(
      "Get bookings error:",
      error
    );

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

    // Customer can cancel only pending/accepted bookings
    const cancellableStatuses = [
      "pending",
      "accepted",
    ];

    if (
      !cancellableStatuses.includes(
        booking.status
      )
    ) {
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
    console.error(
      "Cancel booking error:",
      error
    );

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
      .sort({
        createdAt: -1,
      });

    res.status(200).json({
      bookings,
    });

  } catch (error) {
    console.error(
      "Provider bookings error:",
      error
    );

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
        message:
          "Only pending bookings can be accepted",
      });
    }

    booking.status = "accepted";

    await booking.save();

    res.status(200).json({
      message:
        "Booking accepted successfully",
      booking,
    });

  } catch (error) {
    console.error(
      "Accept booking error:",
      error
    );

    res.status(500).json({
      message:
        "Failed to accept booking",
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
        message:
          "Only pending bookings can be rejected",
      });
    }

    booking.status = "rejected";

    await booking.save();

    res.status(200).json({
      message: "Booking rejected",
      booking,
    });

  } catch (error) {
    console.error(
      "Reject booking error:",
      error
    );

    res.status(500).json({
      message:
        "Failed to reject booking",
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
    if (
      !allowedTransitions[currentStatus] ||
      !allowedTransitions[currentStatus].includes(
        status
      )
    ) {
      return res.status(400).json({
        message: `Cannot change booking status from ${currentStatus} to ${status}`,
      });
    }

    // 6. Update status
    booking.status = status;

    await booking.save();

    res.status(200).json({
      message:
        "Booking status updated successfully",
      booking,
    });

  } catch (error) {
    console.error(
      "Update booking status error:",
      error
    );

    res.status(500).json({
      message:
        "Failed to update booking status",
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