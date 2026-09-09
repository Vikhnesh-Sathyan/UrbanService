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
// ==========================================

export const getServices = async () => {
  const response = await axios.get(
    API,
    getAuthConfig()
  );

  console.log(
    "USER SERVICES RESPONSE:",
    response.data
  );

  if (Array.isArray(response.data)) {
    return response.data;
  }

  if (Array.isArray(response.data?.services)) {
    return response.data.services;
  }

  return [];
};