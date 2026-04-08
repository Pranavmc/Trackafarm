import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { UserCheck, UserX, Search, Mail, Phone, MapPin } from 'lucide-react';

const ApprovalPanel = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('pending');

  const fetchUsers = React.useCallback(async () => {
    try {
      const res = await axios.get(`/admin/users?status=${filter}`);
      setUsers(res.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching users:', err);
    }
  }, [filter]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleStatusChange = async (userId, status) => {
    try {
      await axios.patch(`/admin/users/${userId}/status`, { status });
      fetchUsers();
    } catch (err) {
      alert('Error updating user status');
    }
  };

  return (
    <div style={{ animation: 'fadeIn 0.7s ease-out' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '3rem' }}>
        <div>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Farmer Approvals</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Validate and manage onboarding requests from new farm operators.</p>
        </div>
        <div style={{ display: 'flex', background: 'rgba(255,255,255,0.05)', borderRadius: '12px', padding: '0.4rem', border: '1px solid var(--glass-border)', backdropFilter: 'blur(10px)' }}>
          <button 
            onClick={() => setFilter('pending')} 
            style={{ 
              padding: '0.6rem 1.8rem', 
              borderRadius: '10px', 
              fontWeight: 700,
              fontSize: '0.9rem',
              transition: 'all 0.3s ease',
              background: filter === 'pending' ? 'var(--primary-accent)' : 'transparent',
              color: filter === 'pending' ? 'black' : 'var(--text-secondary)',
              boxShadow: filter === 'pending' ? '0 4px 15px rgba(0, 255, 136, 0.3)' : 'none'
            }}
          >
            Pending Requests
          </button>
          <button 
            onClick={() => setFilter('approved')} 
            style={{ 
              padding: '0.6rem 1.8rem', 
              borderRadius: '10px', 
              fontWeight: 700,
              fontSize: '0.9rem',
              transition: 'all 0.3s ease',
              background: filter === 'approved' ? 'var(--primary-accent)' : 'transparent',
              color: filter === 'approved' ? 'black' : 'var(--text-secondary)',
              boxShadow: filter === 'approved' ? '0 4px 15px rgba(0, 255, 136, 0.3)' : 'none'
            }}
          >
            Approved Farmers
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))', gap: '2rem' }}>
        {loading ? (
          <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '4rem' }}>
            <div className="loading-spinner">Retrieving user data...</div>
          </div>
        ) : users.length === 0 ? (
          <div className="glass-card" style={{ gridColumn: '1/-1', textAlign: 'center', padding: '6rem 2rem', border: '1px dashed var(--glass-border)' }}>
            <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(255,255,255,0.02)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '2rem' }}>
              <UserCheck size={40} color="var(--text-secondary)" style={{ opacity: 0.3 }} />
            </div>
            <h3 style={{ fontSize: '1.25rem', color: 'var(--text-secondary)' }}>No {filter} farmers found in registry.</h3>
            <p style={{ color: 'var(--text-secondary)', opacity: 0.6 }}>Queue is currently synchronization-complete.</p>
          </div>
        ) : users.map(user => (
          <div key={user._id} className="glass-card" style={{ display: 'flex', flexDirection: 'column', height: '100%', position: 'relative', overflow: 'hidden' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 800 }}>{user.name}</h3>
                <div style={{ 
                  display: 'inline-block', 
                  marginTop: '0.5rem', 
                  padding: '0.2rem 0.6rem', 
                  background: 'var(--sky-glow)', 
                  borderRadius: '6px',
                  color: 'var(--primary-accent)',
                  fontWeight: 800,
                  fontSize: '0.8rem',
                  textTransform: 'uppercase'
                }}>
                  {user.farmName}
                </div>
              </div>
              <span style={{ 
                padding: '0.5rem 1rem', 
                borderRadius: '10px', 
                fontSize: '0.75rem', 
                fontWeight: 800,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                background: user.status === 'approved' ? 'rgba(0, 255, 136, 0.1)' : 'rgba(255, 215, 0, 0.1)',
                color: user.status === 'approved' ? 'var(--primary-accent)' : 'var(--secondary-accent)',
                border: `1px solid ${user.status === 'approved' ? 'rgba(0, 255, 136, 0.2)' : 'rgba(255, 215, 0, 0.2)'}`
              }}>
                {user.status}
              </span>
            </div>

            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem', fontSize: '0.95rem', color: 'var(--text-secondary)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem', background: 'rgba(255,255,255,0.02)', borderRadius: '12px' }}>
                <Mail size={18} color="var(--primary-accent)" /> <span style={{ color: 'white' }}>{user.email}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem', background: 'rgba(255,255,255,0.02)', borderRadius: '12px' }}>
                <Phone size={18} color="var(--primary-accent)" /> <span style={{ color: 'white' }}>{user.phone}</span>
              </div>
              {user.location && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem', background: 'rgba(255,255,255,0.02)', borderRadius: '12px' }}>
                  <MapPin size={18} color="var(--primary-accent)" /> <span style={{ color: 'white' }}>{user.location}</span>
                </div>
              )}
            </div>

            {user.status === 'pending' && (
              <div style={{ display: 'flex', gap: '1rem' }}>
                <button 
                  onClick={() => handleStatusChange(user._id, 'approved')}
                  className="btn-primary" 
                  style={{ flex: 1.5, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', height: '52px' }}
                >
                  <UserCheck size={20} /> Approve Entry
                </button>
                <button 
                  onClick={() => handleStatusChange(user._id, 'rejected')}
                  style={{ 
                    flex: 1, 
                    border: '1px solid rgba(255, 118, 117, 0.3)', 
                    color: 'black', 
                    background: 'rgba(255, 118, 117, 0.05)', 
                    borderRadius: '12px', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    gap: '0.5rem',
                    fontWeight: 700,
                    transition: 'all 0.3s ease'
                  }}
                  onMouseOver={(e) => e.target.style.background = 'rgba(255, 118, 117, 0.1)'}
                  onMouseOut={(e) => e.target.style.background = 'rgba(255, 118, 117, 0.05)'}
                >
                  <UserX size={18} /> Deny
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ApprovalPanel;
