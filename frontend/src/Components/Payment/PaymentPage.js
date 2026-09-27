import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";

import PaymentForm from "./PaymentForm";
import { createPaymentIntent } from "../../Services/paymentService";
import "../../styles/Payment.css";

const stripePromise = loadStripe(
  process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY
);

const PaymentPage = () => {
  const { bookingId } = useParams();

  const [clientSecret, setClientSecret] = useState("");
  const [amount, setAmount] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const initializePayment = async () => {
      try {
        setLoading(true);
        setError("");

        if (!bookingId) {
          throw new Error("Booking ID is missing.");
        }

        const response = await createPaymentIntent(bookingId);

        if (!response.success || !response.clientSecret) {
          throw new Error(
            response.message || "Unable to initialize payment"
          );
        }

        // Amount comes securely from backend
        setAmount(response.amount);

        setClientSecret(response.clientSecret);
      } catch (error) {
        console.error("Payment initialization error:", error);

        setError(
          error.response?.data?.message ||
            error.message ||
            "Unable to initialize payment"
        );
      } finally {
        setLoading(false);
      }
    };

    initializePayment();
  }, [bookingId]);

  if (loading) {
    return (
      <div className="payment-page">
        <div className="payment-loading">
          <p>Preparing secure payment...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="payment-page">
        <div className="payment-error-container">
          <h2>Payment Unavailable</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="payment-page">
      <div className="payment-container">
        <div className="payment-summary">
          <span className="payment-label">
            SERVICE PAYMENT
          </span>

          <h1>Complete Payment</h1>

          <p>
            Securely complete your booking payment through Stripe.
          </p>

          <div className="payment-amount">
            ₹{Number(amount).toFixed(2)}
          </div>
        </div>

        {clientSecret && (
          <Elements
            stripe={stripePromise}
            options={{
              clientSecret,
            }}
          >
            <PaymentForm />
          </Elements>
        )}
      </div>
    </div>
  );
};

export default PaymentPage;