import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { getPaymentReceipt } from "../../Services/paymentService";

import "../../styles/PaymentReceipt.css";

const PaymentReceipt = () => {
  const { paymentId } = useParams();

  const [receipt, setReceipt] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadReceipt = async () => {
      try {
        setLoading(true);
        setError("");

        if (!paymentId) {
          throw new Error("Payment ID is missing.");
        }

        const response =
          await getPaymentReceipt(paymentId);

        if (!response.success || !response.receipt) {
          throw new Error(
            response.message ||
              "Unable to load payment receipt"
          );
        }

        setReceipt(response.receipt);
      } catch (error) {
        console.error(
          "Payment receipt error:",
          error
        );

        setError(
          error.response?.data?.message ||
            error.message ||
            "Unable to load payment receipt"
        );
      } finally {
        setLoading(false);
      }
    };

    loadReceipt();
  }, [paymentId]);

  if (loading) {
    return (
      <div className="payment-receipt-page">
        <div className="payment-receipt-state">
          <p>Preparing payment receipt...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="payment-receipt-page">
        <div className="payment-receipt-error">
          <span className="payment-label">
            PAYMENT RECEIPT
          </span>

          <h1>
            Receipt Unavailable
          </h1>

          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="payment-receipt-page">

      <div className="payment-receipt-card">

        {/* HEADER */}

        <div className="payment-receipt-header">

          <div>
            <span className="payment-label">
              URBAN SERVICES
            </span>

            <h1>
              Payment Receipt
            </h1>

            <p>
              Official record of your service payment.
            </p>
          </div>

          <div
            className={`payment-receipt-status ${
              receipt.status
            }`}
          >
            {receipt.status}
          </div>

        </div>


        {/* AMOUNT */}

        <div className="payment-receipt-amount">

          <span>
            AMOUNT PAID
          </span>

          <strong>
            ₹{Number(
              receipt.amount
            ).toFixed(2)}
          </strong>

        </div>


        {/* SERVICE DETAILS */}

        <div className="payment-receipt-section">

          <div className="payment-receipt-section-title">
            SERVICE DETAILS
          </div>

          <div className="payment-receipt-grid">

            <div>
              <span>Service</span>
              <strong>
                {receipt.booking?.service ||
                  "—"}
              </strong>
            </div>

            <div>
              <span>Provider</span>
              <strong>
                {receipt.booking?.provider ||
                  "—"}
              </strong>
            </div>

            <div>
              <span>Booking Date</span>
              <strong>
                {receipt.booking?.date ||
                  "—"}
              </strong>
            </div>

            <div>
              <span>Booking Time</span>
              <strong>
                {receipt.booking?.time ||
                  "—"}
              </strong>
            </div>

            <div>
              <span>Booking Type</span>
              <strong>
                {receipt.booking?.bookingType ===
                "emergency"
                  ? "Emergency"
                  : "Normal"}
              </strong>
            </div>

            <div>
              <span>Payment Date</span>
              <strong>
                {new Date(
                  receipt.paymentDate
                ).toLocaleDateString()}
              </strong>
            </div>

          </div>

        </div>


        {/* PAYMENT DETAILS */}

        <div className="payment-receipt-section">

          <div className="payment-receipt-section-title">
            PAYMENT DETAILS
          </div>

          <div className="payment-receipt-grid">

            <div>
              <span>Payment ID</span>
              <strong>
                {receipt.paymentId}
              </strong>
            </div>

            <div>
              <span>Stripe Payment ID</span>
              <strong>
                {receipt.stripePaymentIntentId}
              </strong>
            </div>

            <div>
              <span>Currency</span>
              <strong>
                {receipt.currency.toUpperCase()}
              </strong>
            </div>

            <div>
              <span>Status</span>
              <strong>
                {receipt.status}
              </strong>
            </div>

          </div>

        </div>


        {/* FOOTER */}

        <div className="payment-receipt-footer">

          <p>
            Thank you for choosing Urban Services.
          </p>

          <span>
            This receipt confirms the payment
            recorded for this booking.
          </span>

        </div>

      </div>

    </div>
  );
};

export default PaymentReceipt;