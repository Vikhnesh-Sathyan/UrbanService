import React from "react";
import { useNavigate } from "react-router-dom";
import "../../../styles/UserDashboard.css";

const UserHome = () => {
  const navigate = useNavigate();

  const user = JSON.parse(
    localStorage.getItem("user") || "{}"
  );

  return (
    <div className="user-home">

      {/* =========================================
          HERO
      ========================================= */}

      <div className="user-hero">

        <div className="user-hero-content">

          <span className="user-eyebrow">
            YOUR SERVICE HUB
          </span>

          <h1>
            Welcome back,
            <span> {user.name || "User"}</span>
          </h1>

          <p>
            Find trusted professionals, book services,
            and manage everything from one place.
          </p>

          <div className="user-hero-actions">

            <button
              className="user-primary-btn"
              onClick={() =>
                navigate("/user/services")
              }
            >
              Explore Services
              <span>→</span>
            </button>

            <button
              className="user-secondary-btn"
              onClick={() =>
                navigate("/user/bookings")
              }
            >
              View My Bookings
            </button>

          </div>

        </div>

        <div className="user-hero-visual">

          <div className="hero-orb orb-one"></div>
          <div className="hero-orb orb-two"></div>

          <div className="hero-service-card">

            <div className="hero-card-icon">
              ✦
            </div>

            <div>
              <strong>
                Local Services
              </strong>

              <span>
                Trusted professionals
              </span>
            </div>

            <div className="hero-card-arrow">
              →
            </div>

          </div>

        </div>

      </div>


      {/* =========================================
          QUICK STATS
      ========================================= */}

      <div className="user-stats-grid">

        <div className="user-stat-card">

          <div className="stat-icon">
            🔎
          </div>

          <div>
            <span>
              Discover
            </span>

            <strong>
              Services
            </strong>
          </div>

        </div>


        <div className="user-stat-card">

          <div className="stat-icon">
            📅
          </div>

          <div>
            <span>
              Manage
            </span>

            <strong>
              Bookings
            </strong>
          </div>

        </div>


        <div className="user-stat-card">

          <div className="stat-icon">
            ⭐
          </div>

          <div>
            <span>
              Trusted
            </span>

            <strong>
              Professionals
            </strong>
          </div>

        </div>


        <div className="user-stat-card">

          <div className="stat-icon">
            🔐
          </div>

          <div>
            <span>
              Secure
            </span>

            <strong>
              Experience
            </strong>
          </div>

        </div>

      </div>


      {/* =========================================
          QUICK ACTIONS
      ========================================= */}

      <div className="user-section-heading">

        <div>
          <span>
            QUICK ACCESS
          </span>

          <h2>
            What would you like to do?
          </h2>
        </div>

      </div>


      <div className="user-action-grid">

        {/* SERVICES */}

        <div className="user-action-card">

          <div className="action-card-top">

            <div className="action-icon">
              🔍
            </div>

            <span className="action-number">
              01
            </span>

          </div>

          <h3>
            Find a Service
          </h3>

          <p>
            Browse approved local professionals
            and find the right service for you.
          </p>

          <button
            onClick={() =>
              navigate("/user/services")
            }
          >
            Explore Services →
          </button>

        </div>


        {/* BOOKINGS */}

        <div className="user-action-card">

          <div className="action-card-top">

            <div className="action-icon">
              📋
            </div>

            <span className="action-number">
              02
            </span>

          </div>

          <h3>
            My Bookings
          </h3>

          <p>
            Track your upcoming and previous
            service bookings in one place.
          </p>

          <button
            onClick={() =>
              navigate("/user/bookings")
            }
          >
            Manage Bookings →
          </button>

        </div>


        {/* PROFILE */}

        <div className="user-action-card">

          <div className="action-card-top">

            <div className="action-icon">
              👤
            </div>

            <span className="action-number">
              03
            </span>

          </div>

          <h3>
            Your Profile
          </h3>

          <p>
            Keep your personal account information
            updated and secure.
          </p>

          <button
            onClick={() =>
              navigate("/user/profile")
            }
          >
            Manage Profile →
          </button>

        </div>

      </div>


      {/* =========================================
          TRUST BANNER
      ========================================= */}

      <div className="user-trust-banner">

        <div className="trust-icon">
          ✓
        </div>

        <div>

          <strong>
            Your trusted local marketplace
          </strong>

          <p>
            Discover verified services and manage
            your bookings with confidence.
          </p>

        </div>

        <span className="trust-arrow">
          →
        </span>

      </div>

    </div>
  );
};

export default UserHome;