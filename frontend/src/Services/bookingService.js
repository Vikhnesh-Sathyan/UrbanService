import axios from "axios";

const API = "http://localhost:5000/api/bookings";

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
// USER / CUSTOMER BOOKINGS
// ==========================================

// Create booking
export const createBooking = async (bookingData) => {
  const response = await axios.post(
    `${API}`,
    bookingData,
    getAuthConfig()
  );

  return response.data;
};


// Get logged-in user's bookings
export const getMyBookings = async () => {
  const response = await axios.get(
    `${API}/my-bookings`,
    getAuthConfig()
  );

  return response.data;
};


// Cancel booking
export const cancelBooking = async (bookingId) => {
  const response = await axios.patch(
    `${API}/${bookingId}/cancel`,
    {},
    getAuthConfig()
  );

  return response.data;
};


// Reschedule booking
export const rescheduleBooking = async (
  bookingId,
  date,
  time
) => {
  const response = await axios.put(
    `${API}/${bookingId}/reschedule`,
    {
      date,
      time,
    },
    getAuthConfig()
  );

  return response.data;
};


// ===============================
// ADD RATING & REVIEW
// ===============================
export const addBookingReview = async (
  bookingId,
  rating,
  review
) => {
  const response = await axios.patch(
    `${API}/${bookingId}/review`,
    {
      rating,
      review,
    },
    getAuthConfig()
  );

  return response.data;
};

// ==========================================
// PROVIDER BOOKINGS
// ==========================================

// Get provider booking requests
export const getProviderBookings = async () => {
  const response = await axios.get(
    `${API}/provider/requests`,
    getAuthConfig()
  );

  return response.data;
};


// Accept booking
export const acceptBooking = async (bookingId) => {
  const response = await axios.patch(
    `${API}/${bookingId}/accept`,
    {},
    getAuthConfig()
  );

  return response.data;
};


// Reject booking
export const rejectBooking = async (bookingId) => {
  const response = await axios.patch(
    `${API}/${bookingId}/reject`,
    {},
    getAuthConfig()
  );

  return response.data;
};


// Update booking status
export const updateBookingStatus = async (
  bookingId,
  status
) => {
  const response = await axios.patch(
    `${API}/${bookingId}/status`,
    {
      status,
    },
    getAuthConfig()
  );

  return response.data;
};


// ==========================================
// ADMIN BOOKINGS
// ==========================================

// Get all bookings
export const getAllBookings = async () => {
  const response = await axios.get(
    `${API}/admin`,
    getAuthConfig()
  );

  return response.data;
};