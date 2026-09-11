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
import UserDashboard from "./Components/Dashboard/User/UserDashboard";

// Provider
import ProviderBookingsPage from "./Components/Services/Provider/ProviderBookingsPage/ProviderBookingsPage";
import ProviderServicesPage from "./Components/Services/Provider/ProviderServicesPage";
import ProviderAvailability from "./Components/Services/Provider/ProviderAvailability";
import ProviderProfile from "./Components/Profile/ProviderProfile";

//Customer
import UserServicesPage from "./Components/Services/User/UserServicePage/UserServicesPage";
import UserServiceDetails from "./Components/Services/User/UserServiceDetails";
import UserBookService from "./Components/Services/User/UserBookService";
import UserBookings from "./Components/Services/User/UserBookings/UserBookings";
import UserProfile from "./Components/Profile/UserProfile";
import UserProviderProfile from "./Components/Services/User/UserProviderProfile";

// Payment
import StripeProvider from "./Components/Payment/StripeProvider";
// import UserBookings from "./Components/Services/User/UserBookings";

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

          <Route
            path="/provider/availability"
            element={<ProviderAvailability />}
          />

          <Route
            path="/provider/profile"
            element={<ProviderProfile />}
          />

          {/* ================= CUSTOMER ================= */}

          <Route 
            path="/user/services"
            element={<UserServicesPage />}
          />

          <Route
            path="/user/services/:serviceId/book"
            element={<UserBookService />}
          />

          <Route
            path="/user/bookings"
            element={<UserBookings />}
          />

          <Route
            path="/user/services/:serviceId/"
            element={<UserServiceDetails />}
          />
          <Route
            path="/user/profile"
            element={<UserProfile />}
          />

          <Route
            path="/user/provider/:providerId"
            element={<UserProviderProfile />}
          />


        </Routes>
      </Router>
    </StripeProvider>
  );
}

export default App;