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
const userAnalyticsRoutes = require("./Routes/userAnalyticsRoutes");
const paymentRoutes = require("./Routes/paymentRoutes");
const {handleStripeWebhook,} = require("./Controllers/StripeWebhookController");
const materialPreparationRoutes = require("./Routes/materialPreparationRoutes");
const serviceFollowUpRoutes = require("./Routes/serviceFollowUpRoutes");
const startServiceFollowUpScheduler = require("./Utils/serviceFollowUpScheduler");
const mlRoutes = require("./Routes/mlRoutes");

const app = express();

app.use(cors());

// ==========================================
// STRIPE WEBHOOK
// ==========================================

app.post(
  "/api/payments/webhook",
  express.raw({ type: "application/json" }),
  handleStripeWebhook
);

app.use(express.json());

app.use(
  "/uploads",
  express.static(
    path.join(__dirname, "uploads")
  )
);

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
app.use("/api/user-analytics", userAnalyticsRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/material-preparation", materialPreparationRoutes);
app.use( "/api/service-follow-ups",serviceFollowUpRoutes);

// =====================================================
// SMART SERVICE ASSISTANT ML API
// React → Node → Python
// =====================================================

app.use("/api/ml", mlRoutes);




// ==========================================
// CONNECT TO MONGODB AND START SERVER
// ==========================================

const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected");

    // Start automatic service follow-up checker
    startServiceFollowUpScheduler();

    // Create HTTP server
    const server = http.createServer(app);

    // Create Socket.IO server
    const io = new Server(server, {
      cors: {
        origin: "http://localhost:3000",
        methods: [
          "GET",
          "POST",
          "PATCH",
          "PUT",
          "DELETE",
        ],
      },
    });

    // Setup notification socket
    setupNotificationSocket(io);

    // Make Socket.IO available throughout the app
    app.set("io", io);

    // Start server
    server.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error(
      "❌ MongoDB connection error:",
      err
    );
  });