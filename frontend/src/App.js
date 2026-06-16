// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import Login from './components/Login';
import Register from './components/Register';
import ForgotPassword from './components/ForgotPassword';
import Dashboard from './components/Dashboard';
import AdminDashboard from './components/AdminDashboard';
import TechnicianDashboard from './components/TechnicianDashboard';
import UserDashboard from './components/UserDashboard';
import OAuth2Success from './components/OAuth2Success';
import ProtectedRoute from './components/ProtectedRoute';
import Chatbot from './components/Chatbot';
import NotificationPanel from './components/NotificationPanel';
import ResourcesCatalogPage from './features/resources/pages/ResourcesCatalogPage';
import ResourceDetailsPage from './features/resources/pages/ResourceDetailsPage';
import AdminResourceManagementPage from './features/resources/pages/AdminResourceManagementPage';
import ResourceAnalyticsDashboard from './features/resources/pages/ResourceAnalyticsDashboard';
import BookingManagement from './components/member2/BookingManagement';
import TicketListPage from './pages/TicketListPage';
import TicketDetailPage from './pages/TicketDetailPage';
import CreateTicketPage from './pages/CreateTicketPage';
import TicketAnalyticsDashboard from './pages/TicketAnalyticsDashboard';

function App() {
  return (
    <Router>
      <Chatbot />
      <NotificationPanel />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/oauth2/success" element={<OAuth2Success />} />
        <Route path="/dashboard" element={<ProtectedRoute element={<Dashboard />} requiredRole={['STUDENT', 'LECTURER', 'ADMIN', 'TECHNICIAN', 'USER']} />} />
        <Route path="/admin-dashboard" element={<ProtectedRoute element={<AdminDashboard />} requiredRole={['ADMIN']} />} />
        <Route path="/technician-dashboard" element={<ProtectedRoute element={<TechnicianDashboard />} requiredRole={['TECHNICIAN']} />} />
        <Route path="/user-dashboard" element={<ProtectedRoute element={<UserDashboard />} requiredRole={['STUDENT', 'LECTURER', 'USER']} />} />
        {/* Member 1 - Resource routes */}
        <Route path="/resources" element={<ProtectedRoute element={<ResourcesCatalogPage />} requiredRole={['STUDENT', 'LECTURER', 'ADMIN', 'TECHNICIAN', 'USER']} />} />
        <Route path="/resources/:id" element={<ProtectedRoute element={<ResourceDetailsPage />} requiredRole={['STUDENT', 'LECTURER', 'ADMIN', 'TECHNICIAN', 'USER']} />} />
        <Route path="/admin/resources" element={<ProtectedRoute element={<AdminResourceManagementPage />} requiredRole={['ADMIN', 'TECHNICIAN']} />} />
        <Route path="/admin/resources/analytics" element={<ProtectedRoute element={<ResourceAnalyticsDashboard />} requiredRole={['ADMIN', 'TECHNICIAN']} />} />
        {/* Member 2 - Booking routes */}
        <Route path="/bookings" element={<ProtectedRoute element={<BookingManagement />} requiredRole={['STUDENT', 'LECTURER', 'ADMIN', 'TECHNICIAN', 'USER']} />} />
        {/* Member 3 - Ticket routes */}
        <Route path="/tickets" element={<ProtectedRoute element={<TicketListPage />} requiredRole={['STUDENT', 'LECTURER', 'ADMIN', 'TECHNICIAN', 'USER']} />} />
        <Route path="/tickets/analytics" element={<ProtectedRoute element={<TicketAnalyticsDashboard />} requiredRole={['ADMIN', 'TECHNICIAN']} />} />
        <Route path="/tickets/create" element={<ProtectedRoute element={<CreateTicketPage />} requiredRole={['STUDENT', 'LECTURER', 'ADMIN', 'TECHNICIAN', 'USER']} />} />
        <Route path="/tickets/:id" element={<ProtectedRoute element={<TicketDetailPage />} requiredRole={['STUDENT', 'LECTURER', 'ADMIN', 'TECHNICIAN', 'USER']} />} />
      </Routes>
    </Router>
  );
}

export default App;