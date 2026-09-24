import axios from "axios";

const API = "http://localhost:5000/api/analytics";

// =====================================================
// AUTH CONFIG
// Sends the logged-in admin's JWT token.
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
// GET ADMIN OVERVIEW
// Fetches platform-level analytics.
// =====================================================

export const getAdminOverview = async () => {
  const response = await axios.get(
    `${API}/admin/overview`,
    getAuthConfig()
  );

  return response.data;
};

// =====================================================
// GET BOOKING ACTIVITY
// Fetches booking counts grouped by date.
// =====================================================

export const getBookingActivity = async () => {
  const response = await axios.get(
    `${API}/admin/bookings`,
    getAuthConfig()
  );

  return response.data;
};

// =====================================================
// GET BOOKING BREAKDOWN
// Fetches booking type and status statistics.
// =====================================================

export const getBookingBreakdown = async () => {
  const response = await axios.get(
    `${API}/admin/booking-breakdown`,
    getAuthConfig()
  );

  return response.data;
};

// =====================================================
// GET SERVICE ANALYTICS
// Fetches booking volume for each service.
// =====================================================

export const getServiceAnalytics = async () => {
  const response = await axios.get(
    `${API}/admin/services`,
    getAuthConfig()
  );

  return response.data;
};

// =====================================================
// GET PROVIDER ANALYTICS
// Fetches provider summary and performance data.
// =====================================================

export const getProviderAnalytics = async () => {
  const response = await axios.get(
    `${API}/admin/providers`,
    getAuthConfig()
  );

  return response.data;
};

// =====================================================
// GET COMPLAINT ANALYTICS
// Fetches complaint status and reason analytics.
// =====================================================

export const getComplaintAnalytics = async () => {
  const response = await axios.get(
    `${API}/admin/complaints`,
    getAuthConfig()
  );

  return response.data;
};