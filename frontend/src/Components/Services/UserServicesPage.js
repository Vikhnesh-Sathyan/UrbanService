import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const UserServicesPage = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedServiceId, setSelectedServiceId] = useState(null);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/services');
        setServices(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch services');
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  if (loading) return <div className="text-center mt-5"><div className="spinner-border" role="status"></div></div>;
  if (error) return <div className="alert alert-danger m-3">{error}</div>;

  const handleServiceClick = (serviceId) => {
    setSelectedServiceId(serviceId);
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Available Services</h2>
      <div className="row">
        {services.map((service) => (
          <div key={service._id} className="col-md-4 mb-4">
            <div 
              className={`card h-100 ${selectedServiceId === service._id ? 'border-primary shadow' : ''}`}
              onClick={() => handleServiceClick(service._id)}
              style={{ cursor: 'pointer' }}
            >
              {service.image && (
                <img 
                  src={service.image} 
                  className="card-img-top" 
                  alt={service.name}
                  style={{ height: '200px', objectFit: 'cover' }}
                />
              )}
              <div className="card-body">
                <h5 className="card-title">{service.name}</h5>
                <p className="card-text">{service.description}</p>
                <p className="card-text">
                  <strong>Price:</strong> ₹{service.price}
                </p>
                <Link 
                  to={`/service-details/${service._id}`} 
                  className="btn btn-primary"
                >
                  View Details
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserServicesPage; 