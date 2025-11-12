import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import api from "../api";
import {
  ShoppingCart,
  Package,
  User,
  LogOut,
  Home,
  LogIn,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import logo from "../assets/logo/photo_2025-11-07_17-43-32.jpg";

function Navbar({ cartCount, updateCartCount }) {

  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const [orderCount, setOrderCount] = useState(0);
  

  // ✅ Fetch Cart Count
  const fetchCartCount = async () => {
    try {
      const res = await api.get("/cart");
    setCartCount(res.data.length);
    } catch (err) {
      console.log("Cart not loaded (maybe not logged in)");
    }
  };

  useEffect(() => {
  if (updateCartCount) updateCartCount();
}, [updateCartCount]);

  // ✅ Call once when component mounts
  useEffect(() => {
    fetchCartCount();
  }, []);

  // ✅ Fetch order count when logged in or route changes
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setOrderCount(0);
          return;
        }

        const res = await axios.get(
          "http://localhost:5000/api/orders/myorders",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setOrderCount(res.data.length);
      } catch (err) {
        console.error("Failed to fetch orders:", err);
        setOrderCount(0);
      }
    };

    fetchOrders();
  }, [user, location]);

  // ✅ Handle logout
  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav
      className="navbar navbar-expand-lg navbar-dark shadow-sm"
      style={{
        backgroundColor: "#0d1117",
        borderBottom: "1px solid #30363d",
        margin: "10px",
      }}
    >
      <div className="container">
        <Link to="/" className="navbar-brand fw-bold text-light m2">
          Daksh Accessories
        </Link>

        <button
          className="navbar-toggler border-0"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto align-items-center gap-3">
            <li className="nav-item">
              <Link to="/" className="nav-link text-light">
                <Home size={17} className="me-1" />
                Home
              </Link>
            </li>

            {/* 🔒 If NOT logged in */}
            {!user ? (
              <>
                <li className="nav-item">
                  <Link to="/login" className="nav-link text-light">
                    <LogIn size={17} className="me-1" />
                    Login
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/register" className="nav-link text-light">
                    Register
                  </Link>
                </li>
              </>
            ) : (
              <>
                {/* 🛒 Cart */}
                <li className="nav-item position-relative">
                  <Link to="/cart" className="nav-link text-light d-flex align-items-center">
                    <ShoppingCart size={17} className="me-1" />
                    Cart
                    {cartCount > 0 && (
                      <span
                        className="badge bg-success ms-2"
                        style={{
                          fontSize: "0.7rem",
                          borderRadius: "10px",
                          padding: "2px 6px",
                        }}
                      >
                        {cartCount}
                      </span>
                    )}
                  </Link>
                </li>

                {/* 📦 Orders */}
                <li className="nav-item position-relative">
                  <Link to="/orders" className="nav-link text-light">
                    <Package size={17} className="me-1" /> Orders
                    {orderCount > 0 && (
                      <span
                        className="badge bg-danger position-absolute top-0 start-100 translate-middle rounded-pill"
                        style={{ fontSize: "0.7rem" }}
                      >
                        {orderCount}
                      </span>
                    )}
                  </Link>
                </li>

                {/* 👤 Profile */}
                <li className="nav-item">
                  <Link to="/profile" className="nav-link text-light">
                    <User size={17} className="me-1" /> Profile
                  </Link>
                </li>

                {/* 🚪 Logout */}
                <li className="nav-item">
                  <button
                    className="btn btn-outline-danger btn-sm ms-2"
                    onClick={handleLogout}
                  >
                    <LogOut size={15} className="me-1" /> Logout
                  </button>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
