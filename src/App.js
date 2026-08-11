import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import RoleRoute from './components/RoleRoute';

import Dashboard from './pages/Dashboard';
import AppointmentsDashboard from './pages/Appointments';
import InvoicesPage from './pages/Services';
import StaffPage from './pages/Staff';
import ClientsPage from './pages/Clients';
import BusinessDashboard from './pages/BusinessDashboard';
import Logout from './pages/Logout';
import LoginPage from './pages/Login';
import UserDashboard from './pages/UserDashboard';
import BookService from './pages/BookService';
import ProfilePage from './pages/ProfilePage';
import UserBookingsDashboard from './components/UpcomingApts';
import AppointmentRequests from './components/AppointmentsRequest';
import AvailabilityManager from './components/Availability';
import MyBookings from './components/Bookings';
import SignUp from './pages/SignUp';
import UserLayout from './components/UserLayout';
import AdminLayout from './components/AdminLayout';
import ConsultantLayout from './components/ConsultantLayout';

const protect = (roles, element) => (
  <RoleRoute allowedRoles={roles}>{element}</RoleRoute>
);

const App = () => (
  <Router>
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignUp />} />

      <Route
        path="/admin/dashboard"
        element={protect(['admin'], <AdminLayout />)}
      />
      <Route
        path="/consultant/dashboard"
        element={protect(['consultant'], <ConsultantLayout />)}
      />
      <Route
        path="/user/dashboard"
        element={protect(['user'], <UserLayout />)}
      />

      <Route
        path="/dashboard"
        element={protect(['admin'], <Layout><Dashboard /></Layout>)}
      />
      <Route
        path="/appointments"
        element={protect(['admin'], <Layout><AppointmentsDashboard /></Layout>)}
      />
      <Route
        path="/services"
        element={protect(['admin'], <Layout><InvoicesPage /></Layout>)}
      />
      <Route
        path="/staff"
        element={protect(['admin'], <Layout><StaffPage /></Layout>)}
      />
      <Route
        path="/clients"
        element={protect(['admin'], <Layout><ClientsPage /></Layout>)}
      />
      <Route
        path="/reports"
        element={protect(['admin'], <Layout><BusinessDashboard /></Layout>)}
      />

      <Route
        path="/user-dashboard"
        element={protect(['user'], <Layout><UserDashboard /></Layout>)}
      />
      <Route
        path="/book-service"
        element={protect(['user'], <Layout><BookService /></Layout>)}
      />
      <Route
        path="/profile"
        element={protect(['user', 'consultant'], <Layout><ProfilePage /></Layout>)}
      />
      <Route
        path="/UpcomingApts"
        element={protect(['user', 'consultant'], <Layout><UserBookingsDashboard /></Layout>)}
      />
      <Route
        path="/mybookings"
        element={protect(['user'], <Layout><MyBookings /></Layout>)}
      />

      <Route
        path="/appointmentrequests"
        element={protect(['consultant'], <Layout><AppointmentRequests /></Layout>)}
      />
      <Route
        path="/availability"
        element={protect(['consultant'], <Layout><AvailabilityManager /></Layout>)}
      />

      <Route
        path="/logout"
        element={protect(['admin', 'consultant', 'user'], <Layout><Logout /></Layout>)}
      />
    </Routes>
  </Router>
);

export default App;