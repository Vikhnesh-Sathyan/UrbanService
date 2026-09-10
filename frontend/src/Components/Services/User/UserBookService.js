import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { createBooking } from "../../../Services/bookingService";

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
  // SUBMIT BOOKING
  // ==========================================

  const handleSubmit = async (e) => {

    e.preventDefault();

    // Phone validation
    if (!/^\d{10}$/.test(phone)) {

      alert(
        "Please enter a valid 10-digit phone number"
      );

      return;
    }

    // Date validation
    if (!date) {

      alert("Please select a booking date");

      return;
    }

    // Time validation
    if (!time) {

      alert("Please select a booking time");

      return;
    }

    if (
      time < startTime ||
      time > endTime
    ) {

      alert(
        `Booking time must be between ${startTime} and ${endTime}`
      );

      return;
    }

    try {

      setLoading(true);

      const data = await createBooking({

        service: service._id,

        phone,

        date,

        time,

        notes,

      });

      console.log(
        "BOOKING CREATED:",
        data
      );

      alert(
        "Booking created successfully!"
      );

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

            Select a date and time within the
            provider's availability.

          </p>


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

                Available:
                {" "}
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

                Working hours:
                {" "}
                {startTime} — {endTime}

              </small>

            </div>


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