import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const ProtectedRoute = ({ allowedRoles }) => {
  const token = localStorage.getItem('token');
  let isAuthenticated = false;
  let userRole = null;

  if (token) {
    try {
      const decodedToken = jwtDecode(token);
      isAuthenticated = true;
      userRole = decodedToken.role;
    } catch (error) {
      console.error("Error decoding token:", error);
      // If token is invalid, clear it and treat as unauthenticated
      localStorage.removeItem('token');
      localStorage.removeItem('userData');
    }
  }

  if (!isAuthenticated) {
    // Not logged in, redirect to login page
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
    // Logged in but role not allowed, redirect to home or unauthorized page
    return <Navigate to="/" replace />; // Or a specific unauthorized page
  }

  // Authenticated and authorized, render the child routes
  return <Outlet />;
};

export default ProtectedRoute;
