import React from "react";

export default function Footer() {
  const handlePreventDefault = (e) => {
    e.preventDefault();
  };

  return (
    <footer className="footer-custom mt-auto">
      <div className="container">
        <div className="row gy-4 justify-content-between">
          {/* Logo and Tagline */}
          <div className="col-lg-4 col-md-6">
            <a href="#" onClick={handlePreventDefault} className="footer-logo">
              <i className="fa-solid fa-bolt-lightning"></i>
              <span>BlinkUp</span>
            </a>
            <p className="footer-tagline mt-2">
              Connect, share, and grow with people who share your passions. Build your network and shape your community today.
            </p>
          </div>

          {/* Column 1: Explore */}
          <div className="col-lg-2 col-md-6">
            <h5 className="footer-header">Explore</h5>
            <ul className="footer-links-list">
              <li>
                <a href="#" onClick={handlePreventDefault} className="footer-link">Explore Hubs</a>
              </li>
              <li>
                <a href="#" onClick={handlePreventDefault} className="footer-link">Trending Topics</a>
              </li>
              <li>
                <a href="#" onClick={handlePreventDefault} className="footer-link">Events</a>
              </li>
              <li>
                <a href="#" onClick={handlePreventDefault} className="footer-link">Groups</a>
              </li>
            </ul>
          </div>

          {/* Column 2: Legal & Info */}
          <div className="col-lg-2 col-md-6">
            <h5 className="footer-header">Company</h5>
            <ul className="footer-links-list">
              <li>
                <a href="#" onClick={handlePreventDefault} className="footer-link">About Us</a>
              </li>
              <li>
                <a href="#" onClick={handlePreventDefault} className="footer-link">Careers</a>
              </li>
              <li>
                <a href="#" onClick={handlePreventDefault} className="footer-link">Privacy Policy</a>
              </li>
              <li>
                <a href="#" onClick={handlePreventDefault} className="footer-link">Terms of Service</a>
              </li>
            </ul>
          </div>

          {/* Column 3: Social & App info */}
          <div className="col-lg-3 col-md-6">
            <h5 className="footer-header">Connect With Us</h5>
            <p className="footer-tagline mb-3">Stay updated with our latest news and features.</p>
            <div className="social-icons-wrapper mb-4">
              <a href="#" onClick={handlePreventDefault} className="social-icon-btn fb">
                <i className="fa-brands fa-facebook-f"></i>
              </a>
              <a href="#" onClick={handlePreventDefault} className="social-icon-btn ig">
                <i className="fa-brands fa-instagram"></i>
              </a>
              <a href="#" onClick={handlePreventDefault} className="social-icon-btn x">
                <i className="fa-brands fa-x-twitter"></i>
              </a>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="footer-divider"></div>

        {/* Bottom copyright row */}
        <div className="footer-copyright">
          <span>&copy; {new Date().getFullYear()} BlinkUp. All rights reserved.</span>
          <div className="d-flex gap-3">
            <a href="#" onClick={handlePreventDefault} className="footer-link">Help Center</a>
            <a href="#" onClick={handlePreventDefault} className="footer-link">Safety Center</a>
            <a href="#" onClick={handlePreventDefault} className="footer-link">Cookies Info</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
