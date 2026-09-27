import React from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/Payment.css";

const PaymentSuccess = () => {
  const navigate = useNavigate();

  return (
    <div className="payment-page">
      <div className="payment-success-container">
        <div className="payment-success-icon">
          ✓
        </div>

        <span className="payment-label">
          PAYMENT SUCCESSFUL
        </span>

        <h1>Payment Completed</h1>

        <p>
          Your payment was successfully processed.
        </p>

        <button
          type="button"
          className="payment-submit-button"
          onClick={() => navigate("/user/bookings")}
        >
          Go to My Bookings
        </button>
      </div>
    </div>
  );
};

export default PaymentSuccess;