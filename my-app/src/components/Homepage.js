import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import Hero from './Hero';
import CategoryCarousel from './CategoryCarousel';
import PlaceScroller from './PlaceScroller';
import Home_statement from './Home_statement';
import RoomCard from './RoomCard';
import { mockRooms } from './mockRooms';
import './HomepageModern.css';

const HomeStatement = Home_statement;

const trustStats = [
  { value: '12K+', label: 'Active listings',  icon: '🏠' },
  { value: '4.8★', label: 'Average rating',   icon: '⭐' },
  { value: '120+', label: 'Neighborhoods',     icon: '📍' },
];

const desktopNavLinks = [
  { label: 'Browse Rooms',  to: '/rooms' },
  { label: 'Share a Room',  to: '/share' },
  { label: 'How it Works',  to: '/how-it-works' },
  { label: 'List Your Space', to: '/signup/landlord' },
];

export default function Homepage() {
  const [mobileOpen,  setMobileOpen]  = useState(false);
  const [signupOpen,  setSignupOpen]  = useState(false);
  const signupRef = useRef(null);

  /* Close signup dropdown when clicking outside */
  useEffect(() => {
    const handler = (e) => {
      if (signupRef.current && !signupRef.current.contains(e.target)) {
        setSignupOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  /* Lock body scroll when mobile drawer is open */
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  return (
    <section className="hp-shell">
      <div className="hp-container">

        {/* ══ Navbar ══ */}
        <header className="hp-navbar">

          {/* Brand */}
          <Link to="/" className="hp-brand-link" aria-label="Rumi Rentals home">
            <div className="hp-brand">
              <div className="hp-logo">
                <span className="hp-logo-text">RUMI</span>
              </div>
              <div>
                <p className="hp-brand-name">Rumi Rentals</p>
                <p className="hp-brand-tag">Find rooms that feel like home</p>
              </div>
            </div>
          </Link>

          {/* Desktop navigation */}
          <nav className="hp-nav" aria-label="Primary navigation">
            {desktopNavLinks.map(link => (
              <Link to={link.to} className="hp-nav-link" key={link.label}>
                {link.label}
              </Link>
            ))}
            <Link to="/popular-areas" className="hp-nav-link" onClick={e => {
              e.preventDefault();
              document.getElementById('popular-areas')?.scrollIntoView({ behavior: 'smooth' });
            }}>
              Popular Areas
            </Link>
          </nav>

          {/* Auth group */}
          <div className="hp-auth-group">
            <Link to="/login" className="hp-signin-btn">Sign In</Link>

            {/* Sign Up dropdown */}
            <div className="hp-signup-wrap" ref={signupRef}>
              <button
                className="hp-cta-btn"
                onClick={() => setSignupOpen(v => !v)}
                aria-haspopup="true"
                aria-expanded={signupOpen}
              >
                Sign Up
                <svg
                  width="10" height="7"
                  viewBox="0 0 10 7"
                  fill="none"
                  aria-hidden="true"
                  className={`hp-chevron${signupOpen ? ' hp-chevron--up' : ''}`}
                >
                  <path d="M1 1l4 4 4-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>

              {signupOpen && (
                <div className="hp-signup-dropdown" role="menu">
                  <Link
                    to="/signup/tenant"
                    className="hp-dropdown-item"
                    role="menuitem"
                    onClick={() => setSignupOpen(false)}
                  >
                    <span className="hp-dropdown-icon">👤</span>
                    <span className="hp-dropdown-text">
                      <strong>Tenant</strong>
                      <span className="hp-dropdown-sub">Find your perfect room</span>
                    </span>
                  </Link>
                  <div className="hp-dropdown-divider" />
                  <Link
                    to="/signup/landlord"
                    className="hp-dropdown-item"
                    role="menuitem"
                    onClick={() => setSignupOpen(false)}
                  >
                    <span className="hp-dropdown-icon">🏢</span>
                    <span className="hp-dropdown-text">
                      <strong>Landlord</strong>
                      <span className="hp-dropdown-sub">List and manage properties</span>
                    </span>
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile hamburger */}
            <button
              className="hp-hamburger"
              onClick={() => setMobileOpen(true)}
              aria-label="Open navigation menu"
            >
              <span />
              <span />
              <span />
            </button>
          </div>
        </header>

        {/* ══ Mobile Overlay + Drawer ══ */}
        {mobileOpen && (
          <div
            className="hp-mobile-overlay"
            onClick={() => setMobileOpen(false)}
            role="dialog"
            aria-modal="true"
            aria-label="Navigation menu"
          >
            <div
              className="hp-mobile-drawer"
              onClick={e => e.stopPropagation()}
            >
              {/* Drawer header */}
              <div className="hp-drawer-hd">
                <div className="hp-brand" style={{ gap: '0.5rem' }}>
                  <div className="hp-logo" style={{ width: 36, height: 36 }}>
                    <span className="hp-logo-text">RUMI</span>
                  </div>
                  <p className="hp-brand-name">Rumi Rentals</p>
                </div>
                <button
                  className="hp-drawer-close"
                  onClick={() => setMobileOpen(false)}
                  aria-label="Close menu"
                >
                  ✕
                </button>
              </div>

              {/* Main nav */}
              <nav className="hp-mobile-nav" aria-label="Mobile navigation">
                <Link to="/rooms"           className="hp-mob-link" onClick={() => setMobileOpen(false)}>
                  <span className="hp-mob-icon">🏠</span> Browse Rooms
                </Link>
                <Link to="/share"           className="hp-mob-link" onClick={() => setMobileOpen(false)}>
                  <span className="hp-mob-icon">🤝</span> Share a Room
                </Link>
                <Link to="/how-it-works"    className="hp-mob-link" onClick={() => setMobileOpen(false)}>
                  <span className="hp-mob-icon">❓</span> How it Works
                </Link>
                <Link to="/signup/landlord" className="hp-mob-link" onClick={() => setMobileOpen(false)}>
                  <span className="hp-mob-icon">📋</span> List Your Space
                </Link>
                <a
                  href="#popular-areas"
                  className="hp-mob-link"
                  onClick={() => {
                    setMobileOpen(false);
                    setTimeout(() => document.getElementById('popular-areas')?.scrollIntoView({ behavior: 'smooth' }), 200);
                  }}
                >
                  <span className="hp-mob-icon">📍</span> Popular Areas
                </a>
              </nav>

              {/* Auth section */}
              <div className="hp-mob-auth">
                <p className="hp-mob-auth-label">Your Account</p>
                <Link to="/login"           className="hp-mob-signin"  onClick={() => setMobileOpen(false)}>Sign In</Link>
                <Link to="/signup/tenant"   className="hp-mob-signup"  onClick={() => setMobileOpen(false)}>Sign Up as Tenant</Link>
                <Link to="/signup/landlord" className="hp-mob-signup2" onClick={() => setMobileOpen(false)}>Sign Up as Landlord</Link>
              </div>

              {/* Footer links */}
              <div className="hp-mob-footer">
                <Link to="/dashboard/landlord" className="hp-mob-footer-link" onClick={() => setMobileOpen(false)}>
                  📊 Landlord Dashboard
                </Link>
                <Link to="/admin" className="hp-mob-footer-link" onClick={() => setMobileOpen(false)}>
                  ⚙️ Admin Console
                </Link>
              </div>
            </div>
          </div>
        )}

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

            <Link to="/rooms" className="hp-sf-btn">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true" style={{ flexShrink: 0 }}>
                <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2.5" />
                <path d="m16.5 16.5 3.5 3.5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
              </svg>
              Search
            </Link>
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

        {/* ── Featured Rooms ── */}
        <div className="hp-section">
          <div className="hp-section-hd">
            <h2 className="hp-section-title">Featured Rooms</h2>
            <p className="hp-section-desc">Handpicked stays across Sri Lanka</p>
          </div>
          <div className="hp-rooms-grid">
            {mockRooms.slice(0, 3).map(room => (
              <RoomCard key={room.id} room={room} />
            ))}
          </div>
          <div className="hp-view-all-wrap">
            <Link to="/rooms" className="hp-view-all-btn">
              View All Rooms
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
          </div>
        </div>

        {/* ── Statement banner ── */}
        <div className="hp-statement">
          <HomeStatement />
        </div>

        {/* ── Popular Areas ── */}
        <div className="hp-section hp-section--last" id="popular-areas">
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
