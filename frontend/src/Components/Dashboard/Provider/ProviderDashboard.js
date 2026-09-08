import React, { useEffect, useState } from "react";
import ProviderSidebar from "./ProviderSidebar";
import ProviderNavbar from "./ProviderNavbar";
import "../../../styles/ProviderDashboard.css";

import { getProviderBookings } from "../../../Services/bookingService";

import { useNavigate } from "react-router-dom";

const ProviderDashboard = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch provider bookings
  const loadBookings = async () => {
    try {
      const data = await getProviderBookings();

      setBookings(data.bookings || []);
    } catch (error) {
      console.error("Failed to fetch provider bookings:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBookings();
  }, []);

  // =========================
  // DASHBOARD STATISTICS
  // =========================

  const totalBookings = bookings.length;

  const pendingBookings = bookings.filter(
    (booking) => booking.status === "pending"
  ).length;

  const activeBookings = bookings.filter(
    (booking) =>
      booking.status === "accepted" ||
      booking.status === "in_progress"
  ).length;

  const completedBookings = bookings.filter(
    (booking) => booking.status === "completed"
  ).length;

  return (
    <div className="provider-dashboard">

      {/* Sidebar */}
      <ProviderSidebar />

      {/* Main */}
      <main className="provider-main">

        {/* Navbar */}
        <ProviderNavbar />

        {/* Dashboard Content */}
        <section className="provider-dashboard-content">

          {/* Welcome */}
          <div className="dashboard-welcome">

            <div>
              <p className="welcome-label">
                WELCOME BACK
              </p>

              <h2>
                Manage your <span>services</span>
              </h2>

              <p>
                Keep track of your bookings and business activity.
              </p>
            </div>

            <button className="add-service-button">
              + Add Service
            </button>

          </div>

          {/* =========================
              STATISTICS
          ========================= */}

          <div className="dashboard-stats">

            <div className="dashboard-stat-card">
              <div className="stat-icon">
                📅
              </div>

              <h3>{totalBookings}</h3>

              <p>
                Total Bookings
              </p>
            </div>


            <div className="dashboard-stat-card">
              <div className="stat-icon">
                ⏳
              </div>

              <h3>{pendingBookings}</h3>

              <p>
                Pending Bookings
              </p>
            </div>


            <div className="dashboard-stat-card">
              <div className="stat-icon">
                🔧
              </div>

              <h3>{activeBookings}</h3>

              <p>
                Active Bookings
              </p>
            </div>


            <div className="dashboard-stat-card">
              <div className="stat-icon">
                ✅
              </div>

              <h3>{completedBookings}</h3>

              <p>
                Completed
              </p>
            </div>

          </div>


          {/* =========================
              RECENT BOOKINGS
          ========================= */}

          <div className="dashboard-panel">

            <div className="panel-header">

              <div>
                <h3>
                  Recent Bookings
                </h3>

                <p>
                  Your latest service booking requests
                </p>
              </div>

              <button 
                className="view-all-button"
                onClick={() => navigate("/provider/bookings")}
            >
                View All →
              </button>

            </div>


            {/* Loading */}
            {loading && (
              <div className="empty-bookings">

                <div className="empty-bookings-icon">
                  ⏳
                </div>

                <h3>
                  Loading bookings...
                </h3>

              </div>
            )}


            {/* No bookings */}
            {!loading && bookings.length === 0 && (
              <div className="empty-bookings">

                <div className="empty-bookings-icon">
                  📅
                </div>

                <h3>
                  No bookings yet
                </h3>

                <p>
                  Your recent booking requests will appear here.
                </p>

              </div>
            )}


            {/* Bookings */}
            {!loading && bookings.length > 0 && (

              <div className="booking-list">

                {bookings.slice(0, 5).map((booking) => (

                  <div
                    className="booking-row"
                    key={booking._id}
                  >

                    {/* Customer */}
                    <div className="customer-cell">

                      <div className="customer-avatar">
                        {booking.user?.name
                          ?.charAt(0)
                          ?.toUpperCase() || "U"}
                      </div>

                      <div>
                        <strong>
                          {booking.user?.name ||
                            "Unknown Customer"}
                        </strong>

                        <p className="service-name">
                          {booking.service?.name ||
                            "Service"}
                        </p>
                      </div>

                    </div>


                    {/* Date */}
                    <div className="booking-date">

                      <strong>
                        {booking.date || "No date"}
                      </strong>

                      <small>
                        {booking.time || "No time"}
                      </small>

                    </div>


                    {/* Status */}
                    <div>

                      <span
                        className={`booking-status ${booking.status}`}
                      >
                        <i></i>

                        {booking.status}
                      </span>

                    </div>


                    {/* Price */}
                    <div className="booking-price">

                      ₹
                      {booking.service?.price || 0}

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

export default ProviderDashboard;