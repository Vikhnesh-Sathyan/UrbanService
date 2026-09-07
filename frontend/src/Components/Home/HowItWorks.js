import React from "react";
import {
  FaSearch,
  FaCalendarCheck,
  FaCheckCircle,
  FaArrowRight,
} from "react-icons/fa";

import "../../styles/HowItWorks.css";

function HowItWorks() {
  const steps = [
    {
      number: "01",
      icon: <FaSearch />,
      title: "Find Your Service",
      description:
        "Browse trusted professionals and choose the service that fits your needs.",
      color: "blue",
    },
    {
      number: "02",
      icon: <FaCalendarCheck />,
      title: "Book a Professional",
      description:
        "Choose your preferred date and time and place your booking in seconds.",
      color: "purple",
    },
    {
      number: "03",
      icon: <FaCheckCircle />,
      title: "Get It Done",
      description:
        "Sit back while your professional delivers a reliable service at your doorstep.",
      color: "green",
    },
  ];

  return (
    <section className="how-it-works-section">

      {/* Background decoration */}
      <div className="how-bg-circle how-bg-circle-one"></div>
      <div className="how-bg-circle how-bg-circle-two"></div>


      {/* Heading */}
      <div className="how-it-works-heading">

        <div className="how-label">
          <span></span>
          HOW IT WORKS
          <span></span>
        </div>

        <h2>
          Getting Things Done
          <br />
          <span>Has Never Been Easier.</span>
        </h2>

        <p>
          From finding the right professional to getting the job done,
          UrbanServices keeps everything simple.
        </p>

      </div>


      {/* Steps */}
      <div className="steps-wrapper">

        {/* Animated line */}
        <div className="steps-line">
          <div className="steps-line-progress"></div>
        </div>


        <div className="steps-container">

          {steps.map((step, index) => (

            <React.Fragment key={step.number}>

              <div
                className={`premium-step step-${step.color}`}
              >

                {/* Number */}
                <div className="step-number">
                  {step.number}
                </div>


                {/* Icon */}
                <div className="premium-step-icon">
                  {step.icon}
                </div>


                {/* Content */}
                <div className="premium-step-content">

                  <h3>
                    {step.title}
                  </h3>

                  <p>
                    {step.description}
                  </p>

                </div>


                {/* Bottom indicator */}
                <div className="step-indicator">
                  <span></span>
                  Simple & Secure
                </div>

              </div>


              {/* Arrow */}
              {index < steps.length - 1 && (
                <div className="premium-step-arrow">
                  <FaArrowRight />
                </div>
              )}

            </React.Fragment>

          ))}

        </div>

      </div>

    </section>
  );
}

export default HowItWorks;