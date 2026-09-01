import React from "react";
import "./AboutUs.css";

function AboutUs() {
  return (
    <section className="aboutus-section">
      <div className="aboutus-card">
        <div className="aboutus-image">
          <div className="aboutus-image-content">
            <div className="aboutus-logo-text">URBAN</div>
            <div className="aboutus-logo-text">SERVICES</div>
            <div className="aboutus-image-decoration"></div>
          </div>
        </div>
        <div className="aboutus-content">
          <h2>About Urban Services</h2>
          <p>
            Urban Services connects you with trusted local professionals for cleaning, electrical, plumbing, and more.
          </p>
          <p>
            Our mission is to deliver fast, reliable, and affordable service to every customer.
          </p>
          <p>
            Join thousands who trust us for quality and convenience.
          </p>
        </div>
      </div>
    </section>
  );
}


export default AboutUs;
