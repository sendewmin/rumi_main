import React from "react";

import Hero from "./Hero";
import CategoryCarousel from "./CategoryCarousel";
import PlaceScroller from "./PlaceScroller";
import Home_statement from "./Home_statement";
import "./HomepageModern.css";
import { supabase } from "../auth/supabaseClient";
import { useAuth } from "../auth/AuthContext";

const HomeStatement = Home_statement;

const quickSections = [
  { label: "Explore", icon: "01" },
  { label: "Types", icon: "02" },
  { label: "Cities", icon: "03" },
  { label: "Saved", icon: "04" },
];

const trustStats = [
  { value: "12K+", label: "Active listings" },
  { value: "4.8/5", label: "Tenant rating" },
  { value: "120+", label: "Neighborhoods" },
];

export default function Homepage() {
  const { user } = useAuth();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    // AuthContext detects logout, App.js redirects to /login automatically
  };

  return (
    <section className="homepage-shell">
      <div className="homepage-modern-container">
        <header className="homepage-topbar">
          <div className="homepage-brand">
            <div className="homepage-logo">
              <span className="homepage-logo-text">RUMI</span>
            </div>
            <div>
              <p className="homepage-brand-title">Rumi Rentals</p>
              <p className="homepage-brand-subtitle">
                Find rooms that feel like home
              </p>
            </div>
          </div>

          <div className="homepage-chip-row" aria-label="Quick sections">
            {quickSections.map((item, index) => (
              <span
                className="homepage-chip"
                key={item.label}
                style={{ "--chip-delay": `${index * 80 + 80}ms` }}
              >
                <span className="homepage-chip-icon">{item.icon}</span>
                {item.label}
              </span>
            ))}
          </div>

          {user && (
            <button
              onClick={handleSignOut}
              style={{
                padding: "8px 20px",
                background: "#000",
                color: "#fff",
                border: "none",
                borderRadius: 8,
                fontSize: 14,
                cursor: "pointer",
                fontWeight: "bold",
                whiteSpace: "nowrap",
              }}
            >
              Sign Out
            </button>
          )}
        </header>

        <div
          className="homepage-search-ribbon"
          aria-label="Search controls preview"
        >
          <span className="homepage-search-heading">Quick Search</span>
          <span
            className="homepage-search-pill"
            style={{ "--pill-delay": "120ms" }}
          >
            Where: Colombo
          </span>
          <span
            className="homepage-search-pill"
            style={{ "--pill-delay": "180ms" }}
          >
            Type: Apartment
          </span>
          <span
            className="homepage-search-pill"
            style={{ "--pill-delay": "240ms" }}
          >
            Budget: LKR 50k - 120k
          </span>
          <button type="button" className="homepage-search-btn">
            Search
          </button>
        </div>

        <div className="homepage-hero-wrap">
          <Hero />
        </div>

        <div className="homepage-stats-grid">
          {trustStats.map((item, index) => (
            <article
              className="homepage-stat-card"
              key={item.label}
              style={{ "--stat-delay": `${index * 100 + 140}ms` }}
            >
              <p className="homepage-stat-value">{item.value}</p>
              <p className="homepage-stat-label">{item.label}</p>
            </article>
          ))}
        </div>

        <div className="homepage-section-card">
          <h3 className="homepage-section-title">Browse by Category</h3>
          <CategoryCarousel />
        </div>

        <div className="homepage-section-card homepage-statement-wrap">
          <HomeStatement />
        </div>

        <div className="homepage-section-card">
          <h3 className="homepage-section-title">Popular Areas</h3>
          <PlaceScroller />
        </div>
      </div>
    </section>
  );
}
