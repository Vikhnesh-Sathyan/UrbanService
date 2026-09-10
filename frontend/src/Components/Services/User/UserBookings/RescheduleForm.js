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

    <div className="reschedule-form-container">

      <h2>
        Reschedule Booking
      </h2>


      <form onSubmit={onSubmit}>

        {/* DATE */}

        <div>

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


        {/* TIME */}

        <div>

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


        {/* CONFIRM */}

        <button
          type="submit"
          disabled={loading}
        >
          {loading
            ? "Updating..."
            : "Confirm Reschedule"}
        </button>


        {/* CLOSE */}

        <button
          type="button"
          disabled={loading}
          onClick={onClose}
        >
          Close
        </button>

      </form>

    </div>
  );
};


export default RescheduleForm;