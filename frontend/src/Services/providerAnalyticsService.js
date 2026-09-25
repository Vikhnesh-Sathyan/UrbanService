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

// =====================================================
// GET MY BOOKING ACTIVITY
// Fetches provider bookings grouped by booking date.
// Used for the Booking Activity chart.
// =====================================================

export const getMyBookingActivity = async () => {
  const response = await axios.get(
    `${API}/booking-activity`,
    getAuthConfig()
  );

  return response.data;
};

// Fetch booking performance for each service owned by the provider
export const getMyServicePerformance = async () => {
  const response = await axios.get(
    `${API}/service-performance`,
    getAuthConfig()
  );

  return response.data;
};

// Fetch emergency booking analytics for the logged-in provider
export const getMyEmergencyAnalytics = async () => {
  const response = await axios.get(
    `${API}/emergency-analytics`,
    getAuthConfig()
  );

  return response.data;
};