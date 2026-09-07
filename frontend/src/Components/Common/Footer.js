import React from "react";
import { Link } from "react-router-dom";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaArrowRight,
} from "react-icons/fa";
import "../../styles/Footer.css";

function Footer() {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { to: "/", label: "Home" },
    { to: "/services", label: "Services" },
    { to: "/login", label: "Login" },
    { to: "/register", label: "Register" },
  ];

  const services = [
    "Women's Salon & Spa",
    "Men's Salon & Massage",
    "AC & Appliance Repair",
    "Cleaning & Pest Control",
    "Electrician & Plumber",
    "Water Purifier",
  ];

  const socialLinks = [
    { icon: <FaFacebookF />, url: "#", label: "Facebook" },
    { icon: <FaTwitter />, url: "#", label: "Twitter" },
    { icon: <FaInstagram />, url: "#", label: "Instagram" },
    { icon: <FaLinkedinIn />, url: "#", label: "LinkedIn" },
  ];

  return (
    <footer className="footer-container">
      <div className="footer-wave"></div>
      <div className="container">
        <div className="footer-content">
          {/* Brand Section */}
          <div className="footer-section footer-brand">
            <h3 className="footer-logo">
              <span className="logo-text">Urban</span>
              <span className="logo-accent">Services</span>
            </h3>
            <p className="footer-description">
              Your trusted marketplace for premium urban services. Connecting
              customers with skilled professionals for all your service needs.
            </p>
            <div className="footer-social">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.url}
                  className="social-icon"
                  aria-label={social.label}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links Section */}
          <div className="footer-section">
            <h4 className="footer-title">Quick Links</h4>
            <ul className="footer-links">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <Link to={link.to} className="footer-link">
                    <span className="link-icon">
                      <FaArrowRight />
                    </span>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services Section */}
          <div className="footer-section">
            <h4 className="footer-title">Our Services</h4>
            <ul className="footer-links">
              {services.map((service, index) => (
                <li key={index}>
                  <Link to="/services" className="footer-link">
                    <span className="link-icon">
                      <FaArrowRight />
                    </span>
                    {service}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Section */}
          <div className="footer-section footer-contact">
            <h4 className="footer-title">Get In Touch</h4>
            <ul className="footer-contact-list">
              <li className="contact-item">
                <span className="contact-icon">
                  <FaMapMarkerAlt />
                </span>
                <span className="contact-text">
                  123 Service Street, Urban City, UC 12345
                </span>
              </li>
              <li className="contact-item">
                <span className="contact-icon">
                  <FaPhone />
                </span>
                <span className="contact-text">
                  <a href="tel:+1234567890">+1 (234) 567-890</a>
                </span>
              </li>
              <li className="contact-item">
                <span className="contact-icon">
                  <FaEnvelope />
                </span>
                <span className="contact-text">
                  <a href="mailto:info@urbanservices.com">
                    info@urbanservices.com
                  </a>
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="footer-bottom">
          <div className="footer-divider"></div>
          <div className="footer-bottom-content">
            <p className="footer-copyright">
              © {currentYear} Urban Services. All rights reserved.
            </p>
            <div className="footer-legal">
              <Link to="/privacy" className="legal-link">
                Privacy Policy
              </Link>
              <span className="legal-separator">•</span>
              <Link to="/terms" className="legal-link">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;

