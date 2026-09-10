import React from "react";
import {
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";

import "../../../styles/UserServiceDetails.css";

const UserServiceDetails = () => {
  const { serviceId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  // Service passed from UserServicePage
  const service = location.state?.service;

  // ==========================================
  // SERVICE NOT FOUND
  // ==========================================

  if (!service) {
    return (
      <div className="service-details-page">
        <div className="service-not-found">

          <h2>Service Not Found</h2>

          <p>
            This service may no longer be available.
          </p>

          <button
            type="button"
            onClick={() => navigate("/user/services")}
          >
            ← Back to Services
          </button>

        </div>
      </div>
    );
  }

  // ==========================================
  // BOOK SERVICE
  // ==========================================

  const handleBookService = () => {
    navigate(`/user/services/${serviceId}/book`, {
      state: {
        service,
      },
    });
  };

  // ==========================================
  // PAGE
  // ==========================================

  return (
    <div className="service-details-page">

      {/* ======================================
          BACK BUTTON
      ====================================== */}

      <button
        type="button"
        className="service-details-back"
        onClick={() => navigate("/user/services")}
      >
        ← Back to Services
      </button>


      {/* ======================================
          MAIN SERVICE CARD
      ====================================== */}

      <div className="service-details-card">

        <div className="service-details-main">

          {/* ======================================
              SERVICE IMAGE
          ====================================== */}

          <div className="service-details-image">

            {service.image ? (
              <img
                src={`http://localhost:5000/uploads/${service.image}`}
                alt={service.name}
              />
            ) : (
              <div className="service-details-no-image">
                No Image
              </div>
            )}

          </div>


          {/* ======================================
              SERVICE INFORMATION
          ====================================== */}

          <div className="service-details-content">

            {/* CATEGORY */}

            <span className="service-details-category">
              {service.category || "Service"}
            </span>


            {/* SERVICE NAME */}

            <h1>
              {service.name}
            </h1>


            {/* PRICE */}

            <div className="service-details-price">

              <strong>
                ₹{service.price}
              </strong>

              <span>
                Starting price
              </span>

            </div>


            {/* DESCRIPTION */}

            <p className="service-details-description">
              {service.description ||
                "No description available for this service."}
            </p>


            {/* ==================================
                DETAILED DESCRIPTION
            ================================== */}

            {service.detailedDescription && (
              <div className="service-details-about">

                <h3>
                  About this Service
                </h3>

                <p>
                  {service.detailedDescription}
                </p>

              </div>
            )}


            {/* DIVIDER */}

            <div className="service-details-divider" />


            {/* ==================================
                PROVIDER
            ================================== */}

            <div className="service-provider-section">

              <div className="service-provider-title">
                Service Provider
              </div>

              <div className="service-provider">

                {/* PROVIDER AVATAR */}

                <div className="service-provider-avatar">
                  {service.provider?.name
                    ? service.provider.name.charAt(0).toUpperCase()
                    : "P"}
                </div>


                {/* PROVIDER INFORMATION */}

                <div className="service-provider-info">

                  <strong>
                    {service.provider?.name ||
                      "Unknown Provider"}
                  </strong>

                  <span>
                    {service.provider?.email ||
                      "Email not available"}
                  </span>

                </div>

              </div>

            </div>

            {/* ==========================================
    PROVIDER AVAILABILITY
========================================== */}

<div className="service-availability">

  <h3>
    Provider Availability
  </h3>

  {service.provider?.availability?.days?.length > 0 ? (

    <>
      <p>
        Available Days
      </p>

      <div className="availability-days">

        {service.provider.availability.days.map(
          (day) => (
            <span key={day}>
              {day}
            </span>
          )
        )}

      </div>

      <p>
        Working Hours
      </p>

      <strong>
        {service.provider.availability.startTime}
        {" — "}
        {service.provider.availability.endTime}
      </strong>
    </>

  ) : (

    <p>
      Provider availability is not configured.
    </p>

  )}

</div>

            {/* ==================================
                BOOK SERVICE
            ================================== */}

            <button
              type="button"
              className="service-book-button"
              onClick={handleBookService}
            >
              Book Service →
            </button>

          </div>

        </div>

      </div>


      {/* ======================================
          ABOUT SECTION
      ====================================== */}

      {service.detailedDescription && (
        <div className="service-about">

          <h3>
            About this Service
          </h3>

          <p>
            {service.detailedDescription}
          </p>

        </div>
      )}

    </div>
  );
};

export default UserServiceDetails;