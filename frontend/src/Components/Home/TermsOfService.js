import React from "react";

import "../../styles/LegalPages.css";

const TermsOfService = () => {
  return (
    <div className="legal-page">

      <div className="legal-container">

        {/* ==========================================
            HEADER
        ========================================== */}

        <span className="legal-label">
          TERMS
        </span>

        <h1>
          Terms of Service
        </h1>

        <p className="legal-intro">
          These terms describe the general rules for using
          the UrbanService platform and its service features.
        </p>


        {/* ==========================================
            PLATFORM USE
        ========================================== */}

        <section>

          <h2>
            1. Using UrbanService
          </h2>

          <p>
            UrbanService provides a platform where customers
            can discover services and connect with service
            providers. Users are expected to provide accurate
            information and use the platform responsibly.
          </p>

        </section>


        {/* ==========================================
            ACCOUNT
        ========================================== */}

        <section>

          <h2>
            2. User Accounts
          </h2>

          <p>
            Users are responsible for maintaining the security
            of their account credentials. Account information
            should be kept accurate and should not be shared
            with unauthorized individuals.
          </p>

        </section>


        {/* ==========================================
            SERVICE BOOKINGS
        ========================================== */}

        <section>

          <h2>
            3. Service Bookings
          </h2>

          <p>
            Customers can browse available services and create
            bookings through the platform. Booking availability,
            status, and completion are managed according to the
            service workflow provided by UrbanService.
          </p>

        </section>


        {/* ==========================================
            SERVICE PROVIDERS
        ========================================== */}

        <section>

          <h2>
            4. Service Providers
          </h2>

          <p>
            Service providers are responsible for the services
            they offer through the platform. Providers should
            maintain accurate service information and manage
            bookings according to the platform workflow.
          </p>

        </section>


        {/* ==========================================
            PAYMENTS
        ========================================== */}

        <section>

          <h2>
            5. Payments
          </h2>

          <p>
            Payments for supported services may be processed
            through the payment functionality provided by
            UrbanService. Users should review the relevant
            booking and payment information before completing
            a transaction.
          </p>

        </section>


        {/* ==========================================
            CANCELLATIONS
        ========================================== */}

        <section>

          <h2>
            6. Cancellations and Refunds
          </h2>

          <p>
            Booking cancellations and refunds are handled
            according to the applicable booking and payment
            workflow available on the platform.
          </p>

        </section>


        {/* ==========================================
            PLATFORM FEATURES
        ========================================== */}

        <section>

          <h2>
            7. Platform Features
          </h2>

          <p>
            UrbanService may provide features such as booking
            management, notifications, payment history,
            provider analytics, material preparation, and
            service follow-up reminders. Features may change
            as the platform is updated.
          </p>

        </section>


        {/* ==========================================
            PROHIBITED USE
        ========================================== */}

        <section>

          <h2>
            8. Responsible Use
          </h2>

          <p>
            Users should not misuse the platform, provide
            misleading information, attempt unauthorized access,
            or interfere with the normal operation of the
            service.
          </p>

        </section>


        {/* ==========================================
            CHANGES
        ========================================== */}

        <section>

          <h2>
            9. Changes to These Terms
          </h2>

          <p>
            UrbanService may update these terms when platform
            features, workflows, or policies change. Updated
            information will be reflected on this page.
          </p>

        </section>


        {/* ==========================================
            CONTACT
        ========================================== */}

        <section>

          <h2>
            10. Contact
          </h2>

          <p>
            If you have questions about these terms or the
            UrbanService platform, please use the Contact Us
            page to get in touch with the platform support team.
          </p>

        </section>

      </div>

    </div>
  );
};

export default TermsOfService;