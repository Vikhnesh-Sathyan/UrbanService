//This file handles the API communication between the React frontend and the notification backend.
import axios from "axios";

const API = "http://localhost:5000/api/notifications";

// Get authentication headers
const getAuthConfig = () => {
  const token = localStorage.getItem("token");

  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

// Get all notifications for logged-in user
export const getMyNotifications = async () => {
  const response = await axios.get(
    API,
    getAuthConfig()
  );

  return response.data;
};

// Mark one notification as read
export const markNotificationAsRead = async (
  notificationId
) => {
  const response = await axios.patch(
    `${API}/${notificationId}/read`,
    {},
    getAuthConfig()
  );

  return response.data;
};

// Mark all notifications as read
export const markAllNotificationsAsRead = async () => {
  const response = await axios.patch(
    `${API}/read-all`,
    {},
    getAuthConfig()
  );

  return response.data;
};