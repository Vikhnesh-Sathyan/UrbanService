import React, { useState } from "react";
import axios from "axios";
import { FaUser, FaEnvelope, FaLock } from "react-icons/fa";
import "../../styles/Register.css";
import { useNavigate } from "react-router-dom";

function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");

  const handleRegister = (e) => {
    e.preventDefault();

    axios
      .post("http://localhost:5000/api/auth/register", {
        name,
        email,
        password,
        role,
      })
      .then(() => alert("Registered successfully"))
      .catch(() => alert("Registration failed"));
  };

  return (
    <div className="register-background">
      <div className="register-container">

        {/* Left Side */}
        <div className="register-brand">
          <div className="brand-logo">S</div>

          <h1>Join our<br />community.</h1>

          <p>
            Book trusted professionals or offer your services
            to customers in your area.
          </p>

          <div className="brand-line"></div>

          <span>Simple. Trusted. Local.</span>
        </div>

        {/* Right Side */}
        <div className="register-content">

          <div className="register-header">
            <span className="small-heading">GET STARTED</span>
            <h2>Create your account</h2>
            <p>Enter your details to get started.</p>
          </div>

          <form onSubmit={handleRegister} className="register-form">

            {/* Name */}
            <div className="input-group">
              <FaUser className="input-icon" />

              <input
                type="text"
                placeholder="Full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            {/* Email */}
            <div className="input-group">
              <FaEnvelope className="input-icon" />

              <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {/* Password */}
            <div className="input-group">
              <FaLock className="input-icon" />

              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {/* Account Type */}
            <div className="account-type">
              <label className="account-label">
                Account type
              </label>

              <div className="role-options">

                <label
                  className={`role-card ${
                    role === "user" ? "active" : ""
                  }`}
                >
                  <input
                    type="radio"
                    name="role"
                    value="user"
                    checked={role === "user"}
                    onChange={(e) => setRole(e.target.value)}
                  />

                  <div className="radio-circle"></div>

                  <div className="role-info">
                    <strong>Customer</strong>
                    <span>Book local services</span>
                  </div>
                </label>

                <label
                  className={`role-card ${
                    role === "provider" ? "active" : ""
                  }`}
                >
                  <input
                    type="radio"
                    name="role"
                    value="provider"
                    checked={role === "provider"}
                    onChange={(e) => setRole(e.target.value)}
                  />

                  <div className="radio-circle"></div>

                  <div className="role-info">
                    <strong>Service Provider</strong>
                    <span>Offer your services</span>
                  </div>
                </label>

              </div>
            </div>

            <button type="submit">
              Create Account
            </button>

          </form>

        <div className="register-footer">
          Already have an account?{" "}
          <span onClick={() => navigate("/login")}>
            Login
        </span>
         </div>
        </div>
      </div>
    </div>
  );
}

export default Register;