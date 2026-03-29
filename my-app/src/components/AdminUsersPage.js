import React from 'react';
import { Users as UsersIcon, Ban, RotateCcw } from 'lucide-react';

const AdminUsersPage = ({ users, onToggleBan }) => {
  return (
    <div>
      {/* Topbar */}
      <div className="ad-topbar">
        <div>
          <h1 className="ad-page-title">Manage Users</h1>
          <p className="ad-page-subtitle">{users.length} total users in the system</p>
        </div>
        <div className="ad-topbar-right">
          <div className="ad-admin-chip">
            <div className="ad-admin-avatar">AD</div>
            <span className="ad-admin-label">Admin</span>
          </div>
        </div>
      </div>

      {/* Users Section */}
      <div className="ad-section">
        <div className="ad-section-hd">
          <h2 className="ad-section-title">All Users</h2>
          <span className="ad-section-count">{users.length} total</span>
        </div>
        
        {users.length > 0 ? (
          <div style={{backgroundColor: '#f8fafc', borderRadius: '8px', overflow: 'hidden'}}>
            {/* Header Row */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1.2fr 0.8fr 0.8fr 1fr',
              gap: '1rem',
              padding: '1rem',
              borderBottom: '1px solid #e2e8f0',
              fontWeight: 600,
              fontSize: '0.875rem',
              color: '#64748b'
            }}>
              <span>Name</span>
              <span>Email</span>
              <span>Role</span>
              <span>Status</span>
              <span>Action</span>
            </div>

            {/* User Rows */}
            {users.map(user => (
              <div key={user.userId} style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1.2fr 0.8fr 0.8fr 1fr',
                gap: '1rem',
                padding: '1rem',
                borderBottom: '1px solid #e2e8f0',
                alignItems: 'center'
              }}>
                <span style={{fontWeight: 500}}>{user.fullName}</span>
                <span style={{fontSize: '0.875rem', color: '#64748b'}}>{user.email}</span>
                
                {/* Role Badge */}
                <span style={{
                  fontSize: '0.875rem',
                  backgroundColor: user.role === 'ADMIN' ? '#dcfce7' : '#e0f2fe',
                  color: user.role === 'ADMIN' ? '#166534' : '#0369a1',
                  padding: '0.25rem 0.5rem',
                  borderRadius: '4px',
                  width: 'fit-content'
                }}>
                  {user.role}
                </span>

                {/* Status Badge */}
                <span style={{
                  fontSize: '0.875rem',
                  backgroundColor: user.status === 'ACTIVE' ? '#dcfce7' : '#fee2e2',
                  color: user.status === 'ACTIVE' ? '#166534' : '#991b1b',
                  padding: '0.25rem 0.5rem',
                  borderRadius: '4px',
                  width: 'fit-content'
                }}>
                  {user.status}
                </span>

                {/* Action Button */}
                <div style={{display: 'flex', gap: '0.5rem'}}>
                  <button
                    style={{
                      backgroundColor: user.status === 'ACTIVE' ? '#dc2626' : '#16a34a',
                      color: 'white',
                      padding: '0.375rem 0.75rem',
                      fontSize: '0.875rem',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      whiteSpace: 'nowrap'
                    }}
                    onClick={() => user.status === 'ACTIVE' 
                      ? onToggleBan(user.userId, true) 
                      : onToggleBan(user.userId, false)
                    }
                  >
                    {user.status === 'ACTIVE' ? (
                      <>
                        <Ban size={16} />
                        Ban
                      </>
                    ) : (
                      <>
                        <RotateCcw size={16} />
                        Unban
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{padding: '2rem', textAlign: 'center', color: '#94a3b8'}}>
            <UsersIcon size={48} style={{margin: '0 auto 1rem', opacity: 0.5}} />
            <p>No users found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminUsersPage;
