const express = require("express");

const router = express.Router();

const {
  createComplaint,
  getAllComplaints,
  getComplaintById,
  updateComplaint,
  getMyComplaints
} = require("../Controllers/ComplaintController");

const authMiddleware = require("../Middleware/authMiddleware");
const roleMiddleware = require("../Middleware/roleMiddleware");

// =====================================================
// CUSTOMER
// =====================================================

router.post(
  "/",
  authMiddleware,
  roleMiddleware("user"),
  createComplaint
);

router.get(
  "/my",
  authMiddleware,
  roleMiddleware("user"),
  getMyComplaints
);

// =====================================================
// ADMIN
// =====================================================

router.get(
  "/admin",
  authMiddleware,
  roleMiddleware("admin"),
  getAllComplaints
);

router.get(
  "/admin/:id",
  authMiddleware,
  roleMiddleware("admin"),
  getComplaintById
);

router.patch(
  "/admin/:id",
  authMiddleware,
  roleMiddleware("admin"),
  updateComplaint
);

module.exports = router;