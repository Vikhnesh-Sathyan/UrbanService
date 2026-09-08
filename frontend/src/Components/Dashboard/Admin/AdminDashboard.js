import React from "react";

import AdminSidebar from "./AdminSidebar";
import AdminNavbar from "./AdminNavbar";
import AdminServiceApprovals from "./AdminServiceApprovals";
import AdminStats from "./AdminStats";
import Adminproviders from "./AdminProviders";
import AdminBookings from "./AdminBookings";

import "../../../styles/AdminDashboard.css";

const AdminDashboard = () => {
  return (
    <div className="admin-dashboard">

      {/* Sidebar */}
      <AdminSidebar />

      {/* Main Content */}
      <main className="admin-main">

        {/* Navbar */}
        <AdminNavbar />

        {/* Dashboard Content */}
        <section className="admin-dashboard-content">

          <div className="admin-welcome">

            <span className="admin-label">
              ADMIN PANEL
            </span>

            <h1>
              Welcome back, Admin
            </h1>

            <p>
              Manage your service booking platform.
            </p>

          </div>

          {/* Statistics Module */}
          <AdminStats />

          {/* Service Approval Module */}
          <AdminServiceApprovals />

          {/* Providers Module */}
          <Adminproviders />

          {/* Bookings Module */}
          <AdminBookings />



        </section>

      </main>

    </div>
  );
};

export default AdminDashboard;