import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import UserHome from "./UserHome";

import "../../../styles/UserDashboard.css";

const UserDashboard = () => {

  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] = useState(false);

  // ==========================================
  // USER
  // ==========================================

  const user = JSON.parse(
    localStorage.getItem("user") || "{}"
  );

  const userName = user.name || "User";


  // ==========================================
  // LOGOUT
  // ==========================================

  const handleLogout = () => {

    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("isLoggedIn");

    navigate("/login");

  };


  // ==========================================
  // NAVIGATION
  // ==========================================

  const goTo = (path) => {

    navigate(path);

    setSidebarOpen(false);

  };


  // ==========================================
  // UI
  // ==========================================

  return (

    <div className="user-dashboard-layout">

      {/* ======================================
          MOBILE OVERLAY
      ====================================== */}

      {sidebarOpen && (
        <div
          className="user-sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}


      {/* ======================================
          SIDEBAR
      ====================================== */}

      <aside
        className={`user-sidebar ${
          sidebarOpen ? "user-sidebar-open" : ""
        }`}
      >

        {/* BRAND */}

        <div className="user-sidebar-brand">

          <div className="user-brand-mark">
            U
          </div>

          <div className="user-brand-text">

            <strong>
              Urban
            </strong>

            <span>
              Services
            </span>

          </div>

        </div>


        {/* USER PROFILE MINI */}

        <div className="user-sidebar-profile">

          <div className="user-avatar">
            {userName.charAt(0).toUpperCase()}
          </div>

          <div className="user-profile-info">

            <strong>
              {userName}
            </strong>

            <span>
              Customer
            </span>

          </div>

        </div>


        {/* NAVIGATION */}

        <nav className="user-sidebar-nav">

          <span className="user-nav-label">
            MENU
          </span>


          {/* HOME */}

          <button
            type="button"
            className="user-nav-item active"
            onClick={() => goTo("/UserDashboard")}
          >

            <span className="user-nav-icon">
              ⌂
            </span>

            <span>
              Dashboard
            </span>

          </button>


          {/* SERVICES */}

          <button
            type="button"
            className="user-nav-item"
            onClick={() =>
              goTo("/user/services")
            }
          >

            <span className="user-nav-icon">
              ◈
            </span>

            <span>
              Browse Services
            </span>

          </button>


          {/* BOOKINGS */}

          <button
            type="button"
            className="user-nav-item"
            onClick={() =>
              goTo("/user/bookings")
            }
          >

            <span className="user-nav-icon">
              ▣
            </span>

            <span>
              My Bookings
            </span>

          </button>


          <span className="user-nav-label user-nav-label-spaced">
            ACCOUNT
          </span>


          {/* PROFILE */}

          <button
            type="button"
            className="user-nav-item"
            onClick={() =>
              goTo("/user/profile")
            }
          >

            <span className="user-nav-icon">
              ◯
            </span>

            <span>
              My Profile
            </span>

          </button>

        </nav>


        {/* SIDEBAR FOOTER */}

        <div className="user-sidebar-footer">

          <div className="user-help-box">

            <span className="user-help-icon">
              ?
            </span>

            <div>

              <strong>
                Need help?
              </strong>

              <span>
                We're here for you.
              </span>

            </div>

          </div>


          {/* LOGOUT */}

          <button
            type="button"
            className="user-logout-btn"
            onClick={handleLogout}
          >

            <span>
              ⇥
            </span>

            Logout

          </button>

        </div>

      </aside>


      {/* ======================================
          MAIN AREA
      ====================================== */}

      <main className="user-main-content">


        {/* ====================================
            TOP HEADER
        ==================================== */}

        <header className="user-topbar">

          <div className="user-topbar-left">

            {/* MOBILE MENU */}

            <button
              type="button"
              className="user-mobile-menu"
              onClick={() =>
                setSidebarOpen(true)
              }
            >
              ☰
            </button>


            <div>

              <span className="user-topbar-label">
                CUSTOMER PORTAL
              </span>

              <h2>
                Dashboard
              </h2>

            </div>

          </div>


          {/* TOPBAR RIGHT */}

          <div className="user-topbar-right">

            <button
              type="button"
              className="user-notification-btn"
              title="Notifications"
            >
              ♢
              <span />
            </button>


            <div className="user-topbar-profile">

              <div className="user-topbar-avatar">
                {userName.charAt(0).toUpperCase()}
              </div>

              <div className="user-topbar-user">

                <strong>
                  {userName}
                </strong>

                <span>
                  Customer
                </span>

              </div>

            </div>

          </div>

        </header>


        {/* ====================================
            PAGE CONTENT
        ==================================== */}

        <div className="user-page-content">

          <UserHome />

        </div>

      </main>

    </div>

  );

};

export default UserDashboard;