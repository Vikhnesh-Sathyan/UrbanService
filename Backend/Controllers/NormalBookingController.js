const Booking = require("../Models/Booking");
const Service = require("../Models/Service");
const User = require("../Models/User");

// Time format validation
const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;

const convertToMinutes = (timeValue) => {
  const [hours, minutes] = timeValue.split(":").map(Number);

  return hours * 60 + minutes;
};

// ===============================
// CREATE NORMAL BOOKING
// ===============================
const createBooking = async (req, res) => {
  try {
    const { service, phone, date, time, notes } = req.body;

    // Required fields
    if (!service || !phone || !date || !time) {
      return res.status(400).json({
        message: "Service, phone, date and time are required",
      });
    }

    // Validate phone
    if (!/^\d{10}$/.test(phone)) {
      return res.status(400).json({
        message: "Phone number must contain exactly 10 digits",
      });
    }

    // Validate date
    const selectedDate = new Date(date);

    if (isNaN(selectedDate.getTime())) {
      return res.status(400).json({
        message: "Invalid booking date",
      });
    }

    const today = new Date();

    today.setHours(0, 0, 0, 0);
    selectedDate.setHours(0, 0, 0, 0);

    // Prevent past booking
    if (selectedDate < today) {
      return res.status(400).json({
        message: "Booking date cannot be in the past",
      });
    }

    // Find service
    const selectedService = await Service.findById(service);

    if (!selectedService) {
      return res.status(404).json({
        message: "Service not found",
      });
    }

    // Only approved services can be booked
    if (selectedService.status !== "approved") {
      return res.status(400).json({
        message: "This service is not available for booking",
      });
    }

    // Service must have provider
    if (!selectedService.provider) {
      return res.status(400).json({
        message: "Service provider is not assigned",
      });
    }

    // Find provider
    const provider = await User.findOne({
      _id: selectedService.provider,
      role: "provider",
    });

    if (!provider) {
      return res.status(404).json({
        message: "Provider not found",
      });
    }

    // Prevent provider booking their own service
    if (selectedService.provider.toString() === req.user.id.toString()) {
      return res.status(400).json({
        message: "You cannot book your own service",
      });
    }

    // Check provider availability
    if (
      !provider.availability ||
      !provider.availability.days ||
      provider.availability.days.length === 0
    ) {
      return res.status(400).json({
        message: "Provider availability is not configured",
      });
    }

    // Get booking weekday
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

    // Check provider working day
    if (!provider.availability.days.includes(bookingDay)) {
      return res.status(400).json({
        message: `Provider is not available on ${bookingDay}`,
      });
    }

    // Validate booking time
    if (!timeRegex.test(time)) {
      return res.status(400).json({
        message: "Invalid booking time format. Use HH:mm",
      });
    }

    const startTime = provider.availability.startTime;
    const endTime = provider.availability.endTime;

    if (!startTime || !endTime) {
      return res.status(400).json({
        message: "Provider availability is not configured",
      });
    }

    // Validate provider times
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

    const bookingMinutes = convertToMinutes(time);
    const startMinutes = convertToMinutes(startTime);
    const endMinutes = convertToMinutes(endTime);

    // Validate provider schedule
    if (startMinutes >= endMinutes) {
      return res.status(400).json({
        message: "Provider availability time configuration is invalid",
      });
    }

    // Check booking time inside working hours
    if (
      bookingMinutes < startMinutes ||
      bookingMinutes >= endMinutes
    ) {
      return res.status(400).json({
        message: `Provider is available only between ${startTime} and ${endTime}`,
      });
    }

    // Check duplicate booking slot
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

    // Create normal booking
    const booking = new Booking({
      user: req.user.id,
      service: selectedService._id,
      provider: selectedService.provider,
      phone,
      date,
      time,
      notes: notes || "",
      bookingType: "normal",
    });

    await booking.save();

    res.status(201).json({
      message: "Booking created successfully",
      booking,
    });
  } catch (error) {
    console.error("Create normal booking error:", error);

    res.status(500).json({
      message: "Failed to create booking",
    });
  }
};

