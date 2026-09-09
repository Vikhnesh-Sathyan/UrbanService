import axios from "axios";

const API = "http://localhost:5000/api/services";

// ==========================================
// AUTH CONFIG
// ==========================================

const getAuthConfig = () => {
  const token = localStorage.getItem("token");

  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};


// ==========================================
// GET APPROVED SERVICES
// Search + Filter + Sort + Pagination
// ==========================================

export const getServices = async (params = {}) => {
  const response = await axios.get(
    API,
    {
      ...getAuthConfig(),
      params,
    }
  );

  console.log(
    "USER SERVICES RESPONSE:",
    response.data
  );

  return response.data;
};