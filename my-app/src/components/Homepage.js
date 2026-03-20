import React from "react";
import Hero from './Hero';
import CategoryCarousel from './CategoryCarousel';
import PlaceScroller from './PlaceScroller';
import Home_statement from './Home_statement';
import './HomepageModern.css';

const HomeStatement = Home_statement;

const trustStats = [
  { value: '12K+', label: 'Active listings',  icon: '🏠' },
  { value: '4.8★', label: 'Average rating',   icon: '⭐' },
  { value: '120+', label: 'Neighborhoods',     icon: '📍' },
];

const navLinks = ['Browse Rooms', 'Popular Areas', 'How it Works'];

export default function Homepage() {
  return (
    <section className="hp-shell">
      <div className="hp-container">

        {/* ── Navbar ── */}
        <header className="hp-navbar">
          <div className="hp-brand">
            <div className="hp-logo">
              <span className="hp-logo-text">RUMI</span>
            </div>
            <div>
              <p className="hp-brand-name">Rumi Rentals</p>
              <p className="hp-brand-tag">Find rooms that feel like home</p>
            </div>
          </div>

          <nav className="hp-nav" aria-label="Primary navigation">
            {navLinks.map(link => (
              <span className="hp-nav-link" key={link}>{link}</span>
            ))}
          </nav>
        </header>

        {/* ── Hero ── */}
        <div className="hp-hero-wrap">
          <Hero />
        </div>

        {/* ── Full-width search bar (booking.com style) ── */}
        <div className="hp-search-wrap">
          <form className="hp-search" onSubmit={e => e.preventDefault()} aria-label="Search for rooms">
            <div className="hp-sf">
              <label className="hp-sf-label" htmlFor="sf-city">📍 City</label>
              <select className="hp-sf-select" id="sf-city">
                <option>Colombo</option>
                <option>Kandy</option>
                <option>Galle</option>
                <option>Negombo</option>
                <option>Jaffna</option>
              </select>
            </div>

            <div className="hp-sf-div" aria-hidden="true" />

            <div className="hp-sf">
              <label className="hp-sf-label" htmlFor="sf-type">🏠 Room type</label>
              <select className="hp-sf-select" id="sf-type">
                <option>Any type</option>
                <option>Room</option>
                <option>Annex</option>
                <option>House</option>
                <option>Apartment</option>
                <option>Boarding</option>
              </select>
            </div>

            <div className="hp-sf-div" aria-hidden="true" />

            <div className="hp-sf">
              <label className="hp-sf-label" htmlFor="sf-budget">💰 Budget (LKR)</label>
              <select className="hp-sf-select" id="sf-budget">
                <option>Any budget</option>
                <option>Under 30k</option>
                <option>30k – 60k</option>
                <option>60k – 120k</option>
                <option>120k+</option>
              </select>
            </div>

            <button type="submit" className="hp-sf-btn">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true" style={{ flexShrink: 0 }}>
                <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2.5" />
                <path d="m16.5 16.5 3.5 3.5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
              </svg>
              Search
            </button>
          </form>
        </div>

        {/* ── Trust stats ── */}
        <div className="hp-stats-bar">
          {trustStats.map((s, i) => (
            <article
              className="hp-stat"
              key={s.label}
              style={{ '--i': i }}
            >
              <span className="hp-stat-icon" aria-hidden="true">{s.icon}</span>
              <strong className="hp-stat-value">{s.value}</strong>
              <span className="hp-stat-label">{s.label}</span>
            </article>
          ))}
        </div>

        {/* ── Browse by Category ── */}
        <div className="hp-section">
          <div className="hp-section-hd">
            <h2 className="hp-section-title">Browse by Category</h2>
            <p className="hp-section-desc">Find the type of space that suits your lifestyle</p>
          </div>
          <CategoryCarousel />
        </div>

        {/* ── Statement banner ── */}
        <div className="hp-statement">
          <HomeStatement />
        </div>

        {/* ── Popular Areas ── */}
        <div className="hp-section hp-section--last">
          <div className="hp-section-hd">
            <h2 className="hp-section-title">Popular Areas</h2>
            <p className="hp-section-desc">Trending neighborhoods across Sri Lanka</p>
          </div>
          <PlaceScroller />
        </div>

      </div>
    </section>
  );
}
