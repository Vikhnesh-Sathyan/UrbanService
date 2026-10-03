import React, { useEffect, useState } from "react";

import {
  FaCalendarAlt,
  FaCheckCircle,
  FaTimesCircle,
  FaAmbulance,
} from "react-icons/fa";

import {
  getMyUserOverview,
  getMyUserBookingStatus,
  getMyUserServiceUsage,
  getMyUserBookingType,
} from "../../../Services/userAnalyticsService";

import BookingActivityChart from "./BookingActivityChart";
import ServiceUsage from "./ServiceUsage";
import BookingTypeChart from "./BookingTypeChart";

import UserNavbar from "../../Dashboard/User/UserNavbar";

import "../../../styles/UserAnalytics.css";

const UserAnalytics = () => {
  const [analytics, setAnalytics] = useState(null);
  const [bookingStatus, setBookingStatus] = useState([]);
  const [serviceUsage, setServiceUsage] = useState([]);
  const [bookingType, setBookingType] = useState([]);

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

        const [
          overviewResponse,
          bookingStatusResponse,
          serviceUsageResponse,
          bookingTypeResponse,
        ] = await Promise.all([
          getMyUserOverview(),
          getMyUserBookingStatus(),
          getMyUserServiceUsage(),
          getMyUserBookingType(),
        ]);

        if (overviewResponse.success) {
          setAnalytics(overviewResponse.data);
        }

        if (bookingStatusResponse.success) {
          setBookingStatus(
            bookingStatusResponse.data
          );
        }

        if (serviceUsageResponse.success) {
          setServiceUsage(
            serviceUsageResponse.data
          );
        }

        if (bookingTypeResponse.success) {
          setBookingType(
            bookingTypeResponse.data
          );
        }

      } catch (error) {
        console.error(
          "User analytics error:",
          error
        );

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


        {/* =================================================
            BOOKING STATUS
        ================================================= */}

        <BookingActivityChart
          data={bookingStatus}
        />


        {/* =================================================
            SERVICE USAGE
        ================================================= */}

        <ServiceUsage
          data={serviceUsage}
        />


        {/* =================================================
            BOOKING TYPE
        ================================================= */}

        <BookingTypeChart
          data={bookingType}
        />

      </main>

    </div>
  );
};

export default UserAnalytics;