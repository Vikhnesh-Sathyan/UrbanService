# 🛠️ UrbanService — Hyperlocal Service Marketplace

A **MERN Stack hyperlocal service marketplace** built during my internship in 2025. UrbanService connects customers with local service professionals through a role-based platform for service discovery, booking, payments, provider management, analytics, notifications, and an ML-powered Smart Service Assistant.

---

## 🚀 Live Demo

👉 **[urban-service-eta.vercel.app](https://urban-service-eta.vercel.app/)**

## 🚀 Features

### 🔐 Authentication & Role-Based Access

* JWT-based authentication
* Secure password hashing with bcrypt.js
* Role-based access for:

  * 👤 User
  * 👨‍🔧 Provider
  * 🛡️ Admin
* Protected frontend routes
* Role-based backend API authorization

---

### 🔎 Service Marketplace

* Browse approved professional services
* Category → Subcategory → Service navigation
* Search services
* Filter by price and rating
* Sort services
* Filter by provider and availability
* View detailed service information

---

### 👨‍🔧 Provider Management

* Add and manage services
* Update service information
* Submit services for admin approval
* Manage provider availability
* Manage customer bookings
* Track service performance
* View booking and earnings analytics

---

### 🛡️ Admin Service Management

* Review provider-submitted services
* Approve services
* Request changes with admin comments
* Reject services
* Manage service categories and subcategories
* Configure suggested materials for services
* Monitor platform activity and analytics

---

### 📅 Booking System

* Normal service bookings
* Emergency service bookings
* Booking status management
* Customer booking history
* Provider booking management
* Customer location information for bookings
* Booking activity tracking

---

### 💳 Payment Management

* Stripe payment integration
* Payment status tracking
* Payment history
* Digital payment receipts
* Refund handling
* Protection against duplicate payment processing
* Payment and revenue analytics

---

### 🔔 Notifications

* Booking notifications
* Emergency request notifications
* Material preparation notifications
* Automatic follow-up notifications
* Read/unread notification management
* Real-time notification updates

---

### 🧰 Provider Material Preparation

Providers can prepare required materials before servicing a booking.

* Admin-defined suggested materials
* Provider material status management
* Available / Need to Buy / Ready statuses
* Provider-added additional materials
* Overall preparation status
* Customer notification when preparation is ready

Customers receive the preparation status without seeing the provider's detailed material list.

---

### 🔄 Automatic Service Follow-up

Providers can schedule a follow-up after completing a service.

* Schedule follow-ups in:

  * Minutes
  * Hours
  * Days
  * Weeks
* Automatic follow-up processing
* Customer notification when the follow-up becomes due
* Direct navigation back to the related service
* Customer can book the service again

---

### 📊 Analytics

#### 👤 User Analytics

* Total bookings
* Completed bookings
* Cancelled bookings
* Emergency bookings
* Booking activity
* Service usage
* Normal vs emergency booking analysis

#### 👨‍🔧 Provider Analytics

* Total services
* Total bookings
* Completed bookings
* Completion rate
* Earnings
* Booking performance
* Service performance
* Emergency booking analytics

#### 🛡️ Admin Analytics

* Platform overview
* Booking activity
* Booking status breakdown
* Service analytics
* Provider analytics
* Complaint analytics
* Payment and revenue analytics

---

# 🧠 Smart Service Assistant

UrbanService includes an ML-powered assistant that allows customers to describe their service problem in natural language.

### Flow

```text
Customer Problem
       ↓
Problem Analysis
       ↓
Recommended Service
       ↓
Possible Causes
       ↓
Estimated Cost
       ↓
Estimated Duration
       ↓
Book Service
```

### Example

```text
"My AC is running but not cooling and water is leaking."

             ↓

Recommended Service
AC Repair

Possible Causes
• Drain blockage
• Dirty filter
• Frozen evaporator coil

Estimated Cost
₹700 - ₹950

Estimated Time
75 - 90 minutes
```

> Cost and duration are estimates. Possible causes are suggestions based on the submitted problem and are not confirmed diagnoses.

---

# 🤖 Machine Learning

The Smart Service Assistant uses a separate Python ML service integrated with the MERN application.

### ML Components

#### 1. Service Classification

Predicts the appropriate service from the customer's problem description.

**Technique:**

* TF-IDF Vectorization
* Logistic Regression

#### 2. Cost Prediction

Predicts an estimated service cost based on the problem and service-related features.

**Technique:**

* TF-IDF text features
* Categorical feature encoding
* Random Forest Regression

#### 3. Duration Prediction

Predicts an estimated service duration.

**Technique:**

* TF-IDF text features
* Categorical feature encoding
* Random Forest Regression

#### 4. Possible Causes

A controlled knowledge layer provides possible causes for recognized service issues.

This is **rule/knowledge-based**, not a separate ML diagnosis model.

### ML Architecture

```text
React
  ↓
Node.js / Express
  ↓
Python Flask ML API
  ↓
TF-IDF / ML Models
  ↓
Service + Cost + Duration
  ↓
Possible Causes
  ↓
React Result
  ↓
Book Service
```

> The current ML prototype is trained using a small synthetic dataset created for project demonstration. The predictions are estimates and are not intended to represent production-level accuracy or real historical customer data.

---

# 🏗️ Tech Stack

## Frontend

* React.js
* React Router
* Axios
* CSS
* React Icons

## Backend

* Node.js
* Express.js
* REST APIs
* Axios
* JWT
* bcrypt.js
* Multer
* Socket.IO

## Database

* MongoDB
* Mongoose

## Payments

* Stripe

## Machine Learning

* Python
* Flask
* Pandas
* Scikit-learn
* Joblib
* TF-IDF
* Logistic Regression
* Random Forest Regression

## Development Tools

* Git
* GitHub
* VS Code

---

# 🔄 Core Application Flow

```text
Customer
   ↓
Browse Services
   ↓
Select Category
   ↓
Select Subcategory
   ↓
Select Service
   ↓
Create Booking
   ↓
Provider Receives Request
   ↓
Provider Accepts Booking
   ↓
Service Execution
   ↓
Payment / Completion
   ↓
Material Preparation / Follow-up
   ↓
Notifications & Analytics
```

---

# 👥 User Roles

## 👤 User

* Browse and search services
* Filter and sort services
* View service details
* Book normal or emergency services
* Make online payments
* View booking history
* View payment receipts
* Receive notifications
* Use Smart Service Assistant
* Submit complaints
* Manage profile

## 👨‍🔧 Provider

* Add and manage services
* Submit services for approval
* Manage availability
* Accept and manage bookings
* Handle emergency requests
* Prepare service materials
* Schedule service follow-ups
* Track payments and earnings
* View analytics
* Manage profile

## 🛡️ Admin

* Manage service approval workflow
* Approve, request changes, or reject services
* Manage service categories
* Manage service subcategories
* Configure suggested service materials
* Monitor bookings and services
* View platform analytics
* Monitor payment analytics
* Manage provider-related workflows

---

# 🔒 Security

* JWT-based authentication
* Password hashing with bcrypt.js
* Protected API routes
* Role-based authorization middleware
* Protected frontend routes
* Authenticated payment operations
* Provider ownership validation
* User-specific booking access
* Environment variables for sensitive configuration

---

# 📁 Project Architecture

```text
UrbanService/
│
├── Backend/
│   ├── Controllers/
│   ├── Models/
│   ├── Routes/
│   ├── Middleware/
│   ├── Utils/
│   ├── ML/
│   │   ├── data/
│   │   ├── models/
│   │   ├── train/
│   │   └── app.py
│   └── server.js
│
├── frontend/
│   └── src/
│       ├── Components/
│       ├── Services/
│       ├── styles/
│       └── App.js
│
└── README.md
```

---

# 🔌 API Architecture

The application follows a modular REST API architecture.

```text
React Frontend
      ↓
Axios
      ↓
Express REST API
      ↓
Authentication Middleware
      ↓
Role Middleware
      ↓
Controller
      ↓
Mongoose Model
      ↓
MongoDB
```

For ML predictions:

```text
React
  ↓
Node.js API
  ↓
Python Flask API
  ↓
ML Models
```

---

# ⭐ Project Highlights

* Full-stack MERN application
* Role-based authentication and authorization
* Modular REST API architecture
* Service approval workflow
* Normal and emergency booking system
* Stripe payment integration
* Payment history and refund handling
* Notification system
* Provider material preparation workflow
* Automatic service follow-up system
* User, Provider, and Admin analytics
* NLP-based service classification using TF-IDF and Logistic Regression
* ML-based cost and duration estimation
* Python Flask ML integration with a MERN application
* Category → Subcategory → Service marketplace flow
* Customer-focused Smart Service Assistant

---

# ⚠️ ML Prototype Note

The machine learning component currently uses **synthetic demonstration data** rather than a large real-world customer dataset.

Therefore:

* Predictions are estimates.
* Possible causes are suggestions, not confirmed diagnoses.
* Cost and duration are approximate.
* The current model is intended to demonstrate the complete ML integration and workflow.

A larger dataset of real historical service requests, actual costs, and actual service durations could be used for future model improvement.

---

# 📌 Project Status

**UrbanService — Core Development Completed**

The application currently includes the major marketplace, booking, payment, analytics, notification, provider workflow, and ML functionality required for the project.

