import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./Components/Auth/Login";
import Register from "./Components/Auth/Register";
import Homepage from "./Components/Home/Homepage";
import AdminDashboard from "./Components/Dashboard/AdminDashboard";
import ProviderDashboard from "./Components/Dashboard/ProviderDashboard";
import UserDashboard from "./Components/Dashboard/UserDashboard";
import 'bootstrap/dist/css/bootstrap.min.css';
import BookService from "./Components/Home/BookService";
import UserServicesPage from './Components/Services/UserServicesPage';
import Details from './Components/Services/Details';
import ServiceDetails from './Components/Home/ServiceDetails';
import StripeProvider from './Components/Payment/StripeProvider';

function App() {
  return (
    <StripeProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/services" element={<UserServicesPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/AdminDashboard" element={<AdminDashboard />} />
          <Route path="/ProviderDashboard" element={<ProviderDashboard />} />
          <Route path="/UserDashboard" element={<UserDashboard />} />
          <Route path="/book-service/:id" element={<BookService />} />
          <Route path="/service-details/:id" element={<Details />} />
          <Route path="/:serviceId" element={<ServiceDetails />} />
        </Routes>
      </Router>
    </StripeProvider>
  );
}

export default App;