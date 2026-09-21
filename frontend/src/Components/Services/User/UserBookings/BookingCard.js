import React, { useEffect, useState } from "react";
import TrackingMap from "../../Tracking/TrackingMap";


import {
  getProviderLocation,
} from "../../../../Services/bookingService";


const BookingCard = ({
  booking,
  actionLoading,
  onCancel,
  onReschedule,
  onReview,
}) => {

  // ==========================================
  // PROVIDER LOCATION
  // ==========================================

  const [providerLocation, setProviderLocation] =
    useState(null);

  const [locationLoading, setLocationLoading] =
    useState(false);

  const [locationError, setLocationError] =
    useState("");

  const [customerLocation, setCustomerLocation] =
  useState(null);


  // ==========================================
  // GET PROVIDER LOCATION
  // ==========================================

  const loadProviderLocation = async () => {

    try {

      setLocationLoading(true);

      setLocationError("");


      const data = await getProviderLocation(
        booking._id
      );


      setProviderLocation(
        data?.tracking || null
      );

    } catch (error) {

      console.error(
        "Failed to load provider location:",
        error
      );


      setProviderLocation(null);


      setLocationError(
        error.response?.data?.message ||
        "Provider location is not available yet"
      );

    } finally {

      setLocationLoading(false);

    }

  };

  const loadCustomerLocation = () => {
  if (!navigator.geolocation) {
    setLocationError(
      "Geolocation is not supported by this browser."
    );
    return;
  }

  navigator.geolocation.getCurrentPosition(
    (position) => {
      const latitude =
        position.coords.latitude;

      const longitude =
        position.coords.longitude;

      setCustomerLocation({
        latitude,
        longitude,
      });

      console.log(
        "Customer GPS:",
        latitude,
        longitude
      );
    },
    (error) => {
      console.error(
        "Customer location error:",
        error
      );

      setLocationError(
        "Unable to get your location."
      );
    },
    {
      enableHighAccuracy: true,
      maximumAge: 10000,
      timeout: 10000,
    }
  );
};

  // ==========================================
  // LOAD LOCATION WHEN IN PROGRESS
  // ==========================================
useEffect(() => {
  if (booking.status !== "in_progress") {
    setProviderLocation(null);
    setCustomerLocation(null);
    setLocationError("");
    return;
  }

  // Get provider location
  loadProviderLocation();

  // Get customer's location
// Get customer's location
if (
  booking.bookingType === "emergency" &&
  booking.customerLocation?.latitude !== null &&
  booking.customerLocation?.longitude !== null
) {
  setCustomerLocation({
    latitude: booking.customerLocation.latitude,
    longitude: booking.customerLocation.longitude,
  });
} else {
  loadCustomerLocation();
}

  // Refresh provider location every 5 seconds
  const interval = setInterval(() => {
    loadProviderLocation();
  }, 5000);

  return () => {
    clearInterval(interval);
  };
}, [booking.status, booking._id]);


  // ==========================================
  // STATUS CLASS
  // ==========================================

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
// ==========================================
// CALCULATE DISTANCE BETWEEN TWO LOCATIONS
// ==========================================

const calculateDistance = (
  providerLatitude,
  providerLongitude,
  customerLatitude,
  customerLongitude
) => {
  const earthRadius = 6371; // kilometers

  const latitudeDifference =
    ((customerLatitude - providerLatitude) *
      Math.PI) /
    180;

  const longitudeDifference =
    ((customerLongitude - providerLongitude) *
      Math.PI) /
    180;

  const providerLat =
    (providerLatitude * Math.PI) / 180;

  const customerLat =
    (customerLatitude * Math.PI) / 180;

  const a =
    Math.sin(latitudeDifference / 2) *
      Math.sin(latitudeDifference / 2) +
    Math.cos(providerLat) *
      Math.cos(customerLat) *
      Math.sin(longitudeDifference / 2) *
      Math.sin(longitudeDifference / 2);

  const c =
    2 *
    Math.atan2(
      Math.sqrt(a),
      Math.sqrt(1 - a)
    );

  return earthRadius * c;
};
// ==========================================
// PROVIDER DISTANCE
// ==========================================

const providerDistance =
  providerLocation &&
  customerLocation
    ? calculateDistance(
        providerLocation.latitude,
        providerLocation.longitude,
        customerLocation.latitude,
        customerLocation.longitude
      )
    : null;

  return (

  <div
    className={`booking-card ${
      booking.bookingType === "emergency"
        ? "booking-card-emergency"
        : ""
    }`}
  >

    {booking.bookingType === "emergency" && (
      <div className="booking-emergency-badge">
        🚨 Emergency Booking
      </div>
    )}


      {/* =====================================
          SERVICE
      ===================================== */}

      <h2>
        {booking.service?.name || "Unknown Service"}
      </h2>


      {/* =====================================
          CATEGORY
      ===================================== */}

      {booking.service?.category && (

        <p>
          Category:{" "}
          {booking.service.category}
        </p>

      )}


      {/* =====================================
          PRICE
      ===================================== */}

      {booking.service?.price !== undefined && (

        <p>
          Price: ₹
          {booking.service.price}
        </p>

      )}


      {/* =====================================
          PROVIDER
      ===================================== */}

      <p>
        Provider:{" "}
        {booking.provider?.name ||
          "Unknown Provider"}
      </p>


      <p>
        Provider Email:{" "}
        {booking.provider?.email || "-"}
      </p>


 {booking.bookingType === "emergency" ? (
  <div className="booking-emergency-request-time">
    <p>
      <strong>Requested:</strong>{" "}
      {booking.date || "-"} at {booking.time || "-"}
    </p>

    <small>
      This was created as an immediate emergency request.
    </small>
  </div>
) : (
  <>
    <p>
      Date:{" "}
      {booking.date || "-"}
    </p>

    <p>
      Time:{" "}
      {booking.time || "-"}
    </p>
  </>
)}


      {/* =====================================
          PHONE
      ===================================== */}

      <p>
        Phone:{" "}
        {booking.phone || "-"}
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
          STATUS
      ===================================== */}

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


      {/* =====================================
          PROVIDER TRACKING
      ===================================== */}

      {booking.status === "in_progress" && (

        <div className="provider-tracking-section">

          <h3>
            Provider Tracking
          </h3>


          {/* LOCATION LOADING */}

          {locationLoading && (

            <p>
              Getting provider location...
            </p>

          )}


          {/* LOCATION AVAILABLE */}

          {!locationLoading &&
            providerLocation && (
<div className="provider-location-info">

  {providerDistance !== null && (
    <p>
      <strong>Distance:</strong>{" "}
      {providerDistance < 1
        ? `${Math.round(
            providerDistance * 1000
          )} m`
        : `${providerDistance.toFixed(
            1
          )} km`}
    </p>
  )}

  {providerLocation.updatedAt && (
    <p>
      <strong>Last Updated:</strong>{" "}
      {new Date(
        providerLocation.updatedAt
      ).toLocaleString()}
    </p>
  )}

</div>

          )}

          {providerLocation && (
  <div className="provider-map">
  <TrackingMap
  latitude={providerLocation.latitude}
  longitude={providerLocation.longitude}
  customerLatitude={
    customerLocation?.latitude ?? null
  }
  customerLongitude={
    customerLocation?.longitude ?? null
  }
/>
{/* <TrackingMap 
  latitude={providerLocation.latitude} 
  longitude={providerLocation.longitude} 
  customerLatitude={8.800000} 
  customerLongitude={76.720000} 
/> */}
  </div>
)}

          {/* LOCATION NOT AVAILABLE */}

          {!locationLoading &&
            !providerLocation &&
            locationError && (

            <p>
              {locationError}
            </p>

          )}


          {/* REFRESH LOCATION */}

          <button
            type="button"
            onClick={loadProviderLocation}
            disabled={locationLoading}
          >
            {locationLoading
              ? "Updating..."
              : "Refresh Location"}
          </button>

        </div>

      )}


      {/* =====================================
          CANCEL / RESCHEDULE
      ===================================== */}

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


      {/* =====================================
          REVIEW
      ===================================== */}

      {booking.status === "completed" && (

        <div className="booking-review-section">

          {booking.rating ? (

            <>

              <p className="review-rating">
                Your Rating:{" "}
                {"⭐".repeat(
                  booking.rating
                )}
              </p>


              {booking.review && (

                <p className="review-text">
                  Your Review:{" "}
                  {booking.review}
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