const express = require("express");

const {
  getCategories,
  getSubCategories,
  createCategory,
  addSubCategory,
  deleteCategory,
  deleteSubCategory,
} = require("../Controllers/CategoryController");

const authMiddleware = require("../Middleware/AuthMiddleware");
const roleMiddleware = require("../Middleware/roleMiddleware");

const router = express.Router();

// ==========================================
// PUBLIC / PROVIDER FETCH
// ==========================================

// Get active categories
router.get("/", getCategories);

// Get active subcategories for a category
router.get(
  "/:categoryId/subcategories",
  getSubCategories
);

// ==========================================
// ADMIN MANAGEMENT
// ==========================================

// Create category
router.post(
  "/",
  authMiddleware,
  roleMiddleware("admin"),
  createCategory
);

// Add subcategory
router.post(
  "/:categoryId/subcategories",
  authMiddleware,
  roleMiddleware("admin"),
  addSubCategory
);

// Delete category
router.delete(
  "/:categoryId",
  authMiddleware,
  roleMiddleware("admin"),
  deleteCategory
);

// Delete subcategory
router.delete(
  "/:categoryId/subcategories/:subCategoryId",
  authMiddleware,
  roleMiddleware("admin"),
  deleteSubCategory
);

module.exports = router;