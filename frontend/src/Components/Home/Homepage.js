import React from "react";
import { Link } from "react-router-dom";
import { FaHome, FaSignInAlt, FaUserPlus } from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Homepage.css";
import { Services } from "./Services";
import AboutUs from "./AboutUs";
import Footer from "./Footer";

function Homepage() {
  const navItems = [
    { to: "/", icon: <FaHome />, label: "Home" },
    { to: "/login", icon: <FaSignInAlt />, label: "Login" },
    { to: "/register", icon: <FaUserPlus />, label: "Register" },
  ];

  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-light bg-light shadow-sm">
        <div className="container">
          <Link to="/" className="navbar-brand fw-bold fs-3">
            Urban Services
          </Link>

          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto align-items-center">
              {navItems.map(({ to, icon, label }) => (
                <li className="nav-item mx-3" key={to}>
                  <Link
                    to={to}
                    className="nav-link d-flex align-items-center"
                    style={{ fontSize: "1.2rem", gap: "0.5rem" }}
                  >
                    <span style={{ fontSize: "1.5rem" }}>{icon}</span>
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </nav>

      <section className="hero-section bg-primary text-white text-center py-5">
        <div className="container">
          <h1 className="display-4 fw-bold">Find the Best Urban Services in One Place!</h1>
          <p className="lead mb-4">
            Your marketplace for cleaners, electricians, plumbers, and more.
          </p>
          <Link to="/services" className="btn btn-light btn-lg shadow">
            Explore Services
          </Link>
        </div>
      </section>

      <Services />
      <AboutUs />
      <Footer />
    </div>
  );
}

export default Homepage;
