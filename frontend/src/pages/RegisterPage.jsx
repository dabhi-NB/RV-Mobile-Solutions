import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { Eye, EyeOff } from "lucide-react";


function RegisterPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    password: "",
    confirmPassword: "",
  });
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setSuccess(false);

    if (formData.password !== formData.confirmPassword) {
      setMessage("⚠️ Passwords do not match");
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:5000/api/users/register",
        formData
      );
      setMessage(res.data.message || "✅ Registration successful!");
      setSuccess(true);
      navigate("/login");
    } catch (err) {
      setSuccess(false);
      setMessage(
        err.response?.data?.message || "Registration failed. Try again."
      );
    }
  };

  return (
    <div className="auth-container-dark">
      <div className="auth-card-dark shadow-lg">
        <h2 className="text-center mb-4 fw-bold text-light">
          Create Your Account
        </h2>

        <form onSubmit={handleSubmit}>
          <input
            name="name"
            type="text"
            className="form-control mb-3 bg-dark text-light border-secondary"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <input
            name="email"
            type="email"
            className="form-control mb-3 bg-dark text-light border-secondary"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            name="phone"
            type="text"
            className="form-control mb-3 bg-dark text-light border-secondary"
            placeholder="Phone Number"
            value={formData.phone}
            onChange={handleChange}
            required
          />
          <input
            name="address"
            type="text"
            className="form-control mb-3 bg-dark text-light border-secondary"
            placeholder="Address"
            value={formData.address}
            onChange={handleChange}
            required
          />

          <div className="input-group mb-3">
            <input
              name="password"
              type={showPassword ? "text" : "password"}
              className="form-control bg-dark text-light border-secondary"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <span
              className="input-group-text bg-dark text-light border-secondary"
              onClick={() => setShowPassword(!showPassword)}
              style={{ cursor: "pointer" }}
            >
              {showPassword ? <EyeOff /> : <Eye />}
            </span>
          </div>

          <div className="input-group mb-3">
            <input
              name="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              className="form-control bg-dark text-light border-secondary"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
            <span
              className="input-group-text bg-dark text-light border-secondary"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              style={{ cursor: "pointer" }}
            >
              {showConfirmPassword ? <EyeOff /> : <Eye />}
            </span>
          </div>

          <button className="btn btn-primary w-100 py-2 fw-semibold">
            Register
          </button>
        </form>

        {message && (
          <p
            className={` text-center fw-semibold ${
              success ? "text-success" : "text-danger"
            }`}
          >
            {message}
          </p>
        )}

        <div className="text-center ">
          <p className="">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-info text-decoration-none fw-semibold"
            >
              Login here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
