import axios from "axios";

const API = "https://urbanservice-backend-x1op.onrender.com/api/user-analytics";

// Get authentication token for the logged-in user
const getAuthConfig = () => {
  const token = localStorage.getItem("token");

  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};


// =====================================================
// GET MY USER OVERVIEW
// =====================================================

export const getMyUserOverview = async () => {
  const response = await axios.get(
    `${API}/overview`,
    getAuthConfig()
  );

  return response.data;
};

// GET MY BOOKING STATUS
// Used for the user booking status chart
export const getMyUserBookingStatus = async () => {
  const response = await axios.get(
    `${API}/booking-status`,
    getAuthConfig()
  );

  return response.data;
};

// =====================================================
// GET USER SERVICE USAGE
// =====================================================

export const getMyUserServiceUsage = async () => {
  const response = await axios.get(
    `${API}/service-usage`,
    getAuthConfig()
  );

  return response.data;
};

// Get user's normal vs emergency booking usage
export const getMyUserBookingType = async () => {
  const response = await axios.get(
    `${API}/booking-type`,
    getAuthConfig()
  );

  return response.data;
};