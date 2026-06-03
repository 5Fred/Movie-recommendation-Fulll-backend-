import React from 'react';
import { Navigate } from 'react-router-dom';

// This component wraps around our private pages and checks for the JWT token
function ProtectedRoute({ children }) {
  const token = localStorage.getItem('flickpick_token');

  // If no token exists, redirect the user straight to the login page
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // If the token is found, allow them to view the page normally
  return children;
}

export default ProtectedRoute;
