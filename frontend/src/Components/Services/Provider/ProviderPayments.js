import React, { useEffect, useState } from "react";

import { getProviderEarnings } from "../../../Services/paymentService";

import "../../../styles/ProviderPayments.css";

const ProviderPayments = () => {
  const [earnings, setEarnings] = useState({
    totalPaid: 0,
    totalRefunded: 0,
    netEarnings: 0,
    successfulPayments: 0,
    refundedPayments: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadEarnings = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await getProviderEarnings();

        if (!response.success) {
          throw new Error(
            response.message || "Unable to load earnings"
          );
        }

        setEarnings(response.earnings);
      } catch (error) {
        console.error(
          "Provider earnings error:",
          error
        );

        setError(
          error.response?.data?.message ||
            error.message ||
            "Unable to load earnings"
        );
      } finally {
        setLoading(false);
      }
    };

    loadEarnings();
  }, []);

  return (
    <div className="provider-payments-page">

      <div className="provider-payments-header">

        <div>
          <span className="provider-payments-label">
            FINANCIAL OVERVIEW
          </span>

          <h1>
            Payments & Earnings
          </h1>

          <p>
            Track your service revenue,
            refunds, and payment activity.
          </p>
        </div>

      </div>


      {error && (
        <div className="provider-payments-error">
          {error}
        </div>
      )}


      <div className="provider-earnings-grid">

        <div className="provider-earning-card primary">

          <span>
            NET EARNINGS
          </span>

          <h2>
            {loading
              ? "..."
              : `₹${Number(
                  earnings.netEarnings
                ).toFixed(2)}`}
          </h2>

          <p>
            Earnings after refunds
          </p>

        </div>


        <div className="provider-earning-card">

          <span>
            TOTAL REVENUE
          </span>

          <h2>
            {loading
              ? "..."
              : `₹${Number(
                  earnings.totalPaid
                ).toFixed(2)}`}
          </h2>

          <p>
            Successful customer payments
          </p>

        </div>


        <div className="provider-earning-card">

          <span>
            REFUNDED
          </span>

          <h2>
            {loading
              ? "..."
              : `₹${Number(
                  earnings.totalRefunded
                ).toFixed(2)}`}
          </h2>

          <p>
            Amount returned to customers
          </p>

        </div>

      </div>


      <div className="provider-payment-summary">

        <div>
          <span>
            Successful Payments
          </span>

          <strong>
            {loading
              ? "..."
              : earnings.successfulPayments}
          </strong>
        </div>


        <div>
          <span>
            Refunded Payments
          </span>

          <strong>
            {loading
              ? "..."
              : earnings.refundedPayments}
          </strong>
        </div>

      </div>

    </div>
  );
};

export default ProviderPayments;