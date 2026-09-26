// Manage the real-time notification connection between the server and users.
//io → whole Socket.IO server
//socket = one user's connection
//socket.id → unique ID of that connection

const setupNotificationSocket = (io) => {
  io.on("connection", (socket) => {
    console.log(
      "User connected to notification socket:",
      socket.id
    );

    // This means the backend is waiting for the frontend to send the user's ID.
    socket.on("joinNotificationRoom", (userId) => {
      if (!userId) {
        return;
      }

      socket.join(`user_${userId}`);

      console.log(
        `User ${userId} joined notification room`
      );
    });

    // Disconnect
    socket.on("disconnect", () => {
      console.log(
        "User disconnected from notification socket:",
        socket.id
      );
    });
  });
};

module.exports = setupNotificationSocket;