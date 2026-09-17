import { io } from "socket.io-client";

const SOCKET_URL = "http://localhost:5000";

let socket = null;

// Store notification listeners that are added
// before the socket connection is created
const notificationListeners = [];

// Connect the logged-in user to Socket.IO
export const connectNotificationSocket = (userId) => {
  console.log("CONNECT SOCKET CALLED:", userId);

  if (!userId) {
    console.log("NO USER ID");
    return null;
  }

  if (socket?.connected) {
    console.log("SOCKET ALREADY CONNECTED");
    return socket;
  }

  console.log("CREATING SOCKET CONNECTION...");

  socket = io(SOCKET_URL);

  socket.on("connect", () => {
    console.log(
      "Connected to notification socket:",
      socket.id
    );

    socket.emit(
      "joinNotificationRoom",
      userId
    );

    // Register listeners that were waiting
    notificationListeners.forEach((callback) => {
      socket.on("newNotification", callback);
    });
  });

  socket.on("disconnect", () => {
    console.log(
      "Disconnected from notification socket"
    );
  });

  socket.on("connect_error", (error) => {
    console.error(
      "Notification socket connection error:",
      error
    );
  });

  return socket;
};

// Listen for new notifications
export const onNewNotification = (callback) => {
  // If socket already exists,
  // register listener immediately
  if (socket) {
    socket.on("newNotification", callback);
    return;
  }

  // If socket does not exist yet,
  // save listener for later
  notificationListeners.push(callback);
};

// Remove notification listener
export const offNewNotification = (callback) => {
  if (socket) {
    socket.off("newNotification", callback);
  }

  const index =
    notificationListeners.indexOf(callback);

  if (index !== -1) {
    notificationListeners.splice(index, 1);
  }
};

// Get current socket
export const getNotificationSocket = () => {
  return socket;
};

// Disconnect Socket.IO
export const disconnectNotificationSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }

  notificationListeners.length = 0;
};