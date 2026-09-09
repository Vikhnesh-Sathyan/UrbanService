import React from "react";
import { useNavigate } from "react-router-dom";

import "../../../styles/UserNavbar.css";

const UserNavbar = ({ onMenuClick }) => {
  const navigate = useNavigate();

  // Get logged-in user
  const storedUser = localStorage.getItem("user");

  let user = {};

  try {
    user = storedUser ? JSON.parse(storedUser) : {};
  } catch (error) {
    user = {};
  }

  const userName = user?.name || "User";

  // Get first letter for avatar
  const userInitial = userName
    .charAt(0)
    .toUpperCase();

  return (
    <header className="user-navbar">

      {/* ==========================================
          MOBILE MENU BUTTON
      ========================================== */}

      <button
        type="button"
        className="user-menu-button"
        onClick={onMenuClick}
        aria-label="Open menu"
      >
        ☰
      </button>


      {/* ==========================================
          PAGE INFORMATION
      ========================================== */}

      <div className="user-navbar-left">

        <div className="user-navbar-heading">
          <span className="user-navbar-label">
            CUSTOMER PORTAL
          </span>

          <h1>
            Welcome back, {userName}
          </h1>
        </div>

      </div>


      {/* ==========================================
          RIGHT SIDE
      ========================================== */}

      <div className="user-navbar-right">

        {/* Notification */}

        <button
          type="button"
          className="user-notification-button"
          aria-label="Notifications"
        >
          <span className="notification-icon">
            ♢
          </span>

          <span className="notification-dot"></span>
        </button>


        {/* Divider */}

        <div className="user-navbar-divider"></div>


        {/* User Profile */}

        <button
          type="button"
          className="user-navbar-profile"
          onClick={() =>
            navigate("/user/profile")
          }
        >

          <div className="user-avatar">
            {userInitial}
          </div>

          <div className="user-profile-info">

            <strong>
              {userName}
            </strong>

            <span>
              Customer
            </span>

          </div>

          <span className="profile-arrow">
            ›
          </span>

        </button>

      </div>

    </header>
  );
};

export default UserNavbar;