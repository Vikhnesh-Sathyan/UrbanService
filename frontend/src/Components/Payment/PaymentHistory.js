import React, { useEffect, useState } from "react";

import { getPaymentHistory } from "../../Services/paymentService";

import "../../styles/Payment.css";

const PaymentHistory = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ==========================================
  // LOAD PAYMENT HISTORY
  // ==========================================

  useEffect(() => {
    const loadPaymentHistory = async () => {
      try {
        setLoading(true);
        setError("");

        const response =
          await getPaymentHistory();

        if (!response.success) {
          throw new Error(
            response.message ||
              "Unable to load payment history"
          );
        }

        setPayments(
          response.payments || []
        );
      } catch (error) {
        console.error(
          "Payment history error:",
          error
        );

        setError(
          error.response?.data?.message ||
            error.message ||
            "Unable to load payment history"
        );
      } finally {
        setLoading(false);
      }
    };

    loadPaymentHistory();
  }, []);

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="payment-page">
        <div className="payment-loading">
          <p>
            Loading payment history...
          </p>
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

          <h2>
            Payment History Unavailable
          </h2>

          <p>{error}</p>

        </div>
      </div>
    );
  }

  // ==========================================
  // EMPTY
  // ==========================================

  if (payments.length === 0) {
    return (
      <div className="payment-page">
        <div className="payment-success-container">

          <span className="payment-label">
            PAYMENT HISTORY
          </span>

          <h1>
            No Payments Yet
          </h1>

          <p>
            Your completed payments will
            appear here.
          </p>

        </div>
      </div>
    );
  }

  // ==========================================
  // PAYMENT HISTORY
  // ==========================================

  return (
    <div className="payment-page">

      <div className="payment-container">

        <div className="payment-summary">

          <span className="payment-label">
            PAYMENT HISTORY
          </span>

          <h1>
            Your Payments
          </h1>

          <p>
            View your service payment
            activity and transaction status.
          </p>

        </div>

        <div className="payment-history-list">

          {payments.map((payment) => (
            <div
              className="payment-history-card"
              key={payment._id}
            >

              <div className="payment-history-main">

                <div>
                  <span className="payment-label">
                    SERVICE
                  </span>

                  <h3>
                    {payment.booking?.service?.name ||
                      "Service"}
                  </h3>

                  <p>
                    Provider:{" "}
                    {payment.booking?.provider?.name ||
                      "Provider"}
                  </p>
                </div>

                <div className="payment-history-amount">
                  ₹
                  {Number(
                    payment.amount
                  ).toFixed(2)}
                </div>

              </div>

              <div className="payment-history-details">

                <div>
                  <span>
                    Booking Date
                  </span>

                  <strong>
                    {payment.booking?.date ||
                      "—"}
                  </strong>
                </div>

                <div>
                  <span>
                    Booking Time
                  </span>

                  <strong>
                    {payment.booking?.time ||
                      "—"}
                  </strong>
                </div>

                <div>
                  <span>
                    Payment Status
                  </span>

                  <strong>
                    {payment.status}
                  </strong>
                </div>

                <div>
                  <span>
                    Payment Date
                  </span>

                  <strong>
                    {new Date(
                      payment.createdAt
                    ).toLocaleDateString()}
                  </strong>
                </div>

              </div>

              <div className="payment-history-footer">

                <span>
                  Payment ID:{" "}
                  {payment.stripePaymentIntentId}
                </span>

                <span>
                  {payment.booking?.bookingType ===
                  "emergency"
                    ? "Emergency Booking"
                    : "Normal Booking"}
                </span>

              </div>
<div className="payment-history-actions">

  <button
    type="button"
    className="payment-receipt-button"
    onClick={() =>
      window.location.href =
        `/user/payment-receipt/${payment._id}`
    }
  >
    View Receipt
  </button>

</div>
            </div>
          ))}

        </div>

      </div>

    </div>
  );
};

export default PaymentHistory;