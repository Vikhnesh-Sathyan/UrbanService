import React, { useState } from "react";
import { updateAvailability } from "../../../Services/providerAvailabilityService";

import "../../../styles/ProviderAvailability.css";

const ProviderAvailability = () => {

  // ==========================================
  // DAYS
  // ==========================================

  const availableDays = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];


  // ==========================================
  // STATE
  // ==========================================

  const [days, setDays] = useState([
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
  ]);

  const [startTime, setStartTime] =
    useState("09:00");

  const [endTime, setEndTime] =
    useState("18:00");

  const [loading, setLoading] =
    useState(false);


  // ==========================================
  // DAY SELECTION
  // ==========================================

  const handleDayChange = (day) => {

    setDays((previousDays) => {

      if (previousDays.includes(day)) {

        return previousDays.filter(
          (item) => item !== day
        );

      }

      return [
        ...previousDays,
        day,
      ];

    });

  };


  // ==========================================
  // SAVE AVAILABILITY
  // ==========================================

  const handleSubmit = async (e) => {

    e.preventDefault();

    if (days.length === 0) {
      alert("Please select at least one day");
      return;
    }

    if (startTime >= endTime) {
      alert("Start time must be before end time");
      return;
    }

    try {

      setLoading(true);

      const data = await updateAvailability({
        days,
        startTime,
        endTime,
      });

      console.log(
        "AVAILABILITY UPDATED:",
        data
      );

      alert(
        "Availability updated successfully!"
      );

    } catch (error) {

      console.error(
        "Availability error:",
        error
      );

      alert(
        error.response?.data?.message ||
        "Failed to update availability"
      );

    } finally {

      setLoading(false);

    }

  };


  // ==========================================
  // UI
  // ==========================================

  return (

    <div className="availability-page">

      <div className="availability-card">

        <div className="availability-header">

          <span className="availability-label">
            PROVIDER SETTINGS
          </span>

          <h1>
            My Availability
          </h1>

          <p>
            Set the days and working hours when
            customers can book your services.
          </p>

        </div>


        <form
          onSubmit={handleSubmit}
          className="availability-form"
        >

          {/* DAYS */}

          <div className="availability-section">

            <h2>
              Available Days
            </h2>

            <p>
              Select the days you accept bookings.
            </p>

            <div className="days-grid">

              {availableDays.map((day) => (

                <label
                  key={day}
                  className={
                    `day-option ${
                      days.includes(day)
                        ? "selected"
                        : ""
                    }`
                  }
                >

                  <input
                    type="checkbox"
                    checked={days.includes(day)}
                    onChange={() =>
                      handleDayChange(day)
                    }
                  />

                  <span>
                    {day}
                  </span>

                </label>

              ))}

            </div>

          </div>


          {/* TIME */}

          <div className="availability-section">

            <h2>
              Working Hours
            </h2>

            <div className="time-grid">

              <div className="time-field">

                <label>
                  Start Time
                </label>

                <input
                  type="time"
                  value={startTime}
                  onChange={(e) =>
                    setStartTime(e.target.value)
                  }
                  required
                />

              </div>


              <div className="time-field">

                <label>
                  End Time
                </label>

                <input
                  type="time"
                  value={endTime}
                  onChange={(e) =>
                    setEndTime(e.target.value)
                  }
                  required
                />

              </div>

            </div>

          </div>


          {/* SUMMARY */}

          <div className="availability-summary">

            <span>
              Booking window
            </span>

            <strong>
              {startTime} — {endTime}
            </strong>

          </div>


          {/* SAVE */}

          <button
            type="submit"
            className="save-availability-btn"
            disabled={loading}
          >

            {loading
              ? "Saving..."
              : "Save Availability →"}

          </button>

        </form>

      </div>

    </div>

  );

};

export default ProviderAvailability;