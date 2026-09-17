const Category = require("../Models/Category");
const Service = require("../Models/Service");
// ==========================================
// GET ALL ACTIVE CATEGORIES
// ==========================================

const getCategories = async (req, res) => {
  try {
    const categories = await Category.find({
      isActive: true,
    }).sort({ name: 1 });

    res.status(200).json({
      categories,
    });
  } catch (error) {
    console.error("Get categories error:", error);

    res.status(500).json({
      message: "Failed to fetch categories",
    });
  }
};

// ==========================================
// GET SUBCATEGORIES FOR A CATEGORY
// ==========================================

const getSubCategories = async (req, res) => {
  try {
    const category = await Category.findOne({
      _id: req.params.categoryId,
      isActive: true,
    });

    if (!category) {
      return res.status(404).json({
        message: "Category not found",
      });
    }

    const subCategories = category.subCategories.filter(
      (subCategory) => subCategory.isActive
    );

    res.status(200).json({
      subCategories,
    });
  } catch (error) {
    console.error("Get subcategories error:", error);

    res.status(500).json({
      message: "Failed to fetch subcategories",
    });
  }
};

// ==========================================
// CREATE CATEGORY
// ==========================================

const createCategory = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name || name.trim() === "") {
      return res.status(400).json({
        message: "Category name is required",
      });
    }

    const existingCategory = await Category.findOne({
      name: name.trim(),
    });

    if (existingCategory) {
      return res.status(400).json({
        message: "Category already exists",
      });
    }

    const category = await Category.create({
      name: name.trim(),
    });

    res.status(201).json({
      message: "Category created successfully",
      category,
    });
  } catch (error) {
    console.error("Create category error:", error);

    res.status(500).json({
      message: "Failed to create category",
    });
  }
};

// ==========================================
// ADD SUBCATEGORY
// ==========================================

const addSubCategory = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name || name.trim() === "") {
      return res.status(400).json({
        message: "Subcategory name is required",
      });
    }

    const category = await Category.findById(
      req.params.categoryId
    );

    if (!category) {
      return res.status(404).json({
        message: "Category not found",
      });
    }

    const subCategoryExists = category.subCategories.some(
      (subCategory) =>
        subCategory.name.toLowerCase() ===
        name.trim().toLowerCase()
    );

    if (subCategoryExists) {
      return res.status(400).json({
        message: "Subcategory already exists",
      });
    }

    category.subCategories.push({
      name: name.trim(),
    });

    await category.save();

    res.status(201).json({
      message: "Subcategory added successfully",
      category,
    });
  } catch (error) {
    console.error("Add subcategory error:", error);

    res.status(500).json({
      message: "Failed to add subcategory",
    });
  }
};

// ==========================================
// DELETE CATEGORY
// ==========================================

const deleteCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;

    const category = await Category.findById(categoryId);

    if (!category) {
      return res.status(404).json({
        message: "Category not found",
      });
    }

    // Check whether services are using this category
    const serviceCount = await Service.countDocuments({
      category: category.name,
    });

    if (serviceCount > 0) {
      return res.status(400).json({
        message:
          "This category is being used by existing services and cannot be deleted.",
      });
    }

    await Category.findByIdAndDelete(categoryId);

    res.status(200).json({
      message: "Category deleted successfully",
    });
  } catch (error) {
    console.error(
      "Delete category error:",
      error
    );

    res.status(500).json({
      message: "Failed to delete category",
    });
  }
};


// ==========================================
// DELETE SUBCATEGORY
// ==========================================

const deleteSubCategory = async (req, res) => {
  try {
    const { categoryId, subCategoryId } =
      req.params;

    const category = await Category.findById(
      categoryId
    );

    if (!category) {
      return res.status(404).json({
        message: "Category not found",
      });
    }

    const subCategory =
      category.subCategories.id(
        subCategoryId
      );

    if (!subCategory) {
      return res.status(404).json({
        message: "Subcategory not found",
      });
    }

    // Check whether services are using this subcategory
    const serviceCount =
      await Service.countDocuments({
        category: category.name,
        subCategory: subCategory.name,
      });

    if (serviceCount > 0) {
      return res.status(400).json({
        message:
          "This subcategory is being used by existing services and cannot be deleted.",
      });
    }

    category.subCategories.pull(
      subCategoryId
    );

    await category.save();

    res.status(200).json({
      message: "Subcategory deleted successfully",
    });
  } catch (error) {
    console.error(
      "Delete subcategory error:",
      error
    );

    res.status(500).json({
      message: "Failed to delete subcategory",
    });
  }
};

module.exports = {
  getCategories,
  getSubCategories,
  createCategory,
  addSubCategory,
  deleteCategory,
  deleteSubCategory,

};