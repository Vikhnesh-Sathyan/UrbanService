import axios from "axios";

const API = "http://localhost:5000/api/complaints";

// Get JWT authorization header
const getAuthConfig = () => {
  const token = localStorage.getItem("token");

  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

// =====================================================
// CUSTOMER
// =====================================================

// Submit a complaint for a completed booking
export const createComplaint = async (complaintData) => {
  const response = await axios.post(
    API,
    complaintData,
    getAuthConfig()
  );

  return response.data;
};

// =====================================================
// ADMIN
// =====================================================

// Get all complaints
export const getAllComplaints = async () => {
  const response = await axios.get(
    `${API}/admin`,
    getAuthConfig()
  );

  return response.data;
};

// Get single complaint
export const getComplaintById = async (complaintId) => {
  const response = await axios.get(
    `${API}/admin/${complaintId}`,
    getAuthConfig()
  );

  return response.data;
};

// Update complaint
export const updateComplaint = async (
  complaintId,
  complaintData
) => {
  const response = await axios.patch(
    `${API}/admin/${complaintId}`,
    complaintData,
    getAuthConfig()
  );

  return response.data;
};

export const getMyComplaints = async () => {
  const response = await axios.get(
    `${API}/my`,
    getAuthConfig()
  );

  return response.data;
};