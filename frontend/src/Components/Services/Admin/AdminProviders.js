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
          : data?.providers || []
      );
    } catch (error) {
      console.error(
        "Failed to load providers:",
        error
      );

      setProviders([]);
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
        <div className="admin-loading-state">
          <div className="admin-loading-spinner"></div>
          <p>Loading providers...</p>
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
           PROVIDERS TABLE
        ======================================== */

        <div className="admin-providers-table-container">

          <div className="admin-providers-table">

            {/* ====================================
                TABLE HEADER
            ==================================== */}

            <div className="admin-table-header">

              <div>
                Provider
              </div>

              <div>
                Email
              </div>

              <div>
                Phone
              </div>

              <div>
                Status
              </div>

              <div>
                Services
              </div>

              <div>
                Role
              </div>

              <div>
                Action
              </div>

            </div>

            {/* ====================================
                TABLE ROWS
            ==================================== */}

            {providers.map((provider) => {

              const serviceCount =
                Array.isArray(provider.services)
                  ? provider.services.length
                  : 0;

              const isActive =
                provider.isActive !== false;

              return (

                <div
                  className="admin-table-row"
                  key={provider._id}
                >

                  {/* PROVIDER */}

                  <div className="provider-table-info">

                    <div className="provider-table-avatar">
                      👤
                    </div>

                    <div className="provider-table-name">

                      <h3>
                        {provider.name ||
                          "Unknown Provider"}
                      </h3>

                      <span>
                        Provider Account
                      </span>

                    </div>

                  </div>

                  {/* EMAIL */}

                  <div className="provider-table-email">

                    {provider.email ||
                      "No email"}

                  </div>

                  {/* PHONE */}

                  <div className="provider-table-phone">

                    {provider.phone ||
                      "No phone"}

                  </div>

                  {/* STATUS */}

                  <div>

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

                  {/* SERVICES */}

                  <div className="provider-table-services">

                    <strong>
                      {serviceCount}
                    </strong>

                  </div>

                  {/* ROLE */}

                  <div>

                    <span className="provider-role">
                      Service Provider
                    </span>

                  </div>

                  {/* ACTION */}

                  <div className="provider-table-action">

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

        </div>

      )}

    </section>
  );
};

export default AdminProviders;