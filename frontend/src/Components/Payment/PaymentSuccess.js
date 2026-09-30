import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import {
  getPaymentStatus,
  refundPayment,
} from "../../Services/paymentService";

import "../../styles/Payment.css";

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [paymentStatus, setPaymentStatus] =
    useState("checking");

  const [payment, setPayment] = useState(null);

  const [error, setError] = useState("");

  const [refundLoading, setRefundLoading] =
    useState(false);

  const [refundMessage, setRefundMessage] =
    useState("");

  // ==========================================
  // CHECK PAYMENT STATUS
  // ==========================================

  useEffect(() => {
    const checkPaymentStatus = async () => {
      try {
        const bookingId =
          searchParams.get("bookingId");

        if (!bookingId) {
          setError(
            "Booking information is missing."
          );

          setPaymentStatus("error");

          return;
        }

        // Retry because Stripe webhook
        // may update MongoDB slightly later.
        const maxAttempts = 5;

        for (
          let attempt = 1;
          attempt <= maxAttempts;
          attempt++
        ) {
          const response =
            await getPaymentStatus(bookingId);

          if (!response.success) {
            throw new Error(
              response.message ||
                "Unable to verify payment"
            );
          }

          setPayment(response.payment);

          // ==========================================
          // PAYMENT SUCCESS
          // ==========================================

          if (
            response.payment.status ===
            "succeeded"
          ) {
            setPaymentStatus("succeeded");

            return;
          }

          // ==========================================
          // PAYMENT FAILED
          // ==========================================

          if (
            response.payment.status ===
            "failed"
          ) {
            setPaymentStatus("failed");

            return;
          }

          // Payment still pending.
          // Wait before checking again.
          if (attempt < maxAttempts) {
            await new Promise((resolve) =>
              setTimeout(resolve, 1000)
            );
          }
        }

        // Still pending after all attempts
        setPaymentStatus("pending");
      } catch (error) {
        console.error(
          "Payment verification error:",
          error
        );

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
  // REFUND PAYMENT
  // ==========================================

  const handleRefund = async () => {
    // Make sure payment exists
    if (!payment?.id) {
      return;
    }

    // Confirm refund
    const confirmed = window.confirm(
      "Are you sure you want to refund this payment?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setRefundLoading(true);
      setRefundMessage("");

      // Call backend refund API
      const response = await refundPayment(
        payment.id
      );

      if (!response.success) {
        throw new Error(
          response.message ||
            "Refund failed"
        );
      }

      // Update payment status in UI
      setPayment((previousPayment) => ({
        ...previousPayment,
        status: "refunded",
      }));

      setRefundMessage(
        "Payment refunded successfully."
      );
    } catch (error) {
      console.error(
        "Refund error:",
        error
      );

      setRefundMessage(
        error.response?.data?.message ||
          error.message ||
          "Unable to refund payment"
      );
    } finally {
      setRefundLoading(false);
    }
  };

  // ==========================================
  // VERIFYING PAYMENT
  // ==========================================

  if (paymentStatus === "checking") {
    return (
      <div className="payment-page">
        <div className="payment-success-container">

          <h1>
            Verifying Payment...
          </h1>

          <p>
            Please wait while we confirm
            your payment.
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

          <h2>
            Payment Verification Failed
          </h2>

          <p>{error}</p>

          <button
            type="button"
            className="payment-submit-button"
            onClick={() =>
              navigate("/user/bookings")
            }
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

        {/* ==========================================
            PAYMENT SUCCESS
        ========================================== */}

        {paymentStatus === "succeeded" && (
          <>
            <div className="payment-success-icon">
              ✓
            </div>

            <span className="payment-label">
              PAYMENT SUCCESSFUL
            </span>

            <h1>
              Payment Completed
            </h1>

            <p>
              Your payment was successfully
              verified.
            </p>

            {payment && (
              <div className="payment-verification-details">

                <p>
                  Amount:{" "}
                  <strong>
                    ₹
                    {Number(
                      payment.amount
                    ).toFixed(2)}
                  </strong>
                </p>

              <p>
  Status:{" "}
  <strong>
    {payment.status === "refunded"
      ? "Refunded"
      : "Paid"}
  </strong>
</p>

              </div>
            )}

            {/* ==========================================
                REFUND BUTTON
            ========================================== */}

            {payment?.status ===
              "succeeded" && (
              <>
                <button
                  type="button"
                  className="payment-submit-button"
                  onClick={
                    handleRefund
                  }
                  disabled={
                    refundLoading
                  }
                >
                  {refundLoading
                    ? "Processing Refund..."
                    : "Request Refund"}
                </button>

                {refundMessage && (
                  <p className="payment-refund-message">
                    {refundMessage}
                  </p>
                )}
              </>
            )}

            {/* ==========================================
                REFUNDED
            ========================================== */}

            {payment?.status ===
              "refunded" && (
              <p className="payment-refund-message">
                Payment refunded successfully.
              </p>
            )}
          </>
        )}

        {/* ==========================================
            PAYMENT PENDING
        ========================================== */}

        {paymentStatus === "pending" && (
          <>
            <span className="payment-label">
              PAYMENT PROCESSING
            </span>

            <h1>
              Payment Is Being Processed
            </h1>

            <p>
              Your payment has not been
              confirmed yet. Please check
              your bookings shortly.
            </p>
          </>
        )}

        {/* ==========================================
            PAYMENT FAILED
        ========================================== */}

        {paymentStatus === "failed" && (
          <>
            <span className="payment-label">
              PAYMENT FAILED
            </span>

            <h1>
              Payment Failed
            </h1>

            <p>
              We could not confirm this
              payment. Please try again.
            </p>
          </>
        )}

        {/* ==========================================
            GO TO BOOKINGS
        ========================================== */}

        <button
          type="button"
          className="payment-submit-button"
          onClick={() =>
            navigate("/user/bookings")
          }
        >
          Go to My Bookings
        </button>

      </div>
    </div>
  );
};

export default PaymentSuccess;