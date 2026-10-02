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

import AboutUs from "./Components/Home/AboutUs";

import Professionals from "./Components/Home/Professionals";

import ContactUs from "./Components/Home/ContactUs";

import HelpCenter from "./Components/Home/HelpCenter";

import PrivacyPolicy from "./Components/Home/PrivacyPolicy";

import TermsOfService from "./Components/Home/TermsOfService";

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
// PROVIDER → MATERIAL PREPARATION
// =====================================================

import MaterialPreparation from "./Components/MaterialPreparation/MaterialPreparation";

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
// Admin Category
// -----------------------------------------------------

import AdminCategories from "./Components/Services/Admin/AdminCategories";

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
// Admin Complaint 
// =====================================================

import AdminComplaints from "./Components/Services/Admin/AdminComplaints";

// =====================================================
// Admin Analytics
// =====================================================

import AdminAnalytics from "./Components/Analytics/Admin/AdminAnalytics";

// =====================================================
// Provider Analytics
// =====================================================

import ProviderAnalytics from "./Components/Analytics/Provider/ProviderAnalytics";

// =====================================================
// User Analytics
// =====================================================

import UserAnalytics from "./Components/Analytics/User/UserAnalytics";

// =====================================================
// Complaint Form
// =====================================================
import ComplaintForm from "./Components/Services/User/ComplaintForm";

// =====================================================
// PAYMENT
// =====================================================

import PaymentPage from "./Components/Payment/PaymentPage";

import PaymentSuccess from "./Components/Payment/PaymentSuccess";

import PaymentHistory from "./Components/Payment/PaymentHistory";

import ProviderPayments from "./Components/Services/Provider/ProviderPayments";

import PaymentReceipt from "./Components/Payment/PaymentReceipt";

// =====================================================
// APP
// =====================================================

function App() {
  return (
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

          <Route 
            path="/about" 
            element={<AboutUs />}
          />

          <Route
            path="/professionals"
            element={<Professionals />}
          />

          <Route
            path="/privacy"
            element={<PrivacyPolicy />}
          />

          <Route
            path="/terms"
            element={<TermsOfService />}
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

          <Route
            path="/contact"
            element={<ContactUs />}
          />

          <Route
            path="/help"
            element={<HelpCenter />}
          />

          <Route
            path="/privacy-policy"
            element={<PrivacyPolicy />}
          />

          <Route
            path="/terms-of-service"
            element={<TermsOfService />}    
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

          {/* ---------------- Provider Material Preparation ---------------- */}

          <Route
            path="/provider/material-preparation/:bookingId"
            element={<MaterialPreparation />}
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
              Complaint Form
          ================================================= */}
          <Route
            path="/user/complaints/new"
            element={<ComplaintForm />}
          />


          {/* =================================================
              ADMIN
          ================================================= */}



          {/* =================================================
              ADMIN → Category
          ================================================= */}

            <Route
              path="/admin/category"
              element={<AdminCategories />}
            />
         


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

          {/* =================================================
                ADMIN → COMPLAINTS
          ================================================= */}

          <Route
            path="/admin/complaints"
            element={<AdminComplaints />}
          />

          
          {/* =================================================
                ADMIN Analytics
          ================================================= */}

          <Route
            path="/admin/analytics"
            element={<AdminAnalytics />}
          />

          {/* =================================================
                PROVIDER Analytics
          ================================================= */}

          <Route
            path="/provider/analytics"
            element={<ProviderAnalytics />}
          />

          {/* =================================================
                USER Analytics
          ================================================= */}

          <Route
             path="/user/analytics"
             element={<UserAnalytics />}
          />
          {/* =================================================
                Payment
          ================================================= */}
        
           <Route
            path="/payment/success"
            element={<PaymentSuccess />}
          />

          <Route
            path="/payment/:bookingId"
            element={<PaymentPage />}
          />

          <Route
            path="/user/payments"
            element={
            <PaymentHistory />}
          />

          <Route
            path="/provider/payments"
            element={<ProviderPayments />}
          />

          <Route
             path="/user/payment-receipt/:paymentId"
             element={<PaymentReceipt />}
          />
        
        </Routes>
      </Router>
  );
}

export default App;