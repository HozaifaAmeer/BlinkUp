import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { apiFetch } from "../../config";
import "./Register.css";

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Client-side validation
    if (!formData.username.trim()) {
      toast.error("Username is required");
      return;
    }
    if (!formData.email.trim()) {
      toast.error("Email is required");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error("Please enter a valid email address");
      return;
    }
    if (!formData.password.trim()) {
      toast.error("Password is required");
      return;
    }
    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setSubmitting(true);

    try {
      const res = await apiFetch("/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Registration failed");
      }

      // Store token and user info
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      window.dispatchEvent(new Event("authChange"));

      toast.success("Account created successfully!");
      navigate("/posts");
    } catch (err) {
      toast.error(err.message);
      setSubmitting(false);
    }
  };

  return (
    <div className="register-page">
      <div className="register-card">

        <h2 className="register-title">Create Account</h2>
        <p className="register-subtitle">
          Join <span className="brand-text-highlight">BlinkUp</span> and start sharing with your community
        </p>

        <form onSubmit={handleSubmit} className="register-form" noValidate>
          <div className="mb-3">
            <label htmlFor="reg-username" className="form-label register-label">
              Username
            </label>
            <div className="input-group">
              <i className="fa-solid fa-user input-icon"></i>
              <input
                type="text"
                className="form-control"
                id="reg-username"
                name="username"
                placeholder="Choose a username"
                value={formData.username}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="mb-3">
            <label htmlFor="reg-email" className="form-label register-label">
              Email
            </label>
            <div className="input-group">
              <i className="fa-solid fa-envelope input-icon"></i>
              <input
                type="email"
                className="form-control"
                id="reg-email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="mb-3">
            <label htmlFor="reg-password" className="form-label register-label">
              Password
            </label>
            <div className="input-group">
              <i className="fa-solid fa-lock input-icon"></i>
              <input
                type="password"
                className="form-control"
                id="reg-password"
                name="password"
                placeholder="Create a password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn register-submit-btn"
            disabled={submitting}
          >
            {submitting ? (
              <>
                <span
                  className="spinner-border spinner-border-sm"
                  role="status"
                ></span>
                Creating Account...
              </>
            ) : (
              <>
                <i className="fa-solid fa-arrow-right"></i>
                Sign Up
              </>
            )}
          </button>
        </form>

        <div className="register-divider">Already a member?</div>

        <p className="register-footer-text">
          <Link to="/login">Log in to your account</Link>
        </p>
      </div>
    </div>
  );
}
