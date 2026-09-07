import axios from "axios";

const API = "http://localhost:5000/api/bookings";

const getAuthConfig = () => {
  const token = localStorage.getItem("token");

  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};


// Get provider bookings
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
    { status },
    getAuthConfig()
  );

  return response.data;
};

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

