import React from "react";
import { NavLink, useNavigate } from "react-router-dom";

import {
  FaHome,
  FaTools,
  FaUsers,
  FaCalendarAlt,
  FaChartLine,
  FaUser,
  FaQuestionCircle,
  FaSignOutAlt,
} from "react-icons/fa";

import "../../../styles/UserSidebar.css";

const UserSidebar = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("user");

    navigate("/login");
  };

  return (
    <aside className={`user-sidebar ${isOpen ? "open" : ""}`}>

      {/* ==========================================
          LOGO
      ========================================== */}

      <div className="user-sidebar-logo">

        <div className="user-logo-icon">
          U
        </div>

        <div className="user-logo-text">
          <h2>Urban</h2>
          <span>Services</span>
        </div>

      </div>


      {/* ==========================================
          NAVIGATION
      ========================================== */}

      <nav className="user-sidebar-nav">

        <span className="user-nav-title">
          MENU
        </span>


        {/* DASHBOARD */}

        <NavLink
          to="/user/dashboard"
          className={({ isActive }) =>
            `user-nav-item ${isActive ? "active" : ""}`
          }
          onClick={onClose}
        >
          <span className="user-nav-icon">
            <FaHome />
          </span>

          <span>
            Dashboard
          </span>
        </NavLink>


        {/* SERVICES */}

        <NavLink
          to="/user/services"
          className={({ isActive }) =>
            `user-nav-item ${isActive ? "active" : ""}`
          }
          onClick={onClose}
        >
          <span className="user-nav-icon">
            <FaTools />
          </span>

          <span>
            Browse Services
          </span>
        </NavLink>


        {/* PROVIDERS */}

        <NavLink
          to="/user/providers"
          className={({ isActive }) =>
            `user-nav-item ${isActive ? "active" : ""}`
          }
          onClick={onClose}
        >
          <span className="user-nav-icon">
            <FaUsers />
          </span>

          <span>
            Browse Providers
          </span>
        </NavLink>


        {/* BOOKINGS */}

        <NavLink
          to="/user/bookings"
          className={({ isActive }) =>
            `user-nav-item ${isActive ? "active" : ""}`
          }
          onClick={onClose}
        >
          <span className="user-nav-icon">
            <FaCalendarAlt />
          </span>

          <span>
            My Bookings
          </span>
        </NavLink>


        {/* ANALYTICS */}

        <NavLink
          to="/user/analytics"
          className={({ isActive }) =>
            `user-nav-item ${isActive ? "active" : ""}`
          }
          onClick={onClose}
        >
          <span className="user-nav-icon">
            <FaChartLine />
          </span>

          <span>
            Analytics
          </span>
        </NavLink>


        {/* ==========================================
            ACCOUNT
        ========================================== */}

        <span className="user-nav-title user-account-title">
          ACCOUNT
        </span>


        {/* PROFILE */}

        <NavLink
          to="/user/profile"
          className={({ isActive }) =>
            `user-nav-item ${isActive ? "active" : ""}`
          }
          onClick={onClose}
        >
          <span className="user-nav-icon">
            <FaUser />
          </span>

          <span>
            Profile
          </span>
        </NavLink>

      </nav>


      {/* ==========================================
          SIDEBAR BOTTOM
      ========================================== */}

      <div className="user-sidebar-bottom">

        {/* SUPPORT */}

        <div className="user-sidebar-support">

          <div className="support-icon">
            <FaQuestionCircle />
          </div>

          <div className="support-content">
            <strong>
              Need Help?
            </strong>

            <span>
              Contact support
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
            <FaSignOutAlt />
          </span>

          Logout
        </button>

      </div>

    </aside>
  );
};

export default UserSidebar;