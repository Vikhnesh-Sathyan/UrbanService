import React from "react";
import { FaBell, FaUserCircle } from "react-icons/fa";

import "../../../styles/AdminNavbar.css";

const AdminNavbar = () => {

  const user = JSON.parse(
    localStorage.getItem("user") || "{}"
  );

  return (
    <header className="admin-navbar">

      <div className="admin-navbar-left">

        <h2>
          Admin Dashboard
        </h2>

        <p>
          Manage your service booking platform
        </p>

      </div>

      <div className="admin-navbar-right">

        <button
          type="button"
          className="admin-notification"
        >
          <FaBell />
        </button>

        <div className="admin-profile">

          <FaUserCircle className="admin-profile-icon" />

          <div>

            <strong>
              {user.name || "Admin"}
            </strong>

            <span>
              Administrator
            </span>

          </div>

        </div>

      </div>

    </header>
  );
};

export default AdminNavbar;