import React from "react";

const AdminStats = () => {
  return (
    <div className="admin-stats">

      {/* Pending Services */}

      <div className="admin-stat-card">

        <div className="admin-stat-icon">
          ⏳
        </div>

        <div className="admin-stat-info">

          <h2>0</h2>

          <p>
            Pending Services
          </p>

        </div>

      </div>


      {/* Providers */}

      <div className="admin-stat-card">

        <div className="admin-stat-icon">
          👥
        </div>

        <div className="admin-stat-info">

          <h2>0</h2>

          <p>
            Total Providers
          </p>

        </div>

      </div>


      {/* Users */}

      <div className="admin-stat-card">

        <div className="admin-stat-icon">
          👤
        </div>

        <div className="admin-stat-info">

          <h2>0</h2>

          <p>
            Total Users
          </p>

        </div>

      </div>


      {/* Bookings */}

      <div className="admin-stat-card">

        <div className="admin-stat-icon">
          📅
        </div>

        <div className="admin-stat-info">

          <h2>0</h2>

          <p>
            Total Bookings
          </p>

        </div>

      </div>

    </div>
  );
};

export default AdminStats;