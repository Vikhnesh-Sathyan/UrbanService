import axios from "axios";

const API = "http://localhost:5000/api/services";

const getAuthConfig = () => {
  const token = localStorage.getItem("token");

  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

// Get logged-in provider's services
export const getMyServices = async () => {
  const response = await axios.get(
    `${API}/my-services`,
    getAuthConfig()
  );

  console.log("GET MY SERVICES RESPONSE:", response.data);

  if (Array.isArray(response.data)) {
    return response.data;
  }

  if (Array.isArray(response.data?.services)) {
    return response.data.services;
  }

  return [];
};

// Add service
export const addService = async (formData) => {
  const response = await axios.post(
    `${API}/add`,
    formData,
    getAuthConfig()
  );

  return response.data;
};

// Update service
export const updateService = async (serviceId, formData) => {
  const response = await axios.put(
    `${API}/${serviceId}`,
    formData,
    getAuthConfig()
  );

  return response.data;
};

// Delete service
export const deleteService = async (serviceId) => {
  const response = await axios.delete(
    `${API}/${serviceId}`,
    getAuthConfig()
  );

  return response.data;
};

// Resubmit service after admin requested changes
export const resubmitService = async (serviceId) => {
  const response = await axios.patch(
    `${API}/${serviceId}/resubmit`,
    {},
    getAuthConfig()
  );

  return response.data;
};