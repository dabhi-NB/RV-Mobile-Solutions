import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/admin/login", { email, password });
      localStorage.setItem("adminInfo", JSON.stringify(res.data));
      navigate("/admin/dashboard");
    } catch (err) {
      setMessage(err.response?.data?.message || "Login failed.");
    }
  };

  return (
    <div className="container mt-5 text-center">
      <p>email === "admin@example.com" && password === "admin123"</p>
      <h2>Admin Login</h2>
      <form onSubmit={handleLogin} className="mt-3" style={{ maxWidth: "400px", margin: "0 auto" }}>
        <input
          type="email"
          placeholder="Email"
          className="form-control mb-3"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="form-control mb-3"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button className="btn btn-dark w-100">Login</button>
      </form>
      {message && <p className="text-danger mt-3">{message}</p>}
    </div>
  );
}

export default AdminLogin;
