import { useEffect, useState } from "react";

import {
  getProviderBookings,
  acceptBooking,
  rejectBooking,
  updateBookingStatus,
} from "../../../../Services/bookingService";

import ProviderBookingCard from "./ProviderBookingCard";

import "../../../../styles/ProviderBookings.css";


const ProviderBookingsPage = () => {

  // ==========================================
  // BOOKINGS
  // ==========================================

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
  // SEPARATE BOOKINGS
  // ==========================================

  const pendingBookings = bookings.filter(
    (booking) =>
      booking.status === "pending"
  );

  const acceptedBookings = bookings.filter(
    (booking) =>
      booking.status === "accepted"
  );

  const inProgressBookings = bookings.filter(
    (booking) =>
      booking.status === "in_progress"
  );

  const completedBookings = bookings.filter(
    (booking) =>
      booking.status === "completed"
  );

  const rejectedBookings = bookings.filter(
    (booking) =>
      booking.status === "rejected"
  );

  const cancelledBookings = bookings.filter(
    (booking) =>
      booking.status === "cancelled"
  );


  // ==========================================
  // RENDER SECTION
  // ==========================================

  const renderBookings = (bookingList) => {

    return bookingList.map((booking) => (

      <ProviderBookingCard
        key={booking._id}
        booking={booking}
        onAccept={handleAccept}
        onReject={handleReject}
        onStatusUpdate={handleStatusUpdate}
      />

    ));

  };


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

      {/* HEADER */}

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


      {/* NO BOOKINGS */}

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

          {pendingBookings.length > 0 && (

            <section className="provider-booking-section">

              <div className="provider-section-header">

                <h2>
                  Pending Requests
                </h2>

                <span>
                  {pendingBookings.length}
                </span>

              </div>

              <div className="provider-booking-list">

                {renderBookings(
                  pendingBookings
                )}

              </div>

            </section>

          )}


          {/* =================================
              ACCEPTED
          ================================= */}

          {acceptedBookings.length > 0 && (

            <section className="provider-booking-section">

              <div className="provider-section-header">

                <h2>
                  Accepted
                </h2>

                <span>
                  {acceptedBookings.length}
                </span>

              </div>

              <div className="provider-booking-list">

                {renderBookings(
                  acceptedBookings
                )}

              </div>

            </section>

          )}


          {/* =================================
              IN PROGRESS
          ================================= */}

          {inProgressBookings.length > 0 && (

            <section className="provider-booking-section">

              <div className="provider-section-header">

                <h2>
                  In Progress
                </h2>

                <span>
                  {inProgressBookings.length}
                </span>

              </div>

              <div className="provider-booking-list">

                {renderBookings(
                  inProgressBookings
                )}

              </div>

            </section>

          )}


          {/* =================================
              COMPLETED
          ================================= */}

          {completedBookings.length > 0 && (

            <section className="provider-booking-section">

              <div className="provider-section-header">

                <h2>
                  Completed
                </h2>

                <span>
                  {completedBookings.length}
                </span>

              </div>

              <div className="provider-booking-list">

                {renderBookings(
                  completedBookings
                )}

              </div>

            </section>

          )}


          {/* =================================
              REJECTED
          ================================= */}

          {rejectedBookings.length > 0 && (

            <section className="provider-booking-section">

              <div className="provider-section-header">

                <h2>
                  Rejected
                </h2>

                <span>
                  {rejectedBookings.length}
                </span>

              </div>

              <div className="provider-booking-list">

                {renderBookings(
                  rejectedBookings
                )}

              </div>

            </section>

          )}


          {/* =================================
              CANCELLED
          ================================= */}

          {cancelledBookings.length > 0 && (

            <section className="provider-booking-section">

              <div className="provider-section-header">

                <h2>
                  Cancelled
                </h2>

                <span>
                  {cancelledBookings.length}
                </span>

              </div>

              <div className="provider-booking-list">

                {renderBookings(
                  cancelledBookings
                )}

              </div>

            </section>

          )}

        </>

      )}

    </div>

  );

};


export default ProviderBookingsPage;