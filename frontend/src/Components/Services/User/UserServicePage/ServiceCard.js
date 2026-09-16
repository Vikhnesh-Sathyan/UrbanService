import React from "react";

const ServiceCard = ({
  service,
  onViewDetails,
}) => {

  // ==========================================
  // RATING
  // ==========================================

  const averageRating = Number(
    service.averageRating || 0
  );

  const totalReviews = Number(
    service.totalReviews || 0
  );


  return (
    <div className="user-service-card">

      {/* ======================================
          SERVICE IMAGE
      ====================================== */}

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


        {/* DARK IMAGE OVERLAY */}

        <div className="user-service-image-overlay"></div>


        {/* ====================================
            CATEGORY
        ==================================== */}

        <span className="user-service-category">
          {service.category}
        </span>


        {/* ====================================
            SERVICE TAG
        ==================================== */}

        {service.tag && (

          <span
            className={`user-service-tag user-service-tag-${service.tag
              .toLowerCase()
              .replace(/\s+/g, "-")}`}
          >
            {service.tag}
          </span>

        )}


        {/* ====================================
            IMAGE CONTENT
        ==================================== */}

        <div className="user-service-image-content">

          <h2>
            {service.name}
          </h2>

          <p>
            {service.description ||
              "Professional service from a trusted provider."}
          </p>


          {/* RATING */}

          <div className="user-service-rating">

            {totalReviews > 0 ? (

              <>
                <span className="user-service-star">
                  ★
                </span>

                <strong>
                  {averageRating.toFixed(1)}
                </strong>

                <span className="user-service-review-count">
                  ({totalReviews} review{totalReviews !== 1 ? "s" : ""})
                </span>
              </>

            ) : (

              <span className="user-service-no-rating">
                ⭐ New
              </span>

            )}

          </div>

        </div>

      </div>


      {/* ======================================
          CARD INFORMATION
      ====================================== */}

      <div className="user-service-body">


        {/* ====================================
            FOOTER
        ==================================== */}

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


          {/* VIEW DETAILS */}

          <button
            type="button"
            className="user-service-button"
            onClick={() =>
              onViewDetails(service)
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
  );
};

export default ServiceCard;