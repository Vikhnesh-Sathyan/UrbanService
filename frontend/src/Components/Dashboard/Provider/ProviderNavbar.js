import React from "react";
import "../../../styles/ProviderNavbar.css";

import NotificationBell from "../../Notifications/NotificationBell";

const ProviderNavbar = () => {
  return (
    <header className="provider-navbar">

      <div className="navbar-title">
        <span>PROVIDER</span>
        <h1>Dashboard</h1>
      </div>

      <div className="navbar-actions">

        {/* Notification Bell */}

        <NotificationBell />


        {/* Provider Profile */}

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