import React, {
  useEffect,
  useState,
} from "react";

import { useNavigate } from "react-router-dom";

import { getServices } from "../../../Services/userService";

import "../../../styles/UserServicesPage.css";


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


      // Search

      if (search.trim()) {
        params.search = search.trim();
      }


      // Category

      if (category) {
        params.category = category;
      }


      // Minimum price

      if (minPrice !== "") {
        params.minPrice = minPrice;
      }


      // Maximum price

      if (maxPrice !== "") {
        params.maxPrice = maxPrice;
      }


      // Rating

      if (minRating !== "") {
        params.minRating = minRating;
      }


      // Sorting

      if (sort) {
        params.sort = sort;
      }


      console.log(
        "SERVICE QUERY:",
        params
      );


      const data = await getServices(params);


      console.log(
        "APPROVED SERVICES:",
        data
      );


      setServices(
        Array.isArray(data?.services)
          ? data.services
          : []
      );


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

    } finally {

      setLoading(false);

    }

  };


  // ==========================================
  // LOAD SERVICES
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
  ]);


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

    setPage(1);

  };


  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {

    return (
      <div className="user-services-page">

        <div className="user-services-empty">

          <div className="user-empty-icon">
            ◈
          </div>

          <h2>
            Loading services...
          </h2>

          <p>
            Finding trusted professionals for you.
          </p>

        </div>

      </div>
    );

  }


  // ==========================================
  // UI
  // ==========================================

  return (

    <div className="user-services-page">


      {/* ======================================
          HEADER
      ====================================== */}

      <div className="user-services-header">

        <div>

          <span className="user-services-eyebrow">
            SERVICE MARKETPLACE
          </span>

          <h1>
            Available Services
          </h1>

          <p>
            Discover trusted professionals
            for your needs.
          </p>

        </div>


        <div>

          <strong>
            {pagination.totalServices}
          </strong>

          <span>
            {" "}services available
          </span>

        </div>

      </div>


      {/* ======================================
          FILTER SECTION
      ====================================== */}

      <div className="user-services-filters">


        {/* SEARCH */}

        <div className="user-filter-field">

          <label>
            Search
          </label>

          <input
            type="text"
            placeholder="Search services..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />

        </div>


        {/* CATEGORY */}

        <div className="user-filter-field">

          <label>
            Category
          </label>

          <select
            value={category}
            onChange={(e) => {
              setCategory(e.target.value);
              setPage(1);
            }}
          >

            <option value="">
              All Categories
            </option>

            <option value="Electrical">
              Electrical
            </option>

            <option value="Plumbing">
              Plumbing
            </option>

            <option value="Cleaning">
              Cleaning
            </option>

            <option value="Beauty">
              Beauty
            </option>

            <option value="AC Repair">
              AC Repair
            </option>

          </select>

        </div>


        {/* MIN PRICE */}

        <div className="user-filter-field">

          <label>
            Min Price
          </label>

          <input
            type="number"
            placeholder="₹ Min"
            value={minPrice}
            onChange={(e) => {
              setMinPrice(e.target.value);
              setPage(1);
            }}
          />

        </div>


        {/* MAX PRICE */}

        <div className="user-filter-field">

          <label>
            Max Price
          </label>

          <input
            type="number"
            placeholder="₹ Max"
            value={maxPrice}
            onChange={(e) => {
              setMaxPrice(e.target.value);
              setPage(1);
            }}
          />

        </div>


        {/* RATING */}

        <div className="user-filter-field">

          <label>
            Rating
          </label>

          <select
            value={minRating}
            onChange={(e) => {
              setMinRating(e.target.value);
              setPage(1);
            }}
          >

            <option value="">
              Any Rating
            </option>

            <option value="4">
              ⭐ 4+
            </option>

            <option value="3">
              ⭐ 3+
            </option>

            <option value="2">
              ⭐ 2+
            </option>

          </select>

        </div>


        {/* SORT */}

        <div className="user-filter-field">

          <label>
            Sort
          </label>

          <select
            value={sort}
            onChange={(e) => {
              setSort(e.target.value);
              setPage(1);
            }}
          >

            <option value="">
              Newest
            </option>

            <option value="rating">
              Highest Rated
            </option>

            <option value="price_low">
              Price: Low to High
            </option>

            <option value="price_high">
              Price: High to Low
            </option>

          </select>

        </div>


        {/* CLEAR */}

        <button
          type="button"
          className="user-clear-filter"
          onClick={clearFilters}
        >
          Clear
        </button>

      </div>


      {/* ======================================
          NO SERVICES
      ====================================== */}

      {services.length === 0 ? (

        <div className="user-services-empty">

          <div className="user-empty-icon">
            ◈
          </div>

          <h2>
            No Services Found
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

      ) : (


        <>
          {/* ==================================
              SERVICE GRID
          ================================== */}

          <div className="user-services-grid">

            {services.map((service) => (

              <div
                className="user-service-card"
                key={service._id}
              >


                {/* IMAGE */}

                <div className="user-service-image-wrapper">

                  {service.image ? (

                    <img
                      className="user-service-image"
                      src={`http://localhost:5000/uploads/${service.image}`}
                      alt={service.name}
                    />

                  ) : (

                    <div className="user-service-image-placeholder">
                      No Image
                    </div>

                  )}


                  {/* CATEGORY */}

                  <span className="user-service-category">
                    {service.category}
                  </span>

                </div>


                {/* BODY */}

                <div className="user-service-body">


                  {/* NAME */}

                  <h2>
                    {service.name}
                  </h2>


                  {/* DESCRIPTION */}

                  <p className="user-service-description">

                    {service.description ||
                      "Professional service from a trusted provider."}

                  </p>


                  {/* PROVIDER */}

                  <div className="user-service-provider">

                    <div className="user-provider-avatar">

                      {service.provider?.name
                        ?.charAt(0)
                        ?.toUpperCase() || "P"}

                    </div>


                    <div>

                      <span>
                        SERVICE PROVIDER
                      </span>

                      <strong>
                        {service.provider?.name ||
                          "Unknown Provider"}
                      </strong>

                    </div>

                  </div>


                  {/* FOOTER */}

                  <div className="user-service-footer">


                    {/* PRICE */}

                    <div className="user-service-price">

                      <span>
                        Starting from
                      </span>

                      <strong>
                        ₹{service.price}
                      </strong>

                    </div>


                    {/* BUTTON */}

                    <button
                      type="button"
                      className="user-service-button"
                      onClick={() =>
                        navigate(
                          `/user/services/${service._id}`,
                          {
                            state: {
                              service,
                            },
                          }
                        )
                      }
                    >

                      View Details

                      <span>
                        →
                      </span>

                    </button>

                  </div>

                </div>

              </div>

            ))}

          </div>


          {/* ==================================
              PAGINATION
          ================================== */}

          {pagination.totalPages > 1 && (

            <div className="user-pagination">

              <button
                type="button"
                disabled={
                  !pagination.hasPreviousPage
                }
                onClick={() =>
                  handlePageChange(page - 1)
                }
              >
                ← Previous
              </button>


              <div className="user-pagination-pages">

                {Array.from(
                  {
                    length:
                      pagination.totalPages,
                  },
                  (_, index) => index + 1
                ).map((pageNumber) => (

                  <button
                    key={pageNumber}
                    type="button"
                    className={
                      pageNumber === page
                        ? "active"
                        : ""
                    }
                    onClick={() =>
                      handlePageChange(
                        pageNumber
                      )
                    }
                  >
                    {pageNumber}
                  </button>

                ))}

              </div>


              <button
                type="button"
                disabled={
                  !pagination.hasNextPage
                }
                onClick={() =>
                  handlePageChange(page + 1)
                }
              >
                Next →
              </button>

            </div>

          )}

        </>

      )}

    </div>

  );

};


export default UserServicesPage;