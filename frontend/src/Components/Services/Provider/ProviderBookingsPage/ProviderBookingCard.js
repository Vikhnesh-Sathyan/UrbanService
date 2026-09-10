import React from "react";

const ProviderBookingCard = ({
  booking,
  onAccept,
  onReject,
  onStatusUpdate,
}) => {

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
            {"⭐".repeat(booking.rating)}
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