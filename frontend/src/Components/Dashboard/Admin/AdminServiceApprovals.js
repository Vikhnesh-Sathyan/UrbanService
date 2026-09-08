import React, { useEffect, useState } from "react";
import axios from "axios";

const API = "http://localhost:5000/api/services";

const AdminServiceApprovals = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  const authConfig = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  // ========================================
  // LOAD PENDING SERVICES
  // ========================================

  const loadPendingServices = async () => {
    try {
      setLoading(true);

      const response = await axios.get(
        `${API}/pending`,
        authConfig
      );

      console.log("PENDING SERVICES:", response.data);

      setServices(
        Array.isArray(response.data)
          ? response.data
          : response.data.services || []
      );

    } catch (error) {
      console.error(
        "Failed to load pending services:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPendingServices();
  }, []);

  // ========================================
  // APPROVE SERVICE
  // ========================================

  const handleApprove = async (serviceId) => {
    try {
      await axios.patch(
        `${API}/${serviceId}/approve`,
        {},
        authConfig
      );

      alert("Service approved successfully.");

      loadPendingServices();

    } catch (error) {
      console.error(
        "Approve service error:",
        error
      );

      alert(
        error.response?.data?.message ||
          "Failed to approve service."
      );
    }
  };

  // ========================================
  // REJECT SERVICE
  // ========================================

  const handleReject = async (serviceId) => {
    const confirmed = window.confirm(
      "Are you sure you want to reject this service?"
    );

    if (!confirmed) {
      return;
    }

    try {
      await axios.patch(
        `${API}/${serviceId}/reject`,
        {},
        authConfig
      );

      alert("Service rejected successfully.");

      loadPendingServices();

    } catch (error) {
      console.error(
        "Reject service error:",
        error
      );

      alert(
        error.response?.data?.message ||
          "Failed to reject service."
      );
    }
  };

  // ========================================
  // LOADING
  // ========================================

  if (loading) {
    return (
      <div className="admin-page-content">
        <h1>Service Approvals</h1>
        <p>Loading pending services...</p>
      </div>
    );
  }

  // ========================================
  // UI
  // ========================================

  return (
    <div className="admin-page-content">

      {/* HEADER */}

      <div className="admin-page-header">

        <div>
          <span className="admin-label">
            SERVICE MANAGEMENT
          </span>

          <h1>
            Service Approvals
          </h1>

          <p>
            Review and manage services submitted by providers.
          </p>
        </div>

        <span className="pending-count">
          {services.length} Pending
        </span>

      </div>

      {/* NO SERVICES */}

      {services.length === 0 ? (

        <div className="admin-empty-state">

          <div className="admin-empty-icon">
            ✓
          </div>

          <h2>
            All Clear!
          </h2>

          <p>
            No services are currently waiting for approval.
          </p>

        </div>

      ) : (

        /* SERVICES */

        <div className="admin-services-grid">

          {services.map((service) => (

            <div
              className="admin-service-card"
              key={service._id}
            >

              {/* IMAGE */}

              {service.image ? (

                <img
                  src={`http://localhost:5000/uploads/${service.image}`}
                  alt={service.name}
                  className="admin-service-image"
                />

              ) : (

                <div className="admin-service-image-placeholder">
                  📷
                </div>

              )}

              {/* CONTENT */}

              <div className="admin-service-content">

                <div className="admin-service-top">

                  <div>

                    <h2>
                      {service.name}
                    </h2>

                    <p>
                      {service.category}
                    </p>

                  </div>

                  <span className="admin-pending-badge">
                    Pending
                  </span>

                </div>

                <p className="admin-service-description">
                  {service.description}
                </p>

                <h3>
                  ₹{service.price}
                </h3>

                {/* PROVIDER */}

                <p className="admin-provider">

                  <strong>
                    Provider:
                  </strong>{" "}

                  {service.provider?.name ||
                    "Unknown Provider"}

                </p>

                {/* ACTIONS */}

                <div className="admin-service-actions">

                  <button
                    type="button"
                    className="admin-approve-btn"
                    onClick={() =>
                      handleApprove(service._id)
                    }
                  >
                    ✓ Approve
                  </button>

                  <button
                    type="button"
                    className="admin-reject-btn"
                    onClick={() =>
                      handleReject(service._id)
                    }
                  >
                    ✕ Reject
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

export default AdminServiceApprovals;