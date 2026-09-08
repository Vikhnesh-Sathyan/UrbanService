import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  FaHome,
  FaBriefcase,
  FaCalendarAlt,
  FaClock,
  FaMoneyBillWave,
  FaUser,
  FaSignOutAlt,
} from "react-icons/fa";

import "../../../styles/ProviderSidebar.css";

const ProviderSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    {
      name: "Dashboard",
      icon: <FaHome />,
      path: "/provider/dashboard",
    },
    {
      name: "My Services",
      icon: <FaBriefcase />,
      path: "/provider/services",
    },
    {
      name: "Bookings",
      icon: <FaCalendarAlt />,
      path: "/provider/bookings",
    },
    {
      name: "Availability",
      icon: <FaClock />,
      path: "/provider/availability",
    },
    {
      name: "Payments",
      icon: <FaMoneyBillWave />,
      path: "/provider/payments",
    },
    {
      name: "Profile",
      icon: <FaUser />,
      path: "/provider/profile",
    },
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <aside className="provider-sidebar">

      {/* BRAND */}
      <div className="provider-brand">
        <div className="provider-brand-mark">
          U
        </div>

        <div className="provider-brand-name">
          <strong>Urban Services</strong>
          <span>Provider</span>
        </div>
      </div>

      {/* MAIN MENU */}
      <div className="sidebar-section-title">
        MAIN MENU
      </div>

      <nav className="provider-nav">

        {menuItems.map((item) => (
          <button
            key={item.path}
            className={`provider-nav-item ${
              location.pathname === item.path ? "active" : ""
            }`}
            onClick={() => navigate(item.path)}
          >
            <span className="provider-nav-icon">
              {item.icon}
            </span>

            <span className="provider-nav-text">
              {item.name}
            </span>
          </button>
        ))}

      </nav>

      {/* BOTTOM */}
      <div className="sidebar-bottom">

        <button
          className="provider-logout"
          onClick={handleLogout}
        >
          <span className="provider-nav-icon">
            <FaSignOutAlt />
          </span>

          <span>
            Logout
          </span>
        </button>

      </div>

    </aside>
  );
};

export default ProviderSidebar;