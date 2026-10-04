import axios from "axios";

const API = "https://urbanservice-backend-x1op.onrender.com/api/users";

const getAuthConfig = () => {

  const token = localStorage.getItem("token");

  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

export const getProviders = async () => {

  const response = await axios.get(
    `${API}/providers`,
    getAuthConfig()
  );

  return response.data;
};