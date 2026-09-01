import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import "./BookService.css";

const BookService = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [service, setService] = useState({});
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    date: "",
    time: "",
    notes: "",
  });

  useEffect(() => {
    axios.get(`http://localhost:5000/api/services/${id}`)
      .then(res => setService(res.data))
      .catch(err => {
        console.error(err);
        alert("Failed to fetch service details. Please try again.");
      });
  }, [id]);

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post("http://localhost:5000/api/booking", { serviceId: id, ...formData })
      .then(() => {
        alert("Booking confirmed!");
        navigate("/services"); // redirect after booking
      })
      .catch(err => console.error(err));
  };

  return (
    <div className="booking-container">
      <h2>Book: {service.name}</h2>
      <form onSubmit={handleSubmit}>
        <input name="name" placeholder="Your Name" onChange={handleChange} required />
        <input name="phone" placeholder="Phone Number" onChange={handleChange} required />
        <input type="date" name="date" onChange={handleChange} required />
        <input type="time" name="time" onChange={handleChange} required />
        <textarea name="notes" placeholder="Notes (optional)" onChange={handleChange} />
        <button type="submit">Book Appointment</button>
      </form>
    </div>
  );
};

export default BookService;
