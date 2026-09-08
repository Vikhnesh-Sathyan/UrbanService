import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEnvelope, FaLock } from "react-icons/fa";
import "../../styles/Login.css";

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    const response = await fetch("http://localhost:5000/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    console.log("LOGIN RESPONSE:", data);

    if (response.ok) {
      alert("Login successful");

      localStorage.setItem("token", data.token);
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("user", JSON.stringify(data.user));

      switch (data.user.role) {
        case "admin":
          navigate("/admin/dashboard");
          break;
        case "provider":
          navigate("/provider/dashboard");
          break;
        case "user":
          navigate("/user/dashboard");
          break;
        default:
          navigate("/dashboard");
      }
    } else {
      alert(data.message);
    }
  };

  return (
    <div className="login-background">
      <div className="login-glow glow-one"></div>
      <div className="login-glow glow-two"></div>

      <div className="login-container">

        <div className="login-header">
          <div className="login-logo">
            <span>VS</span>
          </div>

          <h2>Welcome back</h2>
          <p>Sign in to continue to your account</p>
        </div>

        <form onSubmit={handleLogin} className="login-form">

          <div className="input-wrapper">
            <label>Email address</label>

            <div className="input-group">
              <FaEnvelope className="input-icon" />

              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="input-wrapper">
            <div className="password-label">
              <label>Password</label>
              <span>Forgot password?</span>
            </div>

            <div className="input-group">
              <FaLock className="input-icon" />

              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button type="submit" className="login-button">
            Sign in
          </button>

        </form>

        <div className="register-section">
          <span>Don't have an account?</span>

          <button
            type="button"
            className="register-link"
            onClick={() => navigate("/register")}
          >
            Create an account
          </button>
        </div>

        <div className="login-footer">
          <span>Secure access</span>
          <span>•</span>
          <span>Service Booking Platform</span>
        </div>

      </div>
    </div>
  );
}

export default Login;