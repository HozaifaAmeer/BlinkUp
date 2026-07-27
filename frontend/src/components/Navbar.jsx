import React, { useState, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { apiFetch } from "../config";

export default function Navbar() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (token && storedUser) {
      setUser(JSON.parse(storedUser));
      // Verify token validity with backend
      apiFetch("/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => {
          if (res.status === 401 || res.status === 403) {
            // Stale or expired token
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            setUser(null);
            window.dispatchEvent(new Event("authChange"));
          } else if (res.ok) {
            return res.json();
          }
        })
        .then((data) => {
          if (data && data.user) {
            setUser(data.user);
            localStorage.setItem("user", JSON.stringify(data.user));
          }
        })
        .catch(() => {
          // Ignore network errors on token check (offline/cold start)
        });
    }

    const handleStorage = () => {
      const stored = localStorage.getItem("user");
      setUser(stored ? JSON.parse(stored) : null);
    };

    window.addEventListener("storage", handleStorage);
    window.addEventListener("authChange", handleStorage);
    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener("authChange", handleStorage);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    window.dispatchEvent(new Event("authChange"));
    toast.success("Logged out successfully!");
    navigate("/");
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const trimmed = searchQuery.trim();
    if (trimmed) {
      navigate(`/posts?search=${encodeURIComponent(trimmed)}`);
    } else {
      navigate("/posts");
    }
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light navbar-custom sticky-top py-2">
      <div className="container">
        {/* Brand/Logo */}
        <Link className="navbar-brand-custom" to="/">
          <i className="fa-solid fa-bolt-lightning"></i>
          <span>BlinkUp</span>
        </Link>

        {/* Mobile Toggle Button */}
        <button
          className="navbar-toggler border-0"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarContent"
          aria-controls="navbarContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Collapsible Content */}
        <div className="collapse navbar-collapse" id="navbarContent">
          {/* Search Bar in Middle */}
          <form className="d-flex mx-auto my-2 my-lg-0 search-wrapper" onSubmit={handleSearch}>
            <i className="fa-solid fa-magnifying-glass"></i>
            <input
              className="form-control search-box-custom"
              type="search"
              placeholder="Search by category..."
              aria-label="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </form>

          {/* Navigation Links */}
          <ul className="navbar-nav ms-auto align-items-center gap-1">
            <li className="nav-item">
              <NavLink className={({ isActive }) => `nav-link-custom ${isActive ? "active" : ""}`} to="/">
                <i className="fa-solid fa-house"></i>
                <span>Home</span>
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className={({ isActive }) => `nav-link-custom ${isActive ? "active" : ""}`} to="/posts">
                <i className="fa-solid fa-compass"></i>
                <span>Explore</span>
              </NavLink>
            </li>

            {/* Create Post CTA — always visible */}
            <li className="nav-item ms-lg-2 my-2 my-lg-0">
              <Link className="btn-create-post" to="/posts/new">
                <i className="fa-solid fa-circle-plus"></i>
                <span>Create</span>
              </Link>
            </li>

            {/* Account Dropdown */}
            <li className="nav-item dropdown ms-lg-2 my-2 my-lg-0">
              <button
                className="nav-link-custom dropdown-toggle"
                type="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
                style={{ background: "none", border: "none", cursor: "pointer" }}
              >
                <i className="fa-solid fa-circle-user"></i>
                <span>Account</span>
              </button>

              <ul className="dropdown-menu dropdown-menu-end shadow-sm" style={{ borderRadius: "12px", padding: "8px 0", minWidth: "200px" }}>
                {user ? (
                  <>
                    <li className="px-3 py-2" style={{ borderBottom: "1px solid #e2e8f0" }}>
                      <small className="text-muted d-block" style={{ fontSize: "0.75rem" }}>Signed in as</small>
                      <div style={{ fontWeight: 700, color: "#0f172a", wordBreak: "break-word" }}>{user.username}</div>
                      {user.email && <small className="text-muted d-block" style={{ fontSize: "0.75rem" }}>{user.email}</small>}
                    </li>
                    <li>
                      <button
                        className="dropdown-item d-flex align-items-center gap-2 py-2"
                        onClick={handleLogout}
                        style={{ color: "#ef4444" }}
                      >
                        <i className="fa-solid fa-right-from-bracket"></i>
                        Logout
                      </button>
                    </li>
                  </>
                ) : (
                  <>
                    <li>
                      <Link className="dropdown-item d-flex align-items-center gap-2 py-2" to="/login">
                        <i className="fa-solid fa-right-to-bracket"></i>
                        Login
                      </Link>
                    </li>
                    <li>
                      <Link className="dropdown-item d-flex align-items-center gap-2 py-2" to="/register">
                        <i className="fa-solid fa-user-plus"></i>
                        Sign Up
                      </Link>
                    </li>
                  </>
                )}
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
