import React from "react";
import { FaBell } from "react-icons/fa";
import "../../../styles/ProviderNavbar.css";

const ProviderNavbar = () => {
  return (
    <header className="provider-navbar">

      <div className="navbar-title">
        <span>PROVIDER</span>
        <h1>Dashboard</h1>
      </div>

      <div className="navbar-actions">

        <button className="notification-button">
          <FaBell />
          <span className="notification-dot"></span>
        </button>

        <div className="provider-profile">

          <div className="profile-avatar">
            U
          </div>

          <div className="profile-details">
            <strong>Provider</strong>
            <small>Service Provider</small>
          </div>

        </div>

      </div>

    </header>
  );
};

export default ProviderNavbar;