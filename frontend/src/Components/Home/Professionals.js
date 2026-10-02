import React from "react";
import { Link } from "react-router-dom";
import {
  FaUserTie,
  FaTools,
  FaCalendarCheck,
  FaArrowRight,
} from "react-icons/fa";

import "../../styles/Professionals.css";

const Professionals = () => {
  return (
    <div className="info-page">

      {/* Hero */}
      <section className="info-hero">

        <span className="info-label">
          OUR PROFESSIONALS
        </span>

        <h1>
          Skilled professionals
          <br />
          <span>for everyday services.</span>
        </h1>

        <p>
          UrbanService connects customers with professionals
          who provide practical home and personal services.
        </p>

      </section>


      {/* Features */}
      <section className="professionals-section">

        <div className="professionals-grid">

          <div className="professional-card">

            <div className="professional-icon">
              <FaUserTie />
            </div>

            <h3>
              Service Providers
            </h3>

            <p>
              Professionals can create service listings,
              manage bookings, update availability, and
              handle their service workflow.
            </p>

          </div>


          <div className="professional-card">

            <div className="professional-icon">
              <FaTools />
            </div>

            <h3>
              Multiple Services
            </h3>

            <p>
              Customers can discover professionals across
              different service categories such as repairs,
              cleaning, maintenance, and personal services.
            </p>

          </div>


          <div className="professional-card">

            <div className="professional-icon">
              <FaCalendarCheck />
            </div>

            <h3>
              Structured Bookings
            </h3>

            <p>
              Providers can manage booking requests and
              move accepted services through their workflow
              until completion.
            </p>

          </div>

        </div>

      </section>


      {/* CTA */}
      <section className="info-cta">

        <div>
          <h2>
            Looking for a service professional?
          </h2>

          <p>
            Explore available services and find the right
            professional for your needs.
          </p>
        </div>

        <Link to="/user/services">
          Explore Services
          <FaArrowRight />
        </Link>

      </section>

    </div>
  );
};

export default Professionals;