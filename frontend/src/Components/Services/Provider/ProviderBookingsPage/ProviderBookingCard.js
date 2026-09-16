import React, { useEffect, useRef } from "react";

import {
  updateProviderLocation,
} from "../../../../Services/bookingService";

const ProviderBookingCard = ({
  booking,
  onAccept,
  onReject,
  onStatusUpdate,
}) => {
  // ==========================================
  // GPS WATCH ID
  // ==========================================

  const watchIdRef = useRef(null);


  // ==========================================
  // START LOCATION TRACKING
  // ==========================================

  const startLocationTracking = () => {
    // Prevent multiple GPS watchers
    if (watchIdRef.current !== null) {
      return;
    }

    // Check browser support
    if (!navigator.geolocation) {
      console.error(
        "Geolocation is not supported by this browser."
      );

      return;
    }

    console.log(
      "Provider location tracking started"
    );


    // Start watching provider location
    watchIdRef.current =
      navigator.geolocation.watchPosition(
        async (position) => {
          const latitude =
            position.coords.latitude;

          const longitude =
            position.coords.longitude;


          console.log(
            "Provider GPS:",
            latitude,
            longitude
          );


          try {
            await updateProviderLocation(
              booking._id,
              latitude,
              longitude
            );


            console.log(
              "Provider location updated:",
              latitude,
              longitude
            );

          } catch (error) {

            console.error(
              "Failed to update provider location:",
              error
            );

          }
        },


        // ======================================
        // GPS ERROR
        // ======================================

        (error) => {
          console.error(
            "Location error:",
            error
          );
        },


        // ======================================
        // GPS OPTIONS
        // ======================================

        {
          enableHighAccuracy: true,
          maximumAge: 10000,
          timeout: 10000,
        }
      );
  };


  // ==========================================
  // STOP LOCATION TRACKING
  // ==========================================

  const stopLocationTracking = () => {

    if (watchIdRef.current !== null) {

      navigator.geolocation.clearWatch(
        watchIdRef.current
      );

      watchIdRef.current = null;


      console.log(
        "Provider location tracking stopped"
      );
    }
  };


  // ==========================================
  // TRACK BASED ON BOOKING STATUS
  // ==========================================

  useEffect(() => {

    if (booking.status === "in_progress") {

      startLocationTracking();

    } else {

      stopLocationTracking();

    }


    // Cleanup when component is removed
    return () => {
      stopLocationTracking();
    };

  }, [booking.status, booking._id]);


  // ==========================================
  // STATUS CLASS
  // ==========================================

  const getStatusClass = (status) => {

    switch (status) {

      case "pending":
        return "provider-status-pending";

      case "accepted":
        return "provider-status-accepted";

      case "in_progress":
        return "provider-status-progress";

      case "completed":
        return "provider-status-completed";

      case "rejected":
        return "provider-status-rejected";

      case "cancelled":
        return "provider-status-cancelled";

      default:
        return "provider-status-default";
    }
  };


  return (

    <div className="booking-card">

      {/* =====================================
          SERVICE
      ===================================== */}

      <h3>
        {booking.service?.name || "Service"}
      </h3>


      {/* =====================================
          CUSTOMER
      ===================================== */}

      <p>
        Customer:{" "}
        {booking.user?.name || "Unknown"}
      </p>


      {/* =====================================
          EMAIL
      ===================================== */}

      <p>
        Email:{" "}
        {booking.user?.email || "Not available"}
      </p>


      {/* =====================================
          PHONE
      ===================================== */}

      <p>
        Phone:{" "}
        {booking.phone || "-"}
      </p>


      {/* =====================================
          DATE
      ===================================== */}

      <p>
        Date:{" "}
        {booking.date || "-"}
      </p>


      {/* =====================================
          TIME
      ===================================== */}

      <p>
        Time:{" "}
        {booking.time || "-"}
      </p>


      {/* =====================================
          PRICE
      ===================================== */}

      <p>
        Price: ₹
        {booking.service?.price || 0}
      </p>


      {/* =====================================
          STATUS
      ===================================== */}

      <p className="provider-status-row">

        Status:{" "}

        <span
          className={`provider-status-badge ${getStatusClass(
            booking.status
          )}`}
        >
          {booking.status || "pending"}
        </span>

      </p>


      {/* =====================================
          NOTES
      ===================================== */}

      {booking.notes && (

        <p>
          Notes:{" "}
          {booking.notes}
        </p>

      )}


      {/* =====================================
          CUSTOMER REVIEW
      ===================================== */}

      {booking.status === "completed" &&
        booking.rating && (

        <div className="provider-customer-review">

          <h4>
            Customer Review
          </h4>


          <p className="provider-rating">

            {"⭐".repeat(
              booking.rating
            )}

          </p>


          {booking.review && (

            <p className="provider-review-text">

              "{booking.review}"

            </p>

          )}

        </div>

      )}


      {/* =====================================
          PENDING ACTIONS
      ===================================== */}

      {booking.status === "pending" && (

        <div className="provider-booking-actions">

          <button
            type="button"
            onClick={() =>
              onAccept(booking._id)
            }
          >
            Accept
          </button>


          <button
            type="button"
            onClick={() =>
              onReject(booking._id)
            }
          >
            Reject
          </button>

        </div>

      )}


      {/* =====================================
          ACCEPTED ACTION
      ===================================== */}

      {booking.status === "accepted" && (

        <div className="provider-booking-actions">

          <button
            type="button"
            onClick={() =>
              onStatusUpdate(
                booking._id,
                "in_progress"
              )
            }
          >
            Start Service
          </button>

        </div>

      )}


      {/* =====================================
          IN PROGRESS ACTION
      ===================================== */}

      {booking.status === "in_progress" && (

        <div className="provider-booking-actions">

          <button
            type="button"
            onClick={() =>
              onStatusUpdate(
                booking._id,
                "completed"
              )
            }
          >
            Complete Service
          </button>

        </div>

      )}


      {/* =====================================
          COMPLETED
      ===================================== */}

      {booking.status === "completed" && (

        <div className="provider-completed-message">

          ✓ Service completed

        </div>

      )}


      {/* =====================================
          REJECTED
      ===================================== */}

      {booking.status === "rejected" && (

        <div className="provider-rejected-message">

          Booking rejected

        </div>

      )}


      {/* =====================================
          CANCELLED
      ===================================== */}

      {booking.status === "cancelled" && (

        <div className="provider-cancelled-message">

          Booking cancelled

        </div>

      )}

    </div>

  );
};


export default ProviderBookingCard;