import React from "react";
import {
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";

const UserServiceDetails = () => {
  const { serviceId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  // Service comes from UserServicePage
  const service = location.state?.service;

  // ==========================================
  // SERVICE NOT FOUND
  // ==========================================

  if (!service) {
    return (
      <div>
        <h2>Service Not Found</h2>

        <p>
          This service may no longer be available.
        </p>

        <button
          type="button"
          onClick={() => navigate("/user/services")}
        >
          Back to Services
        </button>
      </div>
    );
  }

  // ==========================================
  // BOOK SERVICE
  // ==========================================

  const handleBookService = () => {
    navigate(
      `/user/services/${serviceId}/book`,
      {
        state: {
          service,
        },
      }
    );
  };

  // ==========================================
  // PAGE
  // ==========================================

  return (
    <div>

      {/* BACK */}

      <button
        type="button"
        onClick={() => navigate("/user/services")}
      >
        ← Back to Services
      </button>


      {/* IMAGE */}

      {service.image && (
        <img
          src={`http://localhost:5000/uploads/${service.image}`}
          alt={service.name}
          width="300"
        />
      )}


      {/* SERVICE */}

      <h1>
        {service.name}
      </h1>


      {/* CATEGORY */}

      <p>
        Category: {service.category}
      </p>


      {/* PRICE */}

      <h2>
        ₹{service.price}
      </h2>


      {/* DESCRIPTION */}

      <p>
        {service.description}
      </p>


      {/* DETAILED DESCRIPTION */}

      {service.detailedDescription && (
        <div>
          <h3>
            About this Service
          </h3>

          <p>
            {service.detailedDescription}
          </p>
        </div>
      )}


      {/* PROVIDER */}

      <div>

        <h3>
          Service Provider
        </h3>

        <p>
          Name:{" "}
          {service.provider?.name ||
            "Unknown Provider"}
        </p>

        <p>
          Email:{" "}
          {service.provider?.email ||
            "Not available"}
        </p>

      </div>


      {/* BOOK */}

      <button
        type="button"
        onClick={handleBookService}
      >
        Book Service
      </button>

    </div>
  );
};

export default UserServiceDetails;