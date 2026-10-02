const mongoose = require("mongoose");
const MaterialPreparation = require("../Models/MaterialPreparation");
const Booking = require("../Models/Booking");
const Service = require("../Models/Service");

// =====================================================
// CREATE MATERIAL PREPARATION
// Creates booking-specific materials from admin suggestions
// Provider can later add additional materials
// =====================================================

const createMaterialPreparation = async (req, res) => {
  try {
    const providerId = req.user.id;
    const { bookingId, providerNotes } = req.body;

    // Check required booking
    if (!bookingId) {
      return res.status(400).json({
        success: false,
        message: "Booking is required",
      });
    }

    // Check valid booking ID
    if (!mongoose.Types.ObjectId.isValid(bookingId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid booking ID",
      });
    }

    // Find booking assigned to this provider
    const booking = await Booking.findOne({
      _id: bookingId,
      provider: providerId,
    }).populate("service");

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found or not assigned to you",
      });
    }

    // Material preparation is not available for finished bookings
    if (
      booking.status === "cancelled" ||
      booking.status === "rejected" ||
      booking.status === "completed"
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Material preparation is not available for this booking",
      });
    }

    // Prevent duplicate material preparation
    const existingPreparation =
      await MaterialPreparation.findOne({
        booking: bookingId,
      });

    if (existingPreparation) {
      return res.status(400).json({
        success: false,
        message:
          "Material preparation already exists for this booking",
      });
    }

    // Get admin-configured materials from the service
    const suggestedMaterials =
      booking.service?.suggestedMaterials || [];

    // Create a booking-specific snapshot
    const materials = suggestedMaterials.map(
      (material) => ({
        name: material.name,
        quantity: material.defaultQuantity,
        unit: material.unit,
        source: "admin",
        status: "available",
      })
    );

    // Create material preparation
    const materialPreparation =
      await MaterialPreparation.create({
        booking: bookingId,
        provider: providerId,
        materials,
        providerNotes: providerNotes || "",
      });

    return res.status(201).json({
      success: true,
      message:
        "Material preparation created successfully",
      data: materialPreparation,
    });
  } catch (error) {
    console.error(
      "Create material preparation error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to create material preparation",
    });
  }
};

// =====================================================
// GET MATERIAL PREPARATION
// Provider views materials for their booking
// =====================================================

const getMaterialPreparation = async (req, res) => {
  try {
    const providerId = req.user.id;
    const { bookingId } = req.params;

    // Find preparation belonging to provider
    const materialPreparation =
      await MaterialPreparation.findOne({
        booking: bookingId,
        provider: providerId,
      }).populate({
        path: "booking",
        populate: {
          path: "service",
          select: "name",
        },
      });

    if (!materialPreparation) {
      return res.status(404).json({
        success: false,
        message: "Material preparation not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: materialPreparation,
    });
  } catch (error) {
    console.error(
      "Get material preparation error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to load material preparation",
    });
  }
};

// =====================================================
// UPDATE MATERIAL PREPARATION
// Provider updates materials and preparation status
// =====================================================

const updateMaterialPreparation = async (req, res) => {
  try {
    const providerId = req.user.id;
    const { bookingId } = req.params;

    const {
      materials,
      preparationStatus,
      providerNotes,
    } = req.body;

    // Find provider's preparation record
    const materialPreparation =
      await MaterialPreparation.findOne({
        booking: bookingId,
        provider: providerId,
      });

    if (!materialPreparation) {
      return res.status(404).json({
        success: false,
        message: "Material preparation not found",
      });
    }

    // Update only provided fields
    if (materials !== undefined) {
      materialPreparation.materials = materials;
    }

    if (preparationStatus !== undefined) {
      materialPreparation.preparationStatus =
        preparationStatus;
    }

    if (providerNotes !== undefined) {
      materialPreparation.providerNotes = providerNotes;
    }

    await materialPreparation.save();

    return res.status(200).json({
      success: true,
      message: "Material preparation updated successfully",
      data: materialPreparation,
    });
  } catch (error) {
    console.error(
      "Update material preparation error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to update material preparation",
    });
  }
};

// =====================================================
// UPDATE MATERIAL ITEM
// Provider marks an individual material as prepared
// =====================================================

// =====================================================
// UPDATE MATERIAL ITEM
// Provider updates an individual material status
// =====================================================

const updateMaterialItem = async (req, res) => {
  try {
    const providerId = req.user.id;
    const { bookingId, materialId } = req.params;
    const { status } = req.body;

    // Validate material status
    const validStatuses = [
      "available",
      "need_to_buy",
      "ready",
    ];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid material status",
      });
    }

    // Find provider's material preparation
    const materialPreparation =
      await MaterialPreparation.findOne({
        booking: bookingId,
        provider: providerId,
      });

    if (!materialPreparation) {
      return res.status(404).json({
        success: false,
        message: "Material preparation not found",
      });
    }

    // Find the specific material
    const material =
      materialPreparation.materials.id(materialId);

    if (!material) {
      return res.status(404).json({
        success: false,
        message: "Material not found",
      });
    }

    // Update material status
    material.status = status;

    // Check whether all materials are ready
    const allReady =
      materialPreparation.materials.every(
        (item) => item.status === "ready"
      );

    // Check whether any preparation work has started
    const anyPrepared =
      materialPreparation.materials.some(
        (item) =>
          item.status === "need_to_buy" ||
          item.status === "ready"
      );

    // Automatically update overall preparation status
    if (allReady) {
      materialPreparation.preparationStatus = "ready";
    } else if (anyPrepared) {
      materialPreparation.preparationStatus = "preparing";
    } else {
      materialPreparation.preparationStatus = "pending";
    }

    await materialPreparation.save();

    return res.status(200).json({
      success: true,
      message: "Material status updated successfully",
      data: materialPreparation,
    });
  } catch (error) {
    console.error(
      "Update material item error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to update material status",
    });
  }
};

// =====================================================
// EXPORT CONTROLLERS
// =====================================================

module.exports = {
  createMaterialPreparation,
  getMaterialPreparation,
  updateMaterialPreparation,
  updateMaterialItem,
};