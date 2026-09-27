import React, { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";

import PaymentForm from "./PaymentForm";
import { createPaymentIntent } from "../../Services/paymentService";

import "../../styles/Payment.css";

// ==========================================
// STRIPE PUBLIC KEY
// ==========================================

const stripePromise = loadStripe(
  process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY
);

const PaymentPage = () => {
  // Get booking ID from URL
  const { bookingId } = useParams();

  // Get payment amount from navigation state
  const location = useLocation();
  const amount = location.state?.amount;

  const [clientSecret, setClientSecret] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ==========================================
  // CREATE PAYMENT INTENT
  // ==========================================

  useEffect(() => {
    const initializePayment = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await createPaymentIntent(
            bookingId
        );

        if (!response.success || !response.clientSecret) {
          throw new Error(
            response.message || "Unable to initialize payment"
          );
        }

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

    if (bookingId && amount) {
      initializePayment();
    } else {
      setError("Booking information is missing.");
      setLoading(false);
    }
  }, [bookingId, amount]);

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="payment-page">
        <div className="payment-loading">
          <p>Preparing secure payment...</p>
        </div>
      </div>
    );
  }

  // ==========================================
  // ERROR
  // ==========================================

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

  // ==========================================
  // STRIPE PAYMENT
  // ==========================================

  return (
    <div className="payment-page">
      <div className="payment-container">

        {/* Payment Summary */}
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

        {/* Stripe Elements */}
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