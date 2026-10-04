const express = require("express");

const cloudinary = require("../config/cloudinary");

const {
  CloudinaryStorage,
} = require("multer-storage-cloudinary");

const multer = require("multer");

const authMiddleware = require("../Middleware/AuthMiddleware");

const roleMiddleware = require("../Middleware/roleMiddleware");

const {
  addService,
  getServices,
  getServiceById,
  getServiceCategories,
  getServiceSubCategories,
  getProviderServices,
  getPendingServices,
  approveService,
  requestChanges,
  rejectService,
  updateService,
  deleteService,
  resubmitService,
  updateSuggestedMaterials,
} = require("../Controllers/ServiceController");

const router = express.Router();

// =====================================================
// CLOUDINARY STORAGE
// =====================================================

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "urbanservice/services",
    allowed_formats: [
      "jpg",
      "jpeg",
      "png",
      "webp",
    ],
  },
});

const upload = multer({
  storage,
});

// =====================================================
// CLOUDINARY IMAGE UPLOAD ERROR HANDLER
// =====================================================

const uploadServiceImage = (req, res, next) => {
  upload.single("image")(req, res, (error) => {
    if (error) {
      console.error(
        "SERVICE IMAGE UPLOAD ERROR:",
        JSON.stringify(
          error,
          Object.getOwnPropertyNames(error),
          2
        )
      );

      console.error(
        "SERVICE IMAGE ERROR MESSAGE:",
        error?.message
      );

      return res.status(500).json({
        success: false,
        message:
          error?.message ||
          "Service image upload failed",
      });
    }

    next();
  });
};

// =====================================================
// PROVIDER ROUTES
// =====================================================

// Provider can add a service
router.post(
  "/add",
  authMiddleware,
  roleMiddleware("provider"),
  uploadServiceImage,
  addService
);

// Provider can view their own services
router.get(
  "/my-services",
  authMiddleware,
  roleMiddleware("provider"),
  getProviderServices
);

// Provider or Admin can update a service
router.put(
  "/:id",
  authMiddleware,
  roleMiddleware("provider", "admin"),
  uploadServiceImage,
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

// =====================================================
// ADMIN ROUTES
// =====================================================

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

// Admin can configure suggested materials
router.patch(
  "/:id/suggested-materials",
  authMiddleware,
  roleMiddleware("admin"),
  updateSuggestedMaterials
);

// =====================================================
// PUBLIC ROUTES
// =====================================================

// Anyone can view approved services
router.get(
  "/",
  getServices
);

// Anyone can view service categories
router.get(
  "/categories",
  getServiceCategories
);

// Anyone can view service sub-categories
router.get(
  "/subcategories",
  getServiceSubCategories
);

// Anyone can view one service
router.get(
  "/:id",
  getServiceById
);

module.exports = router;