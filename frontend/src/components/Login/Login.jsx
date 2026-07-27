import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { apiFetch } from "../../config";
import "./Login.css";

export default function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
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
    if (!formData.password.trim()) {
      toast.error("Password is required");
      return;
    }

    setSubmitting(true);

    try {
      const res = await apiFetch("/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Login failed");
      }

      // Store token and user info
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      window.dispatchEvent(new Event("authChange"));

      toast.success("Welcome back, " + data.user.username + "!");
      navigate("/posts");
    } catch (err) {
      toast.error(err.message);
      setSubmitting(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">

        <h2 className="login-title">Welcome Back</h2>
        <p className="login-subtitle">
          Log in to continue to <span className="brand-text-highlight">BlinkUp</span>
        </p>

        <form onSubmit={handleSubmit} className="login-form" noValidate>
          <div className="mb-3">
            <label htmlFor="login-username" className="form-label login-label">
              Username
            </label>
            <div className="input-group">
              <i className="fa-solid fa-user input-icon"></i>
              <input
                type="text"
                className="form-control"
                id="login-username"
                name="username"
                placeholder="Enter your username"
                value={formData.username}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="mb-3">
            <label htmlFor="login-password" className="form-label login-label">
              Password
            </label>
            <div className="input-group">
              <i className="fa-solid fa-lock input-icon"></i>
              <input
                type="password"
                className="form-control"
                id="login-password"
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn login-submit-btn"
            disabled={submitting}
          >
            {submitting ? (
              <>
                <span
                  className="spinner-border spinner-border-sm"
                  role="status"
                ></span>
                Logging in...
              </>
            ) : (
              <>
                <i className="fa-solid fa-arrow-right"></i>
                Log In
              </>
            )}
          </button>
        </form>

        <div className="login-divider">New to BlinkUp?</div>

        <p className="login-footer-text">
          <Link to="/register">Create an account</Link>
        </p>
      </div>
    </div>
  );
}
