require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path");
const http = require("http");
const { Server } = require("socket.io");

const setupNotificationSocket = require("./Socket/notificationSocket");

// Import Routes
const authRoutes = require("./Routes/AuthRoutes");
const serviceRoutes = require("./Routes/ServiceRoutes");
const bookingRoutes = require("./Routes/BookingRoutes");
const providerRoutes = require("./Routes/providerRoutes");
const reviewRoutes = require("./Routes/reviewRoutes");
const availabilityRoutes = require("./Routes/availabilityRoutes");
const userRoutes = require("./Routes/UserRoutes");
const helpRequestRoutes = require("./Routes/helpRequestRoutes");
const notificationRoutes = require("./Routes/NotificationRoutes");
const categoryRoutes = require("./Routes/CategoryRoutes");
const complaintRoutes = require("./Routes/complaintRoutes");
const analyticsRoutes = require("./Routes/analyticsRoutes");
const providerAnalyticsRoutes = require("./Routes/providerAnalyticsRoutes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Static folder for uploaded images
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Test route
app.get("/", (req, res) => {
  res.send("Backend Server is Running ✅");
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/providers", providerRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/availability", availabilityRoutes);
app.use("/api/users", userRoutes);
app.use("/api",helpRequestRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/complaints", complaintRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/provider-analytics", providerAnalyticsRoutes);

// Connect to MongoDB and start server
const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected");

  const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE"],
  },
});

setupNotificationSocket(io);

app.set("io", io);


server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
  });