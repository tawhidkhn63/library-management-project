import React from 'react';
import { Navigate } from 'react-router-dom';
import { isTokenValid, logout } from '../api/authService';

const PrivateRoute = ({ children, requiredRole }) => {
  const token = localStorage.getItem('token'); // Check if a token exists
  const role = localStorage.getItem('role'); // Get the user's role

  // If the token doesn't exist or is expired, log the user out and redirect to login
  if (!token || !isTokenValid()) {
    logout();
    return <Navigate to="/login" />;
  }

  // If a required role is specified, check if the user has that role
  if (requiredRole && role !== requiredRole) {
    return <Navigate to="/" />; // Redirect to the homepage if the user doesn't have the required role
  }

  return children;
};

export default PrivateRoute;