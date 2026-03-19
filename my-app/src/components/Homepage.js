import React, { useState, useRef, useEffect } from "react";

import Hero from "./Hero";
import CategoryCarousel from "./CategoryCarousel";
import PlaceScroller from "./PlaceScroller";
import Home_statement from "./Home_statement";
import "./HomepageModern.css";
import { supabase } from "../auth/supabaseClient";
import { useAuth } from "../auth/AuthContext";

const HomeStatement = Home_statement;

const trustStats = [
  { value: "12K+", label: "Active listings" },
  { value: "4.8/5", label: "Tenant rating" },
  { value: "120+", label: "Neighborhoods" },
];

export default function Homepage() {
  const { user, profile } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target))
        setDropdownOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  const initials = profile
    ? `${profile.first_name?.[0] ?? ""}${profile.last_name?.[0] ?? ""}`.toUpperCase()
    : (user?.email?.[0].toUpperCase() ?? "?");

  return (
    <section className="homepage-shell">
      <div className="homepage-modern-container">
        {/* ── Navbar ── */}
        <div className="navbar-container">
          <div className="navbar">
            {/* Logo */}
            <div className="logo">
              <img src="./rumi.png" alt="RUMI Logo" className="logo-icon" />
            </div>

            {/* Nav links */}
            <ul className={`nav-links ${menuOpen ? "open" : ""}`}>
              <li>
                <a
                  href="#"
                  className="active"
                  onClick={() => setMenuOpen(false)}
                >
                  Home
                </a>
              </li>
            </ul>

            {/* Profile avatar + dropdown */}
            {user && (
              <div
                ref={dropdownRef}
                style={{ position: "relative", marginLeft: 16 }}
              >
                {/* Avatar */}
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: "50%",
                    background: "#004a99",
                    color: "#fff",
                    border: "none",
                    cursor: "pointer",
                    fontSize: 15,
                    fontWeight: "bold",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {initials}
                </button>

                {/* Dropdown */}
                {dropdownOpen && (
                  <div
                    style={{
                      position: "absolute",
                      top: 48,
                      right: 0,
                      background: "#fff",
                      borderRadius: 12,
                      boxShadow: "0 8px 32px rgba(0,0,0,0.15)",
                      border: "1px solid #eee",
                      minWidth: 220,
                      zIndex: 1000,
                      overflow: "hidden",
                    }}
                  >
                    {/* Header */}
                    <div
                      style={{
                        padding: "16px",
                        background: "#004a99",
                        display: "flex",
                        alignItems: "center",
                        gap: 12,
                      }}
                    >
                      <div
                        style={{
                          width: 44,
                          height: 44,
                          borderRadius: "50%",
                          background: "rgba(255,255,255,0.2)",
                          color: "#fff",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: 18,
                          fontWeight: "bold",
                          border: "2px solid rgba(255,255,255,0.4)",
                        }}
                      >
                        {initials}
                      </div>
                      <div>
                        <p
                          style={{
                            color: "#fff",
                            fontWeight: 700,
                            fontSize: 15,
                            margin: 0,
                          }}
                        >
                          {profile?.first_name} {profile?.last_name}
                        </p>
                        <p
                          style={{
                            color: "rgba(255,255,255,0.7)",
                            fontSize: 12,
                            margin: 0,
                          }}
                        >
                          {profile?.role ?? "User"}
                        </p>
                      </div>
                    </div>

                    {/* Details */}
                    <div
                      style={{
                        padding: "12px 16px",
                        borderBottom: "1px solid #f0f0f0",
                      }}
                    >
                      {[
                        {
                          label: "Email",
                          value: profile?.email ?? user?.email,
                        },
                        { label: "Age", value: profile?.age },
                        { label: "Phone", value: profile?.phone ?? "—" },
                      ].map((row) => (
                        <div
                          key={row.label}
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            padding: "6px 0",
                            borderBottom: "1px solid #f9f9f9",
                          }}
                        >
                          <span style={{ fontSize: 12, color: "#999" }}>
                            {row.label}
                          </span>
                          <span
                            style={{
                              fontSize: 13,
                              fontWeight: 600,
                              color: "#333",
                              maxWidth: 140,
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {row.value}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Sign out */}
                    <button
                      onClick={handleSignOut}
                      style={{
                        width: "100%",
                        padding: "12px 16px",
                        background: "#fff",
                        border: "none",
                        cursor: "pointer",
                        textAlign: "left",
                        fontSize: 14,
                        fontWeight: 600,
                        color: "#e53e3e",
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.background = "#fff5f5")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.background = "#fff")
                      }
                    >
                      ⎋ Sign Out
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Hamburger */}
            <div
              className={`hamburger ${menuOpen ? "active" : ""}`}
              onClick={() => setMenuOpen(!menuOpen)}
            >
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        </div>

        {/* ── Page content ── */}
        <div className="homepage-inner">
          {/* Search ribbon */}
          <div className="homepage-search-ribbon">
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

          {/* Hero */}
          <div className="homepage-hero-wrap">
            <Hero />
          </div>

          {/* Trust stats */}
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

          {/* Category browsing */}
          <div className="homepage-section-card">
            <h3 className="homepage-section-title">Browse by Category</h3>
            <CategoryCarousel />
          </div>

          {/* Home statement */}
          <div className="homepage-section-card homepage-statement-wrap">
            <HomeStatement />
          </div>

          {/* Popular areas */}
          <div className="homepage-section-card">
            <h3 className="homepage-section-title">Popular Areas</h3>
            <PlaceScroller />
          </div>
        </div>
      </div>
    </section>
  );
}
