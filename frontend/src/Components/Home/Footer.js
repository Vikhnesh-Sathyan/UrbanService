import React from "react";
import { Link } from "react-router-dom";

import {
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaLinkedinIn,
  FaArrowRight,
} from "react-icons/fa";

import "../../styles/Footer.css";

const Footer = () => {
  return (
    <footer className="site-footer">

      {/* ==========================================
          MAIN FOOTER
      ========================================== */}

      <div className="footer-container">

        {/* Brand */}
        <div className="footer-brand">

          <Link to="/" className="footer-logo">
            Urban<span>Service</span>
          </Link>

          <p>
            Trusted professionals for your everyday
            home services. Book reliable experts
            whenever you need them.
          </p>

          <div className="footer-socials">

            <a href="#facebook" aria-label="Facebook">
              <FaFacebookF />
            </a>

            <a href="#instagram" aria-label="Instagram">
              <FaInstagram />
            </a>

            <a href="#twitter" aria-label="Twitter">
              <FaTwitter />
            </a>

            <a href="#linkedin" aria-label="LinkedIn">
              <FaLinkedinIn />
            </a>

          </div>

        </div>


        {/* Services */}
        <div className="footer-column">

          <h3>Services</h3>

          <Link to="/user/services">
            Home Cleaning
          </Link>

          <Link to="/user/services">
            AC & Appliance Repair
          </Link>

          <Link to="/user/services">
            Electrician
          </Link>

          <Link to="/user/services">
            Plumbing
          </Link>

          <Link to="/user/services">
            Beauty & Salon
          </Link>

        </div>


        {/* Company */}
        <div className="footer-column">

          <h3>Company</h3>

          <Link to="/about">
            About Us
          </Link>

          <Link to="/user/services">
            Our Services
          </Link>

          <Link to="/professionals">
            Professionals
          </Link>

          <Link to="/contact">
            Contact Us
          </Link>

          <Link to="/help">
            Help Center
          </Link>

        </div>


        {/* Quick Access */}
        <div className="footer-column">

          <h3>Quick Access</h3>

          <Link to="/login">
            Login
          </Link>

          <Link to="/register">
            Create Account
          </Link>

          <Link to="/user/services">
            Browse Services
          </Link>

          <Link to="/user/bookings">
            My Bookings
          </Link>

        </div>

      </div>


      {/* ==========================================
          CTA
      ========================================== */}

      <div className="footer-cta">

        <div>

          <span className="footer-cta-label">
            NEED A PROFESSIONAL?
          </span>

          <h3>
            Get your service done
            <span> without the hassle.</span>
          </h3>

        </div>

        <Link
          to="/user/services"
          className="footer-cta-button"
        >
          Explore Services
          <FaArrowRight />
        </Link>

      </div>


      {/* ==========================================
          BOTTOM BAR
      ========================================== */}

      <div className="footer-bottom">

        <p>
          © {new Date().getFullYear()} UrbanService.
          All rights reserved.
        </p>

        <div className="footer-bottom-links">

          <Link to="/privacy">
            Privacy Policy
          </Link>

          <Link to="/terms">
            Terms of Service
          </Link>

        </div>

      </div>

    </footer>
  );
};

export default Footer;