
import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import { getPaymentStatus } from "../../Services/paymentService";
import "../../styles/Payment.css";

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [paymentStatus, setPaymentStatus] = useState("checking");
  const [payment, setPayment] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
const checkPaymentStatus = async () => {
  try {
    const bookingId = searchParams.get("bookingId");

    if (!bookingId) {
      setError("Booking information is missing.");
      setPaymentStatus("error");
      return;
    }

    // Retry a few times because the Stripe webhook
    // may update MongoDB slightly after the redirect.
    const maxAttempts = 5;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      const response = await getPaymentStatus(bookingId);

      if (!response.success) {
        throw new Error(
          response.message || "Unable to verify payment"
        );
      }

      setPayment(response.payment);

      if (response.payment.status === "succeeded") {
        setPaymentStatus("succeeded");
        return;
      }

      if (response.payment.status === "failed") {
        setPaymentStatus("failed");
        return;
      }

      // Payment is still pending.
      // Wait 1 second before checking again.
      if (attempt < maxAttempts) {
        await new Promise((resolve) =>
          setTimeout(resolve, 1000)
        );
      }
    }

    // Still pending after all attempts
    setPaymentStatus("pending");
  } catch (error) {
    console.error("Payment verification error:", error);

    setError(
      error.response?.data?.message ||
        error.message ||
        "Unable to verify payment"
    );

    setPaymentStatus("error");
  }
};

    checkPaymentStatus();
  }, [searchParams]);

  // ==========================================
  // VERIFYING PAYMENT
  // ==========================================

  if (paymentStatus === "checking") {
    return (
      <div className="payment-page">
        <div className="payment-success-container">
          <h1>Verifying Payment...</h1>

          <p>
            Please wait while we confirm your payment.
          </p>
        </div>
      </div>
    );
  }

  // ==========================================
  // VERIFICATION ERROR
  // ==========================================

  if (paymentStatus === "error") {
    return (
      <div className="payment-page">
        <div className="payment-error-container">
          <h2>Payment Verification Failed</h2>

          <p>{error}</p>

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
  }

  // ==========================================
  // PAYMENT RESULT
  // ==========================================

  return (
    <div className="payment-page">
      <div className="payment-success-container">

        {/* PAYMENT SUCCESS */}
        {paymentStatus === "succeeded" && (
          <>
            <div className="payment-success-icon">
              ✓
            </div>

            <span className="payment-label">
              PAYMENT SUCCESSFUL
            </span>

            <h1>Payment Completed</h1>

            <p>
              Your payment was successfully verified.
            </p>

            {payment && (
              <div className="payment-verification-details">
                <p>
                  Amount:{" "}
                  <strong>
                    ₹{Number(payment.amount).toFixed(2)}
                  </strong>
                </p>

                <p>
                  Status: <strong>Paid</strong>
                </p>
              </div>
            )}
          </>
        )}

        {/* PAYMENT PENDING */}
        {paymentStatus === "pending" && (
          <>
            <span className="payment-label">
              PAYMENT PROCESSING
            </span>

            <h1>Payment Is Being Processed</h1>

            <p>
              Your payment has not been confirmed yet.
              Please check your bookings shortly.
            </p>
          </>
        )}

        {/* PAYMENT FAILED */}
        {paymentStatus === "failed" && (
          <>
            <span className="payment-label">
              PAYMENT FAILED
            </span>

            <h1>Payment Failed</h1>

            <p>
              We could not confirm this payment.
              Please try again.
            </p>
          </>
        )}

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
