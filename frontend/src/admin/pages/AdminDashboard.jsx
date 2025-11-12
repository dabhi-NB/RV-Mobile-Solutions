import React from "react";
import AdminNavbar from "../components/AdminNavbar";
import ProductList from "./ProductList";

function AdminDashboard() {
  return (
    <>
      <AdminNavbar />
      <div className="container mt-4">
        <h2 className="text-center mb-4">Admin Dashboard</h2>
        <ProductList />
      </div>
    </>
  );
}

export default AdminDashboard;
