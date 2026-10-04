import axios from "axios";

const API = "https://urbanservice-backend-x1op.onrender.com/api/provider-analytics";

// =====================================================
// AUTH CONFIG
// =====================================================

const getAuthConfig = () => {
  const token = localStorage.getItem("token");

  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

// =====================================================
// GET MY PROVIDER OVERVIEW
// =====================================================

export const getMyProviderOverview = async () => {
  const response = await axios.get(
    `${API}/overview`,
    getAuthConfig()
  );

  return response.data;
};

// =====================================================
// GET MY BOOKING PERFORMANCE
// =====================================================

export const getMyBookingPerformance = async () => {
  const response = await axios.get(
    `${API}/booking-performance`,
    getAuthConfig()
  );

  return response.data;
};

// =====================================================
// GET MY BOOKING ACTIVITY
// =====================================================

export const getMyBookingActivity = async () => {
  const response = await axios.get(
    `${API}/booking-activity`,
    getAuthConfig()
  );

  return response.data;
};

// =====================================================
// GET MY SERVICE PERFORMANCE
// =====================================================

export const getMyServicePerformance = async () => {
  const response = await axios.get(
    `${API}/service-performance`,
    getAuthConfig()
  );

  return response.data;
};

// =====================================================
// GET MY EMERGENCY ANALYTICS
// =====================================================

export const getMyEmergencyAnalytics = async () => {
  const response = await axios.get(
    `${API}/emergency-analytics`,
    getAuthConfig()
  );

  return response.data;
};