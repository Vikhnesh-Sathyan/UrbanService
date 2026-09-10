import React from "react";

const BookingCard = ({
  booking,
  actionLoading,
  onCancel,
  onReschedule,
  onReview,
}) => {

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

  return (
    <div className="booking-card">

      {/* SERVICE */}

      <h2>
        {booking.service?.name || "Unknown Service"}
      </h2>


      {/* CATEGORY */}

      {booking.service?.category && (
        <p>
          Category: {booking.service.category}
        </p>
      )}


      {/* PRICE */}

      {booking.service?.price !== undefined && (
        <p>
          Price: ₹{booking.service.price}
        </p>
      )}


      {/* PROVIDER */}

      <p>
        Provider:{" "}
        {booking.provider?.name || "Unknown Provider"}
      </p>

      <p>
        Provider Email:{" "}
        {booking.provider?.email || "-"}
      </p>


      {/* DATE */}

      <p>
        Date: {booking.date || "-"}
      </p>


      {/* TIME */}

      <p>
        Time: {booking.time || "-"}
      </p>


      {/* PHONE */}

      <p>
        Phone: {booking.phone || "-"}
      </p>


      {/* NOTES */}

      {booking.notes && (
        <p>
          Notes: {booking.notes}
        </p>
      )}


      {/* STATUS */}

      <p>
        Status:{" "}

        <span
          className={`booking-status ${getStatusClass(
            booking.status
          )}`}
        >
          {booking.status || "pending"}
        </span>
      </p>

      {/* CANCEL / RESCHEDULE */}

      {(booking.status === "pending" ||
        booking.status === "accepted") && (

        <div className="booking-actions">

          <button
            type="button"
            disabled={actionLoading}
            onClick={() =>
              onCancel(booking._id)
            }
          >
            Cancel Booking
          </button>

          <button
            type="button"
            disabled={actionLoading}
            onClick={() =>
              onReschedule(booking)
            }
          >
            Reschedule
          </button>

        </div>
      )}


      {/* REVIEW */}

      {booking.status === "completed" && (
        <div className="booking-review-section">

          {booking.rating ? (
            <>
               <p className="review-rating">
                Your Rating: {"⭐".repeat(booking.rating)}
              </p>

              {booking.review && (
                <p className="review-text">
                  Your Review: {booking.review}
                </p>
              )}
            </>
          ) : (
            <button
              type="button"
              className="review-button"
              disabled={actionLoading}
              onClick={() =>
                onReview(booking)
              }
            >
              Leave a Review
            </button>
          )}

        </div>
      )}

    </div>
  );
};

export default BookingCard;