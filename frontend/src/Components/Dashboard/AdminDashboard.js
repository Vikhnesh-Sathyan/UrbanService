import React, { useEffect, useState } from "react";
import axios from "axios";
import "./AdminDashboard.css";

function AdminDashboard() {
  const [services, setServices] = useState([]);
  const [allServices, setAllServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPendingServices();
    fetchAllServices();
  }, []);

  const fetchPendingServices = () => {
    setLoading(true);
    axios.get("http://localhost:5000/api/pending-services")
      .then(res => {
        setServices(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  };

  const fetchAllServices = () => {
    axios.get("http://localhost:5000/api/services")
      .then(res => setAllServices(res.data))
      .catch(err => console.error(err));
  };

  const approveService = (id) => {
    axios.patch(`http://localhost:5000/api/approve-service/${id}`)
      .then(() => {
        alert("Service Approved Successfully!");
        fetchPendingServices();
        fetchAllServices();
      })
      .catch(() => alert("Error approving service"));
  };

  const rejectService = (id) => {
    if (window.confirm("Are you sure you want to reject this service?")) {
      axios.delete(`http://localhost:5000/api/services/${id}`)
        .then(() => {
          alert("Service Rejected");
          fetchPendingServices();
          fetchAllServices();
        })
        .catch(() => alert("Error rejecting service"));
    }
  };

  // Calculate stats
  const pendingCount = services.length;
  const totalServices = allServices.length;
  const approvedCount = allServices.filter(s => s.status === "approved" || !s.status).length;
  const categories = [...new Set(allServices.map(s => s.category))].length;

  return (
    <div className="provider-dashboard">
      <div className="dashboard-header">
        <div className="header-content">
          <h1>Admin Dashboard</h1>
          <p>Manage and approve service submissions</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card stat-warning">
          <div className="stat-icon">⏳</div>
          <div className="stat-info">
            <h3>{pendingCount}</h3>
            <p>Pending Approval</p>
          </div>
        </div>
        <div className="stat-card stat-success">
          <div className="stat-icon">✅</div>
          <div className="stat-info">
            <h3>{approvedCount}</h3>
            <p>Approved Services</p>
          </div>
        </div>
        <div className="stat-card stat-primary">
          <div className="stat-icon">📦</div>
          <div className="stat-info">
            <h3>{totalServices}</h3>
            <p>Total Services</p>
          </div>
        </div>
        <div className="stat-card stat-info">
          <div className="stat-icon">📂</div>
          <div className="stat-info">
            <h3>{categories}</h3>
            <p>Categories</p>
          </div>
        </div>
      </div>

      {/* Pending Services Section */}
      <div className="services-section">
        <div className="section-header">
          <h2>⏳ Pending Service Approvals</h2>
          <p>Review and approve service submissions</p>
        </div>

        {loading ? (
          <div className="empty-state">
            <div className="spinner"></div>
            <p>Loading pending services...</p>
          </div>
        ) : services.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">✅</div>
            <h3>All Clear!</h3>
            <p>No pending services to review</p>
          </div>
        ) : (
          <div className="services-grid">
            {services.map(service => (
              <div key={service._id} className="service-card admin-card">
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
                  <span className="service-tag tag-pending">Pending</span>
                </div>
                <div className="service-content">
                  <h4>{service.name}</h4>
                  <p className="service-price">₹{service.price}</p>
                  <p className="service-description">{service.description}</p>
                  <div className="service-meta">
                    <p><strong>Category:</strong> {service.category}</p>
                    <p><strong>Provider:</strong> {service.addedBy}</p>
                    {service.tag && (
                      <p><strong>Tag:</strong> <span className={`service-tag-inline tag-${service.tag.toLowerCase()}`}>{service.tag}</span></p>
                    )}
                  </div>
                  <div className="admin-actions">
                    <button 
                      onClick={() => approveService(service._id)} 
                      className="btn-approve"
                    >
                      ✅ Approve
                    </button>
                    <button 
                      onClick={() => rejectService(service._id)} 
                      className="btn-reject"
                    >
                      ❌ Reject
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;
