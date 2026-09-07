import { useEffect, useState } from "react";

import {
  getProviderBookings,
  acceptBooking,
  rejectBooking,
  updateBookingStatus,
} from "src/services/bookingService";

const ProviderBookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadBookings = async () => {
    try {
      const data = await getProviderBookings();

      setBookings(data.bookings || []);
    } catch (error) {
      console.error("Failed to fetch bookings:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBookings();
  }, []);

  // Accept booking
  const handleAccept = async (id) => {
    try {
      await acceptBooking(id);

      await loadBookings();
    } catch (error) {
      console.error("Accept booking error:", error);
      alert(
        error.response?.data?.message ||
          "Failed to accept booking"
      );
    }
  };

  // Reject booking
  const handleReject = async (id) => {
    try {
      await rejectBooking(id);

      await loadBookings();
    } catch (error) {
      console.error("Reject booking error:", error);
      alert(
        error.response?.data?.message ||
          "Failed to reject booking"
      );
    }
  };

  // Update job status
  const handleStatusUpdate = async (id, status) => {
    try {
      await updateBookingStatus(id, status);

      await loadBookings();
    } catch (error) {
      console.error(
        "Status update error:",
        error
      );

      alert(
        error.response?.data?.message ||
          "Failed to update booking status"
      );
    }
  };

  if (loading) {
    return <p>Loading bookings...</p>;
  }

  return (
    <div className="provider-bookings">

      <h1>Booking Requests</h1>

      {bookings.length === 0 ? (
        <p>No bookings found.</p>
      ) : (
        bookings.map((booking) => (
          <div
            key={booking._id}
            className="booking-card"
          >

            <h3>
              {booking.service?.name ||
                "Service"}
            </h3>

            <p>
              Customer:{" "}
              {booking.user?.name ||
                "Unknown"}
            </p>

            <p>
              Email:{" "}
              {booking.user?.email ||
                "Not available"}
            </p>

            <p>
              Phone: {booking.phone}
            </p>

            <p>
              Date: {booking.date}
            </p>

            <p>
              Time: {booking.time}
            </p>

            <p>
              Price: ₹
              {booking.service?.price ||
                0}
            </p>

            <p>
              Status:{" "}
              <strong>
                {booking.status}
              </strong>
            </p>

            {booking.notes && (
              <p>
                Notes: {booking.notes}
              </p>
            )}

            {/* Pending */}
            {booking.status === "pending" && (
              <div>

                <button
                  onClick={() =>
                    handleAccept(
                      booking._id
                    )
                  }
                >
                  Accept
                </button>

                <button
                  onClick={() =>
                    handleReject(
                      booking._id
                    )
                  }
                >
                  Reject
                </button>

              </div>
            )}

            {/* Accepted */}
            {booking.status === "accepted" && (
              <button
                onClick={() =>
                  handleStatusUpdate(
                    booking._id,
                    "in_progress"
                  )
                }
              >
                Start Service
              </button>
            )}

            {/* In Progress */}
            {booking.status === "in_progress" && (
              <button
                onClick={() =>
                  handleStatusUpdate(
                    booking._id,
                    "completed"
                  )
                }
              >
                Complete Service
              </button>
            )}

          </div>
        ))
      )}

    </div>
  );
};

export default ProviderBookingsPage;