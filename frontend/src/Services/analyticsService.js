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