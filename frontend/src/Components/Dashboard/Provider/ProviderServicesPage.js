import React, { useEffect, useState } from "react";
import axios from "axios";
import "../../../styles/ProviderServices.css";

const API = "http://localhost:5000/api/services";

const ProviderServicesPage = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    description: "",
    category: "",
    tag: "",
  });

  const [image, setImage] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const token = localStorage.getItem("token");

  const authConfig = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  // =========================
  // FETCH SERVICES
  // =========================

  const fetchServices = async () => {
    try {
      const response = await axios.get(API);

      setServices(response.data);
    } catch (error) {
      console.error("Failed to fetch services:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  // =========================
  // INPUT CHANGE
  // =========================

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // =========================
  // IMAGE CHANGE
  // =========================

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  // =========================
  // ADD SERVICE
  // =========================

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSubmitting(true);

      const data = new FormData();

      data.append("name", formData.name);
      data.append("price", formData.price);
      data.append("description", formData.description);
      data.append("category", formData.category);
      data.append("tag", formData.tag);

      if (image) {
        data.append("image", image);
      }

      const response = await axios.post(
        `${API}/add`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      alert(response.data.message || "Service added successfully");

      setFormData({
        name: "",
        price: "",
        description: "",
        category: "",
        tag: "",
      });

      setImage(null);
      setShowForm(false);

      fetchServices();

    } catch (error) {
      console.error("Add service error:", error);

      alert(
        error.response?.data?.message ||
        "Failed to add service"
      );

    } finally {
      setSubmitting(false);
    }
  };

  // =========================
  // LOADING
  // =========================

  if (loading) {
    return (
      <div className="provider-services-page">
        <p>Loading services...</p>
      </div>
    );
  }

  // =========================
  // UI
  // =========================

  return (
    <div className="provider-services-page">

      {/* HEADER */}

      <div className="services-page-header">

        <div>
          <span className="page-label">
            SERVICE MANAGEMENT
          </span>

          <h1>My Services</h1>

          <p>
            Manage the services you provide to customers.
          </p>
        </div>

        <button
          className="add-service-btn"
          onClick={() => setShowForm(!showForm)}
        >
          + Add Service
        </button>

      </div>

      {/* ADD SERVICE FORM */}

      {showForm && (
        <div className="service-form-card">

          <div className="form-header">
            <h2>Add New Service</h2>

            <button
              type="button"
              onClick={() => setShowForm(false)}
            >
              ×
            </button>
          </div>

          <form onSubmit={handleSubmit}>

            <div className="form-grid">

              <div className="form-group">
                <label>Service Name</label>

                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Example: AC Repair"
                  required
                />
              </div>

              <div className="form-group">
                <label>Price</label>

                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="₹"
                  required
                />
              </div>

              <div className="form-group">
                <label>Category</label>

                <input
                  type="text"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  placeholder="Example: AC & Appliance Repair"
                  required
                />
              </div>

              <div className="form-group">
                <label>Tag</label>

                <select
                  name="tag"
                  value={formData.tag}
                  onChange={handleChange}
                >
                  <option value="">No Tag</option>
                  <option value="New">New</option>
                  <option value="Popular">Popular</option>
                  <option value="Offer">Offer</option>
                </select>
              </div>

            </div>

            <div className="form-group">
              <label>Description</label>

              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe your service..."
                rows="4"
                required
              />
            </div>

            <div className="form-group">
              <label>Service Image</label>

              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />
            </div>

            <div className="form-actions">

              <button
                type="button"
                onClick={() => setShowForm(false)}
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={submitting}
              >
                {submitting
                  ? "Adding..."
                  : "Add Service"}
              </button>

            </div>

          </form>

        </div>
      )}

      {/* SERVICES */}

      <div className="services-section">

        <div className="section-title">
          <h2>Your Services</h2>

          <span>
            {services.length} services
          </span>
        </div>

        {services.length === 0 ? (

          <div className="empty-services">

            <h3>No services yet</h3>

            <p>
              Add your first service to start receiving bookings.
            </p>

            <button
              onClick={() => setShowForm(true)}
            >
              + Add Your First Service
            </button>

          </div>

        ) : (

          <div className="services-grid">

            {services.map((service) => (

              <div
                className="provider-service-card"
                key={service._id}
              >

                {service.image && (
                  <img
                    src={`http://localhost:5000/uploads/${service.image}`}
                    alt={service.name}
                  />
                )}

                <div className="service-card-content">

                  <div className="service-card-top">

                    <h3>
                      {service.name}
                    </h3>

                    {service.tag && (
                      <span>
                        {service.tag}
                      </span>
                    )}

                  </div>

                  <p className="service-category">
                    {service.category}
                  </p>

                  <p className="service-description">
                    {service.description}
                  </p>

                  <strong className="service-price">
                    ₹{service.price}
                  </strong>

                  <p className="service-status">
                    Status:{" "}
                    {service.status || "Pending"}
                  </p>

                </div>

              </div>

            ))}

          </div>

        )}

      </div>

    </div>
  );
};

export default ProviderServicesPage;