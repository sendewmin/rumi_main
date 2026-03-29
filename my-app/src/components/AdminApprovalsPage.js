import React, { useState } from 'react';
import { Clock, CheckCircle, XCircle, Hash } from 'lucide-react';
import './AdminDashboard.css';

const StatCard = ({ value, label, colorClass, icon }) => (
  <div className="ad-stat-card">
    <div className={`ad-stat-icon-wrap ${colorClass}`}>{icon}</div>
    <div className="ad-stat-info">
      <p className="ad-stat-value">{value}</p>
      <p className="ad-stat-label">{label}</p>
    </div>
  </div>
);

const AdminApprovalsPage = ({ 
  pendingListings, 
  statistics, 
  onApprove, 
  onReject 
}) => {
  const [selectedListingForReject, setSelectedListingForReject] = useState(null);
  const [rejectReason, setRejectReason] = useState('');

  const handleReject = async () => {
    if (!rejectReason.trim()) {
      alert('Please provide a rejection reason');
      return;
    }
    await onReject(selectedListingForReject, rejectReason);
    setRejectReason('');
    setSelectedListingForReject(null);
  };

  return (
    <div>
      {/* Topbar */}
      <div className="ad-topbar">
        <div>
          <h1 className="ad-page-title">Listings for Approval</h1>
          <p className="ad-page-subtitle">
            {pendingListings.length} listing{pendingListings.length !== 1 ? 's' : ''} awaiting your review
          </p>
        </div>
        <div className="ad-topbar-right">
          <div className="ad-admin-chip">
            <div className="ad-admin-avatar">AD</div>
            <span className="ad-admin-label">Admin</span>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="ad-stats-grid">
        <StatCard 
          value={statistics.pending} 
          label="Pending" 
          colorClass="ad-stat-pending"
          icon={<Clock size={24} />}
        />
        <StatCard 
          value={statistics.approved} 
          label="Approved" 
          colorClass="ad-stat-approved"
          icon={<CheckCircle size={24} />}
        />
        <StatCard 
          value={statistics.rejected} 
          label="Rejected" 
          colorClass="ad-stat-rejected"
          icon={<XCircle size={24} />}
        />
        <StatCard 
          value={statistics.total} 
          label="Total" 
          colorClass="ad-stat-total"
          icon={<Hash size={24} />}
        />
      </div>

      {/* Approvals Grid */}
      {pendingListings.length === 0 ? (
        <div style={{padding: '2rem', textAlign: 'center', color: '#94a3b8'}}>
          <p>No pending listings to review</p>
        </div>
      ) : (
        <div className="ad-approvals-grid">
          {pendingListings.map(listing => (
            <div key={listing.roomId} className="ad-approval-card">
              <div className="ad-approval-img-wrap">
                <div className="ad-approval-img" style={{backgroundColor: '#e2e8f0'}}>
                  {listing.roomId}
                </div>
              </div>
              <div className="ad-approval-body">
                <div className="ad-approval-top">
                  <div>
                    <p className="ad-approval-title">{listing.roomTitle}</p>
                    <p className="ad-approval-sub">
                      {listing.address?.city}, {listing.address?.country}
                    </p>
                    <p className="ad-approval-sub" style={{marginTop: '2px'}}>
                      by {listing.renter?.full_name || 'Unknown Renter'}
                    </p>
                  </div>
                  <span className="ad-badge ad-badge-pending">Pending</span>
                </div>
                <div className="ad-approval-footer">
                  <span className="ad-approval-price">
                    LKR {listing.price?.amount?.toLocaleString('en-LK') || 'N/A'} / mo
                  </span>
                  <span className="ad-approval-meta">{listing.roomType}</span>
                  <div className="ad-approval-actions">
                    <button 
                      className="ad-btn ad-btn-approve"
                      onClick={() => onApprove(listing.roomId)}
                    >
                      <CheckCircle size={16} style={{marginRight: '0.5rem'}} />
                      Approve
                    </button>
                    <button 
                      className="ad-btn ad-btn-reject"
                      onClick={() => setSelectedListingForReject(listing.roomId)}
                    >
                      <XCircle size={16} style={{marginRight: '0.5rem'}} />
                      Reject
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Reject Modal */}
      {selectedListingForReject && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex',
          alignItems: 'center', justifyContent: 'center', zIndex: 999
        }}>
          <div style={{
            backgroundColor: 'white', borderRadius: '8px', padding: '2rem',
            minWidth: '400px', boxShadow: '0 10px 25px rgba(0,0,0,0.2)'
          }}>
            <h2 style={{marginBottom: '1rem'}}>Reject Listing</h2>
            <p style={{marginBottom: '1rem', color: '#64748b'}}>
              Please provide a reason for rejection:
            </p>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Reason for rejection..."
              style={{
                width: '100%', minHeight: '100px', padding: '0.5rem',
                border: '1px solid #cbd5e1', borderRadius: '4px',
                fontFamily: 'inherit', marginBottom: '1rem'
              }}
            />
            <div style={{display: 'flex', gap: '0.5rem', justifyContent: 'flex-end'}}>
              <button
                className="ad-btn ad-btn-dismiss"
                onClick={() => setSelectedListingForReject(null)}
              >
                Cancel
              </button>
              <button
                className="ad-btn ad-btn-remove"
                onClick={handleReject}
              >
                Reject
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminApprovalsPage;
