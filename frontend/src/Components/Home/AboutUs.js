
import React from "react";
import {
  FaCheckCircle,
  FaUsers,
  FaShieldAlt,
  FaTools,
  FaArrowRight,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

import "../../styles/AboutUs.css";

const AboutUs = () => {
  const navigate = useNavigate();

  return (
    <div className="about-page">

      {/* ==========================================
          HERO
      ========================================== */}

      <section className="about-hero">

        <div className="about-hero-content">

          <span className="about-label">
            ABOUT URBANSERVICE
          </span>

          <h1>
            Reliable services.
            <br />
            <span>Simple booking.</span>
          </h1>

          <p>
            UrbanService connects customers with local
            professionals for everyday home services,
            making it easier to find, book, and manage
            services in one place.
          </p>

        </div>

      </section>


      {/* ==========================================
          INTRODUCTION
      ========================================== */}

      <section className="about-intro">

        <div className="about-intro-heading">

          <span className="about-label">
            WHAT WE DO
          </span>

          <h2>
            Making everyday services
            <br />
            easier to manage.
          </h2>

        </div>

        <div className="about-intro-text">

          <p>
            Finding a suitable professional for a home
            service should not be complicated. UrbanService
            brings customers and service providers together
            through a simple digital platform.
          </p>

          <p>
            Customers can explore available services,
            view provider information, book services,
            track booking progress, manage payments, and
            receive important service notifications.
          </p>

        </div>

      </section>


      {/* ==========================================
          CORE VALUES
      ========================================== */}

      <section className="about-values">

        <div className="about-section-heading">

          <span className="about-label">
            OUR APPROACH
          </span>

          <h2>
            Built around a better
            <br />
            service experience.
          </h2>

        </div>


        <div className="about-values-grid">

          <div className="about-value-card">

            <div className="about-value-icon">
              <FaUsers />
            </div>

            <h3>
              Local Professionals
            </h3>

            <p>
              Connect customers with professionals
              who provide services in their local area.
            </p>

          </div>


          <div className="about-value-card">

            <div className="about-value-icon">
              <FaShieldAlt />
            </div>

            <h3>
              Structured Service Flow
            </h3>

            <p>
              From booking and status updates to
              payments and notifications, each step
              follows a clear workflow.
            </p>

          </div>


          <div className="about-value-card">

            <div className="about-value-icon">
              <FaTools />
            </div>

            <h3>
              Practical Services
            </h3>

            <p>
              Support everyday needs including repairs,
              cleaning, maintenance, and personal services.
            </p>

          </div>

        </div>

      </section>


      {/* ==========================================
          PLATFORM FEATURES
      ========================================== */}

      <section className="about-features">

        <div className="about-features-content">

          <span className="about-label">
            THE PLATFORM
          </span>

          <h2>
            Everything organized
            <br />
            in one place.
          </h2>

          <p>
            UrbanService is designed to make the complete
            service journey easier for both customers and
            professionals.
          </p>

        </div>


        <div className="about-feature-list">

          <div className="about-feature-item">
            <FaCheckCircle />
            <span>Browse and discover services</span>
          </div>

          <div className="about-feature-item">
            <FaCheckCircle />
            <span>View service provider information</span>
          </div>

          <div className="about-feature-item">
            <FaCheckCircle />
            <span>Book and manage services</span>
          </div>

          <div className="about-feature-item">
            <FaCheckCircle />
            <span>Track booking status</span>
          </div>

          <div className="about-feature-item">
            <FaCheckCircle />
            <span>Manage secure payments</span>
          </div>

          <div className="about-feature-item">
            <FaCheckCircle />
            <span>Receive service notifications</span>
          </div>

        </div>

      </section>


      {/* ==========================================
          CTA
      ========================================== */}

      <section className="about-cta">

        <div>

          <span className="about-label">
            GET STARTED
          </span>

          <h2>
            Need a service?
            <br />
            <span>Find a professional today.</span>
          </h2>

        </div>

        <button
          type="button"
          onClick={() => navigate("/user/services")}
        >
          Explore Services
          <FaArrowRight />
        </button>

      </section>

    </div>
  );
};

export default AboutUs;