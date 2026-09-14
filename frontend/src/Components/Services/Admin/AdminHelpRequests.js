import React, { useEffect, useState } from "react";
import axios from "axios";

import "../../../styles/AdminHelpRequests.css";

const AdminHelpRequests = () => {

  // ========================================
  // STATE
  // ========================================

  const [helpRequests, setHelpRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedRequest, setSelectedRequest] = useState(null);
  const [adminResponse, setAdminResponse] = useState("");
  const [submitting, setSubmitting] = useState(false);


  // ========================================
  // LOAD HELP REQUESTS
  // ========================================

  const loadHelpRequests = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      const response = await axios.get(
        "http://localhost:5000/api/help",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("HELP REQUESTS:", response.data);

      setHelpRequests(
        response.data.helpRequests || []
      );

    } catch (error) {
      console.error(
        "Failed to load help requests:",
        error
      );

      setHelpRequests([]);

    } finally {
      setLoading(false);
    }
  };


  // ========================================
  // LOAD ON PAGE OPEN
  // ========================================

  useEffect(() => {
    loadHelpRequests();
  }, []);


  // ========================================
  // OPEN RESPONSE FORM
  // ========================================

  const handleOpenResponse = (request) => {
    setSelectedRequest(request);

    setAdminResponse(
      request.adminResponse || ""
    );
  };


  // ========================================
  // CLOSE RESPONSE FORM
  // ========================================

  const handleCloseResponse = () => {
    setSelectedRequest(null);
    setAdminResponse("");
  };


  // ========================================
  // SUBMIT ADMIN RESPONSE
  // ========================================

  const handleSubmitResponse = async (e) => {
    e.preventDefault();

    if (!adminResponse.trim()) {
      alert("Please enter a response.");
      return;
    }

    try {
      setSubmitting(true);

      const token = localStorage.getItem("token");

      const response = await axios.patch(
        `http://localhost:5000/api/help/${selectedRequest._id}/respond`,
        {
          adminResponse: adminResponse.trim(),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(
        "HELP RESPONSE:",
        response.data
      );

      alert(
        response.data.message ||
        "Response submitted successfully"
      );

      handleCloseResponse();

      loadHelpRequests();

    } catch (error) {
      console.error(
        "Submit help response error:",
        error
      );

      alert(
        error.response?.data?.message ||
        "Failed to submit response"
      );

    } finally {
      setSubmitting(false);
    }
  };


  // ========================================
  // UNBLOCK PROVIDER
  // ========================================

  const handleUnblockProvider = async (providerId) => {
    try {
      const token = localStorage.getItem("token");

     await axios.patch(
  `http://localhost:5000/api/users/providers/${providerId}/unblock`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Provider unblocked successfully");

      loadHelpRequests();

    } catch (error) {
      console.error(
        "Unblock provider error:",
        error
      );

      alert(
        error.response?.data?.message ||
        "Failed to unblock provider"
      );
    }
  };


  // ========================================
  // LOADING
  // ========================================

  if (loading) {
    return (
      <section className="admin-help-requests-section">

        <div className="admin-empty-state">

          <h3>
            Loading help requests...
          </h3>

        </div>

      </section>
    );
  }


  // ========================================
  // PAGE
  // ========================================

  return (
    <section className="admin-help-requests-section">

      {/* ========================================
          HEADER
      ======================================== */}

      <div className="admin-section-header">

        <div>

          <span className="admin-label">
            SUPPORT MANAGEMENT
          </span>

          <h2>
            Help Requests
          </h2>

          <p>
            View and manage provider support requests.
          </p>

        </div>

        <span className="help-request-count">
          {helpRequests.length} requests
        </span>

      </div>


      {/* ========================================
          NO REQUESTS
      ======================================== */}

      {helpRequests.length === 0 ? (

        <div className="admin-empty-state">

          <div className="admin-empty-icon">
            💬
          </div>

          <h3>
            No Help Requests
          </h3>

          <p>
            Provider help requests will appear here.
          </p>

        </div>

      ) : (

        /* ========================================
           HELP REQUEST LIST
        ======================================== */

        <div className="admin-help-requests-list">

          {helpRequests.map((request) => (

            <div
              className="admin-help-request-card"
              key={request._id}
            >

              {/* ====================================
                  PROVIDER
              ==================================== */}

              <div className="help-request-provider">

                <div className="help-request-avatar">

                  {request.provider?.name
                    ?.charAt(0)
                    ?.toUpperCase() || "P"}

                </div>

                <div>

                  <h3>
                    {request.provider?.name ||
                      "Unknown Provider"}
                  </h3>

                  <p>
                    {request.email ||
                      request.provider?.email ||
                      "No email"}
                  </p>

                </div>

              </div>


              {/* ====================================
                  MESSAGE
              ==================================== */}

              <div className="help-request-message">

                <span>
                  MESSAGE
                </span>

                <p>
                  {request.message ||
                    "No message"}
                </p>

              </div>


              {/* ====================================
                  STATUS
              ==================================== */}

              <div className="help-request-status">

                <span>
                  STATUS
                </span>

                <strong
                  className={
                    request.status === "open"
                      ? "help-status-open"
                      : request.status === "in_progress"
                      ? "help-status-progress"
                      : "help-status-resolved"
                  }
                >
                  {request.status || "open"}
                </strong>

              </div>


              {/* ====================================
                  PROVIDER ACCOUNT STATUS
              ==================================== */}

              <div className="help-request-provider-status">

                <span>
                  PROVIDER ACCOUNT
                </span>

                <strong
                  className={
                    request.provider?.isActive
                      ? "provider-status-active"
                      : "provider-status-blocked"
                  }
                >
                  {request.provider?.isActive
                    ? "Active"
                    : "Blocked"}
                </strong>

              </div>


              {/* ====================================
                  DATE
              ==================================== */}

              <div className="help-request-date">

                <span>
                  SUBMITTED
                </span>

                <p>

                  {request.createdAt
                    ? new Date(
                        request.createdAt
                      ).toLocaleString()
                    : "-"}

                </p>

              </div>


              {/* ====================================
                  ADMIN RESPONSE
              ==================================== */}

              <div className="help-request-response">

                <span>
                  ADMIN RESPONSE
                </span>

                <p>
                  {request.adminResponse ||
                    "No response yet"}
                </p>

              </div>


              {/* ====================================
                  ACTIONS
              ==================================== */}

              <div className="help-request-action">

                {/* RESPOND BUTTON */}

                <button
                  type="button"
                  className="help-respond-btn"
                  onClick={() =>
                    handleOpenResponse(request)
                  }
                >
                  {request.adminResponse
                    ? "Edit Response"
                    : "Respond"}
                </button>


                {/* UNBLOCK BUTTON */}

                {request.provider &&
                  request.provider.isActive === false && (

                    <button
                      type="button"
                      className="help-unblock-btn"
                      onClick={() =>
                        handleUnblockProvider(
                          request.provider._id
                        )
                      }
                    >
                      Unblock Provider
                    </button>

                  )}

              </div>

            </div>

          ))}

        </div>

      )}


      {/* ========================================
          RESPONSE MODAL
      ======================================== */}

      {selectedRequest && (

        <div className="help-response-overlay">

          <div className="help-response-modal">


            {/* HEADER */}

            <div className="help-response-header">

              <div>

                <span className="admin-label">
                  PROVIDER SUPPORT
                </span>

                <h2>
                  Respond to Help Request
                </h2>

              </div>

              <button
                type="button"
                className="help-response-close"
                onClick={handleCloseResponse}
              >
                ×
              </button>

            </div>


            {/* PROVIDER */}

            <div className="help-response-provider">

              <strong>
                {selectedRequest.provider?.name ||
                  "Unknown Provider"}
              </strong>

              <span>
                {selectedRequest.email ||
                  selectedRequest.provider?.email ||
                  "No email"}
              </span>

            </div>


            {/* ORIGINAL MESSAGE */}

            <div className="help-original-message">

              <span>
                PROVIDER MESSAGE
              </span>

              <p>
                {selectedRequest.message}
              </p>

            </div>


            {/* FORM */}

            <form
              onSubmit={handleSubmitResponse}
              className="help-response-form"
            >

              <label>
                Admin Response
              </label>

              <textarea
                value={adminResponse}
                onChange={(e) =>
                  setAdminResponse(e.target.value)
                }
                placeholder="Write your response to the provider..."
                rows="5"
              />


              {/* ACTIONS */}

              <div className="help-response-actions">

                <button
                  type="button"
                  className="help-cancel-btn"
                  onClick={handleCloseResponse}
                  disabled={submitting}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="help-submit-btn"
                  disabled={submitting}
                >
                  {submitting
                    ? "Sending..."
                    : "Send Response"}
                </button>

              </div>

            </form>

          </div>

        </div>

      )}

    </section>
  );
};

export default AdminHelpRequests;