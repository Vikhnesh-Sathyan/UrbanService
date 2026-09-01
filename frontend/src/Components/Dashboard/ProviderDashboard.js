import React, { useState, useEffect } from "react";
import axios from "axios";
import "../../styles/ProviderDashboard.css";

function ProviderDashboard() {
  const [service, setService] = useState({
    name: "",
    price: "",
    description: "",
    category: "",
    tag: "",
    addedBy: "provider@gmail.com",
  });
  const [imageFile, setImageFile] = useState(null);
  const [services, setServices] = useState([]);
  const [serviceToEdit, setServiceToEdit] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const [categories, setCategories] = useState([
    "Women's Salon & Spa",
    "Men's Salon & Massage",
    "AC & Appliance Repair",
    "Cleaning & Pest Control",
    "Electrician, Plumber & Carpenter",
    "Native Water Purifier",
    "Walls & Rooms Painting",
    "Wall Panels"
  ]);
  const [newCategory, setNewCategory] = useState("");

  const tags = ["New", "Popular", "Offer"];

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = () => {
    axios.get("http://localhost:5000/api/services")
      .then(res => setServices(res.data))
      .catch(err => console.log("Fetch error", err));
  };

  const editService = (service) => {
    setService({
      name: service.name,
      price: service.price,
      description: service.description,
      category: service.category,
      tag: service.tag || "",
      addedBy: service.addedBy,
    });
    setServiceToEdit(service);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const deleteService = (id) => {
    if (!window.confirm("Delete this service? This cannot be undone.")) return;
    axios
      .delete(`http://localhost:5000/api/delete-service/${id}`)
      .then((res) => {
        alert(res.data?.message || "Service deleted");
        fetchServices();
      })
      .catch((err) => {
        console.error("Delete service error:", err);
        const message =
          err.response?.data?.message || "Error deleting service";
        alert(message);
      });
  };

  const handleChange = (e) => {
    setService({ ...service, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    for (let key in service) formData.append(key, service[key]);
    if (imageFile) formData.append("image", imageFile);

    if (serviceToEdit) {
      axios.put(`http://localhost:5000/api/update-service/${serviceToEdit._id}`, formData)
        .then((res) => {
          alert(res.data.message);
          resetForm();
          fetchServices();
        })
        .catch(() => alert("Error updating service"));
    } else {
      axios.post("http://localhost:5000/api/add-service", formData)
        .then((res) => {
          alert(res.data.message);
          resetForm();
          fetchServices();
        })
        .catch(() => alert("Error adding service"));
    }
  };

  const resetForm = () => {
    setService({
      name: "",
      price: "",
      description: "",
      category: "",
      tag: "",
      addedBy: "provider@gmail.com",
    });
    setImageFile(null);
    setServiceToEdit(null);
    setShowForm(false);
  };

  const addCategory = () => {
    if (newCategory.trim() !== "") {
      setCategories([...categories, newCategory]);
      setNewCategory("");
    }
  };

  // Group services by category
  const groupedServices = services.reduce((groups, service) => {
    const category = service.category || "Uncategorized";
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(service);
    return groups;
  }, {});

  // Calculate stats
  const totalServices = services.length;
  const totalCategories = Object.keys(groupedServices).length;
  const popularServices = services.filter(s => s.tag === "Popular").length;
  const newServices = services.filter(s => s.tag === "New").length;

  return (
    <div className="provider-dashboard">
      <div className="dashboard-header">
        <div className="header-content">
          <h1>Provider Dashboard</h1>
          <p>Manage your services and grow your business</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card stat-primary">
          <div className="stat-icon">📦</div>
          <div className="stat-info">
            <h3>{totalServices}</h3>
            <p>Total Services</p>
          </div>
        </div>
        <div className="stat-card stat-success">
          <div className="stat-icon">📂</div>
          <div className="stat-info">
            <h3>{totalCategories}</h3>
            <p>Categories</p>
          </div>
        </div>
        <div className="stat-card stat-warning">
          <div className="stat-icon">🔥</div>
          <div className="stat-info">
            <h3>{popularServices}</h3>
            <p>Popular Services</p>
          </div>
        </div>
        <div className="stat-card stat-info">
          <div className="stat-icon">✨</div>
          <div className="stat-info">
            <h3>{newServices}</h3>
            <p>New Services</p>
          </div>
        </div>
      </div>

      {/* Add Service Button */}
      {!showForm && (
        <div className="action-bar">
          <button className="btn-primary" onClick={() => setShowForm(true)}>
            <span>➕</span> Add New Service
          </button>
        </div>
      )}

      {/* Service Form */}
      {showForm && (
        <div className="form-container">
          <div className="form-header">
            <h2>{serviceToEdit ? "✏️ Edit Service" : "➕ Add New Service"}</h2>
            <button className="btn-close" onClick={resetForm}>✕</button>
          </div>
          <form onSubmit={handleSubmit} encType="multipart/form-data" className="service-form">
            <div className="form-row">
              <div className="form-group">
                <label>Service Name</label>
                <input 
                  type="text" 
                  name="name" 
                  placeholder="Enter service name" 
                  value={service.name} 
                  onChange={handleChange} 
                  required 
                />
              </div>
              <div className="form-group">
                <label>Price (₹)</label>
                <input 
                  type="number" 
                  name="price" 
                  placeholder="Enter price" 
                  value={service.price} 
                  onChange={handleChange} 
                  required 
                />
              </div>
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea 
                name="description" 
                placeholder="Describe your service..." 
                value={service.description} 
                onChange={handleChange} 
                rows="4"
                required 
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Category</label>
                <select name="category" value={service.category} onChange={handleChange} required>
                  <option value="">-- Select Category --</option>
                  {categories.map((cat, i) => (
                    <option key={i} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Tag</label>
                <select name="tag" value={service.tag} onChange={handleChange}>
                  <option value="">-- Optional Tag --</option>
                  {tags.map((tag, i) => (
                    <option key={i} value={tag}>{tag}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label>Add New Category</label>
              <div className="category-add">
                <input
                  type="text"
                  placeholder="Enter new category name"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                />
                <button type="button" onClick={addCategory} className="btn-add-category">
                  Add
                </button>
              </div>
            </div>

            <div className="form-group">
              <label>Service Image</label>
              <div className="file-upload">
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleFileChange}
                  id="image-upload"
                />
                <label htmlFor="image-upload" className="file-label">
                  {imageFile ? `📷 ${imageFile.name}` : "📁 Choose Image"}
                </label>
              </div>
            </div>

            <div className="form-actions">
              <button type="submit" className="btn-submit">
                {serviceToEdit ? "✏️ Update Service" : "➕ Add Service"}
              </button>
              <button type="button" onClick={resetForm} className="btn-cancel">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Services List */}
      <div className="services-section">
        <div className="section-header">
          <h2>📑 Your Services</h2>
          <p>Manage and organize your services by category</p>
        </div>

        {Object.keys(groupedServices).length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📭</div>
            <h3>No services yet</h3>
            <p>Start by adding your first service!</p>
            <button className="btn-primary" onClick={() => setShowForm(true)}>
              Add Service
            </button>
          </div>
        ) : (
          Object.keys(groupedServices).map((category, index) => (
            <div key={index} className="category-section">
              <div className="category-header">
                <h3>📂 {category}</h3>
                <span className="service-count">{groupedServices[category].length} services</span>
              </div>
              <div className="services-grid">
                {groupedServices[category].map((s) => (
                  <div key={s._id} className="service-card">
                    {s.image && (
                      <div className="service-image-wrapper">
                        <img 
                          src={`http://localhost:5000/uploads/${s.image}`} 
                          alt={s.name}
                          className="service-image"
                        />
                        {s.tag && <span className={`service-tag tag-${s.tag.toLowerCase()}`}>{s.tag}</span>}
                      </div>
                    )}
                    <div className="service-content">
                      <h4>{s.name}</h4>
                      <p className="service-price">₹{s.price}</p>
                      <p className="service-description">{s.description}</p>
                      <div className="service-actions">
                        <button onClick={() => editService(s)} className="btn-edit">
                          ✏️ Edit
                        </button>
                        <button onClick={() => deleteService(s._id)} className="btn-delete">
                          🗑️ Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default ProviderDashboard;
