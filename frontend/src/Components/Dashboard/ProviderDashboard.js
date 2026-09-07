
import React from "react";
import { useNavigate } from "react-router-dom";

import {
  FaHome,
  FaTools,
  FaCalendarAlt,
  FaBriefcase,
  FaCheckCircle,
  FaClock,
  FaMoneyBillWave,
  FaStar,
  FaUser,
  FaSignOutAlt,
  FaBell,
  FaArrowUp,
  FaArrowRight,
  FaPlus,
  FaMapMarkerAlt,
  FaChevronRight,
} from "react-icons/fa";

import "../../styles/ProviderDashboard.css";

const ProviderDashboard = () => {
  const navigate = useNavigate();

  // =====================================================
  // REQUIRED PROVIDER MODULES
  // =====================================================

  const modules = [
    {
      title: "My Services",
      description: "Add and manage the services you provide.",
      icon: <FaTools />,
      path: "/provider/services",
    },
    {
      title: "Booking Requests",
      description: "View and respond to customer booking requests.",
      icon: <FaCalendarAlt />,
      path: "/provider/bookings",
      badge: "6",
    },
    {
      title: "Active Jobs",
      description: "Manage services that are currently in progress.",
      icon: <FaBriefcase />,
      path: "/provider/active-jobs",
    },
    {
      title: "Completed Jobs",
      description: "View your completed service bookings.",
      icon: <FaCheckCircle />,
      path: "/provider/completed-jobs",
    },
    {
      title: "Availability",
      description: "Set your working days and working hours.",
      icon: <FaClock />,
      path: "/provider/availability",
    },
    {
      title: "Earnings",
      description: "View your earnings and payment history.",
      icon: <FaMoneyBillWave />,
      path: "/provider/earnings",
    },
    {
      title: "Reviews",
      description: "View ratings and customer reviews.",
      icon: <FaStar />,
      path: "/provider/reviews",
    },
    {
      title: "Profile",
      description: "Manage your professional profile.",
      icon: <FaUser />,
      path: "/provider/profile",
    },
  ];

  // =====================================================
  // DASHBOARD STATS
  // =====================================================

  const stats = [
    {
      title: "Active Services",
      value: "12",
      change: "+2 this month",
      icon: <FaTools />,
      className: "indigo",
    },
    {
      title: "Total Bookings",
      value: "28",
      change: "+12% this month",
      icon: <FaCalendarAlt />,
      className: "blue",
    },
    {
      title: "Pending Requests",
      value: "06",
      change: "Needs attention",
      icon: <FaClock />,
      className: "orange",
    },
    {
      title: "Total Earnings",
      value: "₹24,500",
      change: "+18% this month",
      icon: <FaMoneyBillWave />,
      className: "green",
    },
  ];

  // =====================================================
  // RECENT BOOKINGS
  // =====================================================

  const bookings = [
    {
      customer: "Rahul Kumar",
      service: "Plumbing Service",
      date: "Sep 07, 2026",
      time: "10:00 AM",
      status: "Pending",
    },
    {
      customer: "Anu Thomas",
      service: "Home Cleaning",
      date: "Sep 07, 2026",
      time: "02:00 PM",
      status: "Confirmed",
    },
    {
      customer: "Arjun Raj",
      service: "AC Repair",
      date: "Sep 08, 2026",
      time: "11:30 AM",
      status: "Pending",
    },
    {
      customer: "Meera Nair",
      service: "Salon Service",
      date: "Sep 08, 2026",
      time: "04:00 PM",
      status: "Confirmed",
    },
  ];

  // =====================================================
  // LOGOUT
  // =====================================================

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="provider-dashboard">

      {/* =================================================
          SIDEBAR
      ================================================= */}

      <aside className="provider-sidebar">

        {/* BRAND */}

        <div className="provider-brand">

          <div className="provider-brand-mark">
            U
          </div>

          <div className="provider-brand-name">
            <strong>Urban</strong>
            <span>Services</span>
          </div>

        </div>


        {/* MAIN MENU */}

        <div className="sidebar-section-title">
          MAIN MENU
        </div>

        <nav className="provider-nav">

          {/* OVERVIEW */}

          <button
            className="provider-nav-item active"
            onClick={() => navigate("/provider/dashboard")}
          >
            <FaHome />
            <span>Overview</span>
          </button>


          {/* REQUIRED MODULES */}

          {modules.slice(0, 5).map((module) => (

            <button
              key={module.title}
              className="provider-nav-item"
              onClick={() => navigate(module.path)}
            >
              {module.icon}

              <span>
                {module.title}
              </span>

              {module.badge && (
                <small>
                  {module.badge}
                </small>
              )}
            </button>

          ))}


          {/* BUSINESS */}

          <div className="sidebar-section-title second">
            BUSINESS
          </div>


          {modules.slice(5, 7).map((module) => (

            <button
              key={module.title}
              className="provider-nav-item"
              onClick={() => navigate(module.path)}
            >
              {module.icon}

              <span>
                {module.title}
              </span>

            </button>

          ))}

        </nav>


        {/* SIDEBAR BOTTOM */}

        <div className="sidebar-bottom">

          {/* PROFILE */}

          <button
            className="provider-nav-item"
            onClick={() => navigate("/provider/profile")}
          >
            <FaUser />
            <span>Profile</span>
          </button>


          {/* LOGOUT */}

          <button
            className="provider-logout"
            onClick={handleLogout}
          >
            <FaSignOutAlt />
            <span>Logout</span>
          </button>

        </div>

      </aside>


      {/* =================================================
          MAIN CONTENT
      ================================================= */}

      <main className="provider-main">

        {/* TOPBAR */}

        <header className="provider-topbar">

          <div>

            <span className="topbar-page-label">
              PROVIDER PORTAL
            </span>

            <h1>
              Dashboard
            </h1>

          </div>


          <div className="topbar-actions">

            <button className="notification-button">
              <FaBell />
              <span className="notification-dot"></span>
            </button>


            <div className="provider-profile">

              <div className="profile-avatar">
                V
              </div>

              <div className="profile-details">
                <strong>
                  Provider
                </strong>

                <small>
                  Service Provider
                </small>
              </div>

            </div>

          </div>

        </header>


        {/* =================================================
            WELCOME
        ================================================= */}

        <section className="dashboard-welcome">

          <div>

            <p className="welcome-label">
              GOOD EVENING
            </p>

            <h2>
              Welcome back, <span>Provider</span>
            </h2>

            <p>
              Here's what's happening with your services today.
            </p>

          </div>


          <button
            className="add-service-button"
            onClick={() => navigate("/provider/services")}
          >
            <FaPlus />
            Add New Service
          </button>

        </section>


        {/* =================================================
            STATS
        ================================================= */}

        <section className="dashboard-stats">

          {stats.map((stat) => (

            <div
              className={`dashboard-stat-card ${stat.className}`}
              key={stat.title}
            >

              <div className="stat-top">

                <div className="stat-icon">
                  {stat.icon}
                </div>

                <span className="stat-change">
                  {stat.change.includes("%") && (
                    <FaArrowUp />
                  )}

                  {stat.change}
                </span>

              </div>


              <div className="stat-value">
                {stat.value}
              </div>


              <div className="stat-title">
                {stat.title}
              </div>

            </div>

          ))}

        </section>


        {/* =================================================
            RECENT BOOKINGS
        ================================================= */}

        <section className="dashboard-panel">

          <div className="panel-header">

            <div>
              <h3>
                Recent Booking Requests
              </h3>

              <p>
                Manage your latest customer requests.
              </p>
            </div>


            <button
              className="view-all-button"
              onClick={() => navigate("/provider/bookings")}
            >
              View All
              <FaArrowRight />
            </button>

          </div>


          <div className="booking-table">

            <div className="booking-table-header">
              <span>Customer</span>
              <span>Service</span>
              <span>Date & Time</span>
              <span>Status</span>
              <span></span>
            </div>


            {bookings.map((booking, index) => (

              <div
                className="booking-row"
                key={index}
              >

                <div className="customer-cell">

                  <div className="customer-avatar">
                    {booking.customer.charAt(0)}
                  </div>

                  <strong>
                    {booking.customer}
                  </strong>

                </div>


                <span className="service-name">
                  {booking.service}
                </span>


                <div className="booking-date">

                  <strong>
                    {booking.date}
                  </strong>

                  <small>
                    {booking.time}
                  </small>

                </div>


                <span
                  className={`booking-status ${booking.status.toLowerCase()}`}
                >
                  <i></i>
                  {booking.status}
                </span>


                <button
                  className="booking-arrow"
                  onClick={() => navigate("/provider/bookings")}
                >
                  <FaArrowRight />
                </button>

              </div>

            ))}

          </div>

        </section>


        {/* =================================================
            BOTTOM AREA
        ================================================= */}

        <section className="dashboard-bottom-grid">


          {/* TODAY'S SCHEDULE */}

          <div className="dashboard-panel schedule-panel">

            <div className="panel-header">

              <div>

                <h3>
                  Today's Schedule
                </h3>

                <p>
                  Your upcoming jobs.
                </p>

              </div>

              <FaCalendarAlt className="panel-icon" />

            </div>


            <div className="schedule-item">

              <div className="schedule-time">
                <strong>10:00</strong>
                <span>AM</span>
              </div>

              <div className="schedule-line"></div>

              <div className="schedule-info">

                <strong>
                  Plumbing Service
                </strong>

                <span>
                  Rahul Kumar · Home Visit
                </span>

              </div>

            </div>


            <div className="schedule-item">

              <div className="schedule-time">
                <strong>02:00</strong>
                <span>PM</span>
              </div>

              <div className="schedule-line"></div>

              <div className="schedule-info">

                <strong>
                  Home Cleaning
                </strong>

                <span>
                  Anu Thomas · Home Visit
                </span>

              </div>

            </div>

          </div>


          {/* QUICK ACTIONS */}

          <div className="dashboard-panel quick-panel">

            <div className="panel-header">

              <div>

                <h3>
                  Quick Actions
                </h3>

                <p>
                  Common provider tasks.
                </p>

              </div>

            </div>


            <div className="quick-actions">

              <button
                onClick={() => navigate("/provider/services")}
              >
                <FaPlus />
                <span>Add Service</span>
                <FaArrowRight />
              </button>


              <button
                onClick={() => navigate("/provider/bookings")}
              >
                <FaCalendarAlt />
                <span>Manage Bookings</span>
                <FaArrowRight />
              </button>


              <button
                onClick={() => navigate("/provider/availability")}
              >
                <FaClock />
                <span>Set Availability</span>
                <FaArrowRight />
              </button>

            </div>

          </div>


          {/* PROVIDER PERFORMANCE */}

          <div className="dashboard-panel performance-panel">

            <div className="panel-header">

              <div>

                <h3>
                  Your Performance
                </h3>

                <p>
                  This month's overview.
                </p>

              </div>

              <FaStar className="panel-icon star-panel-icon" />

            </div>


            <div className="rating-box">

              <strong>
                4.8
              </strong>

              <div>
                <div className="rating-stars">
                  ★★★★★
                </div>

                <span>
                  Average Rating
                </span>
              </div>

            </div>


            <div className="performance-item">
              <span>Completed Jobs</span>
              <strong>86%</strong>
            </div>

            <div className="performance-bar">
              <span></span>
            </div>


            <button
              className="performance-link"
              onClick={() => navigate("/provider/reviews")}
            >
              View Reviews
              <FaChevronRight />
            </button>

          </div>


        </section>


        {/* =================================================
            YOUR MODULES
        ================================================= */}

        <section className="modules-section">

          <div className="modules-heading">

            <div>
              <span>
                PROVIDER TOOLS
              </span>

              <h3>
                Manage Your Business
              </h3>
            </div>

          </div>


          <div className="dashboard-module-grid">

            {modules.map((module) => (

              <button
                className="dashboard-module"
                key={module.title}
                onClick={() => navigate(module.path)}
              >

                <div className="dashboard-module-icon">
                  {module.icon}
                </div>

                <div className="dashboard-module-content">

                  <strong>
                    {module.title}
                  </strong>

                  <span>
                    {module.description}
                  </span>

                </div>

                <FaArrowRight className="module-arrow" />

              </button>

            ))}

          </div>

        </section>

      </main>

    </div>
  );
};

export default ProviderDashboard;
