import React, { useEffect, useState } from "react";

import {
  getMyServices,
  addService,
  updateService,
  deleteService,
  resubmitService,
} from "../../Services/serviceService";

const ProviderServicesPage = () => {
  const [services, setServices] = useState([]);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [showForm, setShowForm] = useState(false);
  const [editingService, setEditingService] = useState(null);

  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    description: "",
    category: "",
    tag: "",
  });

  const [imageFile, setImageFile] = useState(null);

  // ---------------------------------------
  // Fetch provider services
  // ---------------------------------------

  const loadServices = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getMyServices();

      setServices(data.services || []);
    } catch (err) {
      console.error("Fetch provider services error:", err);

      setError(
        err.response?.data?.message ||
          "Failed to load your services"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadServices();
  }, []);

  // ---------------------------------------
  // Handle input changes
  // ---------------------------------------

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ---------------------------------------
  // Handle image
  // ---------------------------------------

  const handleImageChange = (e) => {
    setImageFile(e.target.files[0] || null);
  };

  // ---------------------------------------
  // Open Add form
  // ---------------------------------------

  const handleAddClick = () => {
    setEditingService(null);

    setFormData({
      name: "",
      price: "",
      description: "",
      category: "",
      tag: "",
    });

    setImageFile(null);
    setError("");
    setShowForm(true);
  };

  // ---------------------------------------
  // Open Edit form
  // ---------------------------------------

  const handleEditClick = (service) => {
    setEditingService(service);

    setFormData({
      name: service.name || "",
      price: service.price || "",
      description: service.description || "",
      category: service.category || "",
      tag: service.tag || "",
    });

    setImageFile(null);
    setError("");
    setShowForm(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // ---------------------------------------
  // Reset form
  // ---------------------------------------

  const resetForm = () => {
    setFormData({
      name: "",
      price: "",
      description: "",
      category: "",
      tag: "",
    });

    setImageFile(null);
    setEditingService(null);
    setShowForm(false);
    setError("");
  };

  // ---------------------------------------
  // Submit service
  // ---------------------------------------

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (!formData.name.trim()) {
      setError("Service name is required.");
      return;
    }

    if (!formData.price || Number(formData.price) <= 0) {
      setError("Please enter a valid price.");
      return;
    }

    if (!formData.description.trim()) {
      setError("Service description is required.");
      return;
    }

    if (!formData.category.trim()) {
      setError("Please enter a category.");
      return;
    }

    try {
      setSubmitting(true);

      const data = new FormData();

      data.append("name", formData.name.trim());
      data.append("price", formData.price);
      data.append("description", formData.description.trim());
      data.append("category", formData.category.trim());
      data.append("tag", formData.tag);

      if (imageFile) {
        data.append("image", imageFile);
      }

      if (editingService) {
        await updateService(editingService._id, data);

        alert("Service updated successfully.");
      } else {
        await addService(data);

        alert(
          "Service submitted successfully. Waiting for admin approval."
        );
      }

      resetForm();
      await loadServices();

    } catch (err) {
      console.error("Save service error:", err);

      setError(
        err.response?.data?.message ||
          "Failed to save service."
      );
    } finally {
      setSubmitting(false);
    }
  };

  // ---------------------------------------
  // Delete service
  // ---------------------------------------

  const handleDelete = async (serviceId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this service?"
    );

    if (!confirmed) {
      return;
    }

    try {
      await deleteService(serviceId);

      alert("Service deleted successfully.");

      await loadServices();

    } catch (err) {
      console.error("Delete service error:", err);

      alert(
        err.response?.data?.message ||
          "Failed to delete service."
      );
    }
  };

  // ---------------------------------------
  // Resubmit service
  // ---------------------------------------

  const handleResubmit = async (serviceId) => {
    const confirmed = window.confirm(
      "Resubmit this service for admin review?"
    );

    if (!confirmed) {
      return;
    }

    try {
      await resubmitService(serviceId);

      alert(
        "Service resubmitted successfully. Waiting for admin review."
      );

      await loadServices();

    } catch (err) {
      console.error("Resubmit service error:", err);

      alert(
        err.response?.data?.message ||
          "Failed to resubmit service."
      );
    }
  };

  // ---------------------------------------
  // Status badge
  // ---------------------------------------

  const getStatusClass = (status) => {
    switch (status) {
      case "approved":
        return "status-approved";

      case "pending":
        return "status-pending";

      case "changes_requested":
        return "status-changes";

      case "rejected":
        return "status-rejected";

      default:
        return "status-default";
    }
  };

  // ---------------------------------------
  // Loading
  // ---------------------------------------

  if (loading) {
    return (
      <div className="provider-services-page">
        <h2>My Services</h2>
        <p>Loading services...</p>
      </div>
    );
  }

  // ---------------------------------------
  // UI
  // ---------------------------------------

  return (
    <div className="provider-services-page">

      {/* Header */}

      <div className="services-page-header">

        <div>
          <h1>My Services</h1>

          <p>
            Manage your services and track their approval status.
          </p>
        </div>

        <button
          type="button"
          onClick={handleAddClick}
          className="btn-primary"
        >
          + Add Service
        </button>

      </div>

      {/* Error */}

      {error && (
        <div className="alert alert-danger">
          {error}
        </div>
      )}

      {/* Add / Edit Form */}

      {showForm && (
        <div className="service-form-card">

          <div className="form-header">

            <h2>
              {editingService
                ? "Edit Service"
                : "Add New Service"}
            </h2>

            <button
              type="button"
              onClick={resetForm}
              className="btn-close"
            >
              ×
            </button>

          </div>

          <form onSubmit={handleSubmit}>

            {/* Service Name */}

            <div className="form-group">

              <label>
                Service Name
              </label>

              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Example: AC Repair"
                required
              />

            </div>

            {/* Price */}

            <div className="form-group">

              <label>
                Price
              </label>

              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="Enter price"
                min="1"
                required
              />

            </div>

            {/* Description */}

            <div className="form-group">

              <label>
                Description
              </label>

              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe your service"
                rows="4"
                required
              />

            </div>

            {/* Category */}

            <div className="form-group">

              <label>
                Category
              </label>

              <input
                type="text"
                name="category"
                value={formData.category}
                onChange={handleChange}
                placeholder="Example: Electrical"
                required
              />

            </div>

            {/* Tag */}

            <div className="form-group">

              <label>
                Tag
              </label>

              <select
                name="tag"
                value={formData.tag}
                onChange={handleChange}
              >

                <option value="">
                  No Tag
                </option>

                <option value="New">
                  New
                </option>

                <option value="Popular">
                  Popular
                </option>

                <option value="Offer">
                  Offer
                </option>

              </select>

            </div>

            {/* Image */}

            <div className="form-group">

              <label>
                Service Image
              </label>

              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />

              {editingService?.image && !imageFile && (
                <p>
                  Existing image will be kept unless you select
                  a new one.
                </p>
              )}

            </div>

            {/* Form buttons */}

            <div className="form-actions">

              <button
                type="submit"
                className="btn-primary"
                disabled={submitting}
              >
                {submitting
                  ? "Saving..."
                  : editingService
                  ? "Update Service"
                  : "Submit Service"}
              </button>

              <button
                type="button"
                className="btn-secondary"
                onClick={resetForm}
                disabled={submitting}
              >
                Cancel
              </button>

            </div>

          </form>

        </div>
      )}

      {/* Services */}

      <div className="services-list">

        {services.length === 0 ? (

          <div className="empty-state">

            <h2>No Services Yet</h2>

            <p>
              Add your first service to start receiving bookings.
            </p>

            <button
              type="button"
              onClick={handleAddClick}
              className="btn-primary"
            >
              + Add Service
            </button>

          </div>

        ) : (

          services.map((service) => (

            <div
              key={service._id}
              className="provider-service-card"
            >

              {/* Image */}

              {service.image && (
                <img
                  src={`http://localhost:5000/uploads/${service.image}`}
                  alt={service.name}
                  className="service-image"
                />
              )}

              <div className="service-card-content">

                <div className="service-card-top">

                  <div>

                    <h2>
                      {service.name}
                    </h2>

                    <p className="service-category">
                      {service.category}
                    </p>

                  </div>

                  <span
                    className={`service-status ${getStatusClass(
                      service.status
                    )}`}
                  >
                    {service.status || "pending"}
                  </span>

                </div>

                <p>
                  {service.description}
                </p>

                <h3>
                  ₹{service.price}
                </h3>

                {/* Admin comment */}

                {service.status === "changes_requested" &&
                  service.adminComment && (

                    <div className="admin-feedback changes-feedback">

                      <strong>
                        Admin requested changes:
                      </strong>

                      <p>
                        {service.adminComment}
                      </p>

                    </div>
                  )}

                {/* Rejection reason */}

                {service.status === "rejected" &&
                  service.rejectionReason && (

                    <div className="admin-feedback rejection-feedback">

                      <strong>
                        Rejection reason:
                      </strong>

                      <p>
                        {service.rejectionReason}
                      </p>

                    </div>
                  )}

                {/* Pending message */}

                {service.status === "pending" && (

                  <div className="service-info">

                    ⏳ Your service is waiting for
                    admin approval.

                  </div>
                )}

                {/* Approved message */}

                {service.status === "approved" && (

                  <div className="service-info">

                    ✓ Your service has been approved
                    and is available to customers.

                  </div>
                )}

                {/* Actions */}

                <div className="service-actions">

                  {/* Changes requested */}

                  {service.status === "changes_requested" && (
                    <>
                      <button
                        type="button"
                        className="btn-primary"
                        onClick={() =>
                          handleEditClick(service)
                        }
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        className="btn-success"
                        onClick={() =>
                          handleResubmit(service._id)
                        }
                      >
                        Resubmit
                      </button>
                    </>
                  )}

                  {/* Edit */}

                  {service.status !== "changes_requested" &&
                    service.status !== "rejected" && (

                      <button
                        type="button"
                        className="btn-secondary"
                        onClick={() =>
                          handleEditClick(service)
                        }
                      >
                        Edit
                      </button>
                    )}

                  {/* Delete */}

                  <button
                    type="button"
                    className="btn-danger"
                    onClick={() =>
                      handleDelete(service._id)
                    }
                  >
                    Delete
                  </button>

                </div>

              </div>

            </div>

          ))

        )}

      </div>

    </div>
  );
};

export default ProviderServicesPage;