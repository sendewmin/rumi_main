import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosClient from '../api/rumi_client';
import supabase from '../api/supabaseClient';
import { useAuth } from '../auth/AuthContext';
import './AdminDashboard.css';

/* Icons (inline SVG) */
const IconGrid = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ad-nav-icon">
    <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
    <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
  </svg>
);
const IconCheckCircle = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ad-nav-icon">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
    <polyline points="22 4 12 14.01 9 11.01"/>
  </svg>
);
const IconUsers = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ad-nav-icon">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
    <circle cx="9" cy="7" r="4"/>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
);
const IconFlag = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ad-nav-icon">
    <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/>
    <line x1="4" y1="22" x2="4" y2="15"/>
  </svg>
);
const IconLogOut = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 16, height: 16 }}>
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
    <polyline points="16 17 21 12 16 7"/>
    <line x1="21" y1="12" x2="9" y2="12"/>
  </svg>
);
const IconSearch = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 16, height: 16 }} className="ad-search-icon">
    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>
);
const IconHome = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 20, height: 20 }}>
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
  </svg>
);

/* ΓöÇΓöÇ Stat Card ΓöÇΓöÇ */
const StatCard = ({ value, label, colorClass, icon }) => (
  <div className="ad-stat-card">
    <div className={`ad-stat-icon-wrap ${colorClass}`}>{icon}</div>
    <div className="ad-stat-info">
      <p className="ad-stat-value">{value}</p>
      <p className="ad-stat-label">{label}</p>
    </div>
  </div>
);

/* ΓöÇΓöÇ Approval Card ΓöÇΓöÇ */
const ApprovalCard = ({ listing, onApprove, onReject }) => (
  <div className="ad-approval-card">
    <img src={listing.image} alt={listing.title} className="ad-approval-img" />
    <div className="ad-approval-body">
      <div className="ad-approval-top">
        <div>
          <p className="ad-approval-title">{listing.title}</p>
          <p className="ad-approval-sub">≡ƒôì {listing.location} ┬╖ by {listing.landlord}</p>
          <p className="ad-approval-sub" style={{ marginTop: '2px' }}>Submitted: {listing.submittedDate}</p>
        </div>
        <span className="ad-badge ad-badge-pending">Pending</span>
      </div>
      <div className="ad-approval-footer">
        <span className="ad-approval-price">{listing.price}</span>
        <span className="ad-approval-meta">{listing.type}</span>
        <div className="ad-approval-actions">
          <button className="ad-btn ad-btn-approve" onClick={() => onApprove(listing.id)}>Γ£ô Approve</button>
          <button className="ad-btn ad-btn-reject"  onClick={() => onReject(listing.id)}>Γ£ò Reject</button>
        </div>
      </div>
    </div>
  </div>
);

/* ΓöÇΓöÇ User Row ΓöÇΓöÇ */
const UserRow = ({ user, onToggleBan }) => {
  const initials = user.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
  return (
    <div className="ad-user-row">
      <div className="ad-user-info">
        <div className="ad-user-avatar">{initials}</div>
        <div>
          <p className="ad-user-name">{user.name}</p>
        </div>
      </div>
      <span className="ad-user-email">{user.email}</span>
      <span className={`ad-badge ${user.role === 'landlord' ? 'ad-badge-landlord' : 'ad-badge-tenant'}`}>
        {user.role}
      </span>
      <span className="ad-user-joined">{user.joined}</span>
      <div className="ad-user-actions">
        <span className={`ad-badge ${user.status === 'active' ? 'ad-badge-active' : 'ad-badge-banned'}`} style={{ marginRight: '0.4rem' }}>
          {user.status}
        </span>
        <button
          className={`ad-btn ${user.status === 'active' ? 'ad-btn-ban' : 'ad-btn-unban'}`}
          onClick={() => onToggleBan(user.id)}
        >
          {user.status === 'active' ? 'Ban' : 'Unban'}
        </button>
      </div>
    </div>
  );
};

/* ΓöÇΓöÇ Report Card ΓöÇΓöÇ */
const ReportCard = ({ report, onDismiss, onRemove }) => (
  <div className="ad-report-card">
    <div className="ad-report-header">
      <div className="ad-report-flag">
        <IconFlag />
      </div>
      <div>
        <p className="ad-report-listing-title">{report.listingTitle}</p>
        <p className="ad-report-landlord">by {report.landlord}</p>
      </div>
      <span className="ad-report-count-badge">{report.reportCount} reports</span>
    </div>
    <div className="ad-report-body">
      <p className="ad-report-reason">
        <span>Reason:</span> {report.reason}
      </p>
      <p className="ad-report-reason" style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
        First reported by {report.reportedBy} ┬╖ {report.date}
      </p>
      <div className="ad-report-actions">
        <button className="ad-btn ad-btn-dismiss" onClick={() => onDismiss(report.id)}>Dismiss</button>
        <button className="ad-btn ad-btn-remove"  onClick={() => onRemove(report.id)}>Remove Listing</button>
      </div>
    </div>
  </div>
);

/* ΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉ
   Main Component - Admin Dashboard
ΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉ */
const AdminDashboard = () => {
  const navigate = useNavigate();
  const { profile, loading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState('approvals');
  
  const [pendingListings, setPendingListings] = useState([]);
  const [users, setUsers] = useState([]);
  const [statistics, setStatistics] = useState({ pending: 0, approved: 0, rejected: 0, total: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [rejectReason, setRejectReason] = useState('');
  const [selectedListingForReject, setSelectedListingForReject] = useState(null);

  // Get auth token
  const getAuthHeader = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.access_token) throw new Error('Not authenticated');
    return `Bearer ${session.access_token}`;
  };

  // Fetch initial data
  useEffect(() => {
    const fetchData = async () => {
      if (authLoading) return;
      
      if (profile?.role !== 'ADMIN') {
        setError('Access denied. Admin privileges required.');
        return;
      }

      try {
        setLoading(true);
        const token = await getAuthHeader();
        
        // Fetch pending listings
        const listingsResponse = await axiosClient.get('/admin/listings/pending?page=0&size=100', {
          headers: { Authorization: token }
        });
        setPendingListings(listingsResponse.data.content || []);
        
        // Fetch statistics
        const statsResponse = await axiosClient.get('/admin/statistics', {
          headers: { Authorization: token }
        });
        setStatistics(statsResponse.data);
        
        // Fetch users
        const usersResponse = await axiosClient.get('/admin/users?page=0&size=100', {
          headers: { Authorization: token }
        });
        setUsers(usersResponse.data.content || []);
      } catch (err) {
        console.error('Error fetching admin data:', err);
        setError('Failed to load admin dashboard');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [authLoading, profile]);

  // Handle approve
  const handleApprove = async (roomId) => {
    try {
      const token = await getAuthHeader();
      await axiosClient.put(`/admin/listings/${roomId}/approve`, {}, {
        headers: { Authorization: token }
      });
      // Refresh data
      setPendingListings(prev => prev.filter(l => l.roomId !== roomId));
      setStatistics(prev => ({
        ...prev,
        pending: prev.pending - 1,
        approved: prev.approved + 1
      }));
    } catch (err) {
      console.error('Error approving listing:', err);
      alert('Failed to approve listing');
    }
  };

  // Handle reject
  const handleReject = async (roomId) => {
    if (!rejectReason.trim()) {
      alert('Please provide a rejection reason');
      return;
    }
    try {
      const token = await getAuthHeader();
      await axiosClient.put(`/admin/listings/${roomId}/reject`, 
        { reason: rejectReason },
        { headers: { Authorization: token } }
      );
      // Refresh data
      setPendingListings(prev => prev.filter(l => l.roomId !== roomId));
      setRejectReason('');
      setSelectedListingForReject(null);
      setStatistics(prev => ({
        ...prev,
        pending: prev.pending - 1,
        rejected: prev.rejected + 1
      }));
    } catch (err) {
      console.error('Error rejecting listing:', err);
      alert('Failed to reject listing');
    }
  };

  // Handle ban user
  const handleBanUser = async (userId) => {
    try {
      const token = await getAuthHeader();
      await axiosClient.put(`/admin/users/${userId}/ban`, {}, {
        headers: { Authorization: token }
      });
      // Update local state
      setUsers(prev => prev.map(u => 
        u.userId === userId ? { ...u, status: 'SUSPENDED' } : u
      ));
    } catch (err) {
      console.error('Error banning user:', err);
      alert('Failed to ban user');
    }
  };

  // Handle unban user
  const handleUnbanUser = async (userId) => {
    try {
      const token = await getAuthHeader();
      await axiosClient.put(`/admin/users/${userId}/unban`, {}, {
        headers: { Authorization: token }
      });
      // Update local state
      setUsers(prev => prev.map(u => 
        u.userId === userId ? { ...u, status: 'ACTIVE' } : u
      ));
    } catch (err) {
      console.error('Error unbanning user:', err);
      alert('Failed to unban user');
    }
  };

  /* Display error or loading */
  if (authLoading || loading) return <div className="ad-shell"><p style={{padding: '2rem'}}>Loading...</p></div>;
  if (error) return <div className="ad-shell"><p style={{padding: '2rem', color: 'red'}}>{error}</p></div>;
  if (profile?.role !== 'ADMIN') {
    return (
      <div className="ad-shell">
        <p style={{padding: '2rem', color: 'red'}}>Access Denied. Admin role required.</p>
      </div>
    );
  }

  return (
    <div className="ad-shell">
      {/* Sidebar */}
      <aside className="ad-sidebar">
        <div className="ad-sidebar-brand">
          <div className="ad-logo"><span className="ad-logo-text">RUMI</span></div>
          <div>
            <p className="ad-brand-name">Rumi Rentals</p>
            <p className="ad-brand-tag">Admin Console</p>
          </div>
        </div>

        <span className="ad-admin-badge">Admin Panel</span>

        <nav className="ad-nav">
          <button className="ad-nav-item active" onClick={() => setActiveTab('approvals')}>
            <IconCheckCircle />
            <span>Pending Approvals</span>
            {pendingListings.length > 0 && <span className="ad-nav-badge">{pendingListings.length}</span>}
          </button>
          <button className="ad-nav-item" onClick={() => setActiveTab('users')}>
            <IconUsers />
            <span>Manage Users</span>
          </button>
        </nav>

        <div className="ad-sidebar-footer">
          <button className="ad-logout-btn" onClick={() => navigate('/login')}>
            <IconLogOut />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="ad-main">
        {/* Topbar */}
        <div className="ad-topbar">
          <div>
            <h1 className="ad-page-title">Listings for Approval</h1>
            <p className="ad-page-subtitle">{pendingListings.length} listing{pendingListings.length !== 1 ? 's' : ''} awaiting your review</p>
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
            icon={<span>⏳</span>}
          />
          <StatCard 
            value={statistics.approved} 
            label="Approved" 
            colorClass="ad-stat-approved"
            icon={<span>✓</span>}
          />
          <StatCard 
            value={statistics.rejected} 
            label="Rejected" 
            colorClass="ad-stat-rejected"
            icon={<span>✕</span>}
          />
          <StatCard 
            value={statistics.total} 
            label="Total" 
            colorClass="ad-stat-total"
            icon={<span>#</span>}
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
                        onClick={() => handleApprove(listing.roomId)}
                      >
                        Approve
                      </button>
                      <button 
                        className="ad-btn ad-btn-reject"
                        onClick={() => setSelectedListingForReject(listing.roomId)}
                      >
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
                  onClick={() => handleReject(selectedListingForReject)}
                >
                  Reject
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div>
            <div className="ad-section-hd">
              <h2 className="ad-section-title">All Users</h2>
              <span className="ad-section-count">{users.length} total</span>
            </div>
            {users.length > 0 ? (
              <div style={{backgroundColor: '#f8fafc', borderRadius: '8px', overflow: 'hidden'}}>
                <div style={{display: 'grid', gridTemplateColumns: '1fr 1.2fr 0.8fr 0.8fr 0.8fr', gap: '1rem', padding: '1rem', borderBottom: '1px solid #e2e8f0', fontWeight: 600, fontSize: '0.875rem', color: '#64748b'}}>
                  <span>Name</span>
                  <span>Email</span>
                  <span>Role</span>
                  <span>Status</span>
                  <span>Action</span>
                </div>
                {users.map(user => (
                  <div key={user.userId} style={{display: 'grid', gridTemplateColumns: '1fr 1.2fr 0.8fr 0.8fr 0.8fr', gap: '1rem', padding: '1rem', borderBottom: '1px solid #e2e8f0', alignItems: 'center'}}>
                    <span style={{fontWeight: 500}}>{user.fullName}</span>
                    <span style={{fontSize: '0.875rem', color: '#64748b'}}>{user.email}</span>
                    <span style={{fontSize: '0.875rem', backgroundColor: user.role === 'ADMIN' ? '#dcfce7' : '#e0f2fe', color: user.role === 'ADMIN' ? '#166534' : '#0369a1', padding: '0.25rem 0.5rem', borderRadius: '4px', width: 'fit-content'}}>{user.role}</span>
                    <span style={{fontSize: '0.875rem', backgroundColor: user.status === 'ACTIVE' ? '#dcfce7' : '#fee2e2', color: user.status === 'ACTIVE' ? '#166534' : '#991b1b', padding: '0.25rem 0.5rem', borderRadius: '4px', width: 'fit-content'}}>{user.status}</span>
                    <button
                      className="ad-btn"
                      style={{
                        backgroundColor: user.status === 'ACTIVE' ? '#dc2626' : '#16a34a',
                        color: 'white',
                        padding: '0.375rem 0.75rem',
                        fontSize: '0.875rem',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        width: 'fit-content'
                      }}
                      onClick={() => user.status === 'ACTIVE' ? handleBanUser(user.userId) : handleUnbanUser(user.userId)}
                    >
                      {user.status === 'ACTIVE' ? 'Ban' : 'Unban'}
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{padding: '2rem', textAlign: 'center', color: '#94a3b8'}}>
                <p>No users found</p>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
