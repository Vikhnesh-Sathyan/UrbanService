import React from "react";
import {
  FaEnvelope,
  FaPhoneAlt,
  FaMapMarkerAlt,
} from "react-icons/fa";

import "../../styles/ContactUs.css";

const ContactUs = () => {
  return (
    <div className="contact-page">

      {/* Hero */}
      <section className="contact-hero">

        <span className="contact-label">
          CONTACT US
        </span>

        <h1>
          We're here to
          <br />
          <span>help.</span>
        </h1>

        <p>
          Have a question about UrbanService?
          Get in touch with us.
        </p>

      </section>


      {/* Contact Cards */}
      <section className="contact-container">

        <div className="contact-card">

          <div className="contact-icon">
            <FaEnvelope />
          </div>

          <h3>
            Email
          </h3>

          <p>
            For general questions and support.
          </p>

          <a href="mailto:support@urbanservice.com">
            support@urbanservice.com
          </a>

        </div>


        <div className="contact-card">

          <div className="contact-icon">
            <FaPhoneAlt />
          </div>

          <h3>
            Phone
          </h3>

          <p>
            Contact our support team for assistance.
          </p>

          <a href="tel:+919999999999">
            +91 99999 99999
          </a>

        </div>


        <div className="contact-card">

          <div className="contact-icon">
            <FaMapMarkerAlt />
          </div>

          <h3>
            Service Area
          </h3>

          <p>
            UrbanService is designed for local
            service discovery and booking.
          </p>

          <span>
            Local Service Marketplace
          </span>

        </div>

      </section>


      {/* Note */}
      <section className="contact-note">

        <h2>
          Need help with a booking?
        </h2>

        <p>
          You can also use the Help Center to find
          answers to common booking and account questions.
        </p>

      </section>

    </div>
  );
};

export default ContactUs;