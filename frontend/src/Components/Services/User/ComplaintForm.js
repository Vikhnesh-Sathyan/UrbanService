import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import { createComplaint } from "../../../Services/complaintService";

import "../../../styles/ComplaintForm.css";

const ComplaintForm = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const booking = location.state?.booking;

  const [reason, setReason] = useState("");
  const [description, setDescription] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Booking is required to submit a complaint
  if (!booking) {
    return (
      <div className="complaint-page">
        <div className="complaint-card">
          <h2>Booking Not Found</h2>

          <p>
            Please select a completed booking before
            reporting an issue.
          </p>

          <button
            onClick={() => navigate("/user/bookings")}
          >
            Back to Bookings
          </button>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!reason) {
      setError("Please select a reason.");
      return;
    }

    if (!description.trim()) {
      setError("Please describe the issue.");
      return;
    }

    try {
      setLoading(true);

      await createComplaint({
        booking: booking._id,
        reason,
        description: description.trim(),
      });

      setSuccess(
        "Your complaint has been submitted successfully."
      );

      setReason("");
      setDescription("");

      setTimeout(() => {
        navigate("/user/bookings");
      }, 1200);
    } catch (error) {
      console.error("Complaint submission error:", error);

      setError(
        error.response?.data?.message ||
          "Failed to submit complaint."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="complaint-page">

      <div className="complaint-header">
        <button
          className="complaint-back-button"
          onClick={() => navigate("/user/bookings")}
        >
          ← Back to Bookings
        </button>

        <div>
          <span className="complaint-eyebrow">
            SUPPORT
          </span>

          <h1>Report an Issue</h1>

          <p>
            Tell us what went wrong with your completed service.
          </p>
        </div>
      </div>

      <div className="complaint-layout">

        {/* Booking information */}
        <div className="complaint-booking-card">

          <span className="complaint-section-label">
            BOOKING
          </span>

          <h2>
            {booking.service?.title ||
              "Service Booking"}
          </h2>

          <div className="complaint-booking-details">

            <div>
              <span>Provider</span>
              <strong>
                {booking.provider?.name ||
                  "Provider"}
              </strong>
            </div>

            <div>
              <span>Date</span>
              <strong>
                {booking.date}
              </strong>
            </div>

            <div>
              <span>Time</span>
              <strong>
                {booking.time}
              </strong>
            </div>

            <div>
              <span>Status</span>
              <strong className="complaint-completed">
                Completed
              </strong>
            </div>

          </div>
        </div>

        {/* Complaint form */}
        <div className="complaint-form-card">

          <span className="complaint-section-label">
            ISSUE DETAILS
          </span>

          <h2>What happened?</h2>

          <form onSubmit={handleSubmit}>

            <div className="complaint-field">

              <label htmlFor="reason">
                Reason
              </label>

              <select
                id="reason"
                value={reason}
                onChange={(e) =>
                  setReason(e.target.value)
                }
              >
                <option value="">
                  Select an issue
                </option>

                <option value="service_quality">
                  Service Quality
                </option>

                <option value="provider_no_show">
                  Provider Did Not Arrive
                </option>

                <option value="service_not_provided">
                  Service Was Not Provided
                </option>

                <option value="payment_issue">
                  Payment Issue
                </option>

                <option value="inappropriate_behavior">
                  Inappropriate Behavior
                </option>

                <option value="other">
                  Other
                </option>
              </select>

            </div>

            <div className="complaint-field">

              <label htmlFor="description">
                Describe the issue
              </label>

              <textarea
                id="description"
                value={description}
                onChange={(e) =>
                  setDescription(e.target.value)
                }
                placeholder="Please explain what happened..."
                rows="7"
              />

            </div>

            {error && (
              <div className="complaint-error">
                {error}
              </div>
            )}

            {success && (
              <div className="complaint-success">
                {success}
              </div>
            )}

            <button
              type="submit"
              className="complaint-submit-button"
              disabled={loading}
            >
              {loading
                ? "Submitting..."
                : "Submit Complaint"}
            </button>

          </form>

        </div>

      </div>
    </div>
  );
};

export default ComplaintForm;