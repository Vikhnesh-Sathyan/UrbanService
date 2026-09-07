import React from "react";
import { useNavigate } from "react-router-dom";
import {
  FaSpa,
  FaUserTie,
  FaSnowflake,
  FaBroom,
  FaTools,
  FaTint,
  FaPaintRoller,
  FaLayerGroup,
  FaArrowRight,
} from "react-icons/fa";

import "../../styles/Services.css";

const categories = [
  {
    icon: <FaSpa />,
    title: "Women's Salon & Spa",
    description: "Beauty, spa treatments, facials and massages.",
    path: "/womens-salon",
    color: "pink",
  },
  {
    icon: <FaUserTie />,
    title: "Men's Salon & Massage",
    description: "Professional grooming, haircuts and massages.",
    path: "/mens-salon",
    color: "blue",
  },
  {
    icon: <FaSnowflake />,
    title: "AC & Appliance Repair",
    description: "Reliable repair and maintenance for appliances.",
    path: "/ac-repair",
    color: "cyan",
  },
  {
    icon: <FaBroom />,
    title: "Cleaning & Pest Control",
    description: "Keep your home clean, fresh and pest-free.",
    path: "/cleaning",
    color: "green",
  },
  {
    icon: <FaTools />,
    title: "Electrician, Plumber & Carpenter",
    description: "Skilled professionals for essential home repairs.",
    path: "/electrician",
    color: "orange",
  },
  {
    icon: <FaTint />,
    title: "Water Purifier",
    description: "Installation, repair and maintenance services.",
    path: "/water-purifier",
    color: "aqua",
  },
  {
    icon: <FaPaintRoller />,
    title: "Walls & Rooms Painting",
    description: "Transform your space with professional painting.",
    path: "/painting",
    color: "purple",
    isNew: true,
  },
  {
    icon: <FaLayerGroup />,
    title: "Wall Panels",
    description: "Stylish decorative wall panel installation.",
    path: "/wall-panels",
    color: "brown",
  },
];

function Services() {
  const navigate = useNavigate();

  return (
    <section className="services-section">

      {/* Heading */}
      <div className="services-heading">

        <span className="services-label">
          OUR SERVICES
        </span>

        <h2>
          Find the Right Service
          <br />
          <span>For Your Needs.</span>
        </h2>

        <p>
          From home repairs to beauty and maintenance,
          book trusted professionals for everyday services.
        </p>

      </div>


      {/* Service Cards */}
      <div className="services-grid">

        {categories.map((item, index) => (

          <div
            className={`service-card service-${item.color}`}
            key={index}
            onClick={() => navigate(item.path)}
          >

            {/* New Badge */}
            {item.isNew && (
              <span className="service-new">
                NEW
              </span>
            )}


            {/* Icon */}
            <div className="service-icon">
              {item.icon}
            </div>


            {/* Content */}
            <div className="service-content">

              <h3>
                {item.title}
              </h3>

              <p>
                {item.description}
              </p>

            </div>


            {/* Arrow */}
            <div className="service-arrow">
              <FaArrowRight />
            </div>

          </div>

        ))}

      </div>

    </section>
  );
}

export default Services;