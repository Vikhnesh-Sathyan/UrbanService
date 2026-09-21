const express = require("express");

const {
  createBooking,
  createEmergencyBooking,
  getMyBookings,
  cancelBooking,
  rescheduleBooking,
  getProviderBookings,
  acceptBooking,
  rejectBooking,
  updateBookingStatus,
  updateProviderLocation,
  getProviderLocation,
  getAllBookings,
  addBookingReview,
  getUserBookings,
  getNearbyEmergencyProviders,
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

router.post(
  "/emergency",
  authMiddleware,
  roleMiddleware("user"),
  createEmergencyBooking
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

// Get provider location
router.get(
  "/:id/location",
  authMiddleware,
  roleMiddleware("user"),
  getProviderLocation
);
// Find nearby providers for emergency booking
router.post(
  "/emergency/nearby",
  authMiddleware,
  roleMiddleware("user"),
  getNearbyEmergencyProviders
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

// Update provider location
router.patch(
  "/:id/location",
  authMiddleware,
  roleMiddleware("provider"),
  updateProviderLocation
);

// Get all bookings (Admin)

router.get(
  "/admin/user/:userId",
  authMiddleware,
  roleMiddleware("admin"),
  getUserBookings
);

router.get(
  "/admin",
  authMiddleware,
  roleMiddleware("admin"),
  getAllBookings
);



module.exports = router;