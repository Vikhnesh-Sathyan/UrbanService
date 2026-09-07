import React from "react";
import { Link } from "react-router-dom";
import { FaArrowRight, FaCheckCircle } from "react-icons/fa";
import "../../styles/Hero.css";

function Hero() {
  return (
    <section className="hero-section">

      <div className="hero-container">

        {/* Left Content */}
        <div className="hero-content">

          <div className="hero-badge">
            <FaCheckCircle />
            Trusted Local Services
          </div>

          <h1>
            Trusted Services.
            <br />
            <span>Right at Your Doorstep.</span>
          </h1>

          <p>
            Find reliable local professionals for your everyday needs.
            From plumbing and electrical work to beauty and home services,
            UrbanServices makes booking simple.
          </p>

          <div className="hero-buttons">

            <Link to="/services" className="hero-primary-btn">
              Explore Services
              <FaArrowRight />
            </Link>

            <Link to="/register" className="hero-secondary-btn">
              Become a Provider
            </Link>

          </div>

          <div className="hero-features">

            <div>
              <FaCheckCircle />
              Verified Professionals
            </div>

            <div>
              <FaCheckCircle />
              Easy Booking
            </div>

            <div>
              <FaCheckCircle />
              Secure Payment
            </div>

          </div>

        </div>


        {/* Right Visual */}
        <div className="hero-visual">

          <div className="hero-card">

            <div className="hero-card-icon">
              🔧
            </div>

            <div>
              <h3>Professional Services</h3>
              <p>Book trusted experts near you</p>
            </div>

          </div>

          <div className="hero-floating-card">
            <span>✓</span>
            <div>
              <strong>Booking Confirmed</strong>
              <small>Your professional is on the way</small>
            </div>
          </div>

          <div className="hero-circle"></div>

        </div>

      </div>

    </section>
  );
}

export default Hero;