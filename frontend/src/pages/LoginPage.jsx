import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext"; // ✅ Import context

const LoginPage = () => {
  const navigate = useNavigate();
  const { login, user } = useAuth(); // ✅ use context login method

  // ✅ Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate("/profile");
    }
  }, [user, navigate]);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const res = await axios.post("http://localhost:5000/api/users/login", {
        email,
        password,
      });

      // ✅ Save both user and token in AuthContext + localStorage
      login(res.data, res.data.token);

      setMessage("✅ Login successful!");
      navigate("/profile");
    } catch (err) {
      const errorMsg =
        err.response?.data?.message || "❌ Login failed. Please try again.";
      setMessage(errorMsg);
    }
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{
        minHeight: "100vh",
        backgroundColor: "#0d1117",
        color: "#fff",
      }}
    >
      <div
        className="card p-4 shadow-lg"
        style={{
          backgroundColor: "#161b22",
          border: "1px solid #30363d",
          width: "400px",
        }}
      >
        <h2 className="text-center mb-4 text-light">🔐 Login</h2>

        {message && (
          <div
            className={`alert ${
              message.includes("✅") ? "alert-success" : "alert-danger"
            }`}
          >
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label text-light">Email address</label>
            <input
              type="email"
              className="form-control bg-dark text-light border-secondary"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label text-light">Password</label>
            <input
              type="password"
              className="form-control bg-dark text-light border-secondary"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary w-100">
            Login
          </button>
        </form>

        <p className=" text-center text-light">
          Don’t have an account?{" "}
          <Link to="/register" className="text-info">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
