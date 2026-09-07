
import React from "react";
import { Link } from "react-router-dom";
import {
  FaHome,
  FaTools,
  FaSignInAlt,
  FaArrowRight,
} from "react-icons/fa";
import "../../styles/Navbar.css";

function Navbar() {
  return (
    <nav className="home-navbar">
      <div className="home-navbar-container">

        {/* Logo */}
        <Link to="/" className="home-navbar-logo">
          Urban<span>Services</span>
        </Link>

        {/* Navigation */}
        <div className="home-navbar-links">

          {/* Home */}
          <Link to="/" className="home-navbar-link">
            <FaHome className="navbar-icon home-icon" />
            <span>Home</span>
          </Link>

          {/* Services */}
          <Link to="/services" className="home-navbar-link">
            <FaTools className="navbar-icon services-icon" />
            <span>Services</span>
          </Link>

          {/* Login */}
          <Link to="/login" className="home-navbar-link">
            <FaSignInAlt className="navbar-icon login-icon" />
            <span>Login</span>
          </Link>

          {/* Get Started */}
          <Link to="/register" className="home-navbar-register">
            <span>Get Started</span>
            <FaArrowRight className="home-navbar-arrow" />
          </Link>

        </div>

        {/* Mobile Menu */}
        <button className="home-navbar-toggle">
          ☰
        </button>

      </div>
    </nav>
  );
}

export default Navbar;