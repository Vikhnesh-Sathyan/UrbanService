import axios from "axios";

const API = "http://localhost:5000/api/payments";

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
// CREATE PAYMENT INTENT
// ==========================================

export const createPaymentIntent = async (bookingId) => {
  const response = await axios.post(
    `${API}/create-payment-intent`,
    {
      bookingId,
    },
    getAuthConfig()
  );

  return response.data;
};

// Get payment status for a booking
export const getPaymentStatus = async (bookingId) => {
  const response = await axios.get(
    `${API}/booking/${bookingId}`,
    getAuthConfig()
  );

  return response.data;
};

// ==========================================
// REFUND PAYMENT
// ==========================================

export const refundPayment = async (paymentId) => {
  const response = await axios.post(
    `${API}/refund/${paymentId}`,
    {},
    getAuthConfig()
  );

  return response.data;
};

// ==========================================
// GET PAYMENT HISTORY
// ==========================================

export const getPaymentHistory = async () => {
  const response = await axios.get(
    `${API}/history`,
    getAuthConfig()
  );

  return response.data;
};