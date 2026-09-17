import React, { useEffect, useState } from "react";

import {
  getServiceCategories,
  createCategory,
  addSubCategory,
  deleteCategory,
  deleteSubCategory,
} from "../../../Services/serviceService";

const AdminCategories = () => {
  const [categories, setCategories] = useState([]);

  const [categoryName, setCategoryName] =
    useState("");

  const [subCategoryNames, setSubCategoryNames] =
    useState({});

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // ==========================================
  // LOAD CATEGORIES
  // ==========================================

  const loadCategories = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getServiceCategories();

      setCategories(data.categories || []);
    } catch (error) {
      console.error(
        "Failed to load categories:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to load categories"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  // ==========================================
  // CREATE CATEGORY
  // ==========================================

  const handleCreateCategory = async (event) => {
    event.preventDefault();

    if (!categoryName.trim()) {
      setError("Category name is required.");
      return;
    }

    try {
      setSubmitting(true);
      setError("");
      setSuccess("");

      await createCategory(categoryName.trim());

      setCategoryName("");

      setSuccess(
        "Category created successfully."
      );

      await loadCategories();
    } catch (error) {
      console.error(
        "Create category error:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to create category"
      );
    } finally {
      setSubmitting(false);
    }
  };

  // ==========================================
  // HANDLE SUBCATEGORY INPUT
  // ==========================================

  const handleSubCategoryChange = (
    categoryId,
    value
  ) => {
    setSubCategoryNames((current) => ({
      ...current,
      [categoryId]: value,
    }));
  };

  // ==========================================
  // ADD SUBCATEGORY
  // ==========================================

  const handleAddSubCategory = async (
    categoryId
  ) => {
    const name =
      subCategoryNames[categoryId]?.trim();

    if (!name) {
      setError(
        "Subcategory name is required."
      );
      return;
    }

    try {
      setSubmitting(true);
      setError("");
      setSuccess("");

      await addSubCategory(
        categoryId,
        name
      );

      setSubCategoryNames((current) => ({
        ...current,
        [categoryId]: "",
      }));

      setSuccess(
        "Subcategory added successfully."
      );

      await loadCategories();
    } catch (error) {
      console.error(
        "Add subcategory error:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to add subcategory"
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="admin-categories-page">

      <div className="admin-categories-header">
        <div>
          <span className="admin-page-label">
            SERVICE MANAGEMENT
          </span>

          <h1>Categories</h1>

          <p>
            Manage the categories and subcategories
            available to service providers.
          </p>
        </div>
      </div>

      {/* ========================================
          MESSAGES
      ======================================== */}

      {error && (
        <div className="admin-category-error">
          {error}
        </div>
      )}

      {success && (
        <div className="admin-category-success">
          {success}
        </div>
      )}

      {/* ========================================
          CREATE CATEGORY
      ======================================== */}

      <section className="admin-category-create-card">

        <div>
          <h2>Create Category</h2>

          <p>
            Add a new service category.
          </p>
        </div>

        <form
          onSubmit={handleCreateCategory}
          className="admin-category-form"
        >
          <input
            type="text"
            placeholder="Example: Home Services"
            value={categoryName}
            onChange={(event) =>
              setCategoryName(event.target.value)
            }
          />

          <button
            type="submit"
            disabled={submitting}
          >
            {submitting
              ? "Creating..."
              : "Create Category"}
          </button>
        </form>

      </section>

      {/* ========================================
          CATEGORY LIST
      ======================================== */}

      <section className="admin-category-list">

        <div className="admin-category-list-header">
          <div>
            <h2>Categories</h2>

            <span>
              {categories.length} categories
            </span>
          </div>
        </div>

        {loading ? (
          <div className="admin-category-empty">
            Loading categories...
          </div>
        ) : categories.length === 0 ? (
          <div className="admin-category-empty">
            No categories created yet.
          </div>
        ) : (
          <div className="admin-category-grid">

            {categories.map((category) => (
              <div
                className="admin-category-card"
                key={category._id}
              >

                <div className="admin-category-card-top">

                  <div>
                    <h3>
                      {category.name}
                    </h3>

                    <span>
                      {
                        category.subCategories
                          ?.filter(
                            (subCategory) =>
                              subCategory.isActive
                          ).length || 0
                      }{" "}
                      subcategories
                    </span>
                  </div>

                </div>

                {/* SUBCATEGORIES */}

                <div className="admin-subcategory-list">

                  {category.subCategories
                    ?.filter(
                      (subCategory) =>
                        subCategory.isActive
                    )
                    .map((subCategory) => (
                      <span
                        key={subCategory._id}
                        className="admin-subcategory-chip"
                      >
                        {subCategory.name}
                      </span>
                    ))}

                </div>

                {/* ADD SUBCATEGORY */}

                <div className="admin-subcategory-form">

                  <input
                    type="text"
                    placeholder="Add subcategory"
                    value={
                      subCategoryNames[
                        category._id
                      ] || ""
                    }
                    onChange={(event) =>
                      handleSubCategoryChange(
                        category._id,
                        event.target.value
                      )
                    }
                  />

                  <button
                    type="button"
                    disabled={submitting}
                    onClick={() =>
                      handleAddSubCategory(
                        category._id
                      )
                    }
                  >
                    Add
                  </button>

                </div>

              </div>
            ))}

          </div>
        )}

      </section>

    </div>
  );
};

export default AdminCategories;