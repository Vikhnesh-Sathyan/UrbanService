import React from "react";
import { NavLink } from "react-router-dom";
import {
  FaHome,
  FaBriefcase,
  FaUsers,
  FaClipboardList,
  FaSignOutAlt,
} from "react-icons/fa";

import "../../../styles/AdminSidebar.css";

const AdminSidebar = () => {

  const menuItems = [
    {
      name: "Dashboard",
      icon: <FaHome />,
      path: "/admin/dashboard",
    },
    {
      name: "Services",
      icon: <FaBriefcase />,
      path: "/admin/services",
    },
    {
      name: "Providers",
      icon: <FaUsers />,
      path: "/admin/providers",
    },
    {
      name: "Bookings",
      icon: <FaClipboardList />,
      path: "/admin/bookings",
    },
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("user");

    window.location.href = "/login";
  };

  return (
    <aside className="admin-sidebar">

      {/* Logo */}

      <div className="admin-sidebar-logo">

        <div className="admin-logo">
          VS
        </div>

        <div>
          <h2>UrbanService</h2>
          <span>Admin Panel</span>
        </div>

      </div>

      {/* Navigation */}

      <nav className="admin-sidebar-nav">

        <p className="admin-nav-title">
          MANAGEMENT
        </p>

        {menuItems.map((item) => (

          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `admin-nav-item ${
                isActive ? "active" : ""
              }`
            }
          >

            <span className="admin-nav-icon">
              {item.icon}
            </span>

            <span>
              {item.name}
            </span>

          </NavLink>

        ))}

      </nav>

      {/* Logout */}

      <div className="admin-sidebar-bottom">

        <button
          type="button"
          onClick={handleLogout}
          className="admin-logout"
        >

          <FaSignOutAlt />

          <span>
            Logout
          </span>

        </button>

      </div>

    </aside>
  );
};

export default AdminSidebar;