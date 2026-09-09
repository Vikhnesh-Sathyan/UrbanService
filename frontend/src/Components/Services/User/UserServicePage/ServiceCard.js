import React from "react";

const ServiceCard = ({
  service,
  onViewDetails,
}) => {

  return (
    <div className="user-service-card">

      {/* ======================================
          IMAGE
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


        {/* CATEGORY */}

        <span className="user-service-category">
          {service.category}
        </span>

      </div>


      {/* ======================================
          BODY
      ====================================== */}

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


        {/* ====================================
            PROVIDER
        ==================================== */}

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


          {/* DETAILS BUTTON */}

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