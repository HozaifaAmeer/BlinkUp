import React from "react";
import img1 from "../../assets/categories/auth1.jpg";
import img2 from "../../assets/categories/aut.jpg";
import img3 from "../../assets/categories/auth.jpg";

export default function Choose() {
  const cards = [
    {
      title: "New Discoveries",
      description: "Explore and discover brand new hubs, trending topics, and growing niche communities that align with your unique personal and professional interests.",
      image: img1,
    },
    {
      title: "Authentic Reviews",
      description: "Read genuine feedback, evaluations, and discussion history from existing BlinkUp members to find high-quality, highly engaging safe spaces.",
      image: img2,
    },
    {
      title: "Share Experience",
      description: "Contribute to the collective pool of knowledge by sharing your personal journey, rating resources, and engaging in constructive conversations.",
      image: img3,
    }
  ];

  return (
    <section className="choose-section">
      <div className="container">
        <div className="text-center mb-5">
          <h2 className="fw-bold fs-1" style={{ letterSpacing: "-1px" }}>
            Why choose <span className="brand-text-highlight">BlinkUp</span>?
          </h2>
          <p className="text-muted mx-auto" style={{ maxWidth: "600px" }}>
            We provide a modern platform centered on genuine community growth, helpful reviews, and mutual sharing.
          </p>
        </div>

        <div className="row g-4 justify-content-center">
          {cards.map((card, index) => (
            <div key={index} className="col-lg-4 col-md-6">
              <div className="choose-card">
                <div className="choose-card-img-wrapper">
                  <img
                    src={card.image}
                    alt={card.title}
                    className="choose-card-img"
                    loading="lazy"
                  />
                </div>
                <div className="choose-card-body">
                  <h3 className="choose-card-title">{card.title}</h3>
                  <p className="choose-card-text">{card.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
