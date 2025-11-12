import React from "react";
import { useNavigate } from "react-router-dom";

function AdminNavbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("adminInfo");
    navigate("/admin/login");
  };

  return (
    <nav className="navbar navbar-dark bg-dark px-3">
      <span className="navbar-brand mb-0 h1">Admin Panel</span>
      <button className="btn btn-outline-light" onClick={handleLogout}>
        Logout
      </button>
    </nav>
  );
}

export default AdminNavbar;
