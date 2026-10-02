const express = require("express");
const router = express.Router();

const {
  createMaterialPreparation,
  getMaterialPreparation,
  updateMaterialPreparation,
  updateMaterialItem,
} = require("../Controllers/MaterialPreparationController");

const authMiddleware = require("../Middleware/authMiddleware");
const roleMiddleware = require("../Middleware/roleMiddleware");

// =====================================================
// CREATE MATERIAL PREPARATION
// Provider creates required materials for a booking
// =====================================================

router.post(
  "/",
  authMiddleware,
  roleMiddleware("provider"),
  createMaterialPreparation
);

// =====================================================
// GET MATERIAL PREPARATION
// Provider views materials for a booking
// =====================================================

router.get(
  "/:bookingId",
  authMiddleware,
  roleMiddleware("provider"),
  getMaterialPreparation
);

// =====================================================
// UPDATE MATERIAL PREPARATION
// Provider updates materials/status/notes
// =====================================================

router.put(
  "/:bookingId",
  authMiddleware,
  roleMiddleware("provider"),
  updateMaterialPreparation
);

// =====================================================
// UPDATE INDIVIDUAL MATERIAL
// Provider marks a material as prepared/not prepared
// =====================================================

router.patch(
  "/:bookingId/material/:materialId",
  authMiddleware,
  roleMiddleware("provider"),
  updateMaterialItem
);

module.exports = router;