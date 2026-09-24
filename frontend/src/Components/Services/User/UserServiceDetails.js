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
  // PROVIDER DATA
  // ==========================================

  const providerName =
    service.provider?.name || "Unknown Provider";

  const providerEmail =
    service.provider?.email || "Email not available";

  const providerAvailability =
    service.provider?.availability;

  const availableDays =
    providerAvailability?.days || [];

  const startTime =
    providerAvailability?.startTime;

  const endTime =
    providerAvailability?.endTime;

  // ==========================================
  // BOOK SERVICE
  // ==========================================
const handleBookService = () => {
  const token = localStorage.getItem("token");
  const storedUser = localStorage.getItem("user");

  // =====================================================
  // NOT LOGGED IN
  // =====================================================

  if (!token) {
    alert("Please login to book this service.");
    navigate("/login");
    return;
  }

  try {
    // ===================================================
    // CHECK JWT EXPIRY
    // ===================================================

    const payload = JSON.parse(
      atob(token.split(".")[1])
    );

    if (
      payload.exp &&
      payload.exp * 1000 < Date.now()
    ) {
      localStorage.removeItem("token");
      localStorage.removeItem("isLoggedIn");
      localStorage.removeItem("user");

      alert(
        "Your session has expired. Please login again."
      );

      navigate("/login");
      return;
    }

    // ===================================================
    // CHECK USER ROLE
    // ===================================================

    if (storedUser) {
      const user = JSON.parse(storedUser);

      if (
        user.role &&
        user.role !== "user"
      ) {
        alert(
          "Only customers can book services."
        );

        return;
      }
    }

    // ===================================================
    // CUSTOMER → BOOKING PAGE
    // ===================================================

    navigate(
      `/user/services/${serviceId}/book`,
      {
        state: {
          service,
        },
      }
    );

  } catch (error) {

    console.error(
      "Book service authentication error:",
      error
    );

    localStorage.removeItem("token");
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("user");

    alert(
      "Please login to book this service."
    );

    navigate("/login");
  }
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
          SERVICE DETAILS CARD
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
                  {providerName
                    .charAt(0)
                    .toUpperCase()}
                </div>


                {/* PROVIDER INFORMATION */}

                <div className="service-provider-info">

                  <strong>
                    {providerName}
                  </strong>

                  <span>
                    {providerEmail}
                  </span>

                </div>

              </div>

            </div>


            {/* ==================================
                PROVIDER AVAILABILITY
            ================================== */}

            <div className="service-availability">

              <h3>
                Provider Availability
              </h3>

              {availableDays.length > 0 ? (

                <>

                  {/* AVAILABLE DAYS */}

                  <p>
                    Available Days
                  </p>

                  <div className="availability-days">

                    {availableDays.map((day) => (

                      <span key={day}>
                        {day}
                      </span>

                    ))}

                  </div>


                  {/* WORKING HOURS */}

                  <p>
                    Working Hours
                  </p>

                  {startTime && endTime ? (

                    <strong>
                      {startTime}
                      {" — "}
                      {endTime}
                    </strong>

                  ) : (

                    <span>
                      Working hours not configured.
                    </span>

                  )}

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

    </div>
  );
};

export default UserServiceDetails;