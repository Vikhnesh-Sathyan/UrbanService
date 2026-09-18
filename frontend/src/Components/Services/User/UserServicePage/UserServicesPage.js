import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaSearch, FaSlidersH, FaArrowLeft } from "react-icons/fa";

import { getServices } from "../../../../Services/userService";
import ServiceCard from "./ServiceCard";
import ServiceFilters from "./ServiceFilters";
import Pagination from "./Pagination";

import "../../../../styles/UserServicesPage.css";

const CATEGORY_API =
  "http://localhost:5000/api/categories";

const UserServicesPage = () => {
  const navigate = useNavigate();

  // ==========================================
  // MARKETPLACE VIEW
  // ==========================================

  // category = main category selected by user
  const [selectedCategory, setSelectedCategory] = useState(null);

  // subcategory = subcategory selected by user
  const [selectedSubCategory, setSelectedSubCategory] =
    useState(null);

  const [subCategories, setSubCategories] = useState([]);

  const [categoryLoading, setCategoryLoading] =
    useState(false);

  const [subCategoryLoading, setSubCategoryLoading] =
    useState(false);

  // ==========================================
  // SERVICES
  // ==========================================

  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);

  // ==========================================
  // CATEGORIES
  // ==========================================

  const [categories, setCategories] = useState([]);

  const [categoriesLoading, setCategoriesLoading] =
    useState(true);

  // ==========================================
  // PAGINATION
  // ==========================================

  const [page, setPage] = useState(1);

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 9,
    totalServices: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPreviousPage: false,
  });

  // ==========================================
  // FILTERS
  // ==========================================

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] =
    useState("");

  const [category, setCategory] = useState("");

  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const [minRating, setMinRating] = useState("");
  const [sort, setSort] = useState("");

  // Provider filter
  const [provider, setProvider] = useState("");
  const [providers, setProviders] = useState([]);

  const [availability, setAvailability] =
    useState("");

  // ==========================================
  // LOAD ALL PROVIDERS
  // ==========================================

  const loadProviders = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/users/providers",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem(
              "token"
            )}`,
          },
        }
      );

      const providerList = Array.isArray(
        response.data?.providers
      )
        ? response.data.providers
        : [];

      const formattedProviders = providerList
        .filter((item) => item?._id)
        .map((item) => ({
          id: item._id,
          name: item.name,
        }));

      setProviders(formattedProviders);
    } catch (error) {
      console.error(
        "Failed to load providers:",
        error
      );

      setProviders([]);
    }
  };

  // ==========================================
  // LOAD MAIN CATEGORIES
  // ==========================================

  const loadCategories = async () => {
    try {
      setCategoriesLoading(true);

      const response = await axios.get(
        CATEGORY_API
      );

      const categoryList = Array.isArray(
        response.data?.categories
      )
        ? response.data.categories
        : [];

      // Show only active categories
      const activeCategories = categoryList.filter(
        (item) => item?.isActive !== false
      );

      setCategories(activeCategories);
    } catch (error) {
      console.error(
        "Failed to load categories:",
        error
      );

      setCategories([]);
    } finally {
      setCategoriesLoading(false);
    }
  };

  // ==========================================
  // LOAD SUBCATEGORIES
  // ==========================================

  const loadSubCategories = async (
    categoryId
  ) => {
    try {
      setSubCategoryLoading(true);

      const response = await axios.get(
        `${CATEGORY_API}/${categoryId}/subcategories`
      );

      const subCategoryList = Array.isArray(
        response.data?.subCategories
      )
        ? response.data.subCategories
        : [];

      // Show only active subcategories
      const activeSubCategories =
        subCategoryList.filter(
          (item) => item?.isActive !== false
        );

      setSubCategories(activeSubCategories);
    } catch (error) {
      console.error(
        "Failed to load subcategories:",
        error
      );

      setSubCategories([]);
    } finally {
      setSubCategoryLoading(false);
    }
  };

  // ==========================================
  // SELECT CATEGORY
  // ==========================================

  const handleCategorySelect = (categoryItem) => {
    setSelectedCategory(categoryItem);

    setSelectedSubCategory(null);

    setSubCategories([]);

    setServices([]);

    setCategory(categoryItem.name);

    setPage(1);

    loadSubCategories(categoryItem._id);
  };

  // ==========================================
// CHANGE CATEGORY FROM FILTER
// ==========================================

const handleFilterCategoryChange = (value) => {
  const categoryItem = categories.find(
    (item) => item.name === value
  );

  if (!categoryItem) {
    return;
  }

  // Change the actual selected category
  setSelectedCategory(categoryItem);

  // Clear previous subcategory
  setSelectedSubCategory(null);

  // Clear old subcategories
  setSubCategories([]);

  // Clear old services
  setServices([]);

  // Update filter value
  setCategory(value);

  // Reset page
  setPage(1);

  // Load subcategories for new category
  loadSubCategories(categoryItem._id);
};

  // ==========================================
  // SELECT SUBCATEGORY
  // ==========================================

  const handleSubCategorySelect = (
    subCategoryItem
  ) => {
    setSelectedSubCategory(subCategoryItem);

    setCategory(
      selectedCategory?.name || ""
    );

    setPage(1);

    setSearch("");
    setDebouncedSearch("");

    setMinPrice("");
    setMaxPrice("");
    setMinRating("");
    setSort("");
    setProvider("");
    setAvailability("");
  };

  // ==========================================
  // BACK TO CATEGORIES
  // ==========================================

  const handleBackToCategories = () => {
    setSelectedCategory(null);
    setSelectedSubCategory(null);

    setSubCategories([]);

    setServices([]);

    setCategory("");

    setSearch("");
    setDebouncedSearch("");

    setMinPrice("");
    setMaxPrice("");
    setMinRating("");
    setSort("");
    setProvider("");
    setAvailability("");

    setPage(1);
  };

  // ==========================================
  // BACK TO SUBCATEGORIES
  // ==========================================

  const handleBackToSubCategories = () => {
    setSelectedSubCategory(null);

    setServices([]);

    setSearch("");
    setDebouncedSearch("");

    setMinPrice("");
    setMaxPrice("");
    setMinRating("");
    setSort("");
    setProvider("");
    setAvailability("");

    setPage(1);
  };

  // ==========================================
  // LOAD SERVICES
  // ==========================================

  const loadServices = async () => {
    // IMPORTANT:
    // Do not load services on the category
    // or subcategory selection screens.
    //
    // Services are loaded ONLY after the user
    // selects a subcategory.

    if (
      !selectedCategory ||
      !selectedSubCategory
    ) {
      return;
    }

    try {
      setLoading(true);

      const params = {
        page,
        limit: 9,

        // Main category
        category: selectedCategory.name,

        // Selected subcategory
        subCategory:
          selectedSubCategory.name,
      };

      // ========================================
      // SEARCH
      // ========================================

      if (debouncedSearch.trim()) {
        params.search =
          debouncedSearch.trim();
      }

      // ========================================
      // PRICE
      // ========================================

      if (minPrice !== "") {
        params.minPrice = minPrice;
      }

      if (maxPrice !== "") {
        params.maxPrice = maxPrice;
      }

      // ========================================
      // RATING
      // ========================================

      if (minRating !== "") {
        params.minRating = minRating;
      }

      // ========================================
      // SORT
      // ========================================

      if (sort) {
        params.sort = sort;
      }

      // ========================================
      // PROVIDER
      // ========================================

      if (provider) {
        params.provider = provider;
      }

      // ========================================
      // AVAILABILITY
      // ========================================

      if (availability) {
        params.availability = availability;
      }

      // ========================================
      // API CALL
      // ========================================

      const data = await getServices(params);

      // ========================================
      // SERVICES
      // ========================================

      setServices(
        Array.isArray(data?.services)
          ? data.services
          : []
      );

      // ========================================
      // PAGINATION
      // ========================================

      setPagination(
        data?.pagination || {
          page,
          limit: 9,
          totalServices: 0,
          totalPages: 0,
          hasNextPage: false,
          hasPreviousPage: false,
        }
      );
    } catch (error) {
      console.error(
        "Failed to load services:",
        error
      );

      setServices([]);

      setPagination({
        page: 1,
        limit: 9,
        totalServices: 0,
        totalPages: 0,
        hasNextPage: false,
        hasPreviousPage: false,
      });
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // LOAD INITIAL DATA
  // ==========================================

  useEffect(() => {
    loadCategories();
    loadProviders();
  }, []);

  // ==========================================
  // DEBOUNCE SEARCH
  // ==========================================

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  // ==========================================
  // LOAD SERVICES WHEN FILTER CHANGES
  // ==========================================

  useEffect(() => {
    loadServices();
  }, [
    page,
    debouncedSearch,
    minPrice,
    maxPrice,
    minRating,
    sort,
    provider,
    availability,
    selectedCategory,
    selectedSubCategory,
  ]);

  // ==========================================
  // SEARCH
  // ==========================================

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
    setPage(1);
  };

  // ==========================================
  // PAGE CHANGE
  // ==========================================

  const handlePageChange = (newPage) => {
    if (
      newPage < 1 ||
      newPage > pagination.totalPages
    ) {
      return;
    }

    setPage(newPage);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // ==========================================
  // CLEAR FILTERS
  // ==========================================

  const clearFilters = () => {
    setSearch("");
    setMinPrice("");
    setMaxPrice("");
    setMinRating("");
    setSort("");
    setProvider("");
    setAvailability("");

    setPage(1);
  };

  // ==========================================
  // VIEW SERVICE DETAILS
  // ==========================================

  const handleViewDetails = (service) => {
    navigate(
      `/user/services/${service._id}`,
      {
        state: { service },
      }
    );
  };

  // ==========================================
  // HERO
  // ==========================================

  const renderHero = () => {
    return (
      <section className="user-services-hero">

        <div className="user-services-marquee">

          <div className="user-services-marquee-track">

            <span>
              ✦ TRUSTED LOCAL SERVICES
            </span>

            <span>
              • VERIFIED PROFESSIONALS
            </span>

            <span>
              • EASY BOOKING
            </span>

            <span>
              • SECURE PAYMENTS
            </span>

            <span>
              • QUALITY SERVICES
            </span>

            <span>
              ✦ TRUSTED LOCAL SERVICES
            </span>

            <span>
              • VERIFIED PROFESSIONALS
            </span>

            <span>
              • EASY BOOKING
            </span>

            <span>
              • SECURE PAYMENTS
            </span>

            <span>
              • QUALITY SERVICES
            </span>

          </div>

        </div>

        <div className="user-services-hero-content">

          <span className="user-services-eyebrow">
            ✦ SERVICE MARKETPLACE
          </span>

          <h1>
            Find the Right Service
          </h1>

          <p>
            Discover trusted professionals for
            your everyday needs.
          </p>

        </div>

        <div className="user-services-search">

          <FaSearch />

          <input
            type="text"
            value={search}
            onChange={handleSearchChange}
            placeholder="Search for a service..."
            disabled={
              !selectedSubCategory
            }
          />

          {search && (
            <button
              type="button"
              onClick={() => {
                setSearch("");
                setPage(1);
              }}
              className="user-services-search-clear"
            >
              ×
            </button>
          )}

        </div>

        <div className="user-services-trust">

          <span>
            ✓ Verified Professionals
          </span>

          <span>
            ✓ Secure Booking
          </span>

          <span>
            ✓ Trusted Services
          </span>

        </div>

      </section>
    );
  };

  // ==========================================
  // CATEGORY LANDING PAGE
  // ==========================================

  const renderCategories = () => {
    return (
      <section className="user-services-category-view">

        <div className="user-services-section-heading">

          <span>
            BROWSE BY CATEGORY
          </span>

          <h2>
            What do you need help with?
          </h2>

          <p>
            Choose a service category to explore
            available subcategories.
          </p>

        </div>

        {categoriesLoading ? (
          <div className="user-services-inline-loading">
            Loading categories...
          </div>
        ) : categories.length > 0 ? (

          <div className="user-services-category-grid">

            {categories.map((categoryItem) => (

              <button
                type="button"
                key={categoryItem._id}
                className="user-services-category-card"
                onClick={() =>
                  handleCategorySelect(
                    categoryItem
                  )
                }
              >

                <div className="user-services-category-icon">
                  ✦
                </div>

                <div className="user-services-category-content">

                  <h3>
                    {categoryItem.name}
                  </h3>

                  <p>
                    Explore services
                  </p>

                </div>

                <span className="user-services-category-arrow">
                  →
                </span>

              </button>

            ))}

          </div>

        ) : (

          <div className="user-services-no-results">

            <div className="user-services-no-results-icon">
              📂
            </div>

            <h2>
              No categories available
            </h2>

            <p>
              Service categories will appear here
              once they are added.
            </p>

          </div>

        )}

      </section>
    );
  };

  // ==========================================
  // SUBCATEGORY PAGE
  // ==========================================

  const renderSubCategories = () => {
    return (
      <section className="user-services-category-view">

        <div className="user-services-breadcrumb">

          <button
            type="button"
            onClick={handleBackToCategories}
          >
            <FaArrowLeft />
            Categories
          </button>

          <span>›</span>

          <strong>
            {selectedCategory?.name}
          </strong>

        </div>

        <div className="user-services-section-heading">

          <span>
            {selectedCategory?.name}
          </span>

          <h2>
            Choose a service type
          </h2>

          <p>
            Select a subcategory to see the
            services offered by professionals.
          </p>

        </div>

        {subCategoryLoading ? (

          <div className="user-services-inline-loading">
            Loading subcategories...
          </div>

        ) : subCategories.length > 0 ? (

          <div className="user-services-subcategory-grid">

            {subCategories.map(
              (subCategoryItem) => (

                <button
                  type="button"
                  key={subCategoryItem._id}
                  className="user-services-subcategory-card"
                  onClick={() =>
                    handleSubCategorySelect(
                      subCategoryItem
                    )
                  }
                >

                  <div className="user-services-subcategory-icon">
                    ◇
                  </div>

                  <div>

                    <h3>
                      {subCategoryItem.name}
                    </h3>

                    <p>
                      View available services
                    </p>

                  </div>

                  <span>
                    →
                  </span>

                </button>

              )
            )}

          </div>

        ) : (

          <div className="user-services-no-results">

            <div className="user-services-no-results-icon">
              📂
            </div>

            <h2>
              No subcategories available
            </h2>

            <p>
              This category does not have any
              active subcategories yet.
            </p>

          </div>

        )}

      </section>
    );
  };

  // ==========================================
  // SERVICE LISTING PAGE
  // ==========================================

  const renderServices = () => {
    return (
      <section className="user-services-marketplace">

        {/* ====================================
            SIDEBAR
        ==================================== */}

        <aside className="user-services-sidebar">

          <div className="user-services-sidebar-title">

            <div>
              <FaSlidersH />

              <span>
                Filters
              </span>
            </div>

            <button
              type="button"
              onClick={clearFilters}
            >
              Clear
            </button>

          </div>

          <ServiceFilters
            category={category}
            categories={categories.map(
              (categoryItem) => categoryItem.name
            )}
            setCategory={(value) => {
              handleFilterCategoryChange(value);
            }}
            provider={provider}
            providers={providers}
            setProvider={(value) => {
              setProvider(value);
              setPage(1);
            }}
            minPrice={minPrice}
            setMinPrice={(value) => {
              setMinPrice(value);
              setPage(1);
            }}
            maxPrice={maxPrice}
            setMaxPrice={(value) => {
              setMaxPrice(value);
              setPage(1);
            }}
            minRating={minRating}
            setMinRating={(value) => {
              setMinRating(value);
              setPage(1);
            }}
            availability={availability}
            setAvailability={(value) => {
              setAvailability(value);
              setPage(1);
            }}
          />

        </aside>

        {/* ====================================
            RESULTS
        ==================================== */}

        <main className="user-services-results">

          {/* BREADCRUMB */}

          <div className="user-services-breadcrumb">

            <button
              type="button"
              onClick={
                handleBackToSubCategories
              }
            >
              <FaArrowLeft />
              {selectedCategory?.name}
            </button>

            <span>›</span>

            <strong>
              {selectedSubCategory?.name}
            </strong>

          </div>

          {/* RESULTS HEADER */}

          <div className="user-services-results-header">

            <div className="user-services-results-count">

              <span>
                {pagination.totalServices}
              </span>

              <strong>
                Services
              </strong>

            </div>

            {/* SORT */}

            <div className="user-services-sort">

              <label htmlFor="service-sort">
                Sort by
              </label>

              <select
                id="service-sort"
                value={sort}
                onChange={(event) => {
                  setSort(event.target.value);
                  setPage(1);
                }}
              >

                <option value="">
                  Recommended
                </option>

                <option value="price_asc">
                  Price: Low to High
                </option>

                <option value="price_desc">
                  Price: High to Low
                </option>

                <option value="rating_desc">
                  Highest Rated
                </option>

                <option value="newest">
                  Newest
                </option>

              </select>

            </div>

          </div>

          {/* SERVICE GRID */}

          {loading ? (

            <div className="user-services-inline-loading">
              Finding available services...
            </div>

          ) : services.length > 0 ? (

            <div className="user-services-grid">

              {services.map((service) => (

                <ServiceCard
                  key={service._id}
                  service={service}
                  onViewDetails={
                    handleViewDetails
                  }
                />

              ))}

            </div>

          ) : (

            <div className="user-services-no-results">

              <div className="user-services-no-results-icon">
                🔎
              </div>

              <h2>
                No services found
              </h2>

              <p>
                There are currently no approved
                services in this subcategory.
              </p>

              <button
                type="button"
                onClick={clearFilters}
              >
                Clear Filters
              </button>

            </div>

          )}

          {/* PAGINATION */}

          {pagination.totalPages > 1 && (

            <div className="user-services-pagination">

              <Pagination
                currentPage={page}
                totalPages={
                  pagination.totalPages
                }
                onPageChange={
                  handlePageChange
                }
              />

            </div>

          )}

        </main>

      </section>
    );
  };

  // ==========================================
  // MAIN PAGE
  // ==========================================

  return (
    <div className="user-services-page">

      {renderHero()}

      {/* ======================================
          CATEGORY LEVEL
      ====================================== */}

      {!selectedCategory &&
        renderCategories()}

      {/* ======================================
          SUBCATEGORY LEVEL
      ====================================== */}

      {selectedCategory &&
        !selectedSubCategory &&
        renderSubCategories()}

      {/* ======================================
          SERVICE LEVEL
      ====================================== */}

      {selectedCategory &&
        selectedSubCategory &&
        renderServices()}

    </div>
  );
};

export default UserServicesPage;