// ===============================
// CANCEL NORMAL BOOKING
// ===============================
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

    // Only normal bookings should use this flow
    if (booking.bookingType !== "normal") {
      return res.status(400).json({
        message: "This is not a normal booking",
      });
    }

    // Only pending and accepted bookings can be cancelled
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
    console.error("Cancel normal booking error:", error);

    res.status(500).json({
      message: "Failed to cancel booking",
    });
  }
};

// ===============================
// RESCHEDULE NORMAL BOOKING
// ===============================
const rescheduleBooking = async (req, res) => {
  try {
    const { date, time } = req.body;

    // Required fields
    if (!date || !time) {
      return res.status(400).json({
        message: "Date and time are required",
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

    // Only normal bookings can be rescheduled
    if (booking.bookingType !== "normal") {
      return res.status(400).json({
        message: "Emergency bookings cannot be rescheduled",
      });
    }

    // Only pending and accepted bookings can be rescheduled
    if (!["pending", "accepted"].includes(booking.status)) {
      return res.status(400).json({
        message: `Booking cannot be rescheduled when status is ${booking.status}`,
      });
    }

    // Validate date
    const selectedDate = new Date(date);

    if (isNaN(selectedDate.getTime())) {
      return res.status(400).json({
        message: "Invalid booking date",
      });
    }

    const today = new Date();

    today.setHours(0, 0, 0, 0);
    selectedDate.setHours(0, 0, 0, 0);

    // Prevent past date
    if (selectedDate < today) {
      return res.status(400).json({
        message: "Booking date cannot be in the past",
      });
    }

    // Find provider
    const provider = await User.findOne({
      _id: booking.provider,
      role: "provider",
    });

    if (!provider) {
      return res.status(404).json({
        message: "Provider not found",
      });
    }

    // Check availability configuration
    if (
      !provider.availability ||
      !provider.availability.days ||
      provider.availability.days.length === 0
    ) {
      return res.status(400).json({
        message: "Provider availability is not configured",
      });
    }

    // Get weekday
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

    // Check working day
    if (!provider.availability.days.includes(bookingDay)) {
      return res.status(400).json({
        message: `Provider is not available on ${bookingDay}`,
      });
    }

    // Validate requested time
    if (!timeRegex.test(time)) {
      return res.status(400).json({
        message: "Invalid booking time format. Use HH:mm",
      });
    }

    const startTime = provider.availability.startTime;
    const endTime = provider.availability.endTime;

    if (!startTime || !endTime) {
      return res.status(400).json({
        message: "Provider availability is not configured",
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

    const bookingMinutes = convertToMinutes(time);
    const startMinutes = convertToMinutes(startTime);
    const endMinutes = convertToMinutes(endTime);

    if (startMinutes >= endMinutes) {
      return res.status(400).json({
        message: "Provider availability time configuration is invalid",
      });
    }

    // Check booking time inside working hours
    if (
      bookingMinutes < startMinutes ||
      bookingMinutes >= endMinutes
    ) {
      return res.status(400).json({
        message: `Provider is available only between ${startTime} and ${endTime}`,
      });
    }

    // Check duplicate slot
    const existingBooking = await Booking.findOne({
      _id: {
        $ne: booking._id,
      },
      provider: booking.provider,
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

    // Update booking
    booking.date = date;
    booking.time = time;

    await booking.save();

    res.status(200).json({
      message: "Booking rescheduled successfully",
      booking,
    });
  } catch (error) {
    console.error("Reschedule normal booking error:", error);

    res.status(500).json({
      message: "Failed to reschedule booking",
    });
  }
};

module.exports = {
  createBooking,
  cancelBooking,
  rescheduleBooking,
};