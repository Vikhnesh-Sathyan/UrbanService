// Handles provider service follow-up scheduling

import axios from "axios";

"https://urbanservice-backend-x1op.onrender.com/api/service-follow-ups";


// Get JWT token for authenticated requests
const getAuthConfig = () => {
  const token = localStorage.getItem("token");

  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

// Schedule a follow-up for a completed booking
export const scheduleServiceFollowUp = async (
  bookingId,
  value,
  unit
) => {
  const response = await axios.post(
    API,
    {
      bookingId,
      value,
      unit,
    },
    getAuthConfig()
  );

  return response.data;
};