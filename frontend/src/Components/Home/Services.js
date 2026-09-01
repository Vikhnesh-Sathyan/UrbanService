import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";
import "../../styles/Services.css";

const categories = [
  {
    icon: "🧖‍♀️",
    title: "Women's Salon & Spa",
    path: "/womens-salon",
    description:
      "Full-service beauty salon with spa treatments, facials, and massages.",
    color: "pink",
  },
  {
    icon: "🧔",
    title: "Men's Salon & Massage",
    path: "/mens-salon",
    description: "Haircuts, grooming, and relaxing massages for men.",
    color: "blue",
  },
  {
    icon: "❄️",
    title: "AC & Appliance Repair",
    path: "/ac-repair",
    description: "Repair and maintenance services for ACs and appliances.",
    color: "cyan",
  },
  {
    icon: "🧹",
    title: "Cleaning & Pest Control",
    path: "/cleaning",
    description: "Professional cleaning and pest control services for homes.",
    color: "green",
  },
  {
    icon: "🔧",
    title: "Electrician, Plumber & Carpenter",
    path: "/electrician",
    description: "Electrical, plumbing, and carpentry repair services.",
    color: "orange",
  },
  {
    icon: "💧",
    title: "Native Water Purifier",
    path: "/water-purifier",
    description: "Installation and maintenance of native water purifiers.",
    color: "aqua",
  },
  {
    icon: "🎨",
    title: "Walls & Rooms Painting",
    path: "/painting",
    isNew: true,
    description: "Quality painting services for walls and rooms.",
    color: "purple",
  },
  {
    icon: "🪵",
    title: "Wall Panels",
    path: "/wall-panels",
    description: "Decorative wall panel installations.",
    color: "brown",
  },
];

function Services() {
  const navigate = useNavigate();
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const handleCategoryClick = (path) => {
    navigate(path);
  };

  return (
    <div className="container my-5 services-container">
      <h2 className="mb-4">
        <span className="services-title-text">Services</span>
        <span className="services-title-decoration"></span>
      </h2>
      <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">
        {categories.map((item, index) => (
          <div className="col" key={index}>
            <div
              className={`card h-100 text-center card-hover-effect position-relative card-${item.color}`}
              onClick={() => handleCategoryClick(item.path)}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              style={{ cursor: "pointer" }}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  handleCategoryClick(item.path);
                }
              }}
            >
              <div className="card-glow"></div>
              <div className="card-pattern"></div>
              <div
                className="card-body d-flex flex-column justify-content-center align-items-center"
                style={{ fontSize: "2rem" }}
              >
                <div className="icon-wrapper mb-3">
                  <div className="icon-backdrop"></div>
                  <div className="icon-emoji">{item.icon}</div>
                </div>
                <p className="card-text">{item.title}</p>
                <div
                  className={`card-description ${
                    hoveredIndex === index ? "show" : ""
                  }`}
                >
                  {item.description}
                </div>
                {item.isNew && (
                  <span className="badge bg-success position-absolute top-0 end-0 m-2">
                    <span className="badge-text">NEW</span>
                    <span className="badge-shine"></span>
                  </span>
                )}
                <div className="card-arrow">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M5 12H19M19 12L12 5M19 12L12 19"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export { Services, categories };
