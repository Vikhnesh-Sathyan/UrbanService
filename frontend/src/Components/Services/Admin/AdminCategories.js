import React, { useEffect, useState } from "react";

import {
  getServiceCategories,
  createCategory,
  addSubCategory,
  deleteCategory,
  deleteSubCategory,
} from "../../../Services/serviceService";

import "../../../styles/AdminCategories.css";

const AdminCategories = () => {
  const [categories, setCategories] = useState([]);

  const [categoryName, setCategoryName] = useState("");

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
      setSuccess("");
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
      setSuccess("");
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

  // ==========================================
  // DELETE CATEGORY
  // ==========================================

  const handleDeleteCategory = async (
    categoryId,
    categoryName
  ) => {
    const confirmed = window.confirm(
      `Delete category "${categoryName}"?`
    );

    if (!confirmed) {
      return;
    }

    try {
      setSubmitting(true);
      setError("");
      setSuccess("");

      await deleteCategory(categoryId);

      setSuccess(
        "Category deleted successfully."
      );

      await loadCategories();
    } catch (error) {
      console.error(
        "Delete category error:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to delete category"
      );
    } finally {
      setSubmitting(false);
    }
  };

  // ==========================================
  // DELETE SUBCATEGORY
  // ==========================================

  const handleDeleteSubCategory = async (
    categoryId,
    subCategoryId,
    subCategoryName
  ) => {
    const confirmed = window.confirm(
      `Delete subcategory "${subCategoryName}"?`
    );

    if (!confirmed) {
      return;
    }

    try {
      setSubmitting(true);
      setError("");
      setSuccess("");

      await deleteSubCategory(
        categoryId,
        subCategoryId
      );

      setSuccess(
        "Subcategory deleted successfully."
      );

      await loadCategories();
    } catch (error) {
      console.error(
        "Delete subcategory error:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to delete subcategory"
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="admin-categories-page">

      {/* ========================================
          HEADER
      ======================================== */}

      <div className="admin-categories-header">

        <div>
          <span className="admin-page-label">
            SERVICE MANAGEMENT
          </span>

          <h1>Categories</h1>

          <p>
            Manage categories and subcategories
            available to service providers.
          </p>
        </div>

        <div className="admin-category-summary">
          <span className="summary-label">
            TOTAL CATEGORIES
          </span>

          <strong>
            {categories.length}
          </strong>
        </div>

      </div>

      {/* ========================================
          MESSAGES
      ======================================== */}

      {error && (
        <div className="admin-category-message error">
          <span>!</span>
          {error}
        </div>
      )}

      {success && (
        <div className="admin-category-message success">
          <span>✓</span>
          {success}
        </div>
      )}

      {/* ========================================
          CREATE CATEGORY
      ======================================== */}

      <section className="admin-category-create-card">

        <div className="admin-create-heading">

          <div className="admin-create-icon">
            +
          </div>

          <div>
            <h2>Create Category</h2>

            <p>
              Add a main service category for
              providers to use.
            </p>
          </div>

        </div>

        <form
          onSubmit={handleCreateCategory}
          className="admin-category-form"
        >

          <div className="admin-input-wrapper">

            <label htmlFor="categoryName">
              Category name
            </label>

            <input
              id="categoryName"
              type="text"
              placeholder="Example: Home Services"
              value={categoryName}
              onChange={(event) =>
                setCategoryName(
                  event.target.value
                )
              }
            />

          </div>

          <button
            type="submit"
            className="admin-primary-button"
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
            <span className="admin-section-label">
              CATEGORY LIBRARY
            </span>

            <h2>
              Categories & Subcategories
            </h2>

            <p>
              These options will be available
              to service providers.
            </p>
          </div>

          <div className="admin-category-count">
            {categories.length}{" "}
            {categories.length === 1
              ? "Category"
              : "Categories"}
          </div>

        </div>

        {loading ? (
          <div className="admin-category-empty">
            <div className="admin-loading-spinner"></div>

            <span>
              Loading categories...
            </span>
          </div>
        ) : categories.length === 0 ? (
          <div className="admin-category-empty">

            <div className="admin-empty-icon">
              +
            </div>

            <h3>
              No categories yet
            </h3>

            <p>
              Create your first category above
              to get started.
            </p>

          </div>
        ) : (
          <div className="admin-category-grid">

            {categories.map((category) => {

              const activeSubCategories =
                category.subCategories?.filter(
                  (subCategory) =>
                    subCategory.isActive
                ) || [];

              return (
                <div
                  className="admin-category-card"
                  key={category._id}
                >

                  {/* CATEGORY HEADER */}

                  <div className="admin-category-card-header">

                    <div className="admin-category-main-info">

                      <div className="admin-category-icon">
                        {category.name
                          .charAt(0)
                          .toUpperCase()}
                      </div>

                      <div>
                        <h3>
                          {category.name}
                        </h3>

                        <span>
                          {activeSubCategories.length}{" "}
                          {activeSubCategories.length === 1
                            ? "subcategory"
                            : "subcategories"}
                        </span>
                      </div>

                    </div>

                    <button
                      type="button"
                      className="admin-delete-button"
                      disabled={submitting}
                      onClick={() =>
                        handleDeleteCategory(
                          category._id,
                          category.name
                        )
                      }
                    >
                      Delete
                    </button>

                  </div>

                  {/* DIVIDER */}

                  <div className="admin-category-divider"></div>

                  {/* SUBCATEGORIES */}

                  <div className="admin-subcategory-section">

                    <div className="admin-subcategory-heading">
                      <span>
                        SUBCATEGORIES
                      </span>

                      <small>
                        {activeSubCategories.length}
                      </small>
                    </div>

                    {activeSubCategories.length >
                    0 ? (
                      <div className="admin-subcategory-list">

                        {activeSubCategories.map(
                          (subCategory) => (
                            <div
                              key={
                                subCategory._id
                              }
                              className="admin-subcategory-chip"
                            >

                              <span className="subcategory-status-dot"></span>

                              <span className="subcategory-name">
                                {
                                  subCategory.name
                                }
                              </span>

                              <button
                                type="button"
                                className="admin-subcategory-delete"
                                disabled={
                                  submitting
                                }
                                onClick={() =>
                                  handleDeleteSubCategory(
                                    category._id,
                                    subCategory._id,
                                    subCategory.name
                                  )
                                }
                                aria-label={`Delete ${subCategory.name}`}
                              >
                                ×
                              </button>

                            </div>
                          )
                        )}

                      </div>
                    ) : (
                      <div className="admin-no-subcategories">
                        No subcategories added yet.
                      </div>
                    )}

                  </div>

                  {/* ADD SUBCATEGORY */}

                  <div className="admin-add-subcategory">

                    <div className="admin-input-wrapper">

                      <label>
                        Add subcategory
                      </label>

                      <input
                        type="text"
                        placeholder="Example: Deep Cleaning"
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

                    </div>

                    <button
                      type="button"
                      className="admin-add-button"
                      disabled={submitting}
                      onClick={() =>
                        handleAddSubCategory(
                          category._id
                        )
                      }
                    >
                      <span>+</span>
                      Add
                    </button>

                  </div>

                </div>
              );
            })}

          </div>
        )}

      </section>

    </div>
  );
};

export default AdminCategories;