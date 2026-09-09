import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getServices } from "../../../Services/userService";

const ServiceDetails = () => {

  // ==========================================
  // ROUTER
  // ==========================================

  const { serviceId } = useParams();
  const navigate = useNavigate();


  // ==========================================
  // STATE
  // ==========================================

  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);


  // ==========================================
  // LOAD SERVICE
  // ==========================================

  const loadService = async () => {
    try {

      setLoading(true);

      const services = await getServices();

      const selectedService = services.find(
        (item) => item._id === serviceId
      );

      if (!selectedService) {
        setService(null);
        return;
      }

      console.log(
        "SELECTED SERVICE:",
        selectedService
      );

      setService(selectedService);

    } catch (error) {

      console.error(
        "Failed to load service:",
        error
      );

      setService(null);

    } finally {

      setLoading(false);

    }
  };


  // ==========================================
  // LOAD WHEN PAGE OPENS
  // ==========================================

  useEffect(() => {
    loadService();
  }, [serviceId]);


  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {

    return (
      <div>
        <h2>Loading service...</h2>
      </div>
    );

  }


  // ==========================================
  // SERVICE NOT FOUND
  // ==========================================

  if (!service) {

    return (
      <div>

        <h2>
          Service Not Found
        </h2>

        <p>
          This service may no longer be available.
        </p>

        <button
          type="button"
          onClick={() =>
            navigate("/user/services")
          }
        >
          Back to Services
        </button>

      </div>
    );

  }


  // ==========================================
  // UI
  // ==========================================

  return (

    <div>

      {/* ======================================
          BACK BUTTON
      ====================================== */}

      <button
        type="button"
        onClick={() =>
          navigate("/user/services")
        }
      >
        ← Back to Services
      </button>


      {/* ======================================
          SERVICE IMAGE
      ====================================== */}

      {service.image && (

        <img
          src={`http://localhost:5000/uploads/${service.image}`}
          alt={service.name}
          width="300"
        />

      )}


      {/* ======================================
          SERVICE INFORMATION
      ====================================== */}

      <h1>
        {service.name}
      </h1>

      <p>
        Category: {service.category}
      </p>

      <h2>
        ₹{service.price}
      </h2>

      <p>
        {service.description}
      </p>


      {/* ======================================
          DETAILED DESCRIPTION
      ====================================== */}

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


      {/* ======================================
          PROVIDER
      ====================================== */}

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


      {/* ======================================
          BOOK SERVICE
      ====================================== */}

      <button
  type="button"
  onClick={() =>
    navigate(`/user/services/${service._id}/book`, {
      state: {
        service,
      },
    })
  }
>
  Book Service

        Book Service
      </button>

    </div>

  );

};

export default ServiceDetails;