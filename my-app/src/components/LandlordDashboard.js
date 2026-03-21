import React, { useState } from 'react';
import './LandlordDashboard.css';
import { useNavigate } from 'react-router-dom';

const mockListings = [
  {
    id: 1,
    title: 'Studio Room — Colombo 3',
    location: 'Colombo 3, Western Province',
    price: 'LKR 45,000 / mo',
    type: 'Studio',
    bedrooms: 1,
    status: 'active',
    image: 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=400&h=260',
  },
  {
    id: 2,
    title: '2BR Apartment — Kandy',
    location: 'Kandy, Central Province',
    price: 'LKR 85,000 / mo',
    type: 'Apartment',
    bedrooms: 2,
    status: 'active',
    image: 'https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?auto=compress&cs=tinysrgb&w=400&h=260',
  },
  {
    id: 3,
    title: 'Annex — Galle',
    location: 'Galle, Southern Province',
    price: 'LKR 35,000 / mo',
    type: 'Annex',
    bedrooms: 1,
    status: 'review',
    image: 'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=400&h=260',
  },
];

const stats = [
  { label: 'Total Listings', value: 3 },
  { label: 'Active', value: 2 },
  { label: 'In Review', value: 1 },
];

const ListingCard = ({ listing, onEdit }) => (
  <div className="ld-listing-card">
    <img src={listing.image} alt={listing.title} className="ld-listing-img" />
    <div className="ld-listing-body">
      <div className="ld-listing-top">
        <div>
          <p className="ld-listing-title">{listing.title}</p>
          <p className="ld-listing-location">{listing.location}</p>
        </div>
        <span className={`ld-badge ${listing.status === 'active' ? 'ld-badge-active' : 'ld-badge-review'}`}>
          {listing.status === 'active' ? 'Active' : 'Pending Review'}
        </span>
      </div>
      <div className="ld-listing-footer">
        <span className="ld-listing-price">{listing.price}</span>
        <div className="ld-listing-meta">
          <span className="ld-listing-type">{listing.type}</span>
          <span className="ld-dot">·</span>
          <span className="ld-listing-type">{listing.bedrooms} BD</span>
        </div>
        <button className="ld-edit-btn" onClick={() => onEdit(listing)}>Edit</button>
      </div>
    </div>
  </div>
);

const LandlordDashboard = () => {
  const navigate = useNavigate();
  const [listings] = useState(mockListings);

  const active = listings.filter(l => l.status === 'active');
  const inReview = listings.filter(l => l.status === 'review');

  const handleEdit = (listing) => {
    console.log('Edit listing:', listing.id);
  };

  return (
    <div className="ld-page">
      {/* ── Left image panel ── */}
      <div className="ld-image-section">
        <div className="ld-logo-section">
          <div className="ld-logo"><span className="ld-logo-text">RUMI</span></div>
        </div>
        <img
          src="https://images.pexels.com/photos/259588/pexels-photo-259588.jpeg?auto=compress&cs=tinysrgb&h=900&w=600"
          alt="Property"
          className="ld-bg-image"
        />
        <div className="ld-image-overlay">
          <div className="ld-overlay-badge">Landlord</div>
          <div className="ld-overlay-text">
            <h2>Welcome back,</h2>
            <h2>Landlord</h2>
            <p className="ld-overlay-sub">Manage your spaces with ease</p>
          </div>
        </div>
      </div>

      {/* ── Right dashboard panel ── */}
      <div className="ld-dashboard-section">
        {/* Header row */}
        <div className="ld-dashboard-header">
          <div>
            <h2 className="ld-dashboard-title">Landlord Dashboard</h2>
            <p className="ld-dashboard-subtitle">Your property overview</p>
          </div>
          <button className="ld-logout-btn" onClick={() => navigate('/login')}>Logout</button>
        </div>

        {/* Stats row */}
        <div className="ld-stats-row">
          {stats.map(s => (
            <div className="ld-stat-card" key={s.label}>
              <p className="ld-stat-value">{s.value}</p>
              <p className="ld-stat-label">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Current Listings */}
        <div className="ld-section">
          <h3 className="ld-section-title">Current Listings</h3>
          {active.length > 0 ? (
            <div className="ld-listings-list">
              {active.map(l => (
                <ListingCard key={l.id} listing={l} onEdit={handleEdit} />
              ))}
            </div>
          ) : (
            <p className="ld-empty">No active listings yet.</p>
          )}
        </div>

        {/* Listings in Review */}
        <div className="ld-section">
          <h3 className="ld-section-title">Listings in Review</h3>
          {inReview.length > 0 ? (
            <div className="ld-listings-list">
              {inReview.map(l => (
                <ListingCard key={l.id} listing={l} onEdit={handleEdit} />
              ))}
            </div>
          ) : (
            <p className="ld-empty">No listings in review.</p>
          )}
        </div>

        {/* Post New Listing CTA */}
        <button className="ld-post-btn" onClick={() => navigate('/landlord')}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
            <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
          </svg>
          Post New Listing
        </button>
      </div>
    </div>
  );
};

export default LandlordDashboard;
