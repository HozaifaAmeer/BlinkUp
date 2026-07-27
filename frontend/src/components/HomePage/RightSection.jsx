import React from "react";
import { Link } from "react-router-dom";

export default function RightSection({ category, isAlt = false }) {
  if (!category) return null;

  return (
    <section className={`category-section ${isAlt ? "category-section-alt" : ""}`}>
      <div className="container">
        <div className="row align-items-center category-card mb-0">
          {/* Content Left */}
          <div className="col-md-7 pe-md-5 order-2 order-md-1">
            <span className="category-meta-tag">{category.tag}</span>
            <h3 className="category-heading">{category.title}</h3>
            <p className="category-text">{category.description}</p>
          </div>
          {/* Image Right */}
          <div className="col-md-5 mb-4 mb-md-0 order-1 order-md-2">
            <div className="category-image-container">
              <img
                src={category.image}
                alt={category.title}
                className="category-image"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
