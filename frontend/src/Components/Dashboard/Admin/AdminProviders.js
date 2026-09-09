import React, { useEffect, useState } from "react";
import { getProviders } from "../../../Services/providerService";
import "../../../styles/AdminProviders.css";

const AdminProviders = () => {

  // ========================================
  // STATE
  // ========================================

  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Selected provider for View modal
  const [selectedProvider, setSelectedProvider] = useState(null);


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
  // OPEN PROVIDER DETAILS
  // ========================================

  const handleViewProvider = (provider) => {

    console.log(
      "SELECTED PROVIDER:",
      provider
    );

    setSelectedProvider(provider);

  };


  // ========================================
  // CLOSE PROVIDER DETAILS
  // ========================================

  const handleCloseProvider = () => {

    setSelectedProvider(null);

  };


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
  // UI
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
           PROVIDER GRID
        ======================================== */

        <div className="admin-providers-grid">

          {providers.map((provider) => (

            <div
              className="admin-provider-card"
              key={provider._id}
            >

              {/* PROVIDER ICON */}

              <div className="provider-card-icon">
                👤
              </div>


              {/* PROVIDER INFORMATION */}

              <div className="provider-card-info">

                <h3>
                  {provider.name || "Unknown Provider"}
                </h3>

                <p>
                  {provider.email || "No email"}
                </p>

                <span className="provider-role">
                  Provider
                </span>

              </div>


              {/* ACTIONS */}

              <div className="provider-card-actions">

                <button
                  type="button"
                  className="provider-view-btn"
                  onClick={() =>
                    handleViewProvider(provider)
                  }
                >
                  View
                </button>

              </div>

            </div>

          ))}

        </div>

      )}


      {/* ========================================
          PROVIDER DETAILS MODAL
      ======================================== */}

      {selectedProvider && (

        <div
          className="provider-modal-overlay"
          onClick={handleCloseProvider}
        >

          <div
            className="provider-modal"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            {/* MODAL HEADER */}

            <div className="provider-modal-header">

              <div>

                <span className="admin-label">
                  PROVIDER DETAILS
                </span>

                <h2>
                  Provider Details
                </h2>

              </div>

              <button
                type="button"
                className="provider-modal-close"
                onClick={handleCloseProvider}
              >
                ×
              </button>

            </div>


            {/* PROVIDER DETAILS */}

            <div className="provider-details">

              {/* NAME */}

              <div className="provider-detail-row">

                <span className="provider-detail-label">
                  Name
                </span>

                <strong>
                  {selectedProvider.name ||
                    "Unknown"}
                </strong>

              </div>


              {/* EMAIL */}

              <div className="provider-detail-row">

                <span className="provider-detail-label">
                  Email
                </span>

                <strong>
                  {selectedProvider.email ||
                    "Unknown"}
                </strong>

              </div>


              {/* ROLE */}

              <div className="provider-detail-row">

                <span className="provider-detail-label">
                  Role
                </span>

                <span className="provider-role">
                  Provider
                </span>

              </div>


              {/* ACCOUNT STATUS */}

              <div className="provider-detail-row">

                <span className="provider-detail-label">
                  Account Status
                </span>

                <span className="provider-status-active">
                  Active
                </span>

              </div>


              {/* SERVICES */}

              <div className="provider-services-section">

                <h3>
                  Services
                </h3>

                <div className="provider-services-list">

                  {Array.isArray(
                    selectedProvider.services
                  ) &&
                  selectedProvider.services.length > 0 ? (

                    selectedProvider.services.map(
                      (service, index) => (

                        <div
                          className="provider-service-item"
                          key={
                            service._id ||
                            index
                          }
                        >

                          {typeof service ===
                          "string"
                            ? service
                            : service.name ||
                              "Unknown Service"}

                        </div>

                      )
                    )

                  ) : (

                    <p className="no-provider-services">
                      No services found.
                    </p>

                  )}

                </div>

              </div>

            </div>


            {/* MODAL FOOTER */}

            <div className="provider-modal-footer">

              <button
                type="button"
                className="provider-modal-close-btn"
                onClick={handleCloseProvider}
              >
                Close
              </button>

            </div>

          </div>

        </div>

      )}

    </section>

  );

};

export default AdminProviders;