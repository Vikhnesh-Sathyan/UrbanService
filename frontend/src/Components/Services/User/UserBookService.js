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
  // null = no booking type selected yet
  const [bookingType, setBookingType] = useState(null);

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
          <h2>Service information not found</h2>

          <p>Please select the service again.</p>

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
      alert(`Provider is not available on ${selectedDay}`);

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
  // GET CUSTOMER LOCATION
  // + FIND NEARBY EMERGENCY PROVIDERS
  // ==========================================

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }

    setLocationLoading(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;

        const locationData = {
          latitude,
          longitude,
        };

        setCustomerLocation(locationData);

        console.log(
          "CUSTOMER LOCATION:",
          locationData
        );

        try {
          // Find nearby providers
          const data = await getNearbyEmergencyProviders(
            latitude,
            longitude,
            service._id
          );

          console.log(
            "NEARBY PROVIDERS:",
            data
          );

          setNearbyProviders(
            data.providers || []
          );
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
        console.error(
          "Location error:",
          error
        );

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

    // Safety check
    if (!bookingType) {
      return;
    }

    setLoading(true);

    try {
      // ==========================================
      // EMERGENCY BOOKING
      // ==========================================

      if (bookingType === "emergency") {
        if (!customerLocation) {
          alert(
            "Please detect your current location first."
          );

          setLoading(false);

          return;
        }

        if (!selectedProvider) {
          alert(
            "Please select a nearby provider."
          );

          setLoading(false);

          return;
        }

        const data =
          await createEmergencyBooking({
            service: service._id,
            phone,
            provider: selectedProvider._id,

            customerLocation: {
              latitude:
                customerLocation.latitude,
              longitude:
                customerLocation.longitude,
            },

            notes,
          });

        console.log(
          "EMERGENCY BOOKING CREATED:",
          data
        );

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

      console.log(
        "NORMAL BOOKING CREATED:",
        data
      );

      alert("Booking created successfully.");

      navigate("/user/bookings");
    } catch (error) {
      console.error(
        "Booking error:",
        error
      );

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
        <h1>Book Service</h1>

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
            BOOKING CARD
        ====================================== */}

        <div
          className={`user-book-form-card ${
            bookingType === "emergency"
              ? "emergency-mode"
              : ""
          }`}
        >

          <h2>
            Booking Details
          </h2>

          <p className="user-book-form-subtitle">
            Choose how you want to book this service.
          </p>


          {/* ==========================================
              BOOKING TYPE
          ========================================== */}

          <div className="user-book-type-section">

            <div className="user-book-type-header">

              <span className="user-book-section-label">
                BOOKING TYPE
              </span>

              <h3>
                How would you like to book?
              </h3>

              <p>
                Choose a scheduled appointment or request immediate assistance.
              </p>

            </div>


            <div className="user-book-type-selection">


              {/* NORMAL BOOKING */}

              <button
                type="button"
                className={`user-book-type-button ${
                  bookingType === "normal"
                    ? "active"
                    : ""
                }`}
                onClick={() => {

                  setBookingType("normal");

                  // Clear emergency data
                  setSelectedProvider(null);
                  setNearbyProviders([]);
                  setCustomerLocation(null);

                }}
              >

                <span className="user-book-type-icon">
                  📅
                </span>


                <span className="user-book-type-content">

                  <strong>
                    Normal Booking
                  </strong>

                  <small>
                    Schedule a service for a preferred date and time.
                  </small>

                </span>


                <span className="user-book-type-check">
                  {bookingType === "normal"
                    ? "✓"
                    : ""}
                </span>

              </button>


              {/* EMERGENCY BOOKING */}

              <button
                type="button"
                className={`user-book-type-button emergency ${
                  bookingType === "emergency"
                    ? "active"
                    : ""
                }`}
                onClick={() => {

                  setBookingType("emergency");

                  // Clear normal booking data
                  setDate("");
                  setTime("");

                }}
              >

                <span className="user-book-type-icon">
                  🚨
                </span>


                <span className="user-book-type-content">

                  <strong>
                    Emergency Service
                  </strong>

                  <small>
                    Get immediate help from a nearby provider.
                  </small>

                </span>


                <span className="user-book-type-check">
                  {bookingType === "emergency"
                    ? "✓"
                    : ""}
                </span>

              </button>

            </div>

          </div>


          {/* ==========================================
              FORM
              
              IMPORTANT:
              The form appears ONLY after the user
              selects Normal or Emergency.
          ========================================== */}

          {bookingType && (

            <form onSubmit={handleSubmit}>


              {/* ======================================
                  EMERGENCY SECTION
              ====================================== */}

              {bookingType === "emergency" && (

                <div className="user-book-emergency-info">

                  <div className="user-book-emergency-heading">

                    <div className="user-book-emergency-icon">
                      🚨
                    </div>


                    <div>

                      <span>
                        EMERGENCY SERVICE
                      </span>

                      <h3>
                        Need help right now?
                      </h3>

                    </div>

                  </div>


                  <p className="user-book-emergency-description">

                    We'll use your current location to find
                    nearby providers who can respond to your
                    emergency request.

                  </p>


                  <button
                    type="button"
                    className="user-book-emergency-location"
                    onClick={handleGetLocation}
                    disabled={locationLoading}
                  >

                    <span>
                      {locationLoading
                        ? "Detecting Location..."
                        : "📍 Find Nearby Providers"}
                    </span>


                    {!locationLoading && (
                      <span className="user-book-location-arrow">
                        →
                      </span>
                    )}

                  </button>


                  {/* LOCATION SUCCESS */}

                  {customerLocation && (

                    <div className="user-book-location-success">

                      <div className="user-book-location-success-icon">
                        ✓
                      </div>


                      <div>

                        <strong>
                          Location detected
                        </strong>

                        <small>
                          Your location will be used to find nearby emergency providers.
                        </small>

                      </div>

                    </div>

                  )}


                  {/* ======================================
                      NEARBY PROVIDERS
                  ====================================== */}

                  {nearbyProviders.length > 0 && (

                    <div className="user-book-nearby-providers">

                      <div className="user-book-nearby-header">

                        <div>

                          <span>
                            AVAILABLE NOW
                          </span>

                          <h3>
                            Nearby Providers
                          </h3>

                        </div>


                        <div className="user-book-provider-count">
                          {nearbyProviders.length}
                        </div>

                      </div>


                      <p className="user-book-nearby-subtitle">
                        Select a provider near your current location.
                      </p>


                      <div className="user-book-nearby-list">

                        {nearbyProviders.map((item) => (

                          <div
                            key={item.provider._id}
                            className={`user-book-nearby-provider ${
                              selectedProvider?._id ===
                              item.provider._id
                                ? "selected"
                                : ""
                            }`}
                          >

                            <div className="user-book-provider-avatar">

                              {item.provider.name
                                ?.charAt(0)
                                ?.toUpperCase() || "P"}

                            </div>


                            <div className="user-book-nearby-provider-info">

                              <strong>
                                {item.provider.name}
                              </strong>

                              <span>
                                📍 {item.distance} km away
                              </span>

                            </div>


                            <button
                              type="button"
                              className="user-book-provider-select"
                              onClick={() => {
                                setSelectedProvider(
                                  item.provider
                                );
                              }}
                            >

                              {selectedProvider?._id ===
                              item.provider._id
                                ? "Selected ✓"
                                : "Select"}

                            </button>

                          </div>

                        ))}

                      </div>

                    </div>

                  )}

                </div>

              )}


              {/* ======================================
                  PHONE
              ====================================== */}

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


              {/* ======================================
                  NORMAL BOOKING DATE + TIME
              ====================================== */}

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


              {/* ======================================
                  NOTES
              ====================================== */}

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


              {/* ======================================
                  SUBMIT
              ====================================== */}

              <button
                type="submit"
                className={`user-book-submit ${
                  bookingType === "emergency"
                    ? "emergency-submit"
                    : ""
                }`}
                disabled={loading}
              >

                {loading ? (

                  "Processing..."

                ) : bookingType === "emergency" ? (

                  <>
                    <span>🚨</span>
                    Request Emergency Service
                  </>

                ) : (

                  <>
                    <span>✓</span>
                    Confirm Booking
                  </>

                )}

              </button>

            </form>

          )}

        </div>

      </div>

    </div>
  );
};

export default UserBookService;