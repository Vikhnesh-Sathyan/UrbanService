import React from "react";

import "../../styles/LegalPages.css";

const PrivacyPolicy = () => {
  return (
    <div className="legal-page">

      <div className="legal-container">

        <span className="legal-label">
          PRIVACY
        </span>

        <h1>
          Privacy Policy
        </h1>

        <p className="legal-intro">
          This page explains how UrbanService handles
          information used within the platform.
        </p>


        <section>
          <h2>
            Information We Use
          </h2>

          <p>
            UrbanService may use account, booking,
            service, and payment-related information
            required to provide platform functionality.
          </p>
        </section>


        <section>
          <h2>
            How Information Is Used
          </h2>

          <p>
            Information is used to support account
            management, service bookings, notifications,
            payments, and other platform features.
          </p>
        </section>


        <section>
          <h2>
            Account Security
          </h2>

          <p>
            Users should keep their login credentials
            private and avoid sharing authentication
            information with others.
          </p>
        </section>


        <section>
          <h2>
            Updates
          </h2>

          <p>
            This privacy information may be updated as
            the UrbanService platform evolves.
          </p>
        </section>

      </div>

    </div>
  );
};

export default PrivacyPolicy;