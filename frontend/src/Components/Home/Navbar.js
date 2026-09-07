import React from "react";
import { Link } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";
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

          <Link to="/" className="home-navbar-link">
            Home
          </Link>

          <Link to="/services" className="home-navbar-link">
            Services
          </Link>

          <Link to="/login" className="home-navbar-link">
            Login
          </Link>

          <Link to="/register" className="home-navbar-register">
            Get Started
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
