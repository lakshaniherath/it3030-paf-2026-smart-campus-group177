// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import AdminDashboard from './components/AdminDashboard';
import UserDashboard from './components/UserDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import Chatbot from './components/Chatbot';
import NotificationPanel from './components/NotificationPanel';

function App() {
  return (
    <Router>
      <Chatbot />
      <NotificationPanel />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<ProtectedRoute element={<Dashboard />} requiredRole={['STUDENT', 'LECTURER', 'ADMIN', 'TECHNICIAN', 'USER']} />} />
        <Route path="/admin-dashboard" element={<ProtectedRoute element={<AdminDashboard />} requiredRole={['ADMIN', 'TECHNICIAN']} />} />
        <Route path="/user-dashboard" element={<ProtectedRoute element={<UserDashboard />} requiredRole={['STUDENT', 'LECTURER', 'USER']} />} />
      </Routes>
    </Router>
  );
}

export default App;