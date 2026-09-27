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

export const createPaymentIntent = async (bookingId, amount) => {
  const response = await axios.post(
    `${API}/create-payment-intent`,
    {
      bookingId,
      amount,
    },
    getAuthConfig()
  );

  return response.data;
};