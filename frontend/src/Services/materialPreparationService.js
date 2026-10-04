import axios from "axios";

const API = "https://urbanservice-backend-x1op.onrender.com/api/material-preparation";
// =====================================================
// AUTH CONFIG
// Adds logged-in provider's JWT token
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
// CREATE MATERIAL PREPARATION
// =====================================================

export const createMaterialPreparation = async (
  bookingId,
  materials,
  providerNotes
) => {
  const response = await axios.post(
    API,
    {
      bookingId,
      materials,
      providerNotes,
    },
    getAuthConfig()
  );

  return response.data;
};

// =====================================================
// GET MATERIAL PREPARATION
// =====================================================

export const getMaterialPreparation = async (
  bookingId
) => {
  const response = await axios.get(
    `${API}/${bookingId}`,
    getAuthConfig()
  );

  return response.data;
};

// =====================================================
// UPDATE MATERIAL PREPARATION
// =====================================================

export const updateMaterialPreparation = async (
  bookingId,
  data
) => {
  const response = await axios.put(
    `${API}/${bookingId}`,
    data,
    getAuthConfig()
  );

  return response.data;
};

// =====================================================
// UPDATE MATERIAL ITEM STATUS
// Provider updates one material's status
// =====================================================

export const updateMaterialItem = async (
  bookingId,
  materialId,
  status
) => {
  const response = await axios.patch(
    `${API}/${bookingId}/material/${materialId}`,
    {
      status,
    },
    getAuthConfig()
  );

  return response.data;
};