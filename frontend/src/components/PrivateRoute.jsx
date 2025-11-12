// ✅ frontend/src/components/PrivateRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";

// This component protects private routes
const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("token");

  if (!token) {
    // No token → redirect to login
    return <Navigate to="/login" replace />;
  }

  // Token found → render the protected page
  return children;
};

export default PrivateRoute;
