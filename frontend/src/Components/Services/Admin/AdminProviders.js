import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { getProviders } from "../../../Services/providerService";
import "../../../styles/AdminProviders.css";

const AdminProviders = () => {

  const navigate = useNavigate();

  // ========================================
  // STATE
  // ========================================

  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);


  // ========================================
  // LOAD PROVIDERS
  // ========================================

  const loadProviders = async () => {
    try {

      setLoading(true);

      const data = await getProviders();

      console.log("PROVIDERS:", data);

      setProviders(
        Array.isArray(data)
          ? data
          : data.providers || []
      );

    } catch (error) {

      console.error(
        "Failed to load providers:",
        error
      );

    } finally {

      setLoading(false);

    }
  };


  // ========================================
  // LOAD ON PAGE OPEN
  // ========================================

  useEffect(() => {
    loadProviders();
  }, []);


  // ========================================
  // LOADING
  // ========================================

  if (loading) {

    return (
      <section className="admin-providers-section">

        <div className="admin-empty-state">

          <h3>
            Loading providers...
          </h3>

        </div>

      </section>
    );

  }


  // ========================================
  // PAGE
  // ========================================

  return (

    <section className="admin-providers-section">

      {/* ========================================
          HEADER
      ======================================== */}

      <div className="admin-section-header">

        <div>

          <span className="admin-label">
            PROVIDER MANAGEMENT
          </span>

          <h2>
            Service Providers
          </h2>

          <p>
            View and manage registered service providers.
          </p>

        </div>

      </div>


      {/* ========================================
          NO PROVIDERS
      ======================================== */}

      {providers.length === 0 ? (

        <div className="admin-empty-state">

          <div className="admin-empty-icon">
            👥
          </div>

          <h3>
            No Providers Found
          </h3>

          <p>
            Registered providers will appear here.
          </p>

        </div>

      ) : (

        /* ========================================
           PROVIDER LIST
        ======================================== */

        <div className="admin-providers-grid">

          {providers.map((provider) => {

            const serviceCount =
              Array.isArray(provider.services)
                ? provider.services.length
                : 0;

            const isActive =
              provider.isActive !== false;

            return (

              <div
                className="admin-provider-card"
                key={provider._id}
              >

                {/* =================================
                    PROVIDER ICON
                ================================= */}

                <div className="provider-card-icon">
                  👤
                </div>


                {/* =================================
                    PROVIDER INFORMATION
                ================================= */}

                <div className="provider-card-info">

                  <h3>
                    {provider.name ||
                      "Unknown Provider"}
                  </h3>

                  <p>
                    {provider.email ||
                      "No email"}
                  </p>

                  <span className="provider-role">
                    Provider
                  </span>

                </div>


                {/* =================================
                    STATUS
                ================================= */}

                <div className="provider-card-status">

                  <span className="provider-status-label">
                    STATUS
                  </span>

                  <span
                    className={
                      isActive
                        ? "provider-status-active"
                        : "provider-status-inactive"
                    }
                  >
                    {isActive
                      ? "Active"
                      : "Blocked"}
                  </span>

                </div>


                {/* =================================
                    SERVICE COUNT
                ================================= */}

                <div className="provider-card-services">

                  <span>
                    SERVICES
                  </span>

                  <strong>
                    {serviceCount}
                  </strong>

                </div>


                {/* =================================
                    VIEW DETAILS
                ================================= */}

                <div className="provider-card-actions">

                  <button
                    type="button"
                    className="provider-view-btn"
                    onClick={() =>
                      navigate(
                        `/admin/providers/${provider._id}`
                      )
                    }
                  >
                    View Details
                  </button>

                </div>

              </div>

            );

          })}

        </div>

      )}

    </section>

  );

};

export default AdminProviders;