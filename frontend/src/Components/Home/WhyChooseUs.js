import React from "react";
import {
  FaUserCheck,
  FaBolt,
  FaShieldAlt,
  FaCreditCard,
} from "react-icons/fa";

import "../../styles/WhyChooseUs.css";

function WhyChooseUs() {
  const features = [
    {
      icon: <FaUserCheck />,
      title: "Verified Professionals",
      description:
        "Book with confidence through trusted professionals who are carefully selected for quality, experience, and reliability.",
      color: "blue",
    },
    {
      icon: <FaBolt />,
      title: "Quick Booking",
      description:
        "Find the right service and book a convenient time quickly with a simple and smooth booking experience.",
      color: "orange",
    },
    {
      icon: <FaShieldAlt />,
      title: "Safe & Reliable",
      description:
        "Enjoy a dependable service experience with trusted professionals from booking to service completion.",
      color: "green",
    },
    {
      icon: <FaCreditCard />,
      title: "Secure Payments",
      description:
        "Make payments through a secure and smooth checkout experience designed for simple and reliable transactions.",
      color: "purple",
    },
  ];

  return (
    <section className="why-section">

      {/* =========================================
          HEADING
      ========================================= */}

      <div className="why-heading">

        <span className="why-label">
          WHY CHOOSE US
        </span>

        <h2>
          Everything You Need,
          <br />
          <span>All in One Place.</span>
        </h2>

        <p>
          UrbanServices is designed to make finding and booking
          local professionals simple, safe and convenient.
        </p>

      </div>

      {/* =========================================
          FEATURES
      ========================================= */}

      <div className="why-features">

        {features.map((feature) => (
          <div
            className={`why-feature why-${feature.color}`}
            key={feature.title}
          >

            {/* ICON */}

            <div className="why-feature-icon">
              {feature.icon}
            </div>

            {/* CONTENT */}

            <div className="why-feature-content">

              <h3>{feature.title}</h3>

              <p>{feature.description}</p>

            </div>

            {/* HOVER LINE */}

            <div className="why-feature-line"></div>

          </div>
        ))}

      </div>

      {/* =========================================
          BOTTOM MESSAGE
      ========================================= */}

      <div className="why-bottom">

        <span></span>

        <p>
          Simple. Reliable. Built for everyday services.
        </p>

        <span></span>

      </div>

    </section>
  );
}

export default WhyChooseUs;