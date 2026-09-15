import React from "react";

const ServiceFilters = ({
  category,
  setCategory,

  provider,
  providers,
  setProvider,

  minPrice,
  setMinPrice,
  maxPrice,
  setMaxPrice,

  minRating,
  setMinRating,
}) => {
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

            <span>
              ₹0
            </span>

            <strong>
              {maxPrice
                ? `₹${Number(maxPrice).toLocaleString()}`
                : "Any Price"}
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
          SERVICE PROVIDER
      ====================================== */}

      <div className="user-filter-section">

        <div className="user-filter-title">
          SERVICE PROVIDER
        </div>

        <div className="user-filter-field">

          <select
            value={provider}
            onChange={(e) => {
              setProvider(e.target.value);
            }}
          >

            <option value="">
              All Providers
            </option>

        {providers?.map((item) => {
  console.log("PROVIDER OPTION:", item);

  return (
    <option key={item.id} value={item.id}>
      {item.name}
    </option>
  );
})}

          </select>

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