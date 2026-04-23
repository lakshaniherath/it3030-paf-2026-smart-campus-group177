import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ element, requiredRole }) => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const authToken = localStorage.getItem('authToken');

  // Check if user is authenticated
  if (!authToken || !user.email) {
    return <Navigate to="/login" replace />;
  }

  // Check if user has required role
  if (requiredRole && !requiredRole.includes(user.role)) {
    // Redirect to appropriate dashboard based on role
    if (user.role === 'ADMIN' || user.role === 'TECHNICIAN') {
      return <Navigate to="/dashboard" replace />;
    }
    return <Navigate to="/dashboard" replace />;
  }

  return element;
};

export default ProtectedRoute;
