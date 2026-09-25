import React, { useEffect, useState } from "react";

import {
  FaBriefcase,
  FaCalendarAlt,
  FaCheckCircle,
  FaChartLine,
} from "react-icons/fa";

import ProviderNavbar from "../../Dashboard/Provider/ProviderNavbar";

import BookingActivityChart from "./BookingActivityChart";

import {
  getMyProviderOverview,
  getMyBookingPerformance,
  getMyBookingActivity,
} from "../../../Services/providerAnalyticsService";

import "../../../styles/ProviderAnalytics.css";

const ProviderAnalytics = () => {
  // =====================================================
  // STATE
  // =====================================================

  const [bookingPerformance, setBookingPerformance] = useState([]);
  const [bookingActivity, setBookingActivity] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  

  // =====================================================
  // LOAD ANALYTICS
  // =====================================================
useEffect(() => {
  const loadAnalytics = async () => {
    try {
      setLoading(true);
      setError("");

     const [
  overviewResponse,
  performanceResponse,
  activityResponse,
] = await Promise.all([
  getMyProviderOverview(),
  getMyBookingPerformance(),
  getMyBookingActivity(),
]);

      if (overviewResponse.success) {
        setAnalytics(overviewResponse.data);
      }

      if (performanceResponse.success) {
        setBookingPerformance(performanceResponse.data);
      }
      if (activityResponse.success) {
  setBookingActivity(activityResponse.data);
}
    } catch (error) {
      console.error(
        "Provider analytics error:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to load provider analytics."
      );
    } finally {
      setLoading(false);
    }
  };

  loadAnalytics();
}, []);

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return <div>Loading provider analytics...</div>;
  }

  // =====================================================
  // ERROR
  // =====================================================

  if (error) {
    return <div>{error}</div>;
  }

  // =====================================================
  // PAGE
  // =====================================================
return (
  <div className="provider-analytics-page">


      <ProviderNavbar />

  <section className="provider-analytics-content">
        {/* =================================================
            HEADER
        ================================================= */}

        <div className="provider-analytics-header">

          <div>
            <p className="provider-analytics-label">
              PROVIDER ANALYTICS
            </p>

            <h1>
              Business Performance
            </h1>

            <p>
              Track your services, bookings and completion
              performance.
            </p>
          </div>

        </div>


        {/* =================================================
            KPI CARDS
        ================================================= */}

        <div className="provider-analytics-kpi-grid">

          <div className="provider-analytics-kpi">

            <div className="provider-analytics-kpi-top">
              <div className="provider-analytics-kpi-icon">
                <FaBriefcase />
              </div>
            </div>

            <h3>
              {analytics?.totalServices || 0}
            </h3>

            <p>
              My Services
            </p>

          </div>


          <div className="provider-analytics-kpi">

            <div className="provider-analytics-kpi-top">
              <div className="provider-analytics-kpi-icon">
                <FaCalendarAlt />
              </div>
            </div>

            <h3>
              {analytics?.totalBookings || 0}
            </h3>

            <p>
              Total Bookings
            </p>

          </div>


          <div className="provider-analytics-kpi">

            <div className="provider-analytics-kpi-top">
              <div className="provider-analytics-kpi-icon">
                <FaCheckCircle />
              </div>
            </div>

            <h3>
              {analytics?.completedBookings || 0}
            </h3>

            <p>
              Completed Bookings
            </p>

          </div>


          <div className="provider-analytics-kpi">

            <div className="provider-analytics-kpi-top">
              <div className="provider-analytics-kpi-icon">
                <FaChartLine />
              </div>
            </div>

            <h3>
              {analytics?.completionRate || 0}%
            </h3>

            <p>
              Completion Rate
            </p>

          </div>

        </div>


        {/* =================================================
            BOOKING PERFORMANCE
        ================================================= */}

        <div className="provider-analytics-panel">

          <div className="provider-analytics-panel-header">

            <div>

              <h2>
                Booking Performance
              </h2>

              <p>
                Breakdown of your booking statuses
              </p>

            </div>

          </div>


          {bookingPerformance.length === 0 ? (

            <div className="provider-analytics-empty">

              <div className="provider-analytics-empty-icon">
                <FaChartLine />
              </div>

              <h3>
                No booking data yet
              </h3>

              <p>
                Your booking performance will appear here.
              </p>

            </div>

          ) : (

            <div className="provider-booking-status-grid">

              {bookingPerformance.map((item) => (

                <div
                  className="provider-booking-status-card"
                  key={item._id}
                >

                  <div className="provider-booking-status-left">

                    <span className="provider-booking-status-dot" />

                    <span className="provider-booking-status-name">
                      {item._id}
                    </span>

                  </div>

                  <span className="provider-booking-status-count">
                    {item.count}
                  </span>

                </div>

              ))}

            </div>

          )}

        </div>
{/* =================================================
    BOOKING ACTIVITY
================================================= */}

<BookingActivityChart
  data={bookingActivity}
/>
      </section>

    

  </div>
);
};

export default ProviderAnalytics;