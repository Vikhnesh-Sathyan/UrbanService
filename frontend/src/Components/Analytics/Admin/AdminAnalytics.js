import React, { useEffect, useState } from "react";

import AdminSidebar from "../../Dashboard/Admin/AdminSidebar";
import AdminNavbar from "../../Dashboard/Admin/AdminNavbar";

import { getAdminOverview , getBookingActivity } from "../../../Services/analyticsService";

import BookingActivityChart from "./BookingActivityChart";

import "../../../styles/AdminAnalytics.css";

const AdminAnalytics = () => {
  // =====================================================
  // STATE
  // =====================================================

  const [overview, setOverview] = useState(null);
  const [bookingActivity, setBookingActivity] = useState([]);
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
      ] = await Promise.all([
        getAdminOverview(),
        getBookingActivity(),
      ]);

      setOverview(overviewResponse.data);
      setBookingActivity(bookingResponse.data);
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

          {/* Header */}
          <div className="admin-analytics-header">

            <span className="admin-label">
              PLATFORM ANALYTICS
            </span>

            <h1>
              Analytics
            </h1>

            <p>
              Monitor bookings, services, providers and
              complaints across UrbanService.
            </p>

          </div>

{/* =====================================================
    OVERVIEW
===================================================== */}

<div className="admin-analytics-overview">

  <div className="analytics-section-heading">
    <div>
      <span>OVERVIEW</span>
      <h2>Platform performance</h2>
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

<BookingActivityChart
  data={bookingActivity}/>
  
        </section>

      </main>

    </div>
  );
};

export default AdminAnalytics;