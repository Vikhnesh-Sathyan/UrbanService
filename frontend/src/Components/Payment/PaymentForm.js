import React, { useState } from "react";
import {
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";

const PaymentForm = ({ bookingId }) => {
  const stripe = useStripe();
  const elements = useElements();

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setLoading(true);
    setMessage("");

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
      return_url: `${window.location.origin}/payment/success?bookingId=${bookingId}`,      },
    });

    if (error) {
      setMessage(error.message || "Payment failed.");
      setLoading(false);
    }
  };

  return (
    <form className="payment-form" onSubmit={handleSubmit}>
      <div className="payment-form-header">
        <span className="payment-label">SECURE PAYMENT</span>

        <h2>Complete Your Payment</h2>

        <p>
          Your payment information is securely processed by Stripe.
        </p>
      </div>

      <div className="payment-element-wrapper">
        <PaymentElement />
      </div>

      {message && (
        <p className="payment-error">
          {message}
        </p>
      )}

      <button
        type="submit"
        className="payment-submit-button"
        disabled={!stripe || !elements || loading}
      >
        {loading ? "Processing..." : "Pay Now"}
      </button>
    </form>
  );
};

export default PaymentForm;