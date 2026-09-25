import axios from "axios";

const API = "http://localhost:5000/api/provider-analytics";

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
// GET MY PROVIDER ANALYTICS
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