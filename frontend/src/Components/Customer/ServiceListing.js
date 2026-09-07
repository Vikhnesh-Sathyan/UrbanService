import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "../../styles/ServiceListing.css";

function ServiceListings() {
  const [services, setServices] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/api/service")
      .then((res) => {
        const approvedServices = res.data.filter(service => service.status === "approved");
        setServices(approvedServices);
      })
      .catch(() => alert("Failed to fetch services"));
  }, []);

  return (
    <div className="service-listing-container">
      <div className="service-listing-header">
        <h2>🛒 Available Services</h2>
      </div>
      {services.length === 0 ? (
        <div className="empty-state">
          <h3>No services available at the moment</h3>
          <p>Please check back later!</p>
        </div>
      ) : (
        <div className="service-grid">
          {services.map((service) => (
            <div key={service._id} className="service-card">
              <img 
                src={`http://localhost:5000/uploads/${service.image}`} 
                alt={service.name}
                className="service-image"
              />
              <div className="service-content">
                <h3>{service.name}</h3>
                <p className="service-price">₹{service.price}</p>
                <span className="service-category">{service.category}</span>
                <p className="service-description">{service.description}</p>
                
                <Link to={`/book-service/${service._id}`} style={{ textDecoration: 'none' }}>
                  <button className="book-now-button">Book Now</button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ServiceListings;
