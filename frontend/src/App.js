import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Auth
import Login from "./Components/Auth/Login";
import Register from "./Components/Auth/Register";

// Home
import Homepage from "./Components/Home/Homepage";

// Dashboards
import AdminDashboard from "./Components/Dashboard/Admin/AdminDashboard";
import ProviderDashboard from "./Components/Dashboard/Provider/ProviderDashboard";
import UserDashboard from "./Components/Dashboard/UserDashboard";

// Provider
import ProviderBookingsPage from "./Components/Provider/ProviderBookingsPage";
import ProviderServicesPage from "./Components/Provider/ProviderServicesPage";  

// Customer
import BookService from "./Components/Customer/BookService";
import ServiceDetails from "./Components/Customer/ServiceDetails";

// Payment
import StripeProvider from "./Components/Payment/StripeProvider";

function App() {
  return (
    <StripeProvider>
      <Router>
        <Routes>

          {/* ================= HOME ================= */}
          <Route path="/" element={<Homepage />} />

          {/* ================= AUTH ================= */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* ================= DASHBOARDS ================= */}
          <Route
            path="/admin/dashboard"
            element={<AdminDashboard />}
          />

          <Route
            path="/provider/dashboard"
            element={<ProviderDashboard />}
          />

          <Route
            path="/user/dashboard"
            element={<UserDashboard />}
          />

          {/* ================= PROVIDER ================= */}

          <Route
            path="/provider/services"
            element={<ProviderServicesPage />}
          />

          <Route
            path="/provider/bookings"
            element={<ProviderBookingsPage />}
          />

          {/* ================= CUSTOMER ================= */}

          <Route
            path="/book-service/:id"
            element={<BookService />}
          />

          <Route
            path="/service/:serviceId"
            element={<ServiceDetails />}
          />

        </Routes>
      </Router>
    </StripeProvider>
  );
}

export default App;