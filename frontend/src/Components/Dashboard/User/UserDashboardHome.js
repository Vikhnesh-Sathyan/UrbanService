import React from "react";
import { useNavigate } from "react-router-dom";

import "../../../styles/UserDashboardHome.css";

const UserDashboardHome = () => {
  const navigate = useNavigate();

  const storedUser = localStorage.getItem("user");

  let user = {};

  try {
    user = storedUser ? JSON.parse(storedUser) : {};
  } catch (error) {
    user = {};
  }

  const userName = user?.name || "Customer";

  return (
    <section className="user-dashboard-home">

      {/* ==========================================
          WELCOME SECTION
      ========================================== */}

      <div className="user-welcome-card">

        <div className="user-welcome-content">

          <span className="user-welcome-label">
            YOUR SERVICE HUB
          </span>

          <h2>
            Hello, {userName} 👋
          </h2>

          <p>
            Find trusted local professionals and
            manage your service bookings in one place.
          </p>

          <button
            type="button"
            onClick={() => navigate("/user/services")}
            className="user-primary-action"
          >
            Explore Services
            <span>→</span>
          </button>

        </div>


        <div className="user-welcome-decoration">

          <div className="welcome-circle circle-one"></div>

          <div className="welcome-circle circle-two"></div>

          <div className="welcome-service-icon">
            ✦
          </div>

        </div>

      </div>


      {/* ==========================================
          QUICK STATS
      ========================================== */}

      <div className="user-stat-grid">

        {/* STAT 1 */}

        <div className="user-stat-card">

          <div className="user-stat-icon">
            ◈
          </div>

          <div className="user-stat-content">

            <span>
              Available Services
            </span>

            <strong>
              —
            </strong>

          </div>

        </div>


        {/* STAT 2 */}

        <div className="user-stat-card">

          <div className="user-stat-icon">
            ▣
          </div>

          <div className="user-stat-content">

            <span>
              My Bookings
            </span>

            <strong>
              —
            </strong>

          </div>

        </div>


        {/* STAT 3 */}

        <div className="user-stat-card">

          <div className="user-stat-icon">
            ✓
          </div>

          <div className="user-stat-content">

            <span>
              Completed
            </span>

            <strong>
              —
            </strong>

          </div>

        </div>


        {/* STAT 4 */}

        <div className="user-stat-card">

          <div className="user-stat-icon">
            ★
          </div>

          <div className="user-stat-content">

            <span>
              Account Status
            </span>

            <strong className="user-status-text">
              Active
            </strong>

          </div>

        </div>

      </div>


      {/* ==========================================
          QUICK ACTIONS
      ========================================== */}

      <div className="user-dashboard-section">

        <div className="user-section-heading">

          <div>

            <span>
              QUICK ACTIONS
            </span>

            <h3>
              What would you like to do?
            </h3>

          </div>

        </div>


        <div className="user-action-grid">

          {/* BROWSE SERVICES */}

          <button
            type="button"
            className="user-action-card"
            onClick={() =>
              navigate("/user/services")
            }
          >

            <div className="user-action-icon">
              ◈
            </div>

            <div className="user-action-content">

              <h4>
                Browse Services
              </h4>

              <p>
                Discover trusted professionals
                near you.
              </p>

            </div>

            <span className="user-action-arrow">
              →
            </span>

          </button>


          {/* MY BOOKINGS */}

          <button
            type="button"
            className="user-action-card"
            onClick={() =>
              navigate("/user/bookings")
            }
          >

            <div className="user-action-icon">
              ▣
            </div>

            <div className="user-action-content">

              <h4>
                My Bookings
              </h4>

              <p>
                View and manage your
                service bookings.
              </p>

            </div>

            <span className="user-action-arrow">
              →
            </span>

          </button>


          {/* PROFILE */}

          <button
            type="button"
            className="user-action-card"
            onClick={() =>
              navigate("/user/profile")
            }
          >

            <div className="user-action-icon">
              ◉
            </div>

            <div className="user-action-content">

              <h4>
                My Profile
              </h4>

              <p>
                Manage your account
                information.
              </p>

            </div>

            <span className="user-action-arrow">
              →
            </span>

          </button>

        </div>

      </div>


      {/* ==========================================
          SERVICE MARKETPLACE INFO
      ========================================== */}

      <div className="user-info-section">

        <div className="user-info-content">

          <span className="user-info-label">
            URBAN SERVICES
          </span>

          <h3>
            Quality services, simplified.
          </h3>

          <p>
            From home repairs to personal care,
            discover professionals you can rely on.
          </p>

        </div>


        <div className="user-info-features">

          <div>
            <span>01</span>
            <p>Trusted Professionals</p>
          </div>

          <div>
            <span>02</span>
            <p>Easy Booking</p>
          </div>

          <div>
            <span>03</span>
            <p>Secure Experience</p>
          </div>

        </div>

      </div>

    </section>
  );
};

export default UserDashboardHome;