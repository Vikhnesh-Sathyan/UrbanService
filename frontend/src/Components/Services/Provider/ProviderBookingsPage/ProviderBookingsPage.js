import { useEffect, useState } from "react";

import {
  getProviderBookings,
  acceptBooking,
  rejectBooking,
  updateBookingStatus,
} from "../../../../Services/bookingService";

import ProviderBookingSection from "./ProviderBookingSection";

import "../../../../styles/ProviderBookings.css";


const ProviderBookingsPage = () => {

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);


  // ==========================================
  // LOAD PROVIDER BOOKINGS
  // ==========================================

  const loadBookings = async () => {

    try {

      setLoading(true);

      const data = await getProviderBookings();

      setBookings(data.bookings || []);

    } catch (error) {

      console.error(
        "Failed to fetch bookings:",
        error
      );

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
  // ACCEPT BOOKING
  // ==========================================

  const handleAccept = async (id) => {

    try {

      await acceptBooking(id);

      await loadBookings();

    } catch (error) {

      console.error(
        "Accept booking error:",
        error
      );

      alert(
        error.response?.data?.message ||
        "Failed to accept booking"
      );

    }

  };


  // ==========================================
  // REJECT BOOKING
  // ==========================================

  const handleReject = async (id) => {

    try {

      await rejectBooking(id);

      await loadBookings();

    } catch (error) {

      console.error(
        "Reject booking error:",
        error
      );

      alert(
        error.response?.data?.message ||
        "Failed to reject booking"
      );

    }

  };


  // ==========================================
  // UPDATE BOOKING STATUS
  // ==========================================

  const handleStatusUpdate = async (
    id,
    status
  ) => {

    try {

      await updateBookingStatus(
        id,
        status
      );

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


  // ==========================================
  // SEPARATE BOOKINGS BY STATUS
  // ==========================================

  const pendingBookings = bookings.filter(
    (booking) => booking.status === "pending"
  );

  const acceptedBookings = bookings.filter(
    (booking) => booking.status === "accepted"
  );

  const inProgressBookings = bookings.filter(
    (booking) => booking.status === "in_progress"
  );

  const completedBookings = bookings.filter(
    (booking) => booking.status === "completed"
  );

  const rejectedBookings = bookings.filter(
    (booking) => booking.status === "rejected"
  );

  const cancelledBookings = bookings.filter(
    (booking) => booking.status === "cancelled"
  );


  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {

    return (

      <div className="provider-bookings">

        <div className="provider-loading">

          Loading bookings...

        </div>

      </div>

    );

  }


  // ==========================================
  // PAGE
  // ==========================================

  return (

    <div className="provider-bookings">


      {/* =====================================
          HEADER
      ===================================== */}

      <div className="provider-bookings-header">

        <span className="provider-bookings-eyebrow">
          BOOKING MANAGEMENT
        </span>

        <h1>
          Booking Requests
        </h1>

        <p>
          Manage your customer bookings and
          service requests.
        </p>

      </div>


      {/* =====================================
          NO BOOKINGS
      ===================================== */}

      {bookings.length === 0 ? (

        <div className="provider-empty">

          <h3>
            No bookings found
          </h3>

          <p>
            Customer bookings will appear here.
          </p>

        </div>

      ) : (

        <>


          {/* =================================
              PENDING
          ================================= */}

          <ProviderBookingSection
            title="Pending Requests"
            bookings={pendingBookings}
            onAccept={handleAccept}
            onReject={handleReject}
            onStatusUpdate={handleStatusUpdate}
          />


          {/* =================================
              ACCEPTED
          ================================= */}

          <ProviderBookingSection
            title="Accepted"
            bookings={acceptedBookings}
            onAccept={handleAccept}
            onReject={handleReject}
            onStatusUpdate={handleStatusUpdate}
          />


          {/* =================================
              IN PROGRESS
          ================================= */}

          <ProviderBookingSection
            title="In Progress"
            bookings={inProgressBookings}
            onAccept={handleAccept}
            onReject={handleReject}
            onStatusUpdate={handleStatusUpdate}
          />


          {/* =================================
              COMPLETED
          ================================= */}

          <ProviderBookingSection
            title="Completed"
            bookings={completedBookings}
            onAccept={handleAccept}
            onReject={handleReject}
            onStatusUpdate={handleStatusUpdate}
          />


          {/* =================================
              REJECTED
          ================================= */}

          <ProviderBookingSection
            title="Rejected"
            bookings={rejectedBookings}
            onAccept={handleAccept}
            onReject={handleReject}
            onStatusUpdate={handleStatusUpdate}
          />


          {/* =================================
              CANCELLED
          ================================= */}

          <ProviderBookingSection
            title="Cancelled"
            bookings={cancelledBookings}
            onAccept={handleAccept}
            onReject={handleReject}
            onStatusUpdate={handleStatusUpdate}
          />

        </>

      )}

    </div>

  );

};


export default ProviderBookingsPage;