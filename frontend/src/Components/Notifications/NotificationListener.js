//listens for new Socket.IO notifications in the background.

import React, { useEffect } from "react";

import {
  onNewNotification,
  offNewNotification,
} from "../../Services/notificationSocket";

const NotificationListener = () => {
  useEffect(() => {
    // Function that runs when a new notification arrives
    const handleNewNotification = (notification) => {
      console.log(
        "🔔 NEW NOTIFICATION RECEIVED:",
        notification
      );
    };

    // Start listening
    onNewNotification(handleNewNotification);

    // Remove listener when component is removed
    return () => {
      offNewNotification(handleNewNotification);
    };
  }, []);

  return null;
};

export default NotificationListener;
