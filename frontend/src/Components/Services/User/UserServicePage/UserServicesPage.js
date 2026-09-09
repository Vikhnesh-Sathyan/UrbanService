
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { getServices } from "../../../../Services/userService";

import ServiceCard from "./ServiceCard";
import ServiceFilters from "./ServiceFilters";
import Pagination from "./Pagination";

import "../../../../styles/UserServicesPage.css";


const UserServicePage = () => {

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


      // SEARCH

      if (search.trim()) {
        params.search = search.trim();
      }


      // CATEGORY

      if (category) {
        params.category = category;
      }


      // MIN PRICE

      if (minPrice !== "") {
        params.minPrice = minPrice;
      }


      // MAX PRICE

      if (maxPrice !== "") {
        params.maxPrice = maxPrice;
      }


      // RATING

      if (minRating !== "") {
        params.minRating = minRating;
      }


      // SORT

      if (sort) {
        params.sort = sort;
      }


      console.log("SERVICE QUERY:", params);


      const data = await getServices(params);


      console.log("SERVICES RESPONSE:", data);


      // SERVICES

      setServices(
        Array.isArray(data?.services)
          ? data.services
          : []
      );


      // PAGINATION

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
  // FETCH SERVICES
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
  // VIEW SERVICE DETAILS
  // ==========================================

  const handleViewDetails = (service) => {

    navigate(
      `/user/services/${service._id}`,
      {
        state: {
          service,
        },
      }
    );

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
  // PAGE
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


        <div className="user-services-count">

          <strong>
            {pagination.totalServices}
          </strong>

          <span>
            {" "}services available
          </span>

        </div>

      </div>


      {/* ======================================
          FILTERS
      ====================================== */}

      <ServiceFilters
        search={search}
        setSearch={setSearch}

        category={category}
        setCategory={setCategory}

        minPrice={minPrice}
        setMinPrice={setMinPrice}

        maxPrice={maxPrice}
        setMaxPrice={setMaxPrice}

        minRating={minRating}
        setMinRating={setMinRating}

        sort={sort}
        setSort={setSort}

        clearFilters={clearFilters}
      />


      {/* ======================================
          SERVICES
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

        <div className="user-services-grid">

          {services.map((service) => (

            <ServiceCard
              key={service._id}
              service={service}
              onViewDetails={handleViewDetails}
            />

          ))}

        </div>

      )}


      {/* ======================================
          PAGINATION
      ====================================== */}

      {pagination.totalPages > 1 && (

        <Pagination
          page={page}
          pagination={pagination}
          onPageChange={handlePageChange}
        />

      )}

    </div>

  );

};


export default UserServicePage;

