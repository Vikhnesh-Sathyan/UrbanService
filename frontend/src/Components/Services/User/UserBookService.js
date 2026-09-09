import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { createBooking } from "../../../Services/bookingService";

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
      <div>

        <h2>
          Service information not found
        </h2>

        <p>
          Please select the service again.
        </p>

        <button
          type="button"
          onClick={() =>
            navigate("/user/services")
          }
        >
          Back to Services
        </button>

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

      alert(
        "Please enter a valid 10-digit phone number"
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


      // Go to user's bookings
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
  // UI
  // ==========================================

  return (

    <div>

      {/* ======================================
          HEADER
      ====================================== */}

      <button
        type="button"
        onClick={() =>
          navigate(-1)
        }
      >
        ← Back
      </button>


      <h1>
        Book Service
      </h1>

      <p>
        Book a service from the selected provider.
      </p>


      {/* ======================================
          SELECTED SERVICE
      ====================================== */}

      <div>

        {service.image && (

          <img
            src={`http://localhost:5000/uploads/${service.image}`}
            alt={service.name}
            width="200"
          />

        )}

        <h2>
          {service.name}
        </h2>

        <p>
          Category: {service.category}
        </p>

        <h3>
          ₹{service.price}
        </h3>

        <p>
          Provider:{" "}
          {service.provider?.name ||
            "Unknown Provider"}
        </p>

      </div>


      {/* ======================================
          BOOKING FORM
      ====================================== */}

      <form onSubmit={handleSubmit}>

        {/* PHONE */}

        <div>

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

        <div>

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

        <div>

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


        {/* NOTES */}

        <div>

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
          disabled={loading}
        >

          {loading
            ? "Booking..."
            : "Confirm Booking"}

        </button>

      </form>

    </div>

  );

};

export default UserBookService;