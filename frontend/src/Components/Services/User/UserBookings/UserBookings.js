import React, { useEffect, useState } from "react";

import {
  getMyBookings,
  cancelBooking,
  rescheduleBooking,
} from "../../../../Services/bookingService";

import BookingCard from "./BookingCard";
import RescheduleForm from "./RescheduleForm";

import "../../../../styles/UserBookings.css";


const UserBookings = () => {

  // ==========================================
  // BOOKINGS
  // ==========================================

  const [bookings, setBookings] = useState([]);

  const [loading, setLoading] = useState(true);

  const [actionLoading, setActionLoading] =
    useState(false);


  // ==========================================
  // RESCHEDULE
  // ==========================================

  const [rescheduleId, setRescheduleId] =
    useState(null);

  const [newDate, setNewDate] =
    useState("");

  const [newTime, setNewTime] =
    useState("");


  // ==========================================
  // LOAD BOOKINGS
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
          : data?.bookings || []
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

  const handleCancel = async (
    bookingId
  ) => {

    const confirmed =
      window.confirm(
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
  // LOADING
  // ==========================================

  if (loading) {

    return (

      <div className="user-bookings-page">

        <div className="user-bookings-empty">

          <div className="user-bookings-icon">
            ◈
          </div>

          <h2>
            Loading your bookings...
          </h2>

          <p>
            Please wait while we fetch your bookings.
          </p>

        </div>

      </div>

    );

  }


  // ==========================================
  // PAGE
  // ==========================================

  return (

    <div className="user-bookings-page">


      {/* ======================================
          HEADER
      ====================================== */}

      <div className="user-bookings-header">

        <div>

          <span className="user-bookings-eyebrow">
            SERVICE BOOKINGS
          </span>

          <h1>
            My Bookings
          </h1>

          <p>
            View and manage your service bookings.
          </p>

        </div>


        <div className="user-bookings-count">

          <strong>
            {bookings.length}
          </strong>

          <span>
            {" "}bookings
          </span>

        </div>

      </div>


      {/* ======================================
          NO BOOKINGS
      ====================================== */}

      {bookings.length === 0 ? (

        <div className="user-bookings-empty">

          <div className="user-bookings-icon">
            ◈
          </div>

          <h2>
            No Bookings Found
          </h2>

          <p>
            You have not booked any services yet.
          </p>

        </div>

      ) : (

        <div className="user-bookings-list">

          {bookings.map((booking) => (

            <BookingCard
              key={booking._id}
              booking={booking}
              actionLoading={actionLoading}
              onCancel={handleCancel}
              onReschedule={
                handleOpenReschedule
              }
            />

          ))}

        </div>

      )}


      {/* ======================================
          RESCHEDULE
      ====================================== */}

      {rescheduleId && (

        <RescheduleForm
          newDate={newDate}
          newTime={newTime}
          setNewDate={setNewDate}
          setNewTime={setNewTime}
          loading={actionLoading}
          onSubmit={handleReschedule}
          onClose={
            handleCloseReschedule
          }
        />

      )}

    </div>

  );

};


export default UserBookings;