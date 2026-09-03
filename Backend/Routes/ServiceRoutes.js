const express = require("express");
const multer = require("multer");
const path = require("path");

const {
  addService,
  getServices,
  getServiceById,
  getPendingServices,
  approveService,
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

// Add service
router.post("/add", upload.single("image"), addService);

// Get all approved services
router.get("/", getServices);

// Get pending services
router.get("/pending", getPendingServices);

// Approve service
router.patch("/:id/approve", approveService);

// Update service
router.put("/:id", upload.single("image"), updateService);

// Delete service
router.delete("/:id", deleteService);

// Get single service
router.get("/:id", getServiceById);

module.exports = router;