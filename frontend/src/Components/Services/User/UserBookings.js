import React, { useEffect, useState } from "react";

import {
  getMyBookings,
  cancelBooking,
  rescheduleBooking,
} from "../../../Services/bookingService";

const UserBookings = () => {

  // ==========================================
  // STATE
  // ==========================================

  const [bookings, setBookings] = useState([]);

  const [loading, setLoading] = useState(true);

  const [actionLoading, setActionLoading] =
    useState(false);

  // Reschedule state
  const [rescheduleId, setRescheduleId] =
    useState(null);

  const [newDate, setNewDate] =
    useState("");

  const [newTime, setNewTime] =
    useState("");


  // ==========================================
  // LOAD MY BOOKINGS
  // ==========================================

  const loadBookings = async () => {

    try {

      setLoading(true);

      const data = await getMyBookings();

      console.log(
        "MY BOOKINGS:",
        data
      );

      setBookings(
        Array.isArray(data)
          ? data
          : data.bookings || []
      );

    } catch (error) {

      console.error(
        "Failed to load bookings:",
        error
      );

      setBookings([]);

    } finally {

      setLoading(false);

    }

  };


  // ==========================================
  // LOAD WHEN PAGE OPENS
  // ==========================================

  useEffect(() => {

    loadBookings();

  }, []);


  // ==========================================
  // CANCEL BOOKING
  // ==========================================

  const handleCancel = async (bookingId) => {

    const confirmed = window.confirm(
      "Are you sure you want to cancel this booking?"
    );

    if (!confirmed) {
      return;
    }

    try {

      setActionLoading(true);

      await cancelBooking(
        bookingId
      );

      alert(
        "Booking cancelled successfully"
      );

      await loadBookings();

    } catch (error) {

      console.error(
        "Cancel booking error:",
        error
      );

      alert(
        error.response?.data?.message ||
        "Failed to cancel booking"
      );

    } finally {

      setActionLoading(false);

    }

  };


  // ==========================================
  // OPEN RESCHEDULE
  // ==========================================

  const handleOpenReschedule = (
    booking
  ) => {

    setRescheduleId(
      booking._id
    );

    setNewDate(
      booking.date || ""
    );

    setNewTime(
      booking.time || ""
    );

  };


  // ==========================================
  // CLOSE RESCHEDULE
  // ==========================================

  const handleCloseReschedule = () => {

    setRescheduleId(null);

    setNewDate("");

    setNewTime("");

  };


  // ==========================================
  // RESCHEDULE BOOKING
  // ==========================================

  const handleReschedule = async (e) => {

    e.preventDefault();

    if (!newDate || !newTime) {

      alert(
        "Please select date and time"
      );

      return;
    }

    try {

      setActionLoading(true);

      await rescheduleBooking(
        rescheduleId,
        newDate,
        newTime
      );

      alert(
        "Booking rescheduled successfully"
      );

      handleCloseReschedule();

      await loadBookings();

    } catch (error) {

      console.error(
        "Reschedule booking error:",
        error
      );

      alert(
        error.response?.data?.message ||
        "Failed to reschedule booking"
      );

    } finally {

      setActionLoading(false);

    }

  };


  // ==========================================
  // STATUS CLASS
  // ==========================================

  const getStatusClass = (
    status
  ) => {

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


  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {

    return (

      <div>

        <h2>
          Loading your bookings...
        </h2>

      </div>

    );

  }


  // ==========================================
  // UI
  // ==========================================

  return (

    <div>

      <h1>
        My Bookings
      </h1>

      <p>
        View and manage your service bookings.
      </p>


      {/* ======================================
          NO BOOKINGS
      ====================================== */}

      {bookings.length === 0 ? (

        <div>

          <h2>
            No Bookings Found
          </h2>

          <p>
            You have not booked any services yet.
          </p>

        </div>

      ) : (

        <div>

          {bookings.map(
            (booking) => (

              <div
                key={booking._id}
              >

                {/* =================================
                    SERVICE
                ================================= */}

                <h2>
                  {booking.service?.name ||
                    "Unknown Service"}
                </h2>


                {/* =================================
                    CATEGORY
                ================================= */}

                {booking.service?.category && (

                  <p>

                    Category:{" "}

                    {booking.service.category}

                  </p>

                )}


                {/* =================================
                    PRICE
                ================================= */}

                {booking.service?.price !==
                  undefined && (

                  <p>

                    Price: ₹
                    {booking.service.price}

                  </p>

                )}


                {/* =================================
                    PROVIDER
                ================================= */}

                <p>

                  Provider:{" "}

                  {booking.provider?.name ||
                    "Unknown Provider"}

                </p>


                <p>

                  Provider Email:{" "}

                  {booking.provider?.email ||
                    "-"}

                </p>


                {/* =================================
                    DATE
                ================================= */}

                <p>

                  Date:{" "}

                  {booking.date || "-"}

                </p>


                {/* =================================
                    TIME
                ================================= */}

                <p>

                  Time:{" "}

                  {booking.time || "-"}

                </p>


                {/* =================================
                    PHONE
                ================================= */}

                <p>

                  Phone:{" "}

                  {booking.phone || "-"}

                </p>


                {/* =================================
                    NOTES
                ================================= */}

                {booking.notes && (

                  <p>

                    Notes:{" "}

                    {booking.notes}

                  </p>

                )}


                {/* =================================
                    STATUS
                ================================= */}

                <p>

                  Status:{" "}

                  <span
                    className={`booking-status ${getStatusClass(
                      booking.status
                    )}`}
                  >

                    {booking.status ||
                      "pending"}

                  </span>

                </p>


                {/* =================================
                    ACTIONS
                ================================= */}

                {(
                  booking.status ===
                    "pending" ||

                  booking.status ===
                    "accepted"
                ) && (

                  <div>

                    {/* CANCEL */}

                    <button
                      type="button"
                      disabled={
                        actionLoading
                      }
                      onClick={() =>
                        handleCancel(
                          booking._id
                        )
                      }
                    >
                      Cancel Booking
                    </button>


                    {/* RESCHEDULE */}

                    <button
                      type="button"
                      disabled={
                        actionLoading
                      }
                      onClick={() =>
                        handleOpenReschedule(
                          booking
                        )
                      }
                    >
                      Reschedule
                    </button>

                  </div>

                )}

              </div>

            )
          )}

        </div>

      )}


      {/* ==========================================
          RESCHEDULE FORM
      ========================================== */}

      {rescheduleId && (

        <div>

          <h2>
            Reschedule Booking
          </h2>


          <form
            onSubmit={
              handleReschedule
            }
          >

            {/* DATE */}

            <div>

              <label>
                New Date
              </label>

              <input
                type="date"
                value={newDate}
                min={
                  new Date()
                    .toISOString()
                    .split("T")[0]
                }
                onChange={(e) =>
                  setNewDate(
                    e.target.value
                  )
                }
                required
              />

            </div>


            {/* TIME */}

            <div>

              <label>
                New Time
              </label>

              <input
                type="time"
                value={newTime}
                onChange={(e) =>
                  setNewTime(
                    e.target.value
                  )
                }
                required
              />

            </div>


            {/* CONFIRM */}

            <button
              type="submit"
              disabled={
                actionLoading
              }
            >

              {actionLoading
                ? "Updating..."
                : "Confirm Reschedule"}

            </button>


            {/* CLOSE */}

            <button
              type="button"
              disabled={
                actionLoading
              }
              onClick={
                handleCloseReschedule
              }
            >

              Close

            </button>

          </form>

        </div>

      )}

    </div>

  );

};

export default UserBookings;