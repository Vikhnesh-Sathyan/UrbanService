const setupNotificationSocket = (io) => {
  io.on("connection", (socket) => {
    console.log(
      "User connected to notification socket:",
      socket.id
    );

    // Join a room using the user's ID
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