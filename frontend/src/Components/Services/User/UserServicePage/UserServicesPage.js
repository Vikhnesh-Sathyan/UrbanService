import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaSearch, FaSlidersH } from "react-icons/fa";

import { getServices } from "../../../../Services/userService";
import ServiceCard from "./ServiceCard";
import ServiceFilters from "./ServiceFilters";
import Pagination from "./Pagination";

import "../../../../styles/UserServicesPage.css";

const UserServicesPage = () => {
  const navigate = useNavigate();

  // ==========================================
  // SERVICES
  // ==========================================

  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

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
  const [category, setCategory] = useState("");

  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const [minRating, setMinRating] = useState("");
  const [sort, setSort] = useState("");

  // Provider filter
  const [provider, setProvider] = useState("");
  const [providers, setProviders] = useState([]);

  const [availability, setAvailability] = useState("");

  // ==========================================
  // LOAD ALL PROVIDERS
  // ==========================================
  // This is separate from services.
  // Therefore selecting one provider will NOT
  // remove the other providers from the dropdown.

  const loadProviders = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/users/providers",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const providerList = Array.isArray(response.data?.providers)
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
      console.error("Failed to load providers:", error);
      setProviders([]);
    }
  };

  // ==========================================
  // LOAD SERVICES
  // ==========================================

  const loadServices = async () => {
    try {
      setLoading(true);

      const params = {
        page,
        limit: 9,
      };

      // ========================================
      // SEARCH
      // ========================================

      if (search.trim()) {
        params.search = search.trim();
      }

      // ========================================
      // CATEGORY
      // ========================================

      if (category) {
        params.category = category;
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
      console.error("Failed to load services:", error);

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
  // LOAD PROVIDERS ONCE
  // ==========================================

  useEffect(() => {
    loadProviders();
  }, []);

  // ==========================================
  // LOAD SERVICES WHEN FILTER CHANGES
  // ==========================================

  useEffect(() => {
    loadServices();
  }, [
    page,
    search,
    category,
    minPrice,
    maxPrice,
    minRating,
    sort,
    provider,
    availability,
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
    setCategory("");
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
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="user-services-page">

        <div className="user-services-loading">

          <div className="user-services-loading-spinner"></div>

          <h2>Finding services...</h2>

          <p>
            Discovering trusted professionals
            near you.
          </p>

        </div>

      </div>
    );
  }

  // ==========================================
  // PAGE
  // ==========================================

  return (
    <div className="user-services-page">

      {/* ======================================
          HERO / HEADER
      ====================================== */}

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
            Available Services
          </h1>

          <p>
            Discover trusted professionals for your everyday needs.
          </p>

        </div>

        {/* SEARCH */}

        <div className="user-services-search">

          <FaSearch />

          <input
            type="text"
            value={search}
            onChange={handleSearchChange}
            placeholder="Search for a service..."
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

        {/* TRUST ITEMS */}

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


      {/* ======================================
          MARKETPLACE CONTENT
      ====================================== */}

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


          {/* FILTERS */}

          <ServiceFilters

            category={category}

            setCategory={(value) => {
              setCategory(value);
              setPage(1);
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

          {/* RESULTS HEADER */}

          <div className="user-services-results-header">

            <div>

              <span className="user-services-results-label">
                SERVICES
              </span>

              <h2>
                {pagination.totalServices}{" "}
                services available
              </h2>

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


          {/* ====================================
              SERVICE GRID
          ==================================== */}

          {services.length > 0 ? (

            <div className="user-services-grid">

              {services.map((service) => (

                <ServiceCard
                  key={service._id}
                  service={service}
                  onViewDetails={handleViewDetails}
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
                Try changing your search or filters.
              </p>

              <button
                type="button"
                onClick={clearFilters}
              >
                Clear Filters
              </button>

            </div>

          )}


          {/* ====================================
              PAGINATION
          ==================================== */}

          {pagination.totalPages > 1 && (

            <div className="user-services-pagination">

              <Pagination
                currentPage={page}
                totalPages={pagination.totalPages}
                onPageChange={handlePageChange}
              />

            </div>

          )}

        </main>

      </section>

    </div>
  );
};

export default UserServicesPage;