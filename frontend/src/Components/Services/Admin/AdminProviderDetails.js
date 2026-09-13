import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

import "../../../styles/AdminProviderDetails.css";

const AdminProviderDetails = () => {

  const { providerId } = useParams();
  const navigate = useNavigate();

  const [provider, setProvider] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchProvider();
  }, [providerId]);

  const fetchProvider = async () => {
    try {

      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      const response = await axios.get(
        `http://localhost:5000/api/users/providers/${providerId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(
        "PROVIDER DETAILS:",
        response.data
      );

      setProvider(response.data.provider);

    } catch (error) {

      console.error(
        "Fetch provider details error:",
        error
      );

      setError(
        error.response?.data?.message ||
        "Failed to load provider details."
      );

    } finally {

      setLoading(false);

    }
  };

  if (loading) {
    return (
      <section className="admin-provider-details-page">
        <div className="admin-provider-details-loading">
          Loading provider details...
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="admin-provider-details-page">
        <div className="admin-provider-details-error">

          <h2>
            Unable to Load Provider
          </h2>

          <p>
            {error}
          </p>

          <button
            onClick={() => navigate("/admin/providers")}
          >
            Back to Providers
          </button>

        </div>
      </section>
    );
  }

  if (!provider) {
    return null;
  }

  return (
    <section className="admin-provider-details-page">

      {/* HEADER */}

      <div className="admin-provider-details-header">

        <button
          type="button"
          className="admin-provider-back-btn"
          onClick={() =>
            navigate("/admin/providers")
          }
        >
          ← Back to Providers
        </button>

        <div className="admin-provider-title">

          <div className="admin-provider-avatar">
            {provider.name
              ?.charAt(0)
              ?.toUpperCase() || "P"}
          </div>

          <div>

            <span className="admin-label">
              PROVIDER DETAILS
            </span>

            <h1>
              {provider.name || "Unknown Provider"}
            </h1>

            <p>
              {provider.email || "No email"}
            </p>

          </div>

        </div>

      </div>


      {/* ACCOUNT STATUS */}

      <div className="admin-provider-status-card">

        <div>

          <span>
            ACCOUNT STATUS
          </span>

          <strong>
            {provider.isActive === false
              ? "Blocked"
              : "Active"}
          </strong>

        </div>

        <span
          className={
            provider.isActive === false
              ? "status-badge blocked"
              : "status-badge active"
          }
        >
          {provider.isActive === false
            ? "Blocked"
            : "Active"}
        </span>

      </div>


      {/* BASIC INFORMATION */}

      <div className="admin-provider-section">

        <div className="admin-provider-section-header">

          <h2>
            Basic Information
          </h2>

          <p>
            Provider account information
          </p>

        </div>

        <div className="admin-provider-info-grid">

          <div className="admin-provider-info-item">
            <span>Name</span>
            <strong>
              {provider.name || "Not provided"}
            </strong>
          </div>

          <div className="admin-provider-info-item">
            <span>Email</span>
            <strong>
              {provider.email || "Not provided"}
            </strong>
          </div>

          <div className="admin-provider-info-item">
            <span>Phone</span>
            <strong>
              {provider.phone || "Not provided"}
            </strong>
          </div>

          <div className="admin-provider-info-item">
            <span>Role</span>
            <strong>
              {provider.role || "Provider"}
            </strong>
          </div>

          <div className="admin-provider-info-item">
            <span>Experience</span>
            <strong>
              {provider.experience || "Not provided"}
            </strong>
          </div>

          <div className="admin-provider-info-item">
            <span>Location</span>
            <strong>
              {provider.location?.city ||
                "Not provided"}
            </strong>
          </div>

        </div>

      </div>


      {/* PROFESSIONAL DESCRIPTION */}

      <div className="admin-provider-section">

        <div className="admin-provider-section-header">

          <h2>
            Professional Information
          </h2>

        </div>

        <div className="admin-provider-description">

          {provider.professionalDescription ||
            "No professional description provided."}

        </div>

      </div>


      {/* AVAILABILITY */}

      <div className="admin-provider-section">

        <div className="admin-provider-section-header">

          <h2>
            Availability
          </h2>

        </div>

        <div className="admin-provider-availability">

          {provider.availability ? (
            <pre>
              {JSON.stringify(
                provider.availability,
                null,
                2
              )}
            </pre>
          ) : (
            <p>
              Availability not provided.
            </p>
          )}

        </div>

      </div>


      {/* SERVICES */}

      <div className="admin-provider-section">

        <div className="admin-provider-section-header">

          <div>
            <h2>
              Services
            </h2>

            <p>
              Services offered by this provider
            </p>
          </div>

          <strong className="service-count">
            {provider.services?.length || 0}
          </strong>

        </div>


        {provider.services?.length > 0 ? (

          <div className="admin-provider-services-list">

            {provider.services.map((service) => (

              <div
                className="admin-provider-service-card"
                key={service._id}
              >

                <div>

                  <h3>
                    {service.name}
                  </h3>

                  <p>
                    {service.category ||
                      "General Service"}
                  </p>

                  <span>
                    {service.description ||
                      "No description provided."}
                  </span>

                </div>

                <div className="admin-provider-service-right">

                  <strong>
                    ₹{service.price}
                  </strong>

                  <span
                    className={`service-status ${service.status}`}
                  >
                    {service.status}
                  </span>

                </div>

              </div>

            ))}

          </div>

        ) : (

          <div className="admin-no-services">
            No services found.
          </div>

        )}

      </div>


      {/* ACTIONS */}

      <div className="admin-provider-actions">

        {provider.isActive === false ? (

          <button
            type="button"
            className="admin-unblock-btn"
          >
            Unblock Provider
          </button>

        ) : (

          <button
            type="button"
            className="admin-block-btn"
          >
            Block Provider
          </button>

        )}

      </div>

    </section>
  );
};

export default AdminProviderDetails;