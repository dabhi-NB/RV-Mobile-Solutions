import React from "react";
import { Navigate } from "react-router-dom";

function AdminPrivateRoute({ children }) {
  const adminInfo = JSON.parse(localStorage.getItem("adminInfo"));
  return adminInfo ? children : <Navigate to="/admin/login" />;
}

export default AdminPrivateRoute;
