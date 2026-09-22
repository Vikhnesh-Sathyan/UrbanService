import React, { useEffect, useState } from "react";
import {
  getAllComplaints,
  updateComplaint,
} from "../../../Services/complaintService";

import "../../../styles/AdminComplaints.css";

const reasonLabels = {
  service_quality: "Service Quality",
  provider_no_show: "Provider Did Not Arrive",
  service_not_provided: "Service Was Not Provided",
  payment_issue: "Payment Issue",
  inappropriate_behavior: "Inappropriate Behavior",
  other: "Other",
};

const AdminComplaints = () => {
  const [complaints, setComplaints] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedComplaint, setSelectedComplaint] =
    useState(null);

  const [adminResponse, setAdminResponse] =
    useState("");

  const [actionLoading, setActionLoading] =
    useState(false);

  // =====================================================
  // LOAD COMPLAINTS
  // =====================================================

  const loadComplaints = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getAllComplaints();

      setComplaints(data?.complaints || []);
    } catch (error) {
      console.error(
        "Failed to load complaints:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to load complaints."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadComplaints();
  }, []);

  // =====================================================
  // OPEN COMPLAINT
  // =====================================================

  const handleOpenComplaint = (complaint) => {
    setSelectedComplaint(complaint);

    setAdminResponse(
      complaint.adminResponse || ""
    );
  };

  // =====================================================
  // UPDATE COMPLAINT
  // =====================================================

  const handleUpdate = async (
    status,
    adminAction
  ) => {
    if (!selectedComplaint) {
      return;
    }

    try {
      setActionLoading(true);

      const data = await updateComplaint(
        selectedComplaint._id,
        {
          status,
          adminAction,
          adminResponse,
        }
      );

      // Update selected complaint
      setSelectedComplaint(data.complaint);

      // Refresh list
      await loadComplaints();

      alert("Complaint updated successfully.");
    } catch (error) {
      console.error(
        "Failed to update complaint:",
        error
      );

      alert(
        error.response?.data?.message ||
          "Failed to update complaint."
      );
    } finally {
      setActionLoading(false);
    }
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="admin-complaints-page">
        <div className="admin-complaints-loading">
          Loading complaints...
        </div>
      </div>
    );
  }

  return (
    <div className="admin-complaints-page">

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="admin-complaints-header">

        <div>
          <span className="admin-complaints-eyebrow">
            CUSTOMER SUPPORT
          </span>

          <h1>Complaints</h1>

          <p>
            Review customer complaints and take
            appropriate action.
          </p>
        </div>

        <div className="admin-complaints-count">
          <strong>
            {complaints.length}
          </strong>

          <span>Total Complaints</span>
        </div>

      </div>

      {/* =================================================
          ERROR
      ================================================= */}

      {error && (
        <div className="admin-complaints-error">
          {error}
        </div>
      )}

      {/* =================================================
          MAIN CONTENT
      ================================================= */}

      <div className="admin-complaints-layout">

        {/* =================================================
            COMPLAINT LIST
        ================================================= */}

        <div className="admin-complaints-list">

          {complaints.length === 0 ? (

            <div className="admin-empty-complaints">
              <h3>No complaints</h3>

              <p>
                There are currently no customer
                complaints to review.
              </p>
            </div>

          ) : (

            complaints.map((complaint) => (

              <button
                key={complaint._id}
                type="button"
                className={`admin-complaint-item ${
                  selectedComplaint?._id ===
                  complaint._id
                    ? "active"
                    : ""
                }`}
                onClick={() =>
                  handleOpenComplaint(complaint)
                }
              >

                <div className="admin-complaint-item-top">

                  <strong>
                    {complaint.customer?.name ||
                      "Unknown Customer"}
                  </strong>

                  <span
                    className={`complaint-status complaint-status-${complaint.status}`}
                  >
                    {complaint.status
                      ?.replace("_", " ")}
                  </span>

                </div>

                <div className="admin-complaint-item-service">
                  {complaint.service?.name ||
                  complaint.service?.title ||
                    "Unknown Service"}
                </div>

                <div className="admin-complaint-item-reason">
                  {reasonLabels[
                    complaint.reason
                  ] || complaint.reason}
                </div>

                <small>
                  {new Date(
                    complaint.createdAt
                  ).toLocaleDateString()}
                </small>

              </button>

            ))

          )}

        </div>

        {/* =================================================
            COMPLAINT DETAILS
        ================================================= */}

        <div className="admin-complaint-details">

          {!selectedComplaint ? (

            <div className="admin-no-selection">
              <h3>Select a complaint</h3>

              <p>
                Select a complaint from the list
                to review its details.
              </p>
            </div>

          ) : (

            <>

              <div className="admin-detail-header">

                <div>
                  <span className="admin-complaints-eyebrow">
                    COMPLAINT DETAILS
                  </span>

                  <h2>
                    {reasonLabels[
                      selectedComplaint.reason
                    ] || selectedComplaint.reason}
                  </h2>
                </div>

                <span
                  className={`complaint-status complaint-status-${selectedComplaint.status}`}
                >
                  {selectedComplaint.status?.replace(
                    "_",
                    " "
                  )}
                </span>

              </div>

              {/* CUSTOMER */}

              <div className="admin-detail-section">

                <h3>Customer</h3>

                <p>
                  <strong>Name:</strong>{" "}
                  {selectedComplaint.customer?.name ||
                    "-"}
                </p>

                <p>
                  <strong>Email:</strong>{" "}
                  {selectedComplaint.customer?.email ||
                    "-"}
                </p>

                <p>
                  <strong>Phone:</strong>{" "}
                  {selectedComplaint.customer?.phone ||
                    "-"}
                </p>

              </div>

              {/* PROVIDER */}

              <div className="admin-detail-section">

                <h3>Provider</h3>

                <p>
                  <strong>Name:</strong>{" "}
                  {selectedComplaint.provider?.name ||
                    "-"}
                </p>

                <p>
                  <strong>Email:</strong>{" "}
                  {selectedComplaint.provider?.email ||
                    "-"}
                </p>

                <p>
                  <strong>Active:</strong>{" "}
                  {selectedComplaint.provider?.isActive
                    ? "Yes"
                    : "No"}
                </p>

              </div>

              {/* BOOKING */}

              <div className="admin-detail-section">

                <h3>Booking</h3>

                <p>
                  <strong>Date:</strong>{" "}
                  {selectedComplaint.booking?.date ||
                    "-"}
                </p>

                <p>
                  <strong>Time:</strong>{" "}
                  {selectedComplaint.booking?.time ||
                    "-"}
                </p>

                <p>
                  <strong>Status:</strong>{" "}
                  {selectedComplaint.booking?.status ||
                    "-"}
                </p>

              </div>

              {/* DESCRIPTION */}

              <div className="admin-detail-section">

                <h3>Customer Description</h3>

                <div className="complaint-description">
                  {selectedComplaint.description}
                </div>

              </div>

              {/* ADMIN RESPONSE */}

              <div className="admin-detail-section">

                <h3>Admin Response</h3>

                <textarea
                  value={adminResponse}
                  onChange={(e) =>
                    setAdminResponse(
                      e.target.value
                    )
                  }
                  placeholder="Enter your response..."
                  rows="5"
                />

              </div>

              {/* ACTIONS */}

              <div className="admin-complaint-actions">

                <h3>Actions</h3>

                <div className="admin-action-buttons">

                  <button
                    type="button"
                    disabled={actionLoading}
                    onClick={() =>
                      handleUpdate(
                        "under_review",
                        "none"
                      )
                    }
                  >
                    Mark Under Review
                  </button>

                  <button
                    type="button"
                    disabled={actionLoading}
                    onClick={() =>
                      handleUpdate(
                        "resolved",
                        "warning"
                      )
                    }
                  >
                    Resolve & Warn Provider
                  </button>

                  <button
                    type="button"
                    disabled={actionLoading}
                    onClick={() =>
                      handleUpdate(
                        "resolved",
                        "provider_blocked"
                      )
                    }
                  >
                    Resolve & Block Provider
                  </button>

                  <button
                    type="button"
                    disabled={actionLoading}
                    onClick={() =>
                      handleUpdate(
                        "resolved",
                        "none"
                      )
                    }
                  >
                    Resolve Complaint
                  </button>

                  <button
                    type="button"
                    disabled={actionLoading}
                    onClick={() =>
                      handleUpdate(
                        "rejected",
                        "none"
                      )
                    }
                  >
                    Reject Complaint
                  </button>

                </div>

              </div>

            </>

          )}

        </div>

      </div>

    </div>
  );
};

export default AdminComplaints;