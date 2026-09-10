import axios from "axios";

const API = "http://localhost:5000/api/auth";


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
// UPDATE AVAILABILITY
// ==========================================

export const updateAvailability = async (
  availabilityData
) => {

  const response = await axios.put(
    `${API}/availability`,
    availabilityData,
    getAuthConfig()
  );

  return response.data;
};