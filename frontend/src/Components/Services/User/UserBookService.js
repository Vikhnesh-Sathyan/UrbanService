import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  createBooking,
  createEmergencyBooking,
  getNearbyEmergencyProviders,
} from "../../../Services/bookingService";

import "../../../styles/UserBookService.css";

const UserBookService = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Service passed from Service Details page
  const service = location.state?.service;

  // ==========================================
  // STATE
  // ==========================================

  const [phone, setPhone] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [notes, setNotes] = useState("");

  const [loading, setLoading] = useState(false);

  // Booking type
  const [bookingType, setBookingType] = useState("normal");

  // Customer location for emergency booking
  const [customerLocation, setCustomerLocation] = useState(null);

  const [locationLoading, setLocationLoading] = useState(false);

  // Nearby providers for emergency service
  const [nearbyProviders, setNearbyProviders] = useState([]);

  // Selected provider for emergency booking
  const [selectedProvider, setSelectedProvider] = useState(null);

  // ==========================================
  // PROVIDER AVAILABILITY
  // ==========================================

  const availability = service?.provider?.availability;

  const availableDays = availability?.days || [];

  const startTime = availability?.startTime || "09:00";

  const endTime = availability?.endTime || "18:00";

  // ==========================================
  // SERVICE NOT FOUND
  // ==========================================

  if (!service) {
    return (
      <div className="user-book-service-page">

        <div className="user-book-not-found">

          <h2>
            Service information not found
          </h2>

          <p>
            Please select the service again.
          </p>

          <button
            type="button"
            onClick={() => navigate("/user/services")}
          >
            Back to Services
          </button>

        </div>

      </div>
    );
  }

  // ==========================================
  // DATE CHANGE
  // ==========================================

  const handleDateChange = (e) => {

    const selectedDate = e.target.value;

    setDate(selectedDate);

    // Reset time when date changes
    setTime("");

    if (!selectedDate) {
      return;
    }

    const selectedDay = new Date(
      `${selectedDate}T00:00:00`
    ).toLocaleDateString("en-US", {
      weekday: "long",
    });

    // Check provider available day
    if (!availableDays.includes(selectedDay)) {

      alert(
        `Provider is not available on ${selectedDay}`
      );

      setDate("");

      return;
    }
  };

  // ==========================================
  // TIME CHANGE
  // ==========================================

  const handleTimeChange = (e) => {

    const selectedTime = e.target.value;

    if (
      selectedTime < startTime ||
      selectedTime > endTime
    ) {

      alert(
        `Please select a time between ${startTime} and ${endTime}`
      );

      setTime("");

      return;
    }

    setTime(selectedTime);
  };

  // ==========================================
  // GET CUSTOMER CURRENT LOCATION
  // ==========================================

// ==========================================
// GET CUSTOMER LOCATION + NEARBY PROVIDERS
// ==========================================

const handleGetLocation = () => {
  // Check browser support
  if (!navigator.geolocation) {
    alert("Geolocation is not supported by your browser.");
    return;
  }

  setLocationLoading(true);

  navigator.geolocation.getCurrentPosition(
    async (position) => {
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;

      // Save customer location
      const locationData = {
        latitude,
        longitude,
      };

      setCustomerLocation(locationData);

      console.log("CUSTOMER LOCATION:", locationData);

      try {
        // Find nearby providers
        const data = await getNearbyEmergencyProviders(
          latitude,
          longitude,
          service._id
        );

        console.log("NEARBY PROVIDERS:", data);

        setNearbyProviders(data.providers || []);

      } catch (error) {
        console.error(
          "Nearby provider error:",
          error
        );

        alert(
          error.response?.data?.message ||
          "Failed to find nearby providers"
        );
      } finally {
        setLocationLoading(false);
      }
    },

    (error) => {
      console.error("Location error:", error);

      setLocationLoading(false);

      alert(
        "Unable to get your location. Please allow location permission."
      );
    }
  );
};

  // ==========================================
  // SUBMIT BOOKING
  // ==========================================

