import React, { useEffect, useState } from "react";

import {
  FaCalendarAlt,
  FaCheckCircle,
  FaTimesCircle,
  FaAmbulance,
} from "react-icons/fa";

import {
  getMyUserOverview,
} from "../../../Services/userAnalyticsService";

import UserNavbar from "../../Dashboard/User/UserNavbar";

import "../../../styles/UserAnalytics.css";


const UserAnalytics = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");


  // =====================================================
  // LOAD USER ANALYTICS
  // =====================================================

  useEffect(() => {
    const loadAnalytics = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await getMyUserOverview();

        if (response.success) {
          setAnalytics(response.data);
        }
      } catch (error) {
        console.error("User analytics error:", error);

        setError(
          error.response?.data?.message ||
            "Failed to load user analytics."
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
    return (
      <div className="user-analytics-loading">
        Loading your analytics...
      </div>
    );
  }


  // =====================================================
  // ERROR
  // =====================================================

  if (error) {
    return (
      <div className="user-analytics-error">
        {error}
      </div>
    );
  }


  // =====================================================
  // PAGE
  // =====================================================

  return (
    <div className="user-analytics-page">

      <UserNavbar />

      <main className="user-analytics-content">

        {/* =================================================
            HEADER
        ================================================= */}

        <div className="user-analytics-header">

          <p className="user-analytics-label">
            MY ANALYTICS
          </p>

          <h1>
            Your Activity
          </h1>

          <p>
            Track your bookings and service activity.
          </p>

        </div>


        {/* =================================================
            OVERVIEW
        ================================================= */}

        <div className="user-analytics-kpi-grid">

          <div className="user-analytics-kpi">

            <div className="user-analytics-kpi-icon">
              <FaCalendarAlt />
            </div>

            <h3>
              {analytics?.totalBookings || 0}
            </h3>

            <p>
              Total Bookings
            </p>

          </div>


          <div className="user-analytics-kpi">

            <div className="user-analytics-kpi-icon">
              <FaCheckCircle />
            </div>

            <h3>
              {analytics?.completedBookings || 0}
            </h3>

            <p>
              Completed
            </p>

          </div>


          <div className="user-analytics-kpi">

            <div className="user-analytics-kpi-icon">
              <FaTimesCircle />
            </div>

            <h3>
              {analytics?.cancelledBookings || 0}
            </h3>

            <p>
              Cancelled
            </p>

          </div>


          <div className="user-analytics-kpi">

            <div className="user-analytics-kpi-icon">
              <FaAmbulance />
            </div>

            <h3>
              {analytics?.emergencyBookings || 0}
            </h3>

            <p>
              Emergency Bookings
            </p>

          </div>

        </div>

      </main>

    </div>
  );
};


export default UserAnalytics;