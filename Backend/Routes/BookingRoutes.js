const express = require("express");

const {
  createBooking,
  getMyBookings,
  cancelBooking,
} = require("../Controllers/BookingController");

const authMiddleware = require("../Middleware/AuthMiddleware");

const router = express.Router();


// Create Booking
router.post("/", authMiddleware, createBooking);


// Get Logged-in User's Bookings
router.get("/my-bookings", authMiddleware, getMyBookings);


// Cancel Booking
router.patch("/:id/cancel", authMiddleware, cancelBooking);


module.exports = router;