import React, { useEffect, useState } from "react";
import { getServices } from "../../../Services/userService";

const UserServicesPage = () => {

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
    <div>

      <h1>Available Services</h1>

      <p>
        Choose a service from our trusted providers.
      </p>


      {/* ==========================================
          NO SERVICES
      ========================================== */}

      {services.length === 0 ? (

        <div>
          <h2>No Services Available</h2>

          <p>
            There are currently no approved services.
          </p>
        </div>

      ) : (

        /* ==========================================
           SERVICE LIST
        ========================================== */

        <div>

          {services.map((service) => (

            <div
              key={service._id}
            >

              {/* IMAGE */}

              {service.image && (
                <img
                  src={`http://localhost:5000/uploads/${service.image}`}
                  alt={service.name}
                  width="200"
                />
              )}


              {/* NAME */}

              <h2>
                {service.name}
              </h2>


              {/* CATEGORY */}

              <p>
                {service.category}
              </p>


              {/* DESCRIPTION */}

              <p>
                {service.description}
              </p>


              {/* PRICE */}

              <h3>
                ₹{service.price}
              </h3>


              {/* PROVIDER */}

              <p>
                Provider:{" "}
                {service.provider?.name ||
                  "Unknown Provider"}
              </p>


              {/* VIEW BUTTON */}

              <button
                type="button"
              >
                View Details
              </button>

            </div>

          ))}

        </div>

      )}

    </div>
  );
};

export default UserServicesPage;