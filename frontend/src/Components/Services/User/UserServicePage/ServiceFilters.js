import React from "react";

const ServiceFilters = ({
  search,
  setSearch,
  category,
  setCategory,
  minPrice,
  setMinPrice,
  maxPrice,
  setMaxPrice,
  minRating,
  setMinRating,
  sort,
  setSort,
  clearFilters,
}) => {
  return (
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
  );
};

export default ServiceFilters;