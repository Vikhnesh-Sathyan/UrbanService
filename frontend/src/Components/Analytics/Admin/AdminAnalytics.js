import React from "react";

import AdminSidebar from "../../Dashboard/Admin/AdminSidebar";
import AdminNavbar from "../../Dashboard/Admin/AdminNavbar";

import "../../../styles/AdminAnalytics.css";

const AdminAnalytics = () => {
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
              Monitor bookings, services, providers and complaints
              across UrbanService.
            </p>

          </div>

          {/* Analytics sections will be added here */}

        </section>

      </main>

    </div>
  );
};

export default AdminAnalytics;