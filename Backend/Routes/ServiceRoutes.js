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



// Multer configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },

  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// Routes
// Provider can add a service
router.post(
  "/add",
  authMiddleware,
  roleMiddleware("provider"),
  upload.single("image"),
  addService
);

// Anyone can view approved services
router.get("/", getServices);

// Admin can view pending services
router.get(
  "/pending",
  authMiddleware,
  roleMiddleware("admin"),
  getPendingServices
);

// Admin can approve services
router.patch(
  "/:id/approve",
  authMiddleware,
  roleMiddleware("admin"),
  approveService
);

// Provider or Admin can update
router.put(
  "/:id",
  authMiddleware,
  roleMiddleware("provider", "admin"),
  upload.single("image"),
  updateService
);

// Provider or Admin can delete
router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("provider", "admin"),
  deleteService
);

// Admin - View pending services
router.get(
  "/pending",
  authMiddleware,
  roleMiddleware("admin"),
  getPendingServices
);

// Admin - Approve service
router.patch(
  "/:id/approve",
  authMiddleware,
  roleMiddleware("admin"),
  approveService
);

// Admin - Request changes
router.patch(
  "/:id/request-changes",
  authMiddleware,
  roleMiddleware("admin"),
  requestChanges
);

// Admin - Reject service
router.patch(
  "/:id/reject",
  authMiddleware,
  roleMiddleware("admin"),
  rejectService
);

// Anyone can view one service
router.get("/:id", getServiceById);

module.exports = router;