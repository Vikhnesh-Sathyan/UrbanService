import React, { useEffect, useState } from "react";
import axios from "axios";

import AdminSidebar from "./AdminSidebar";
import AdminNavbar from "./AdminNavbar";

import "../../../styles/AdminDashboard.css";

const API = "http://localhost:5000/api/services";

const AdminDashboard = () => {

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
  // DASHBOARD
  // ========================================

  return (

    <div className="admin-dashboard">

      {/* Sidebar */}

      <AdminSidebar />

      {/* Main */}

      <main className="admin-main">

        {/* Navbar */}

        <AdminNavbar />

        {/* Content */}

        <section className="admin-dashboard-content">

          {/* Welcome */}

          <div className="admin-welcome">

            <div>

              <span className="admin-label">
                ADMIN PANEL
              </span>

              <h1>
                Welcome back, Admin
              </h1>

              <p>
                Review and manage provider service
                submissions.
              </p>

            </div>

          </div>


          {/* ========================================
              STATISTICS
          ======================================== */}

          <div className="admin-stats">

            <div className="admin-stat-card">

              <div className="admin-stat-icon">
                ⏳
              </div>

              <div>

                <h2>
                  {services.length}
                </h2>

                <p>
                  Pending Services
                </p>

              </div>

            </div>


            <div className="admin-stat-card">

              <div className="admin-stat-icon">
                📋
              </div>

              <div>

                <h2>
                  Review
                </h2>

                <p>
                  Service Requests
                </p>

              </div>

            </div>


            <div className="admin-stat-card">

              <div className="admin-stat-icon">
                👥
              </div>

              <div>

                <h2>
                  Providers
                </h2>

                <p>
                  Provider Management
                </p>

              </div>

            </div>


            <div className="admin-stat-card">

              <div className="admin-stat-icon">
                📅
              </div>

              <div>

                <h2>
                  Bookings
                </h2>

                <p>
                  Booking Management
                </p>

              </div>

            </div>

          </div>


          {/* ========================================
              PENDING SERVICES
          ======================================== */}

          <div className="admin-services-panel">

            <div className="admin-panel-header">

              <div>

                <h2>
                  Pending Service Approvals
                </h2>

                <p>
                  Review services submitted by providers.
                </p>

              </div>

              <span className="pending-count">
                {services.length} Pending
              </span>

            </div>


            {/* Loading */}

            {loading && (

              <div className="admin-empty-state">

                <div className="admin-loading-icon">
                  ⏳
                </div>

                <h3>
                  Loading services...
                </h3>

              </div>

            )}


            {/* No services */}

            {!loading && services.length === 0 && (

              <div className="admin-empty-state">

                <div className="admin-empty-icon">
                  ✓
                </div>

                <h3>
                  All Clear!
                </h3>

                <p>
                  No services are waiting for approval.
                </p>

              </div>

            )}


            {/* Services */}

            {!loading && services.length > 0 && (

              <div className="admin-services-grid">

                {services.map((service) => (

                  <div
                    className="admin-service-card"
                    key={service._id}
                  >

                    {/* Image */}

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


                    {/* Content */}

                    <div className="admin-service-content">

                      <div className="admin-service-top">

                        <div>

                          <h3>
                            {service.name}
                          </h3>

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


                      <h4>
                        ₹{service.price}
                      </h4>


                      {/* Provider */}

                      <p className="admin-provider">

                        <strong>
                          Provider:
                        </strong>{" "}

                        {service.provider?.name ||
                          "Unknown Provider"}

                      </p>


                      {/* Actions */}

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

        </section>

      </main>

    </div>

  );
};

export default AdminDashboard;