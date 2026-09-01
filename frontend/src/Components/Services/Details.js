import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import PaymentForm from '../Payment/PaymentForm';

const Details = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showPayment, setShowPayment] = useState(false);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [paymentComplete, setPaymentComplete] = useState(false);
  const [bookingError, setBookingError] = useState('');
  const [bookingSubmitting, setBookingSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    date: '',
    time: '',
    notes: ''
  });
  const todayLocal = new Date(new Date().getTime() - new Date().getTimezoneOffset() * 60000)
    .toISOString()
    .split('T')[0];

  const handlePaymentSuccess = () => {
    setShowPayment(false);
    setBookingSuccess(false);
    setPaymentComplete(true);
    setTimeout(() => navigate('/UserDashboard'), 1200);
  };

  const handlePaymentCancel = () => setShowPayment(false);

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    setBookingError('');

    const trimmedName = formData.name.trim();
    const phoneDigits = formData.phone.replace(/\D/g, '');
    const isPastDate = formData.date && formData.date < todayLocal;

    if (!trimmedName || trimmedName.length < 2) {
      setBookingError('Please enter a valid name (min 2 characters).');
      return;
    }
    if (phoneDigits.length < 10) {
      setBookingError('Please enter a valid phone number (10 digits).');
      return;
    }
    if (!formData.date || !formData.time) {
      setBookingError('Please select both date and time.');
      return;
    }
    if (isPastDate) {
      setBookingError('Please choose a date today or in the future.');
      return;
    }

    try {
      setBookingSubmitting(true);
      await axios.post('http://localhost:5000/api/booking', { serviceId: id, ...formData });
      setShowBookingForm(false);
      setBookingSuccess(true);
      setShowPayment(true);
    } catch (err) {
      console.error(err);
      alert('Failed to book. Please try again.');
    } finally {
      setBookingSubmitting(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    const fetchServiceDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/services/${id}`);
        setService(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch service details');
        setLoading(false);
      }
    };

    fetchServiceDetails();
  }, [id]);

  if (loading) return <div className="text-center mt-5"><div className="spinner-border" role="status"></div></div>;
  if (error) return <div className="alert alert-danger m-3">{error}</div>;
  if (!service) return <div className="alert alert-warning m-3">Service not found</div>;

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-md-6">
          {service.image && (
            <img 
              src={service.image} 
              className="img-fluid rounded" 
              alt={service.name}
              style={{ width: '100%', maxHeight: '400px', objectFit: 'cover' }}
            />
          )}
        </div>
        <div className="col-md-6">
          <h2 className="mb-3">{service.name}</h2>
          <p className="lead">{service.description}</p>
          <div className="mb-3">
            <h4>Price: ₹{service.price}</h4>
          </div>
          <div className="mb-3">
            <h5>Service Details:</h5>
            <p>{service.detailedDescription || 'No detailed description available.'}</p>
          </div>
          <div className="mb-3">
            <h5>Provider Information:</h5>
            <p>Provider: {service.provider?.name || 'Not specified'}</p>
            <p>Rating: {service.rating || 'No ratings yet'}</p>
          </div>
          <div className="d-grid gap-2">
            <button 
              className="btn btn-primary mb-2"
              onClick={() => {
                setShowBookingForm(true);
                setShowPayment(false);
              }}
            >
              Book Appointment
            </button>
            <button 
              className="btn btn-success"
              type="button"
              onClick={() => {
                setShowBookingForm(true);
                setShowPayment(false);
              }}
            >
              Pay Now
            </button>
            <button 
              className="btn btn-outline-secondary"
              onClick={() => navigate('/services')}
            >
              Back to Services
            </button>
          </div>
        </div>
      </div>

      {bookingSuccess && (
        <div className="alert alert-success mt-3" role="alert">
          Booking placed. Please complete payment to confirm your service.
        </div>
      )}

      {paymentComplete && (
        <div className="alert alert-success mt-3" role="alert">
          Payment successful. Your service is confirmed.
        </div>
      )}

      {showBookingForm && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content border-0 shadow-lg rounded-4 overflow-hidden">
              <div className="modal-header text-white" style={{ background: 'linear-gradient(90deg, #6a11cb 0%, #2575fc 100%)' }}>
                <h5 className="modal-title fw-semibold">Book Appointment</h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setShowBookingForm(false)}></button>
              </div>
              <form onSubmit={handleBookingSubmit} className="needs-validation">
                <div className="modal-body p-4">
                  <div className="mb-3">
                    <input
                      className="form-control form-control-lg"
                      name="name"
                      placeholder="Your Name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <input
                      className="form-control form-control-lg"
                      name="phone"
                      placeholder="Phone Number (10 digits)"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="row g-3 mb-3">
                    <div className="col">
                      <input
                        className="form-control form-control-lg"
                        type="date"
                        name="date"
                        value={formData.date}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="col">
                      <input
                        className="form-control form-control-lg"
                        type="time"
                        name="time"
                        value={formData.time}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                  <div className="mb-3">
                    <textarea
                      className="form-control"
                      style={{ minHeight: '90px' }}
                      name="notes"
                      placeholder="Notes (optional)"
                      value={formData.notes}
                      onChange={handleChange}
                    />
                  </div>
                  {bookingError && (
                    <div className="alert alert-danger py-2 mb-0">
                      {bookingError}
                    </div>
                  )}
                </div>
                <div className="modal-footer d-flex justify-content-between p-3 border-0">
                  <button type="button" className="btn btn-outline-secondary px-4" onClick={() => setShowBookingForm(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary px-4" disabled={bookingSubmitting}>
                    {bookingSubmitting ? 'Booking...' : 'Confirm Booking'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {showPayment && (
        <div className="card mt-4">
          <div className="card-header d-flex justify-content-between align-items-center">
            <h5 className="mb-0">Payment</h5>
            <button type="button" className="btn-close" onClick={handlePaymentCancel}></button>
          </div>
          <div className="card-body">
            <PaymentForm 
              service={{ 
                ...service, 
                price: typeof service.price === 'number' ? `₹${service.price}` : service.price 
              }}
              onPaymentSuccess={handlePaymentSuccess}
              onPaymentCancel={handlePaymentCancel}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Details; 