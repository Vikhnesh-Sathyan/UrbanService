const express = require("express");
const multer = require("multer");
const path = require("path");

const authMiddleware = require("../Middleware/authMiddleware");
const roleMiddleware = require("../Middleware/roleMiddleware");

const {
  addService,
  getServices,
  getServiceById,
  getPendingServices,
  approveService,
  requestChanges,
  rejectService,
  updateService,
  deleteService,
} = require("../Controllers/ServiceController");

const router = express.Router();

// ==================== MULTER CONFIGURATION ====================

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },

  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// ==================== PROVIDER ROUTES ====================

// Provider can add a service
router.post(
  "/add",
  authMiddleware,
  roleMiddleware("provider"),
  upload.single("image"),
  addService
);

// Provider or Admin can update a service
router.put(
  "/:id",
  authMiddleware,
  roleMiddleware("provider", "admin"),
  upload.single("image"),
  updateService
);

// Provider or Admin can delete a service
router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("provider", "admin"),
  deleteService
);

router.patch(
  "/:id/resubmit",
  authMiddleware,
  roleMiddleware("provider"),
  resubmitService
);
// ==================== ADMIN ROUTES ====================

// Admin can view pending services
router.get(
  "/pending",
  authMiddleware,
  roleMiddleware("admin"),
  getPendingServices
);

// Admin can approve service
router.patch(
  "/:id/approve",
  authMiddleware,
  roleMiddleware("admin"),
  approveService
);

// Admin can request changes
router.patch(
  "/:id/request-changes",
  authMiddleware,
  roleMiddleware("admin"),
  requestChanges
);

// Admin can reject service
router.patch(
  "/:id/reject",
  authMiddleware,
  roleMiddleware("admin"),
  rejectService
);

// ==================== PUBLIC ROUTES ====================

// Anyone can view approved services
router.get("/", getServices);

// Anyone can view one service
router.get("/:id", getServiceById);

module.exports = router;