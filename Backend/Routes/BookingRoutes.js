const express = require("express");

const {
  createBooking,
  getMyBookings,
  cancelBooking,
  rescheduleBooking,
  getProviderBookings,
  acceptBooking,
  rejectBooking,
  updateBookingStatus,
  getAllBookings,
  addBookingReview,
} = require("../Controllers/BookingController");

const authMiddleware = require("../Middleware/AuthMiddleware");
const roleMiddleware = require("../Middleware/roleMiddleware");

const router = express.Router();

// ===============================
// CUSTOMER ROUTES
// ===============================

// Create booking
router.post(
  "/",
  authMiddleware,
  roleMiddleware("user"),
  createBooking
);

// Get customer's bookings
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

// Reschedule booking
router.put(
  "/:id/reschedule",
  authMiddleware,
  roleMiddleware("user"),
  rescheduleBooking
);

// Add review
router.patch(
  "/:id/review",
  authMiddleware,
  roleMiddleware("user"),
  addBookingReview
);

// ===============================
// PROVIDER ROUTES
// ===============================

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

// Update booking status
router.patch(
  "/:id/status",
  authMiddleware,
  roleMiddleware("provider"),
  updateBookingStatus
);

// Get all bookings (Admin)
router.get(
  "/admin",
  authMiddleware,
  roleMiddleware("admin"),
  getAllBookings
);

module.exports = router;