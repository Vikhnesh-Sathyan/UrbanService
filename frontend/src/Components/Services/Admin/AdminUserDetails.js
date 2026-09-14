import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import "../../../styles/AdminDashboard.css";

const AdminUserDetails = () => {
  const { userId } = useParams();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookings, setBookings] = useState([]);

  const loadUserDetails = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `http://localhost:5000/api/users/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch user");
      }

      setUser(data.user);
    } catch (error) {
      console.error("Failed to load user details:", error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };
  const loadUserBookings = async () => {
  try {
    const token = localStorage.getItem("token");

    const response = await fetch(
      `http://localhost:5000/api/bookings/admin/user/${userId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message || "Failed to fetch bookings"
      );
    }

    setBookings(data.bookings || []);
  } catch (error) {
    console.error(
      "Failed to load user bookings:",
      error
    );

    setBookings([]);
  }
};

  useEffect(() => {
    loadUserDetails();
    loadUserBookings();
  }, [userId]);

  if (loading) {
    return (
      <section className="admin-user-details-section">
        <div className="admin-empty-state">
          <h3>Loading user details...</h3>
        </div>
      </section>
    );
  }

  if (!user) {
    return (
      <section className="admin-user-details-section">
        <div className="admin-empty-state">
          <div className="admin-empty-icon">👤</div>
          <h3>User Not Found</h3>
          <p>The requested user could not be found.</p>

          <button
            className="admin-view-btn"
            onClick={() => navigate("/admin/users")}
          >
            Back to Users
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="admin-user-details-section">

      {/* Header */}
      <div className="admin-user-details-header">
        <button
          className="admin-back-btn"
          onClick={() => navigate("/admin/users")}
        >
          ← Back to Users
        </button>

        <div>
          <span className="admin-label">
            USER MANAGEMENT
          </span>

          <h2>User Details</h2>

          <p>
            View customer profile information.
          </p>
        </div>
      </div>

      {/* Profile Card */}
      <div className="admin-user-profile-card">

        <div className="admin-user-avatar">
          {user.name
            ? user.name.charAt(0).toUpperCase()
            : "U"}
        </div>

        <div className="admin-user-profile-info">
          <h1>{user.name || "Unknown User"}</h1>

          <p>{user.email || "-"}</p>

          <span className="admin-user-role">
            Customer
          </span>
        </div>
      </div>

      {/* Information */}
      <div className="admin-user-info-card">

        <div className="admin-user-card-header">
          <h3>Personal Information</h3>
          <p>Registered customer details</p>
        </div>

        <div className="admin-user-info-grid">

          <div className="admin-user-info-item">
            <span>Name</span>
            <strong>{user.name || "-"}</strong>
          </div>

          <div className="admin-user-info-item">
            <span>Email</span>
            <strong>{user.email || "-"}</strong>
          </div>

          <div className="admin-user-info-item">
            <span>Phone</span>
            <strong>{user.phone || "-"}</strong>
          </div>

          <div className="admin-user-info-item">
            <span>City</span>
            <strong>
              {user.location?.city || "-"}
            </strong>
          </div>

          <div className="admin-user-info-item">
            <span>State</span>
            <strong>
              {user.location?.state || "-"}
            </strong>
          </div>

          <div className="admin-user-info-item">
            <span>Registered Date</span>
            <strong>
              {user.createdAt
                ? new Date(
                    user.createdAt
                  ).toLocaleDateString()
                : "-"}
            </strong>
          </div>

        </div>
      </div>
      {/* Booking History */}
<div className="admin-user-bookings-card">

  <div className="admin-user-card-header">
    <h3>Booking History</h3>

    <p>
      Services booked by this customer
    </p>
  </div>

  {bookings.length === 0 ? (
    <div className="admin-user-no-bookings">
      <div className="admin-empty-icon">
        📅
      </div>

      <h3>No Bookings Found</h3>

      <p>
        This user has not made any bookings yet.
      </p>
    </div>
  ) : (
    <div className="admin-user-bookings-wrapper">
      <table className="admin-user-bookings-table">
        <thead>
          <tr>
            <th>Service</th>
            <th>Provider</th>
            <th>Date</th>
            <th>Time</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {bookings.map((booking) => (
            <tr key={booking._id}>

              <td>
                <div className="booking-service">
                  <strong>
                    {booking.service?.name ||
                      "Unknown Service"}
                  </strong>

                  {booking.service?.category && (
                    <span>
                      {booking.service.category}
                    </span>
                  )}
                </div>
              </td>

              <td>
                <div className="booking-person">
                  <strong>
                    {booking.provider?.name ||
                      "Unknown"}
                  </strong>

                  <span>
                    {booking.provider?.email || "-"}
                  </span>
                </div>
              </td>

              <td>
                {booking.date || "-"}
              </td>

              <td>
                {booking.time || "-"}
              </td>

              <td>
                <span
                  className={`booking-status booking-status-${
                    booking.status === "in_progress"
                      ? "progress"
                      : booking.status || "default"
                  }`}
                >
                  {booking.status || "pending"}
                </span>
              </td>

            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )}
</div>

    </section>
  );
};

export default AdminUserDetails;