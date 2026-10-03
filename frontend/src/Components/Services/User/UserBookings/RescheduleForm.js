import React from "react";

const RescheduleForm = ({
  newDate,
  newTime,
  setNewDate,
  setNewTime,
  loading,
  onSubmit,
  onClose,
}) => {
  return (
    <div className="reschedule-modal-overlay">

      <div className="reschedule-modal">

        {/* HEADER */}

        <div className="reschedule-modal-header">
          <div>
            <span className="reschedule-eyebrow">
              BOOKING UPDATE
            </span>

            <h2>Reschedule Booking</h2>

            <p>
              Choose a new date and time for your service.
            </p>
          </div>

          <button
            type="button"
            className="reschedule-close"
            onClick={onClose}
            disabled={loading}
          >
            ×
          </button>
        </div>


        {/* FORM */}

        <form onSubmit={onSubmit}>

          <div className="reschedule-field">

            <label>
              New Date
            </label>

            <input
              type="date"
              value={newDate}
              min={
                new Date()
                  .toISOString()
                  .split("T")[0]
              }
              onChange={(e) =>
                setNewDate(e.target.value)
              }
              required
            />

          </div>


          <div className="reschedule-field">

            <label>
              New Time
            </label>

            <input
              type="time"
              value={newTime}
              onChange={(e) =>
                setNewTime(e.target.value)
              }
              required
            />

          </div>


          <div className="reschedule-actions">

            <button
              type="button"
              className="reschedule-cancel"
              disabled={loading}
              onClick={onClose}
            >
              Close
            </button>

            <button
              type="submit"
              className="reschedule-submit"
              disabled={loading}
            >
              {loading
                ? "Updating..."
                : "Confirm Reschedule"}
            </button>

          </div>

        </form>

      </div>

    </div>
  );
};

export default RescheduleForm;