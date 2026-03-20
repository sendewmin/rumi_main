import React from "react";
import "./Hero.css";
import heroImage from "./hero-image.png";
import { useNavigate } from "react-router-dom";

export default function Hero() {
  const navigate = useNavigate();

  return (
    <section className="hero">
      <div className="hero-content">
        <h1 className="her_1">Pick it</h1>
        <h1 className="her_2">Rent it</h1>
        <h1 className="her_3">Enjoy it</h1>

        <div className="hero-cta-row">
          <button className="hero-post-btn" onClick={() => navigate("/login")}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
              <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
            Post Ad
          </button>
        </div>
      </div>

      <div className="hero-image">
        <img src={heroImage} alt="Furniture" />
      </div>
    </section>
  );
}
