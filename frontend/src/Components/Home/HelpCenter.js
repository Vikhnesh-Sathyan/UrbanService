import React from "react";
import { Link } from "react-router-dom";
import {
  FaQuestionCircle,
  FaCalendarCheck,
  FaCreditCard,
  FaBell,
  FaUserShield,
} from "react-icons/fa";

import "../../styles/HelpCenter.css";

const HelpCenter = () => {
  return (
    <div className="help-page">

      {/* Hero */}
      <section className="help-hero">

        <span className="help-label">
          HELP CENTER
        </span>

        <h1>
          How can we
          <br />
          <span>help you?</span>
        </h1>

        <p>
          Find useful information about bookings,
          payments, accounts, and service notifications.
        </p>

      </section>


      {/* Help Topics */}
      <section className="help-container">

        <div className="help-card">

          <FaCalendarCheck />

          <h3>
            Bookings
          </h3>

          <p>
            Learn how to book a service, check booking
            status, and manage your appointments.
          </p>

        </div>


        <div className="help-card">

          <FaCreditCard />

          <h3>
            Payments
          </h3>

          <p>
            Manage service payments, payment history,
            receipts, and payment status.
          </p>

        </div>


        <div className="help-card">

          <FaBell />

          <h3>
            Notifications
          </h3>

          <p>
            Stay informed about booking updates,
            service reminders, and important activity.
          </p>

        </div>


        <div className="help-card">

          <FaUserShield />

          <h3>
            Account
          </h3>

          <p>
            Manage your profile and access the features
            available for your account type.
          </p>

        </div>

      </section>


      {/* FAQ */}
      <section className="help-faq">

        <div className="help-faq-heading">

          <FaQuestionCircle />

          <div>
            <span className="help-label">
              COMMON QUESTIONS
            </span>

            <h2>
              Frequently asked questions
            </h2>
          </div>

        </div>


        <div className="help-question">

          <h3>
            How do I book a service?
          </h3>

          <p>
            Browse available services, open a service
            details page, and select the booking option.
          </p>

        </div>


        <div className="help-question">

          <h3>
            Can I check my booking status?
          </h3>

          <p>
            Yes. Your bookings page displays the current
            status of your service booking.
          </p>

        </div>


        <div className="help-question">

          <h3>
            Where can I view my payment history?
          </h3>

          <p>
            Users can access their payment history from
            the payment section of their account.
          </p>

        </div>


        <div className="help-question">

          <h3>
            Need additional help?
          </h3>

          <p>
            Contact our support team for further assistance.
          </p>

          <Link to="/contact">
            Contact Us
          </Link>

        </div>

      </section>

    </div>
  );
};

export default HelpCenter;