const handleSubmit = async (e) => {
  e.preventDefault();

  setLoading(true);

  try {
    // ==========================================
    // EMERGENCY BOOKING
    // ==========================================
    if (bookingType === "emergency") {
      if (!customerLocation) {
        alert("Please detect your current location first.");
        setLoading(false);
        return;
      }

      if (!selectedProvider) {
        alert("Please select a nearby provider.");
        setLoading(false);
        return;
      }

      const data = await createEmergencyBooking({
        service: service._id,
        phone,
        provider: selectedProvider._id,

        customerLocation: {
          latitude: customerLocation.latitude,
          longitude: customerLocation.longitude,
        },

        notes,
      });

      console.log("EMERGENCY BOOKING CREATED:", data);

alert(
  "🚨 Emergency booking request sent successfully!\n\n" +
  "Your request has been sent to the selected provider."
);
      
      navigate("/user/bookings");

      return;
    }

    // ==========================================
    // NORMAL BOOKING
    // ==========================================

    const data = await createBooking({
      service: service._id,
      phone,
      date,
      time,
      notes,
    });

    console.log("NORMAL BOOKING CREATED:", data);

    alert("Booking created successfully.");

    // Keep your existing navigation here
    // Example:
    // navigate("/user/bookings");

  } catch (error) {
    console.error("Booking error:", error);

    alert(
      error.response?.data?.message ||
      "Failed to create booking"
    );
  } finally {
    setLoading(false);
  }
};

  // ==========================================
  // TODAY
  // ==========================================

  const today = new Date()
    .toISOString()
    .split("T")[0];

  // ==========================================
  // UI
  // ==========================================

  return (

    <div className="user-book-service-page">

      {/* BACK */}

      <button
        type="button"
        className="user-book-back"
        onClick={() => navigate(-1)}
      >
        ← Back
      </button>


      {/* HEADER */}

      <div className="user-book-header">

        <h1>
          Book Service
        </h1>

        <p>
          Book a service from the selected provider.
        </p>

      </div>


      {/* MAIN LAYOUT */}

      <div className="user-book-layout">


        {/* ======================================
            SERVICE CARD
        ====================================== */}

        <div className="user-book-service-card">

          <div className="user-book-service-image">

            {service.image ? (

              <img
                src={`http://localhost:5000/uploads/${service.image}`}
                alt={service.name}
              />

            ) : (

              <div className="user-book-no-image">
                No image available
              </div>

            )}

          </div>


          <div className="user-book-service-info">

            <span className="user-book-category">

              {service.category}

            </span>


            <h2>
              {service.name}
            </h2>


            <div className="user-book-price">

              ₹{service.price}

            </div>


            <span className="user-book-price-label">

              Service price

            </span>


            {/* PROVIDER */}

            <div className="user-book-provider">

              <div className="user-book-provider-label">

                Provider

              </div>

              <div className="user-book-provider-name">

                {service.provider?.name ||
                  "Unknown Provider"}

              </div>

            </div>


            {/* ==================================
                AVAILABILITY
            ================================== */}

            <div className="user-book-availability">

              <div className="user-book-availability-title">

                Provider Availability

              </div>


              <div className="user-book-availability-label">

                Available Days

              </div>


              <div className="user-book-days">

                {availableDays.length > 0 ? (

                  availableDays.map((day) => (

                    <span key={day}>
                      {day}
                    </span>

                  ))

                ) : (

                  <span>
                    Availability not set
                  </span>

                )}

              </div>


              <div className="user-book-availability-label">

                Working Hours

              </div>


              <strong>

                {startTime} — {endTime}

              </strong>

            </div>

          </div>

        </div>


        {/* ======================================
            BOOKING FORM
        ====================================== */}

        <div className="user-book-form-card">

        <h2>
  Booking Details
</h2>

<p className="user-book-form-subtitle">
  Choose how you want to book this service.
</p>
{bookingType === "emergency" && (
  <div className="user-book-emergency-info">

    <h3>🚨 Emergency Service</h3>

    <p>
      Need this service immediately?
      We'll find nearby providers based on your current location.
    </p>

    <button
  type="button"
  className="user-book-emergency-location"
  onClick={handleGetLocation}
  disabled={locationLoading}
>
  {locationLoading
    ? "Detecting Location..."
    : "📍 Find Nearby Providers"}
</button>

{customerLocation && (
  <div className="user-book-location-success">
    <p>📍 Your location has been detected</p>
    <small>
      Your current location will be used to find nearby emergency providers.
    </small>
  </div>
)}

{/* NEARBY PROVIDERS */}

{nearbyProviders.length > 0 && (
  <div className="user-book-nearby-providers">
    <h3>Nearby Providers</h3>

    <p className="user-book-nearby-subtitle">
      Providers available near your current location
    </p>

    {nearbyProviders.map((item) => (
      <div
        key={item.provider._id}
        className="user-book-nearby-provider"
      >
        <div className="user-book-nearby-provider-info">
          <strong>{item.provider.name}</strong>

          <p>
            📍 {item.distance} km away
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setSelectedProvider(item.provider);
            console.log("SELECTED PROVIDER:", item.provider);
          }}
        >
          {selectedProvider?._id === item.provider._id
            ? "Selected ✓"
            : "Select"}
        </button>
      </div>
    ))}
  </div>
)}


  </div>
)}
{/* BOOKING TYPE */}
<div className="user-book-type-selection">

  <button
    type="button"
    className={`user-book-type-button ${
      bookingType === "normal" ? "active" : ""
    }`}
    onClick={() => setBookingType("normal")}
  >
    📅 Normal Booking
  </button>

  <button
    type="button"
    className={`user-book-type-button ${
      bookingType === "emergency" ? "active emergency" : ""
    }`}
    onClick={() => setBookingType("emergency")}
  >
    🚨 Emergency Service
  </button>

</div>


          <form onSubmit={handleSubmit}>


            {/* PHONE */}

            <div className="user-book-form-group">

              <label>
                Phone Number
              </label>

              <input
                type="tel"
                value={phone}
                onChange={(e) =>
                  setPhone(e.target.value)
                }
                placeholder="Enter 10-digit phone number"
                maxLength="10"
                required
              />

            </div>


{bookingType === "normal" && (
  <>
    
    {/* DATE */}
    <div className="user-book-form-group">

      <label>
        Booking Date
      </label>

      <input
        type="date"
        value={date}
        onChange={handleDateChange}
        min={today}
        required
      />

      <small className="user-book-help">
        Available:{" "}
        {availableDays.join(", ")}
      </small>

    </div>


    {/* TIME */}
    <div className="user-book-form-group">

      <label>
        Booking Time
      </label>

      <input
        type="time"
        value={time}
        onChange={handleTimeChange}
        min={startTime}
        max={endTime}
        required
      />

      <small className="user-book-help">
        Working hours:{" "}
        {startTime} — {endTime}
      </small>

    </div>

  </>
)}


            {/* NOTES */}

            <div className="user-book-form-group">

              <label>
                Notes
              </label>

              <textarea
                value={notes}
                onChange={(e) =>
                  setNotes(e.target.value)
                }
                placeholder="Describe your requirement (optional)"
                rows="4"
              />

            </div>


            {/* SUBMIT */}

            <button
              type="submit"
              className="user-book-submit"
              disabled={loading}
            >

              {loading
                ? "Booking..."
                : "Confirm Booking"}

            </button>

          </form>

        </div>

      </div>

    </div>
  );
};

export default UserBookService;