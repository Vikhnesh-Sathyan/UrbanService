import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEnvelope, FaLock } from "react-icons/fa";
import "../../styles/Login.css";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Help request states
  const [showHelp, setShowHelp] = useState(false);
  const [helpMessage, setHelpMessage] = useState("");
  const [helpLoading, setHelpLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        "http://localhost:5000/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
          }),
        }
      );

      const data = await response.json();

      console.log("LOGIN RESPONSE:", data);

      if (response.ok) {
        alert("Login successful");

        localStorage.setItem("token", data.token);
        localStorage.setItem(
          "isLoggedIn",
          "true"
        );
        localStorage.setItem(
          "user",
          JSON.stringify(data.user)
        );

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

        // ========================================
        // PROVIDER BLOCKED
        // ========================================

        if (data.code === "PROVIDER_BLOCKED") {
          alert(data.message);

          // Show Need Help option
          setShowHelp(true);

          return;
        }

        alert(data.message);
      }

    } catch (error) {

      console.error("Login error:", error);

      alert("Unable to connect to server");
    }
  };


  // ========================================
  // SUBMIT HELP REQUEST
  // ========================================

  const handleHelpRequest = async (e) => {
    e.preventDefault();

    if (!helpMessage.trim()) {
      alert("Please enter your message");
      return;
    }

    try {

      setHelpLoading(true);

      const response = await fetch(
        "http://localhost:5000/api/help",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            message: helpMessage,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {

        alert(
          "Help request submitted successfully"
        );

        setHelpMessage("");
        setShowHelp(false);

      } else {

        alert(data.message);
      }

    } catch (error) {

      console.error(
        "Help request error:",
        error
      );

      alert("Unable to submit help request");

    } finally {

      setHelpLoading(false);
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

          <p>
            Sign in to continue to your account
          </p>

        </div>


        {/* ======================================
            LOGIN FORM
        ====================================== */}

        <form
          onSubmit={handleLogin}
          className="login-form"
        >

          <div className="input-wrapper">

            <label>Email address</label>

            <div className="input-group">

              <FaEnvelope className="input-icon" />

              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                required
              />

            </div>

          </div>


          <div className="input-wrapper">

            <div className="password-label">

              <label>Password</label>

              <span>
                Forgot password?
              </span>

            </div>

            <div className="input-group">

              <FaLock className="input-icon" />

              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                required
              />

            </div>

          </div>


          <button
            type="submit"
            className="login-button"
          >
            Sign in
          </button>

        </form>


        {/* ======================================
            BLOCKED PROVIDER HELP
        ====================================== */}

        {showHelp && (

          <div className="help-section">

            <h3>Need Help?</h3>

            <p>
              Your provider account is currently
              blocked. You can send a request to
              the administrator.
            </p>

            <form
              onSubmit={handleHelpRequest}
            >

              <textarea
                placeholder="Explain why you need help..."
                value={helpMessage}
                onChange={(e) =>
                  setHelpMessage(e.target.value)
                }
                rows="4"
              />

              <button
                type="submit"
                disabled={helpLoading}
              >
                {helpLoading
                  ? "Submitting..."
                  : "Submit Help Request"}
              </button>

            </form>

          </div>

        )}


        {/* ======================================
            REGISTER
        ====================================== */}

        <div className="register-section">

          <span>
            Don't have an account?
          </span>

          <button
            type="button"
            className="register-link"
            onClick={() =>
              navigate("/register")
            }
          >
            Create an account
          </button>

        </div>


        {/* ======================================
            FOOTER
        ====================================== */}

        <div className="login-footer">

          <span>Secure access</span>

          <span>•</span>

          <span>
            Service Booking Platform
          </span>

        </div>

      </div>

    </div>
  );
}

export default Login;