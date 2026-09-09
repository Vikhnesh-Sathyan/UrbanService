import React from "react";
import { NavLink, useNavigate } from "react-router-dom";

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

        <div>
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
            `user-nav-item ${
              isActive ? "active" : ""
            }`
          }
          onClick={onClose}
        >
          <span className="user-nav-icon">
            ⌂
          </span>

          <span>
            Dashboard
          </span>
        </NavLink>


        {/* SERVICES */}

        <NavLink
          to="/user/services"
          className={({ isActive }) =>
            `user-nav-item ${
              isActive ? "active" : ""
            }`
          }
          onClick={onClose}
        >
          <span className="user-nav-icon">
            ◈
          </span>

          <span>
            Browse Services
          </span>
        </NavLink>


        {/* BOOKINGS */}

        <NavLink
          to="/user/bookings"
          className={({ isActive }) =>
            `user-nav-item ${
              isActive ? "active" : ""
            }`
          }
          onClick={onClose}
        >
          <span className="user-nav-icon">
            ▣
          </span>

          <span>
            My Bookings
          </span>
        </NavLink>


        <span className="user-nav-title">
          ACCOUNT
        </span>


        {/* PROFILE */}

        <NavLink
          to="/user/profile"
          className={({ isActive }) =>
            `user-nav-item ${
              isActive ? "active" : ""
            }`
          }
          onClick={onClose}
        >
          <span className="user-nav-icon">
            ◉
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

        <div className="user-sidebar-support">

          <span className="support-icon">
            ?
          </span>

          <div>
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
            ↪
          </span>

          Logout

        </button>

      </div>

    </aside>
  );
};

export default UserSidebar;