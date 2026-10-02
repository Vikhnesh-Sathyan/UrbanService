import React from "react";
import { Navigate } from "react-router-dom";

// Protects authenticated pages from logged-out users
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;