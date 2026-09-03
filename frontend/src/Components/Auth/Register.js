import React, { useState } from "react";
import axios from "axios";
import { FaUser, FaEnvelope, FaLock, FaUserTag } from "react-icons/fa";
import "../../styles/Register.css";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");

  const handleRegister = (e) => {
    e.preventDefault();
    axios
      .post("http://localhost:5000/api/auth/register", { name, email, password, role })
      .then(() => alert("Registered successfully"))
      .catch(() => alert("Registration failed"));
  };

  return (
    <div className="register-background">
      <div className="register-container">
        <h2>Register</h2>
        <form onSubmit={handleRegister} className="register-form">
          <div className="input-group">
            <FaUser className="input-icon" />
            <input
              type="text"
              placeholder="Name"
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <FaEnvelope className="input-icon" />
            <input
              type="email"
              placeholder="Email"
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <FaLock className="input-icon" />
            <input
              type="password"
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <FaUserTag className="input-icon" />
            <select value={role} onChange={(e) => setRole(e.target.value)} required>
              <option value="user">User</option>
              <option value="provider">Provider</option>
              {/* <option value="admin">Admin</option> */}
            </select>
          </div>
        <button type="submit">Register</button>
        </form>
      </div>
    </div>
  );
}

export default Register;
