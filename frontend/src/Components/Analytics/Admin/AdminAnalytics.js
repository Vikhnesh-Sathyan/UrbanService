import React, { useEffect, useState } from "react";

import AdminSidebar from "../../Dashboard/Admin/AdminSidebar";
import AdminNavbar from "../../Dashboard/Admin/AdminNavbar";

import {
  getAdminOverview,
  getBookingActivity,
  getBookingBreakdown,
  getServiceAnalytics,
  getProviderAnalytics,
  getComplaintAnalytics,
  getPaymentAnalytics,
} from "../../../Services/analyticsService";

import BookingActivityChart from "./BookingActivityChart";
import BookingBreakdown from "./BookingBreakdown";
import BookingStatusChart from "./BookingStatusChart";
import ServiceBookingChart from "./ServiceBookingChart";
import ProviderPerformanceChart from "./ProviderPerformanceChart";
import ComplaintStatusSummary from "./ComplaintStatusSummary";
import ComplaintReasonChart from "./ComplaintReasonChart";

import "../../../styles/AdminAnalytics.css";

const AdminAnalytics = () => {
  // =====================================================
  // STATE
  // =====================================================

  const [overview, setOverview] = useState(null);
  const [bookingBreakdown, setBookingBreakdown] = useState(null);
  const [bookingActivity, setBookingActivity] = useState([]);
  const [serviceAnalytics, setServiceAnalytics] = useState([]);
  const [providerAnalytics, setProviderAnalytics] = useState(null);
  const [complaintAnalytics, setComplaintAnalytics] = useState(null);

  const [paymentAnalytics, setPaymentAnalytics] = useState({
    totalRevenue: 0,
    totalRefunded: 0,
    netRevenue: 0,
    successfulPayments: 0,
    refundedPayments: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =====================================================
  // LOAD ADMIN ANALYTICS
  // =====================================================

  useEffect(() => {
    const loadAnalytics = async () => {
      try {
        setLoading(true);
        setError("");

        const [
          overviewResponse,
          bookingResponse,
          breakdownResponse,
          serviceResponse,
          providerResponse,
          complaintResponse,
          paymentResponse,
        ] = await Promise.all([
          getAdminOverview(),
          getBookingActivity(),
          getBookingBreakdown(),
          getServiceAnalytics(),
          getProviderAnalytics(),
          getComplaintAnalytics(),
          getPaymentAnalytics(),
        ]);

        // -------------------------------------------------
        // STORE ANALYTICS DATA
        // -------------------------------------------------

        setOverview(overviewResponse.data);

        setBookingActivity(
          bookingResponse.data
        );

        setBookingBreakdown(
          breakdownResponse.data
        );

        setServiceAnalytics(
          serviceResponse.data
        );

        setProviderAnalytics(
          providerResponse.data
        );

        setComplaintAnalytics(
          complaintResponse.data
        );

        // -------------------------------------------------
        // PAYMENT ANALYTICS
        // -------------------------------------------------

        if (paymentResponse.success) {
          setPaymentAnalytics(
            paymentResponse.data
          );
        }

      } catch (error) {
        console.error(
          "Admin analytics error:",
          error
        );

        setError(
          error.response?.data?.message ||
            "Failed to load analytics."
        );
      } finally {
        setLoading(false);
      }
    };

    loadAnalytics();
  }, []);

  // =====================================================
  // LOADING STATE
  // =====================================================

  if (loading) {
    return (
      <div className="admin-dashboard">

        <AdminSidebar />

        <main className="admin-main">

          <AdminNavbar />

          <section className="admin-analytics-content">

            <div className="admin-analytics-state">

              <div className="admin-analytics-loader" />

              <p>
                Loading analytics...
              </p>

            </div>

          </section>

        </main>

      </div>
    );
  }

  // =====================================================
  // ERROR STATE
  // =====================================================

  if (error) {
    return (
      <div className="admin-dashboard">

        <AdminSidebar />

        <main className="admin-main">

          <AdminNavbar />

          <section className="admin-analytics-content">

            <div className="admin-analytics-state admin-analytics-error">

              <h2>
                Unable to load analytics
              </h2>

              <p>
                {error}
              </p>

            </div>

          </section>

        </main>

      </div>
    );
  }

  // =====================================================
  // MAIN UI
  // =====================================================

  return (
    <div className="admin-dashboard">

      {/* Sidebar */}
      <AdminSidebar />

      {/* Main Content */}
      <main className="admin-main">

        {/* Navbar */}
        <AdminNavbar />

        {/* Analytics Content */}
        <section className="admin-analytics-content">

          {/* =====================================================
              HEADER
          ===================================================== */}

          <div className="admin-analytics-header">

            <span className="admin-label">
              PLATFORM ANALYTICS
            </span>

            <h1>
              Analytics
            </h1>

            <p>
              Monitor bookings, services, providers,
              payments and complaints across
              UrbanService.
            </p>

          </div>

          {/* =====================================================
              OVERVIEW
          ===================================================== */}

          <div className="admin-analytics-overview">

            <div className="analytics-section-heading">

              <div>

                <span>
                  OVERVIEW
                </span>

                <h2>
                  Platform performance
                </h2>

              </div>

              <span className="analytics-live-indicator">
                <span></span>
                Live data
              </span>

            </div>

            <div className="analytics-kpi-grid">

              {/* Total Users */}
              <div className="analytics-kpi-card">

                <div className="analytics-kpi-top">

                  <span className="analytics-kpi-label">
                    Total Users
                  </span>

                  <span className="analytics-kpi-index">
                    01
                  </span>

                </div>

                <div className="analytics-kpi-value">
                  {overview.totalUsers}
                </div>

                <div className="analytics-kpi-footer">
                  Registered customers
                </div>

              </div>

              {/* Total Providers */}
              <div className="analytics-kpi-card">

                <div className="analytics-kpi-top">

                  <span className="analytics-kpi-label">
                    Total Providers
                  </span>

                  <span className="analytics-kpi-index">
                    02
                  </span>

                </div>

                <div className="analytics-kpi-value">
                  {overview.totalProviders}
                </div>

                <div className="analytics-kpi-footer">
                  Service professionals
                </div>

              </div>

              {/* Total Bookings */}
              <div className="analytics-kpi-card">

                <div className="analytics-kpi-top">

                  <span className="analytics-kpi-label">
                    Total Bookings
                  </span>

                  <span className="analytics-kpi-index">
                    03
                  </span>

                </div>

                <div className="analytics-kpi-value">
                  {overview.totalBookings}
                </div>

                <div className="analytics-kpi-footer">
                  All booking requests
                </div>

              </div>

              {/* Completed */}
              <div className="analytics-kpi-card">

                <div className="analytics-kpi-top">

                  <span className="analytics-kpi-label">
                    Completed
                  </span>

                  <span className="analytics-kpi-index">
                    04
                  </span>

                </div>

                <div className="analytics-kpi-value">
                  {overview.completedBookings}
                </div>

                <div className="analytics-kpi-footer">
                  Successfully completed
                </div>

              </div>

            </div>

          </div>

          {/* =====================================================
              PAYMENT & REVENUE
          ===================================================== */}

          <div className="admin-analytics-overview">

            <div className="analytics-section-heading">

              <div>

                <span>
                  FINANCIAL OVERVIEW
                </span>

                <h2>
                  Payments & Revenue
                </h2>

              </div>

              <span className="analytics-live-indicator">
                <span></span>
                Payment data
              </span>

            </div>

            <div className="analytics-kpi-grid">

              {/* Total Revenue */}
              <div className="analytics-kpi-card">

                <div className="analytics-kpi-top">

                  <span className="analytics-kpi-label">
                    Total Revenue
                  </span>

                  <span className="analytics-kpi-index">
                    01
                  </span>

                </div>

                <div className="analytics-kpi-value">
                  ₹
                  {Number(
                    paymentAnalytics.totalRevenue
                  ).toFixed(2)}
                </div>

                <div className="analytics-kpi-footer">
                  Successful customer payments
                </div>

              </div>

              {/* Refunded */}
              <div className="analytics-kpi-card">

                <div className="analytics-kpi-top">

                  <span className="analytics-kpi-label">
                    Refunded
                  </span>

                  <span className="analytics-kpi-index">
                    02
                  </span>

                </div>

                <div className="analytics-kpi-value">
                  ₹
                  {Number(
                    paymentAnalytics.totalRefunded
                  ).toFixed(2)}
                </div>

                <div className="analytics-kpi-footer">
                  Amount returned to customers
                </div>

              </div>

              {/* Net Revenue */}
              <div className="analytics-kpi-card">

                <div className="analytics-kpi-top">

                  <span className="analytics-kpi-label">
                    Net Revenue
                  </span>

                  <span className="analytics-kpi-index">
                    03
                  </span>

                </div>

                <div className="analytics-kpi-value">
                  ₹
                  {Number(
                    paymentAnalytics.netRevenue
                  ).toFixed(2)}
                </div>

                <div className="analytics-kpi-footer">
                  Revenue after refunds
                </div>

              </div>

              {/* Successful Payments */}
              <div className="analytics-kpi-card">

                <div className="analytics-kpi-top">

                  <span className="analytics-kpi-label">
                    Successful Payments
                  </span>

                  <span className="analytics-kpi-index">
                    04
                  </span>

                </div>

                <div className="analytics-kpi-value">
                  {paymentAnalytics.successfulPayments}
                </div>

                <div className="analytics-kpi-footer">
                  Completed transactions
                </div>

              </div>

            </div>

          </div>

          {/* =====================================================
              BOOKING ACTIVITY
          ===================================================== */}

          <BookingActivityChart
            data={bookingActivity}
          />

          {/* =====================================================
              BOOKING BREAKDOWN
          ===================================================== */}

          <div className="analytics-breakdown-grid">

            <BookingBreakdown
              data={bookingBreakdown}
            />

            <BookingStatusChart
              data={bookingBreakdown}
            />

          </div>

          {/* =====================================================
              SERVICE ANALYTICS
          ===================================================== */}

          <div className="analytics-service-section">

            <ServiceBookingChart
              data={serviceAnalytics}
            />

          </div>

          {/* =====================================================
              PROVIDER ANALYTICS
          ===================================================== */}

          <div className="analytics-provider-section">

            <div className="analytics-section-heading">

              <div>

                <span>
                  PROVIDER ANALYTICS
                </span>

                <h2>
                  Provider performance
                </h2>

              </div>

            </div>

            {/* Provider KPI cards */}

            <div className="analytics-provider-kpi-grid">

              <div className="analytics-provider-kpi-card">

                <span>
                  Total Providers
                </span>

                <strong>
                  {providerAnalytics?.summary?.totalProviders || 0}
                </strong>

              </div>

              <div className="analytics-provider-kpi-card">

                <span>
                  Active Providers
                </span>

                <strong>
                  {providerAnalytics?.summary?.activeProviders || 0}
                </strong>

              </div>

              <div className="analytics-provider-kpi-card">

                <span>
                  Blocked Providers
                </span>

                <strong>
                  {providerAnalytics?.summary?.blockedProviders || 0}
                </strong>

              </div>

            </div>

            {/* Performance chart */}

            <ProviderPerformanceChart
              data={
                providerAnalytics?.performance || []
              }
            />

          </div>

          {/* =====================================================
              COMPLAINT ANALYTICS
          ===================================================== */}

          <div className="analytics-complaint-section">

            <div className="analytics-section-heading">

              <div>

                <span>
                  COMPLAINT ANALYTICS
                </span>

                <h2>
                  Customer issue insights
                </h2>

              </div>

            </div>

            <ComplaintStatusSummary
              data={complaintAnalytics}
            />

            <ComplaintReasonChart
              data={complaintAnalytics}
            />

          </div>

        </section>

      </main>

    </div>
  );
};

export default AdminAnalytics;