import React from "react";

const ServiceFilters = ({
  category,
  setCategory,
  minPrice,
  setMinPrice,
  maxPrice,
  setMaxPrice,
  minRating,
  setMinRating,
}) => {
  // ==========================================
  // PRICE RANGE
  // ==========================================

  const handlePriceRange = (value) => {
    switch (value) {
      case "":
        setMinPrice("");
        setMaxPrice("");
        break;

      case "0-500":
        setMinPrice("0");
        setMaxPrice("500");
        break;

      case "500-1000":
        setMinPrice("500");
        setMaxPrice("1000");
        break;

      case "1000-2000":
        setMinPrice("1000");
        setMaxPrice("2000");
        break;

      case "2000-5000":
        setMinPrice("2000");
        setMaxPrice("5000");
        break;

      case "5000+":
        setMinPrice("5000");
        setMaxPrice("");
        break;

      default:
        setMinPrice("");
        setMaxPrice("");
    }
  };

  // Current selected price range
  const getPriceRange = () => {
    if (minPrice === "0" && maxPrice === "500") {
      return "0-500";
    }

    if (minPrice === "500" && maxPrice === "1000") {
      return "500-1000";
    }

    if (minPrice === "1000" && maxPrice === "2000") {
      return "1000-2000";
    }

    if (minPrice === "2000" && maxPrice === "5000") {
      return "2000-5000";
    }

    if (minPrice === "5000" && maxPrice === "") {
      return "5000+";
    }

    return "";
  };

  return (
    <div className="user-services-filters">

      {/* ======================================
          CATEGORY
      ====================================== */}

      <div className="user-filter-section">

        <div className="user-filter-title">
          CATEGORY
        </div>

        <div className="user-filter-field">

          <select
            value={category}
            onChange={(e) => {
              setCategory(e.target.value);
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

      </div>

{/* ======================================
    PRICE RANGE
====================================== */}

<div className="user-filter-section">

  <div className="user-filter-title">
    PRICE RANGE
  </div>

  <div className="user-price-range">

    <div className="user-price-values">
      <span>₹0</span>
      <strong>
        {maxPrice ? `₹${Number(maxPrice).toLocaleString()}` : "Any Price"}
      </strong>
    </div>

    <input
      type="range"
      min="0"
      max="5000"
      step="100"
      value={maxPrice || 5000}
      onChange={(e) => {
        const value = Number(e.target.value);

        setMinPrice("");

        if (value === 5000) {
          setMaxPrice("");
        } else {
          setMaxPrice(String(value));
        }
      }}
      className="user-price-slider"
    />

  </div>

</div>


      {/* ======================================
          RATING
      ====================================== */}

      <div className="user-filter-section">

        <div className="user-filter-title">
          RATING
        </div>

        <div className="user-filter-field">

          <select
            value={minRating}
            onChange={(e) => {
              setMinRating(e.target.value);
            }}
          >
            <option value="">
              Any Rating
            </option>

            <option value="4">
              ⭐ 4+ & above
            </option>

            <option value="3">
              ⭐ 3+ & above
            </option>

            <option value="2">
              ⭐ 2+ & above
            </option>

          </select>

        </div>

      </div>

    </div>
  );
};

export default ServiceFilters;