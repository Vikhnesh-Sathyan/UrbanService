import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "../../styles/UserDashboard.css";

function UserServices() {
  const [services, setServices] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [loading, setLoading] = useState(true);

  const categories = [
    "All",
    "Women's Salon & Spa",
    "Men's Salon & Massage",
    "AC & Appliance Repair",
    "Cleaning & Pest Control",
    "Electrician, Plumber & Carpenter",
    "Native Water Purifier",
    "Walls & Rooms Painting",
    "Wall Panels"
  ];

  const fetchServices = (category = "") => {
    setLoading(true);
    const url = category && category !== "All"
      ? `http://localhost:5000/api/services?category=${category}`
      : `http://localhost:5000/api/services`;

    axios.get(url)
      .then(res => {
        setServices(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  };

  const fetchBookings = () => {
    const userId = localStorage.getItem("userId");
    if (userId) {
      axios.get(`http://localhost:5000/api/bookings/user/${userId}`)
        .then(res => setBookings(res.data))
        .catch(err => console.error(err));
    }
  };

  useEffect(() => {
    fetchServices();
    fetchBookings();
  }, []);

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    fetchServices(category);
  };

  // Calculate stats
  const totalServices = services.length;
  const activeBookings = bookings.filter(b => b.status === "confirmed" || b.status === "pending").length;
  const completedBookings = bookings.filter(b => b.status === "completed").length;

  return (
    <div className="user-dashboard">
      <div className="dashboard-header">
        <div className="header-content">
          <h1>My Dashboard</h1>
          <p>Browse services and manage your bookings</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card stat-primary">
          <div className="stat-icon">🔍</div>
          <div className="stat-info">
            <h3>{totalServices}</h3>
            <p>Available Services</p>
          </div>
        </div>
        <div className="stat-card stat-warning">
          <div className="stat-icon">📅</div>
          <div className="stat-info">
            <h3>{activeBookings}</h3>
            <p>Active Bookings</p>
          </div>
        </div>
        <div className="stat-card stat-success">
          <div className="stat-icon">✅</div>
          <div className="stat-info">
            <h3>{completedBookings}</h3>
            <p>Completed</p>
          </div>
        </div>
        <div className="stat-card stat-info">
          <div className="stat-icon">⭐</div>
          <div className="stat-info">
            <h3>{bookings.length}</h3>
            <p>Total Bookings</p>
          </div>
        </div>
      </div>

      {/* Recent Bookings */}
      {bookings.length > 0 && (
        <div className="bookings-section">
          <div className="section-header">
            <h2>📋 Recent Bookings</h2>
            <Link to="/bookings" className="view-all-link">View All →</Link>
          </div>
          <div className="bookings-grid">
            {bookings.slice(0, 3).map(booking => (
              <div key={booking._id} className="booking-card">
                <div className="booking-header">
                  <h4>{booking.serviceName || "Service"}</h4>
                  <span className={`status-badge status-${booking.status}`}>
                    {booking.status}
                  </span>
                </div>
                <div className="booking-details">
                  <p><strong>Date:</strong> {new Date(booking.date).toLocaleDateString()}</p>
                  <p><strong>Time:</strong> {booking.time}</p>
                  <p><strong>Amount:</strong> ₹{booking.amount}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Services Section */}
      <div className="services-section">
        <div className="section-header">
          <h2>🛍️ Browse Services</h2>
          <p>Find the perfect service for your needs</p>
        </div>

        <div className="category-filters">
          {categories.map((category, index) => (
            <button
              key={index}
              onClick={() => handleCategoryClick(category)}
              className={`filter-btn ${selectedCategory === category ? "active" : ""}`}
            >
              {category}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Loading services...</p>
          </div>
        ) : services.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🔍</div>
            <h3>No services found</h3>
            <p>Try selecting a different category</p>
          </div>
        ) : (
          <div className="services-grid">
            {services.map(service => (
              <Link to={`/service-details/${service._id}`} key={service._id} className="service-card-link">
                <div className="service-card">
                  <div className="service-image-wrapper">
                    {service.image ? (
                      <img 
                        src={`http://localhost:5000/uploads/${service.image}`} 
                        alt={service.name}
                        className="service-image"
                      />
                    ) : (
                      <div className="service-image-placeholder">📷</div>
                    )}
                    {service.tag && (
                      <span className={`service-tag tag-${service.tag.toLowerCase()}`}>
                        {service.tag}
                      </span>
                    )}
                  </div>
                  <div className="service-content">
                    <h4 className="service-title">{service.name}</h4>
                    <p className="service-category">{service.category}</p>
                    <div className="service-footer">
                      <span className="service-price">₹{service.price}</span>
                      <button className="btn-view">View Details →</button>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default UserServices;
