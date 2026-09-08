import React, { useEffect, useState } from "react";

import { getAllBookings } from "../../../Services/bookingService";

import "../../../styles/AdminDashboard.css";

const AdminBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadBookings = async () => {
    try {
      setLoading(true);

      const data = await getAllBookings();

      console.log("ALL BOOKINGS:", data);

      setBookings(
        Array.isArray(data)
          ? data
          : data.bookings || []
      );

    } catch (error) {
      console.error("Failed to load bookings:", error);

      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBookings();
  }, []);

  const getStatusClass = (status) => {
    switch (status) {
      case "pending":
        return "booking-status-pending";

      case "accepted":
        return "booking-status-accepted";

      case "in_progress":
        return "booking-status-progress";

      case "completed":
        return "booking-status-completed";

      case "rejected":
        return "booking-status-rejected";

      case "cancelled":
        return "booking-status-cancelled";

      default:
        return "booking-status-default";
    }
  };

  if (loading) {
    return (
      <section className="admin-bookings-section">
        <div className="admin-empty-state">
          <h3>Loading bookings...</h3>
        </div>
      </section>
    );
  }

  return (
    <section className="admin-bookings-section">

      {/* Header */}

      <div className="admin-section-header">

        <div>
          <span className="admin-label">
            BOOKING MANAGEMENT
          </span>

          <h2>
            All Bookings
          </h2>

          <p>
            View and monitor all customer bookings.
          </p>
        </div>

        <span className="booking-count">
          {bookings.length} bookings
        </span>

      </div>

      {/* No bookings */}

      {bookings.length === 0 ? (

        <div className="admin-empty-state">

          <div className="admin-empty-icon">
            📅
          </div>

          <h3>
            No Bookings Found
          </h3>

          <p>
            Customer bookings will appear here.
          </p>

        </div>

      ) : (

        <div className="admin-bookings-table-wrapper">

          <table className="admin-bookings-table">

            <thead>

              <tr>
                <th>Customer</th>
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

                  {/* Customer */}

                  <td>
                    <div className="booking-person">

                      <strong>
                        {booking.user?.name || "Unknown"}
                      </strong>

                      <span>
                        {booking.user?.email || "-"}
                      </span>

                    </div>
                  </td>

                  {/* Service */}

                  <td>
                    <div className="booking-service">

                      <strong>
                        {booking.service?.name || "Unknown Service"}
                      </strong>

                      {booking.service?.category && (
                        <span>
                          {booking.service.category}
                        </span>
                      )}

                    </div>
                  </td>

                  {/* Provider */}

                  <td>
                    <div className="booking-person">

                      <strong>
                        {booking.provider?.name || "Unknown"}
                      </strong>

                      <span>
                        {booking.provider?.email || "-"}
                      </span>

                    </div>
                  </td>

                  {/* Date */}

                  <td>
                    {booking.date || "-"}
                  </td>

                  {/* Time */}

                  <td>
                    {booking.time || "-"}
                  </td>

                  {/* Status */}

                  <td>

                    <span
                      className={`booking-status ${getStatusClass(
                        booking.status
                      )}`}
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

    </section>
  );
};

export default AdminBookings;