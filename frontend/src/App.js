import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";

// =====================================================
// AUTH
// =====================================================

import Login from "./Components/Auth/Login";
import Register from "./Components/Auth/Register";

// =====================================================
// HOME
// =====================================================

import Homepage from "./Components/Home/Homepage";

// =====================================================
// DASHBOARDS
// =====================================================

import AdminDashboard from "./Components/Dashboard/Admin/AdminDashboard";
import ProviderDashboard from "./Components/Dashboard/Provider/ProviderDashboard";
import UserDashboard from "./Components/Dashboard/User/UserDashboard";

// =====================================================
// PROVIDER
// =====================================================

// Provider Services
import ProviderServicesPage from "./Components/Services/Provider/ProviderServicesPage";

// Provider Bookings
import ProviderBookingsPage from "./Components/Services/Provider/ProviderBookingsPage/ProviderBookingsPage";

// Provider Availability
import ProviderAvailability from "./Components/Services/Provider/ProviderAvailability";

// Provider Profile
import ProviderProfile from "./Components/Profile/ProviderProfile";

// =====================================================
// USER / CUSTOMER
// =====================================================

// User Services
import UserServicesPage from "./Components/Services/User/UserServicePage/UserServicesPage";
import UserServiceDetails from "./Components/Services/User/UserServiceDetails";
import UserBookService from "./Components/Services/User/UserBookService";

// User Bookings
import UserBookings from "./Components/Services/User/UserBookings/UserBookings";

// User Profile
import UserProfile from "./Components/Profile/UserProfile";

// User Providers
import UserProviders from "./Components/Services/User/UserProviders";
import UserProviderProfile from "./Components/Services/User/UserProviderProfile";

// =====================================================
// Notifications
// =====================================================
import NotificationListener from "./Components/Notifications/NotificationListener";

// -----------------------------------------------------
// Admin Services
// -----------------------------------------------------

// Add AdminServices import here when the component is ready.

// -----------------------------------------------------
// Admin Providers
// -----------------------------------------------------

import AdminProviders from "./Components/Services/Admin/AdminProviders";
import AdminProviderDetails from "./Components/Services/Admin/AdminProviderDetails";

// -----------------------------------------------------
// Admin Bookings
// -----------------------------------------------------

import AdminBookings from "./Components/Services/Admin/AdminBookings";

// -----------------------------------------------------
// Admin Users
// -----------------------------------------------------

import AdminUsers from "./Components/Services/Admin/AdminUsers";
import AdminUserDetails from "./Components/Services/Admin/AdminUserDetails";

// -----------------------------------------------------
// Admin Help Requests
// -----------------------------------------------------

import AdminHelpRequests from "./Components/Services/Admin/AdminHelpRequests";

// =====================================================
// PAYMENT
// =====================================================

import StripeProvider from "./Components/Payment/StripeProvider";


// =====================================================
// APP
// =====================================================

function App() {
  return (
    <StripeProvider>
      <Router>
        
          <NotificationListener />

        <Routes>

          {/* =================================================
              HOME
          ================================================= */}

          <Route
            path="/"
            element={<Homepage />}
          />


          {/* =================================================
              AUTH
          ================================================= */}

          <Route
            path="/login"
            element={<Login />}
          />

          <Route
            path="/register"
            element={<Register />}
          />


          {/* =================================================
              DASHBOARDS
          ================================================= */}

          {/* Admin Dashboard */}
          <Route
            path="/admin/dashboard"
            element={<AdminDashboard />}
          />

          {/* Provider Dashboard */}
          <Route
            path="/provider/dashboard"
            element={<ProviderDashboard />}
          />

          {/* User Dashboard */}
          <Route
            path="/user/dashboard"
            element={<UserDashboard />}
          />


          {/* =================================================
              PROVIDER
          ================================================= */}

          {/* ---------------- Provider Services ---------------- */}

          <Route
            path="/provider/services"
            element={<ProviderServicesPage />}
          />

          {/* ---------------- Provider Bookings ---------------- */}

          <Route
            path="/provider/bookings"
            element={<ProviderBookingsPage />}
          />

          {/* ---------------- Provider Availability ---------------- */}

          <Route
            path="/provider/availability"
            element={<ProviderAvailability />}
          />

          {/* ---------------- Provider Profile ---------------- */}

          <Route
            path="/provider/profile"
            element={<ProviderProfile />}
          />


          {/* =================================================
              USER / CUSTOMER
          ================================================= */}

          {/* ---------------- User Services ---------------- */}

          <Route
            path="/user/services"
            element={<UserServicesPage />}
          />

          <Route
            path="/user/services/:serviceId"
            element={<UserServiceDetails />}
          />

          {/* ---------------- Book Service ---------------- */}

          <Route
            path="/user/services/:serviceId/book"
            element={<UserBookService />}
          />

          {/* ---------------- User Bookings ---------------- */}

          <Route
            path="/user/bookings"
            element={<UserBookings />}
          />

          {/* ---------------- User Profile ---------------- */}

          <Route
            path="/user/profile"
            element={<UserProfile />}
          />


          {/* ---------------- User Providers ---------------- */}

          {/* All Providers */}
          <Route
            path="/user/providers"
            element={<UserProviders />}
          />

          {/* Single Provider */}
          <Route
            path="/user/providers/:providerId"
            element={<UserProviderProfile />}
          />


          {/* =================================================
              ADMIN
          ================================================= */}


          {/* =================================================
              ADMIN → DASHBOARD
          ================================================= */}

          <Route
            path="/admin/dashboard"
            element={<AdminDashboard />}
          />


          {/* =================================================
              ADMIN → SERVICES
          ================================================= */}

          {/*
            Add this when AdminServices component is available:

            <Route
              path="/admin/services"
              element={<AdminServices />}
            />
          */}


          {/* =================================================
              ADMIN → PROVIDERS
          ================================================= */}

          {/* All Providers */}
          <Route
            path="/admin/providers"
            element={<AdminProviders />}
          />

          {/* Provider Details */}
          <Route
            path="/admin/providers/:providerId"
            element={<AdminProviderDetails />}
          />


          {/* =================================================
              ADMIN → BOOKINGS
          ================================================= */}

          <Route
            path="/admin/bookings"
            element={<AdminBookings />}
          />


          {/* =================================================
              ADMIN → USERS
          ================================================= */}

          {/* All Users */}
          <Route
            path="/admin/users"
            element={<AdminUsers />}
          />

          {/* User Details + Booking History */}
          <Route
            path="/admin/users/:userId"
            element={<AdminUserDetails />}
          />


          {/* =================================================
              ADMIN → HELP REQUESTS
          ================================================= */}

          <Route
            path="/admin/help-requests"
            element={<AdminHelpRequests />}
          />


        </Routes>
      </Router>
    </StripeProvider>
  );
}

export default App;