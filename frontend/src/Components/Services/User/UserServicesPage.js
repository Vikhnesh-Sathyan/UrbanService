import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getServices } from "../../../Services/userService";

import "../../../styles/UserServices.css";

const UserServicesPage = () => {

    const navigate = useNavigate();


  // ==========================================
  // STATE
  // ==========================================

  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);


  // ==========================================
  // LOAD SERVICES
  // ==========================================

  const loadServices = async () => {
    try {

      setLoading(true);

      const data = await getServices();

      console.log("APPROVED SERVICES:", data);

      setServices(data);

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
  // LOAD WHEN PAGE OPENS
  // ==========================================

  useEffect(() => {
    loadServices();
  }, []);


  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div>
        <h2>Loading services...</h2>
      </div>
    );
  }


  // ==========================================
  // UI
  // ==========================================

  return (
  <div className="user-services-page">

    <div className="user-services-header">
      <div>
        <span className="user-services-eyebrow">
          EXPLORE SERVICES
        </span>

        <h1>Available Services</h1>

        <p>
          Choose a service from our trusted providers.
        </p>
      </div>
    </div>

    {services.length === 0 ? (

      <div className="user-services-empty">
        <div className="user-empty-icon">⌁</div>

        <h2>No Services Available</h2>

        <p>
          There are currently no approved services.
        </p>
      </div>

    ) : (

      <div className="user-services-grid">

        {services.map((service) => (

          <div
            className="user-service-card"
            key={service._id}
          >

            <div className="user-service-image-wrapper">

              {service.image ? (
                <img
                  className="user-service-image"
                  src={`http://localhost:5000/uploads/${service.image}`}
                  alt={service.name}
                />
              ) : (
                <div className="user-service-image-placeholder">
                  Service
                </div>
              )}

              <span className="user-service-category">
                {service.category}
              </span>

            </div>


            <div className="user-service-body">

              <h2>
                {service.name}
              </h2>

              <p className="user-service-description">
                {service.description}
              </p>


              <div className="user-service-provider">

                <div className="user-provider-avatar">
                  {(service.provider?.name || "P")
                    .charAt(0)
                    .toUpperCase()}
                </div>

                <div>
                  <span>Service Provider</span>

                  <strong>
                    {service.provider?.name ||
                      "Unknown Provider"}
                  </strong>
                </div>

              </div>


              <div className="user-service-footer">

                <div className="user-service-price">
                  <span>Starting from</span>

                  <strong>
                    ₹{service.price}
                  </strong>
                </div>

                <button
                  type="button"
                  className="user-service-button"
                  onClick={() =>
                    navigate(
                      `/user/services/${service._id}`,
                      {
                        state: {
                          service,
                        },
                      }
                    )
                  }
                >
                  View Details
                  <span>→</span>
                </button>

              </div>

            </div>

          </div>

        ))}

      </div>

    )}

  </div>
);

};

export default UserServicesPage;