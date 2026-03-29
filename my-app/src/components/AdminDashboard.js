import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LayoutGrid, CheckCircle, Users, LogOut } from 'lucide-react';
import axiosClient from '../api/rumi_client';
import supabase from '../api/supabaseClient';
import { useAuth } from '../auth/AuthContext';
import AdminApprovalsPage from './AdminApprovalsPage';
import AdminUsersPage from './AdminUsersPage';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user, profile, loading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState('approvals');
  
  const [pendingListings, setPendingListings] = useState([]);
  const [users, setUsers] = useState([]);
  const [statistics, setStatistics] = useState({ pending: 0, approved: 0, rejected: 0, total: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get auth token from user session
  const getAuthHeader = async () => {
    if (!user?.user_metadata?.access_token) {
      // Try to get from session
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) throw new Error('Not authenticated');
      return `Bearer ${session.access_token}`;
    }
    return `Bearer ${user.user_metadata.access_token}`;
  };

  // Fetch initial data
  useEffect(() => {
    const fetchData = async () => {
      if (authLoading) return;

      try {
        setLoading(true);
        const authHeader = await getAuthHeader();
        
        try {
          // Fetch pending listings
          const listingsResponse = await axiosClient.get('/api/admin/listings/pending?page=0&size=100', {
            headers: { Authorization: authHeader }
          });
          setPendingListings(listingsResponse.data.content || []);
        } catch (err) {
          console.error('Error fetching listings:', err);
        }
        
        try {
          // Fetch statistics
          const statsResponse = await axiosClient.get('/api/admin/statistics', {
            headers: { Authorization: authHeader }
          });
          setStatistics(statsResponse.data);
        } catch (err) {
          console.error('Error fetching statistics:', err);
        }
        
        try {
          // Fetch users
          const usersResponse = await axiosClient.get('/api/admin/users?page=0&size=100', {
            headers: { Authorization: authHeader }
          });
          setUsers(usersResponse.data.content || []);
        } catch (err) {
          console.warn('Users endpoint not available, skipping:', err.message);
        }
      } catch (err) {
        console.error('Error setting up admin data:', err);
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
      await axiosClient.put(`/api/admin/listings/${roomId}/approve`, {}, {
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
  const handleReject = async (roomId, reason) => {
    try {
      const token = await getAuthHeader();
      await axiosClient.put(`/api/admin/listings/${roomId}/reject`, 
        { reason },
        { headers: { Authorization: token } }
      );
      // Refresh data
      setPendingListings(prev => prev.filter(l => l.roomId !== roomId));
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

  // Handle ban/unban user
  const handleToggleBan = async (userId, shouldBan) => {
    try {
      const token = await getAuthHeader();
      const endpoint = shouldBan ? 'ban' : 'unban';
      await axiosClient.put(`/api/admin/users/${userId}/${endpoint}`, {}, {
        headers: { Authorization: token }
      });
      // Update local state
      const newStatus = shouldBan ? 'SUSPENDED' : 'ACTIVE';
      setUsers(prev => prev.map(u => 
        u.userId === userId ? { ...u, status: newStatus } : u
      ));
    } catch (err) {
      console.error('Error updating user status:', err);
      alert('Failed to update user status');
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
          <button 
            className={`ad-nav-item ${activeTab === 'approvals' ? 'active' : ''}`}
            onClick={() => setActiveTab('approvals')}
          >
            <CheckCircle size={20} />
            <span>Pending Approvals</span>
            {pendingListings.length > 0 && <span className="ad-nav-badge">{pendingListings.length}</span>}
          </button>
          <button 
            className={`ad-nav-item ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => setActiveTab('users')}
          >
            <Users size={20} />
            <span>Manage Users</span>
            {users.length > 0 && <span className="ad-nav-badge">{users.length}</span>}
          </button>
        </nav>

        <div className="ad-sidebar-footer">
          <button className="ad-logout-btn" onClick={() => navigate('/login')}>
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="ad-main">
        {/* Render Pages Based on Active Tab */}
        {activeTab === 'approvals' && (
          <AdminApprovalsPage
            pendingListings={pendingListings}
            statistics={statistics}
            onApprove={handleApprove}
            onReject={handleReject}
          />
        )}
        
        {activeTab === 'users' && (
          <AdminUsersPage
            users={users}
            onToggleBan={handleToggleBan}
          />
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;


