
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { createBooking } from "../../../Services/bookingService";

import "../../../styles/UserBookService.css";

const UserBookService = () => {
  // ==========================================
  // ROUTER
  // ==========================================

  const location = useLocation();
  const navigate = useNavigate();

  // Service is passed from Service Details page
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
  // SUBMIT BOOKING
  // ==========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Phone validation
    if (!/^\d{10}$/.test(phone)) {
      alert("Please enter a valid 10-digit phone number");
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

      console.log("BOOKING CREATED:", data);

      alert("Booking created successfully!");

      // Go to user's bookings
      navigate("/user/bookings");
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
  // UI
  // ==========================================

  return (
    <div className="user-book-service-page">

      {/* ======================================
          BACK BUTTON
      ====================================== */}

      <button
        type="button"
        className="user-book-back"
        onClick={() => navigate(-1)}
      >
        ← Back
      </button>

      {/* ======================================
          HEADER
      ====================================== */}

      <div className="user-book-header">
        <h1>Book Service</h1>

        <p>
          Book a service from the selected provider.
        </p>
      </div>

      {/* ======================================
          MAIN LAYOUT
      ====================================== */}

      <div className="user-book-layout">

        {/* ======================================
            SERVICE SUMMARY CARD
        ====================================== */}

        <div className="user-book-service-card">

          {/* SERVICE IMAGE */}

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

          {/* SERVICE INFORMATION */}

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

            <div className="user-book-provider">

              <div className="user-book-provider-label">
                Provider
              </div>

              <div className="user-book-provider-name">
                {service.provider?.name ||
                  "Unknown Provider"}
              </div>

            </div>

          </div>
        </div>

        {/* ======================================
            BOOKING FORM CARD
        ====================================== */}

        <div className="user-book-form-card">

          <h2>
            Booking Details
          </h2>

          <p className="user-book-form-subtitle">
            Enter your details to book this service.
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

            {/* DATE + TIME */}

            <div className="user-book-date-time">

              {/* DATE */}

              <div className="user-book-form-group">

                <label>
                  Booking Date
                </label>

                <input
                  type="date"
                  value={date}
                  onChange={(e) =>
                    setDate(e.target.value)
                  }
                  min={
                    new Date()
                      .toISOString()
                      .split("T")[0]
                  }
                  required
                />

              </div>

              {/* TIME */}

              <div className="user-book-form-group">

                <label>
                  Booking Time
                </label>

                <input
                  type="time"
                  value={time}
                  onChange={(e) =>
                    setTime(e.target.value)
                  }
                  required
                />

              </div>

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
