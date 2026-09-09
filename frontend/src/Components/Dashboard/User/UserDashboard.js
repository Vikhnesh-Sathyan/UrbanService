import React, { useState } from "react";

import UserSidebar from "./UserSidebar";
import UserNavbar from "./UserNavbar";
import UserDashboardHome from "./UserDashboardHome";

import "../../../styles/UserDashboard.css";

const UserDashboard = () => {

  // ==========================================
  // SIDEBAR STATE
  // ==========================================

  const [sidebarOpen, setSidebarOpen] = useState(false);


  // ==========================================
  // OPEN SIDEBAR
  // ==========================================

  const handleMenuClick = () => {
    setSidebarOpen(true);
  };


  // ==========================================
  // CLOSE SIDEBAR
  // ==========================================

  const handleCloseSidebar = () => {
    setSidebarOpen(false);
  };


  // ==========================================
  // UI
  // ==========================================

  return (
    <div className="user-dashboard">

      {/* ========================================
          SIDEBAR
      ======================================== */}

      <UserSidebar
        isOpen={sidebarOpen}
        onClose={handleCloseSidebar}
      />


      {/* ========================================
          MAIN AREA
      ======================================== */}

      <main className="user-dashboard-main">

        {/* NAVBAR */}

        <UserNavbar
          onMenuClick={handleMenuClick}
        />


        {/* DASHBOARD CONTENT */}

        <div className="user-dashboard-content">

          <UserDashboardHome />

        </div>

      </main>

    </div>
  );
};

export default UserDashboard;