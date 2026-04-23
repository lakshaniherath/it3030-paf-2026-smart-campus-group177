import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

// HEAD imports
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

// member-01 imports
import { AuthProvider } from './context/AuthContext';
import DashboardLayout from './components/DashboardLayout';
import ResourcesCatalogPage from './features/resources/pages/ResourcesCatalogPage';
import ResourceDetailsPage from './features/resources/pages/ResourceDetailsPage';
import AdminResourceManagementPage from './features/resources/pages/AdminResourceManagementPage';

function App() {
  return (
    <AuthProvider>
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
          
          <Route path="/resources" element={<DashboardLayout><ResourcesCatalogPage /></DashboardLayout>} />
          <Route path="/resources/:id" element={<DashboardLayout><ResourceDetailsPage /></DashboardLayout>} />
          <Route path="/admin/resources" element={<DashboardLayout><AdminResourceManagementPage /></DashboardLayout>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
