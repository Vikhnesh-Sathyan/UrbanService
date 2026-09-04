const express = require("express");

const {
  createBooking,
  getMyBookings,
  cancelBooking,
  getProviderBookings,
  acceptBooking,
  rejectBooking,
  updateBookingStatus,
} = require("../Controllers/BookingController");

const authMiddleware = require("../Middleware/authMiddleware");
const roleMiddleware = require("../Middleware/roleMiddleware");

const router = express.Router();


// CUSTOMER ROUTES

// Create booking
router.post(
  "/",
  authMiddleware,
  roleMiddleware("user"),
  createBooking
);

// Get logged-in customer's bookings
router.get(
  "/my-bookings",
  authMiddleware,
  roleMiddleware("user"),
  getMyBookings
);

// Cancel booking
router.patch(
  "/:id/cancel",
  authMiddleware,
  roleMiddleware("user"),
  cancelBooking
);



// PROVIDER ROUTES

// Get provider booking requests
router.get(
  "/provider/requests",
  authMiddleware,
  roleMiddleware("provider"),
  getProviderBookings
);

// Accept booking
router.patch(
  "/:id/accept",
  authMiddleware,
  roleMiddleware("provider"),
  acceptBooking
);

// Reject booking
router.patch(
  "/:id/reject",
  authMiddleware,
  roleMiddleware("provider"),
  rejectBooking
);

// Update job status
router.patch(
  "/:id/status",
  authMiddleware,
  roleMiddleware("provider"),
  updateBookingStatus
);

module.exports = router;


