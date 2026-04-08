import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Phone, Shield, Calendar, MapPin, BadgeCheck, LogOut } from 'lucide-react';

const Profile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const InfoItem = ({ icon: Icon, label, value }) => (
    <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', padding: '1.5rem' }}>
      <div style={{ 
        width: '48px', 
        height: '48px', 
        borderRadius: '12px', 
        background: 'var(--sky-glow)', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        color: 'var(--primary-accent)',
        border: '1px solid var(--glass-border-glow)'
      }}>
        <Icon size={24} />
      </div>
      <div>
        <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em' }}>{label}</p>
        <p style={{ margin: '0.25rem 0 0', fontSize: '1.1rem', fontWeight: 600, color: 'white' }}>{value || 'Not provided'}</p>
      </div>
    </div>
  );

  return (
    <div style={{ animation: 'fadeIn 0.7s ease-out' }}>
      <header style={{ marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem', fontWeight: 900 }}>User Profile</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Manage your identity and synchronization credentials.</p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '3rem' }}>
        {/* Profile Card */}
        <div className="glass-card" style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '3rem 2rem' }}>
          <div style={{ 
            width: '120px', 
            height: '120px', 
            borderRadius: '40px', 
            background: 'var(--primary-accent)', 
            color: 'black',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 900,
            fontSize: '3rem',
            boxShadow: '0 8px 30px rgba(0, 255, 136, 0.4)',
            marginBottom: '2rem'
          }}>
            {user?.name?.charAt(0)}
          </div>
          <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{user?.name}</h2>
          <div style={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            gap: '0.5rem',
            background: 'var(--sky-glow)', 
            padding: '0.4rem 1rem', 
            borderRadius: '20px',
            color: 'var(--primary-accent)',
            fontWeight: 800,
            fontSize: '0.85rem',
            textTransform: 'uppercase'
          }}>
            <BadgeCheck size={16} /> {user?.role}
          </div>
          
          <div style={{ width: '100%', height: '1px', background: 'var(--glass-border)', margin: '2.5rem 0' }} />
          
          <div style={{ textAlign: 'left', width: '100%' }}>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '1rem' }}>
              Member since: <span style={{ color: 'white' }}>{new Date(user?.createdAt || Date.now()).toLocaleDateString()}</span>
            </p>
            <div style={{ 
              padding: '1rem', 
              background: 'rgba(255,255,255,0.03)', 
              borderRadius: '12px',
              border: '1px solid var(--glass-border)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              marginBottom: '2rem'
            }}>
              <Shield size={18} color="var(--primary-accent)" />
              <span style={{ fontSize: '0.85rem' }}>Account Status: <b>{user?.status}</b></span>
            </div>

            <button 
              onClick={handleLogout}
              className="glass-card"
              style={{ 
                width: '100%', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                gap: '0.75rem', 
                padding: '1rem',
                color: '#ff7675',
                border: '1px solid rgba(255, 118, 117, 0.3)',
                background: 'rgba(255, 118, 117, 0.05)',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              <LogOut size={20} /> Logout from Session
            </button>
          </div>
        </div>

        {/* Details Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', alignContent: 'start' }}>
          <InfoItem icon={User} label="Full Name" value={user?.name} />
          <InfoItem icon={Mail} label="Email Address" value={user?.email} />
          <InfoItem icon={Phone} label="Phone Number" value={user?.phone} />
          <InfoItem icon={Shield} label="Security Role" value={user?.role} />
          <InfoItem icon={MapPin} label="Farm Location" value={user?.farmName || 'System Administrative Hub'} />
          <InfoItem icon={Calendar} label="Synchronization Date" value={new Date().toLocaleDateString()} />
        </div>
      </div>
    </div>
  );
};

export default Profile;
