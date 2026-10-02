import React, {
  useEffect,
  useRef,
  useState,
} from "react";

import { useNavigate } from "react-router-dom";

import {
  updateProviderLocation,
} from "../../../../Services/bookingService";

import {
  scheduleServiceFollowUp,
} from "../../../../Services/serviceFollowUpService";

const ProviderBookingCard = ({
  booking,
  onAccept,
  onReject,
  onStatusUpdate,
}) => {
  const navigate = useNavigate();

  // ==========================================
  // FOLLOW-UP STATE
  // ==========================================

  const [showFollowUp, setShowFollowUp] =
    useState(false);

  const [followUpValue, setFollowUpValue] =
    useState("");

  const [followUpUnit, setFollowUpUnit] =
    useState("days");

  const [followUpLoading, setFollowUpLoading] =
    useState(false);

  // ==========================================
  // GPS WATCH ID
  // ==========================================

  const watchIdRef = useRef(null);

  const isEmergency =
    booking.bookingType === "emergency";

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

  // ==========================================
  // SCHEDULE FOLLOW-UP
  // ==========================================

  const handleScheduleFollowUp = async () => {
    if (
      !followUpValue ||
      Number(followUpValue) <= 0
    ) {
      alert("Enter a valid follow-up time.");
      return;
    }

    try {
      setFollowUpLoading(true);

      await scheduleServiceFollowUp(
        booking._id,
        Number(followUpValue),
        followUpUnit
      );

      alert(
        "Follow-up scheduled successfully."
      );

      setShowFollowUp(false);
      setFollowUpValue("");
      setFollowUpUnit("days");
    } catch (error) {
      console.error(
        "Schedule follow-up error:",
        error
      );

      alert(
        error.response?.data?.message ||
          "Failed to schedule follow-up."
      );
    } finally {
      setFollowUpLoading(false);
    }
  };

  return (
    <div
      className={`booking-card ${
        isEmergency
          ? "provider-booking-card-emergency"
          : ""
      }`}
    >
      {/* =====================================
          EMERGENCY BADGE
      ===================================== */}

      {isEmergency && (
        <div className="provider-emergency-badge">
          🚨 EMERGENCY REQUEST
        </div>
      )}

      {/* =====================================
          SERVICE
      ===================================== */}

      <h3>
        {booking.service?.name || "Service"}
      </h3>

      {/* =====================================
          EMERGENCY MESSAGE
      ===================================== */}

      {isEmergency && (
        <div className="provider-emergency-info">
          <strong>
            ⚡ Immediate service requested
          </strong>

          <span>
            Customer needs this service as soon
            as possible.
          </span>
        </div>
      )}

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
        {booking.user?.email ||
          "Not available"}
      </p>

      {/* =====================================
          PHONE
      ===================================== */}

      <p>
        Phone: {booking.phone || "-"}
      </p>

      {/* =====================================
          DATE / TIME
      ===================================== */}

      {isEmergency ? (
        <div className="provider-emergency-request-time">
          <p>
            <strong>Requested:</strong>{" "}
            {booking.date || "-"} at{" "}
            {booking.time || "-"}
          </p>

          <small>
            Emergency request was created
            immediately.
          </small>
        </div>
      ) : (
        <>
          <p>
            Date: {booking.date || "-"}
          </p>

          <p>
            Time: {booking.time || "-"}
          </p>
        </>
      )}

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
          Notes: {booking.notes}
        </p>
      )}

      {/* =====================================
          EMERGENCY CUSTOMER LOCATION
      ===================================== */}

      {isEmergency &&
        booking.customerLocation?.latitude !==
          null &&
        booking.customerLocation?.longitude !==
          null && (
          <div className="provider-emergency-location">
            <strong>
              📍 Customer Location Available
            </strong>

            <p>
              Customer location was captured
              when the emergency request was
              created.
            </p>

            <button
              type="button"
              onClick={() => {
                const {
                  latitude,
                  longitude,
                } = booking.customerLocation;

                window.open(
                  `https://www.google.com/maps?q=${latitude},${longitude}`,
                  "_blank"
                );
              }}
            >
              Open Customer Location
            </button>
          </div>
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
            className={
              isEmergency
                ? "provider-emergency-accept"
                : ""
            }
            onClick={() =>
              onAccept(booking._id)
            }
          >
            {isEmergency
              ? "Accept Emergency"
              : "Accept"}
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
              navigate(
                `/provider/material-preparation/${booking._id}`
              )
            }
          >
            Material Preparation
          </button>

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
              navigate(
                `/provider/material-preparation/${booking._id}`
              )
            }
          >
            Material Preparation
          </button>

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
          COMPLETED + FOLLOW-UP
      ===================================== */}

      {booking.status === "completed" && (
        <div className="provider-completed-section">
          <div className="provider-completed-message">
            ✓ Service completed
          </div>

          {/* Show Follow-up button */}
          {!showFollowUp && (
            <button
              type="button"
              onClick={() =>
                setShowFollowUp(true)
              }
            >
              Follow-up
            </button>
          )}

          {/* Follow-up form */}
          {showFollowUp && (
            <div className="provider-follow-up-form">
              <h4>
                Schedule Follow-up
              </h4>

              <p>
                Choose when the customer should
                receive a reminder to book this
                service again.
              </p>

              <div className="provider-follow-up-inputs">
                <input
                  type="number"
                  min="1"
                  value={followUpValue}
                  onChange={(e) =>
                    setFollowUpValue(
                      e.target.value
                    )
                  }
                  placeholder="Enter time"
                />

                <select
                  value={followUpUnit}
                  onChange={(e) =>
                    setFollowUpUnit(
                      e.target.value
                    )
                  }
                >
                  <option value="minutes">
                    Minutes
                  </option>

                  <option value="hours">
                    Hours
                  </option>

                  <option value="days">
                    Days
                  </option>

                  <option value="weeks">
                    Weeks
                  </option>
                </select>
              </div>

              <div className="provider-follow-up-actions">
                <button
                  type="button"
                  onClick={
                    handleScheduleFollowUp
                  }
                  disabled={followUpLoading}
                >
                  {followUpLoading
                    ? "Scheduling..."
                    : "Schedule Follow-up"}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setShowFollowUp(false);
                    setFollowUpValue("");
                  }}
                  disabled={followUpLoading}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
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