import React, { useEffect, useState } from "react";
import axios from "axios";

const API = "http://localhost:5000/api/services";

const AdminServiceApprovals = () => {
  // ========================================
  // STATE
  // ========================================

  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  // Reject form state
  const [showRejectForm, setShowRejectForm] = useState(false);
  const [rejectServiceId, setRejectServiceId] = useState(null);
  const [rejectionReason, setRejectionReason] = useState("");

  // ========================================
  // AUTH CONFIG
  // ========================================

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

      console.log(
        "PENDING SERVICES:",
        response.data
      );

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

      setServices([]);

    } finally {
      setLoading(false);
    }
  };

  // ========================================
  // LOAD ON PAGE OPEN
  // ========================================

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

      alert(
        "Service approved successfully."
      );

      await loadPendingServices();

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
  // OPEN REJECT FORM
  // ========================================

  const openRejectForm = (serviceId) => {
    setRejectServiceId(serviceId);
    setRejectionReason("");
    setShowRejectForm(true);
  };

  // ========================================
  // CLOSE REJECT FORM
  // ========================================

  const closeRejectForm = () => {
    setShowRejectForm(false);
    setRejectServiceId(null);
    setRejectionReason("");
  };

  // ========================================
  // REJECT SERVICE
  // ========================================

  const handleReject = async () => {

    // Validate reason
    if (!rejectionReason.trim()) {
      alert(
        "Please enter a rejection reason."
      );
      return;
    }

    try {

     await axios.patch(
  `${API}/${rejectServiceId}/reject`,
  {
    adminComment: rejectionReason.trim(),
  },
  authConfig
);

      alert(
        "Service rejected successfully."
      );

      // Close form
      closeRejectForm();

      // Reload pending services
      await loadPendingServices();

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

        <h1>
          Service Approvals
        </h1>

        <p>
          Loading pending services...
        </p>

      </div>
    );
  }

  // ========================================
  // UI
  // ========================================

  return (
    <div className="admin-page-content">

      {/* ========================================
          HEADER
      ======================================== */}

      <div className="admin-page-header">

        <div>

          <span className="admin-label">
            SERVICE MANAGEMENT
          </span>

          <h1>
            Service Approvals
          </h1>

          <p>
            Review and manage services
            submitted by providers.
          </p>

        </div>

        <span className="pending-count">
          {services.length} Pending
        </span>

      </div>

      {/* ========================================
          REJECT FORM
      ======================================== */}

      {showRejectForm && (

        <div className="reject-form-card">

          <div className="reject-form-header">

            <div>

              <h2>
                Reject Service
              </h2>

              <p>
                Please provide a reason for
                rejecting this service.
              </p>

            </div>

            <button
              type="button"
              className="btn-close"
              onClick={closeRejectForm}
            >
              ×
            </button>

          </div>

          <div className="form-group">

            <label>
              Rejection Reason
            </label>

            <textarea
              value={rejectionReason}
              onChange={(e) =>
                setRejectionReason(
                  e.target.value
                )
              }
              placeholder="Example: Please provide more details about the service."
              rows="4"
            />

          </div>

          <div className="reject-form-actions">

            <button
              type="button"
              className="btn-secondary"
              onClick={closeRejectForm}
            >
              Cancel
            </button>

            <button
              type="button"
              className="admin-reject-btn"
              onClick={handleReject}
            >
              ✕ Reject Service
            </button>

          </div>

        </div>

      )}

      {/* ========================================
          NO SERVICES
      ======================================== */}

      {services.length === 0 ? (

        <div className="admin-empty-state">

          <div className="admin-empty-icon">
            ✓
          </div>

          <h2>
            All Clear!
          </h2>

          <p>
            No services are currently
            waiting for approval.
          </p>

        </div>

      ) : (

        /* ========================================
           SERVICES
        ======================================== */

        <div className="admin-services-grid">

          {services.map((service) => (

            <div
              className="admin-service-card"
              key={service._id}
            >

              {/* ========================================
                  IMAGE
              ======================================== */}

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

              {/* ========================================
                  CONTENT
              ======================================== */}

              <div className="admin-service-content">

                {/* SERVICE TOP */}

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

                {/* DESCRIPTION */}

                <p className="admin-service-description">
                  {service.description}
                </p>

                {/* PRICE */}

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

                {/* ========================================
                    ACTIONS
                ======================================== */}

                <div className="admin-service-actions">

                  {/* APPROVE */}

                  <button
                    type="button"
                    className="admin-approve-btn"
                    onClick={() =>
                      handleApprove(
                        service._id
                      )
                    }
                  >
                    ✓ Approve
                  </button>

                  {/* REJECT */}

                  <button
                    type="button"
                    className="admin-reject-btn"
                    onClick={() =>
                      openRejectForm(
                        service._id
                      )
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