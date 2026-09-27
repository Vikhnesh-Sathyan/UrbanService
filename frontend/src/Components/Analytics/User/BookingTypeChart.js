import React from "react";
import { FaCalendarCheck, FaAmbulance } from "react-icons/fa";

const BookingTypeChart = ({ data }) => {
  const normalBookings =
    data.find((item) => item._id === "normal")?.count || 0;

  const emergencyBookings =
    data.find((item) => item._id === "emergency")?.count || 0;

  const totalBookings = normalBookings + emergencyBookings;

  if (totalBookings === 0) {
    return (
      <div className="user-analytics-panel">
        <div className="user-analytics-panel-header">
          <div>
            <h2>Booking Type</h2>
            <p>Compare your normal and emergency bookings.</p>
          </div>
        </div>

        <div className="user-analytics-empty">
          <div className="user-analytics-empty-icon">
            <FaCalendarCheck />
          </div>

          <h3>No booking type data yet</h3>

          <p>
            Your normal and emergency booking activity will appear here.
          </p>
        </div>
      </div>
    );
  }

  const normalPercentage = Math.round(
    (normalBookings / totalBookings) * 100
  );

  const emergencyPercentage = Math.round(
    (emergencyBookings / totalBookings) * 100
  );

  return (
    <div className="user-analytics-panel">
      <div className="user-analytics-panel-header">
        <div>
          <h2>Booking Type</h2>
          <p>Compare your normal and emergency bookings.</p>
        </div>
      </div>

      <div className="user-booking-type-list">
        {/* Normal bookings */}
        <div className="user-booking-type-item">
          <div className="user-booking-type-info">
            <div className="user-booking-type-name">
              <span className="user-booking-type-icon normal">
                <FaCalendarCheck />
              </span>

              <span>Normal Bookings</span>
            </div>

            <strong>{normalBookings}</strong>
          </div>

          <div className="user-booking-type-bar">
            <div
              className="user-booking-type-bar-fill normal"
              style={{ width: `${normalPercentage}%` }}
            />
          </div>

          <span className="user-booking-type-percentage">
            {normalPercentage}%
          </span>
        </div>

        {/* Emergency bookings */}
        <div className="user-booking-type-item">
          <div className="user-booking-type-info">
            <div className="user-booking-type-name">
              <span className="user-booking-type-icon emergency">
                <FaAmbulance />
              </span>

              <span>Emergency Bookings</span>
            </div>

            <strong>{emergencyBookings}</strong>
          </div>

          <div className="user-booking-type-bar">
            <div
              className="user-booking-type-bar-fill emergency"
              style={{ width: `${emergencyPercentage}%` }}
            />
          </div>

          <span className="user-booking-type-percentage">
            {emergencyPercentage}%
          </span>
        </div>
      </div>
    </div>
  );
};

export default BookingTypeChart;