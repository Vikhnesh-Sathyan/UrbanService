import axios from "axios";

const API = "http://localhost:5000/api/user-analytics";


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