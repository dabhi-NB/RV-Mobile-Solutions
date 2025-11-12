import React from "react";
import { Navigate } from "react-router-dom";

const PrivateAdminRoute = ({ children }) => {
  const admin = JSON.parse(localStorage.getItem("adminInfo"));
  return admin ? children : <Navigate to="/admin/login" />;
};

export default PrivateAdminRoute;
