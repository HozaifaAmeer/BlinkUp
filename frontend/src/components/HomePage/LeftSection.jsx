import React from "react";
import { Link } from "react-router-dom";

export default function LeftSection({ category, isAlt = false }) {
  if (!category) return null;

  return (
    <section className={`category-section ${isAlt ? "category-section-alt" : ""}`}>
      <div className="container">
        <div className="row align-items-center category-card mb-0">
          {/* Image Left */}
          <div className="col-md-5 mb-4 mb-md-0">
            <div className="category-image-container">
              <img
                src={category.image}
                alt={category.title}
                className="category-image"
                loading="lazy"
              />
            </div>
          </div>
          {/* Content Right */}
          <div className="col-md-7 ps-md-5">
            <span className="category-meta-tag">{category.tag}</span>
            <h3 className="category-heading">{category.title}</h3>
            <p className="category-text">{category.description}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
