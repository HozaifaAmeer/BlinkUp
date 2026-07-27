import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import hero1 from "../../assets/images/hero1.jpg";
import hero3 from "../../assets/images/hero3.jpg";
import hero4 from "../../assets/images/hero4.jpg";

export default function Hero() {
  useEffect(() => {
    // Initialize the Bootstrap Carousel after React mounts the DOM
    const initCarousel = () => {
      if (window.bootstrap && window.bootstrap.Carousel) {
        const carouselEl = document.getElementById("heroCarousel");
        if (carouselEl) {
          const carouselInstance = new window.bootstrap.Carousel(carouselEl, {
            interval: 2000, // rotate every 2 seconds
            wrap: true,     // wrap back to first slide when reaching the end
            keyboard: true  // allow arrow keys control
          });
          carouselInstance.cycle();
          return carouselInstance;
        }
      }
      return null;
    };

    let carousel = initCarousel();

    // Fallback in case the Bootstrap script is still loading asynchronously
    let retryTimer;
    if (!carousel) {
      retryTimer = setTimeout(() => {
        carousel = initCarousel();
      }, 500);
    }

    return () => {
      if (carousel) {
        carousel.dispose();
      }
      if (retryTimer) {
        clearTimeout(retryTimer);
      }
    };
  }, []);

  return (
    <div className="main-content">
      {/* Hero Section */}
      <section className="hero-section">
        {/* Carousel Background */}
        <div id="heroCarousel" className="carousel slide carousel-fade hero-carousel" data-bs-ride="carousel" data-bs-interval="5000" >
          <div className="carousel-indicators">
            <button
              type="button"
              data-bs-target="#heroCarousel"
              data-bs-slide-to="0"
              className="active"
              aria-current="true"
              aria-label="Slide 1"
            ></button>
            <button
              type="button"
              data-bs-target="#heroCarousel"
              data-bs-slide-to="1"
              aria-label="Slide 2"
            ></button>
            <button
              type="button"
              data-bs-target="#heroCarousel"
              data-bs-slide-to="2"
              aria-label="Slide 3"
            ></button>
          </div>
          
          <div className="carousel-inner h-100">
            <div className="carousel-item active h-100">
              <img src={hero1} className="d-block w-100 hero-img" alt="Connect on BlinkUp" />
            </div>
            <div className="carousel-item h-100">
              <img src={hero4} className="d-block w-100 hero-img" alt="Share your thoughts" />
            </div>
            <div className="carousel-item h-100">
              <img src={hero3} className="d-block w-100 hero-img" alt="Belong to a community" />
            </div>
          </div>
          
          {/* Subtle overlay shading */}
          <div className="hero-overlay"></div>
          
          {/* Overlaid Hero Content */}
          <div className="hero-content-wrapper">
            <div className="hero-content">
              {/* <div className="hero-badge animate__animated animate__fadeInDown">
                <i className="fa-solid fa-bolt-lightning me-2"></i>
                Welcome to BlinkUp
              </div> */}
              <h1 className="hero-title animate__animated animate__fadeInUp">
                <span className="gradient-connect">Connect.</span> <span className="gradient-share">Share.</span> Belong
              </h1>
              <p className="hero-description animate__animated animate__fadeInUp">
                Find and connect with people who share your interests. Discover communities, share your thoughts, and build meaningful connections every day.
              </p>
              <div className="animate__animated animate__fadeInUp">
                <Link to="/posts" className="hero-btn-explore">
                  <span>Explore</span>
                  <i className="fa-solid fa-compass"></i>
                </Link>
              </div>
            </div>
          </div>

          {/* Carousel Arrows */}
          <button className="carousel-control-prev" type="button" data-bs-target="#heroCarousel" data-bs-slide="prev" style={{ zIndex: 3 }}>
            <span className="carousel-control-prev-icon" aria-hidden="true"></span>
            <span className="visually-hidden">Previous</span>
          </button>
          <button className="carousel-control-next" type="button" data-bs-target="#heroCarousel" data-bs-slide="next" style={{ zIndex: 3 }}>
            <span className="carousel-control-next-icon" aria-hidden="true"></span>
            <span className="visually-hidden">Next</span>
          </button>
        </div>
      </section>
    </div>
  );
}

