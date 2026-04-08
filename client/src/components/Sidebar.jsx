import React, { useState } from 'react';
import { NavLink, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  LayoutDashboard, Beef, Milk, Stethoscope, Shovel,
  FileText, TrendingUp, LogOut, ShieldCheck, User,
  DollarSign, ChevronRight, Zap, Activity, X, ShoppingCart, Package
} from 'lucide-react';
import Logo from './Logo';

/* Nav group header */
const NavSection = ({ label }) => (
  <div style={{
    padding: '0.4rem 1.25rem 0.25rem',
    fontSize: '0.62rem',
    fontWeight: 800,
    letterSpacing: '0.18em',
    textTransform: 'uppercase',
    color: 'var(--primary-accent)',
    opacity: 0.5,
    userSelect: 'none',
    marginTop: '0.5rem',
  }}>
    {label}
  </div>
);

/* Individual nav link */
const SideLink = ({ to, icon, label, end = false, index = 0, onClose }) => {
  const [hovered, setHovered] = useState(false);
  const delay = `${index * 60}ms`;

  return (
    <NavLink
      to={to}
      end={end}
      onClick={onClose}
      className={({ isActive }) => `sidebar-link animate-slide-right ${isActive ? 'active' : ''}`}
      style={{ animationDelay: delay, textDecoration: 'none', position: 'relative', overflow: 'hidden' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {({ isActive }) => (
        <>
          {/* Hover shimmer background */}
          {hovered && !isActive && (
            <div style={{
              position: 'absolute', inset: 0,
              background: 'var(--sidebar-hover-bg)',
              borderRadius: 'var(--radius-md)',
              pointerEvents: 'none',
              animation: 'fadeIn 0.2s both',
            }} />
          )}

          {/* Icon badge */}
          <div style={{
            width: '34px', height: '34px',
            borderRadius: '10px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
            background: isActive
              ? 'var(--sidebar-icon-active-bg)'
              : hovered ? 'var(--sidebar-icon-bg-hover)' : 'var(--sidebar-icon-bg)',
            border: isActive ? '1px solid rgba(0,229,255,0.35)' : '1px solid transparent',
            boxShadow: isActive ? '0 0 12px rgba(0,229,255,0.2)' : 'none',
            transition: 'all 0.3s ease',
            color: isActive ? 'var(--primary-accent)' : hovered ? 'var(--sidebar-label-hover)' : 'var(--sidebar-label-color)',
          }}>
            {React.cloneElement(icon, { size: 16 })}
          </div>

          {/* Label */}
          <span style={{
            flex: 1,
            fontSize: '0.88rem',
            fontWeight: isActive ? 700 : 500,
            color: isActive ? 'var(--text-primary)' : hovered ? 'var(--text-primary)' : 'var(--text-secondary)',
            transition: 'color 0.2s ease',
          }}>
            {label}
          </span>

          {/* Active indicator chevron */}
          {isActive && (
            <ChevronRight size={14} style={{ color: 'var(--primary-accent)', opacity: 0.7, animation: 'slideLeftFade 0.3s both' }} />
          )}
        </>
      )}
    </NavLink>
  );
};

const Sidebar = ({ isMobileOpen, onClose, style }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const farmerGroups = [
    {
      label: 'Overview',
      links: [
        { to: '/dashboard', label: 'Dashboard', icon: <LayoutDashboard />, end: true },
      ]
    },
    {
      label: 'Farm Management',
      links: [
        { to: '/dashboard/livestock', label: 'Livestock', icon: <Beef /> },
        { to: '/dashboard/milk-logs', label: 'Milk Logs', icon: <Milk /> },
        { to: '/dashboard/vet-records', label: 'Vet Records', icon: <Stethoscope /> },
        { to: '/dashboard/feed-inventory', label: 'Feed & Water', icon: <Shovel /> },
      ]
    },
    {
      label: 'Strategy & Finance',
      links: [
        { to: '/dashboard/finance', label: 'Financials', icon: <DollarSign /> },
        { to: '/dashboard/strategy-hub', label: 'Strategy Hub', icon: <Zap /> },
      ]
    },
    {
      label: 'E-commerce',
      links: [
        { to: '/dashboard/marketplace', label: 'Marketplace', icon: <ShoppingCart /> },
        { to: '/dashboard/seller', label: 'Seller Dashboard', icon: <Package /> },
      ]
    }
  ];

  const adminGroups = [
    {
      label: 'Administration',
      links: [
        { to: '/admin', label: 'Control Center', icon: <ShieldCheck />, end: true },
        { to: '/admin/approvals', label: 'Manage Users', icon: <User /> },
        { to: '/admin/animals', label: 'All Animals', icon: <Beef /> },
        { to: '/admin/profile', label: 'Admin Profile', icon: <User /> },
      ]
    }
  ];

  const groups = user?.role === 'admin' ? adminGroups : farmerGroups;
  let linkIndex = 0;

  return (
    <aside className={`sidebar animate-slide-right delay-0 ${isMobileOpen ? 'mobile-open' : ''}`} style={{
      ...style,
      display: 'flex', flexDirection: 'column',
      background: 'var(--sidebar-bg)',
      borderRight: '1px solid var(--sidebar-border)',
      backdropFilter: 'blur(40px)',
      WebkitBackdropFilter: 'blur(40px)',
      boxShadow: 'var(--sidebar-shadow)',
      overflow: 'hidden',
    }}>

      {/* — Mobile Close Button — */}
      <button 
        onClick={onClose}
        style={{
          position: 'absolute', top: '1.25rem', right: '1rem',
          background: 'var(--glass-white)', border: '1px solid var(--glass-border)',
          width: '32px', height: '32px', borderRadius: '8px',
          display: 'none', alignItems: 'center', justifyContent: 'center',
          color: 'var(--primary-accent)', zIndex: 10
        }}
        className="mobile-close"
      >
        <X size={18} />
      </button>

      <style>{`
        @media (max-width: 1024px) {
          .mobile-close { display: flex !important; }
        }
      `}</style>

      {/* — Top decorative glow — */}
      <div style={{
        position: 'absolute', top: '-80px', left: '-60px',
        width: '220px', height: '220px', borderRadius: '50%',
        background: 'var(--sidebar-orb-bg)', filter: 'blur(60px)',
        pointerEvents: 'none',
      }} />

      {/* — Logo — */}
      <div className="animate-slide-down" style={{
        padding: '1.75rem 1.5rem 1.5rem',
        borderBottom: '1px solid var(--sidebar-divider)',
        flexShrink: 0,
        position: 'relative',
      }}>
        <Link to="/" style={{ textDecoration: 'none' }}>
          <Logo />
        </Link>

        {/* Status pill */}
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
          marginTop: '0.85rem',
          background: 'rgba(0,229,255,0.07)',
          border: '1px solid rgba(0,229,255,0.15)',
          borderRadius: '100px',
          padding: '0.25rem 0.75rem',
          fontSize: '0.65rem', fontWeight: 800,
          letterSpacing: '0.12em', textTransform: 'uppercase',
          color: 'var(--primary-accent)',
        }}>
          <span style={{
            width: '6px', height: '6px', borderRadius: '50%',
            background: 'var(--primary-accent)',
            boxShadow: '0 0 6px var(--primary-accent)',
            animation: 'pulseGlowSoft 2s infinite',
            display: 'inline-block',
          }} />
          System Online
        </div>
      </div>

      {/* — Navigation — */}
      <nav style={{
        flex: 1,
        overflowY: 'auto',
        overflowX: 'hidden',
        padding: '0.75rem 0.75rem',
        display: 'flex', flexDirection: 'column', gap: '0.1rem',
        scrollbarWidth: 'thin',
      }}>
        {groups.map((group) => (
          <div key={group.label}>
            <NavSection label={group.label} />
            {group.links.map((link) => (
              <SideLink
                key={link.to}
                to={link.to}
                icon={link.icon}
                label={link.label}
                end={link.end}
                onClose={onClose}
                index={linkIndex++}
              />
            ))}
          </div>
        ))}
      </nav>

      {/* — Bottom: User card + Logout — */}
      <div style={{
        borderTop: '1px solid var(--sidebar-divider)',
        padding: '1rem 0.75rem 1.25rem',
        flexShrink: 0,
        background: 'var(--sidebar-bottom-bg)',
      }}>
        {/* User info card */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: '0.85rem',
          padding: '0.85rem 1rem',
          borderRadius: 'var(--radius-md)',
          background: 'var(--sidebar-card-bg)',
          border: '1px solid var(--sidebar-card-border)',
          marginBottom: '0.75rem',
        }}>
          {/* Avatar */}
          <div style={{
            width: '38px', height: '38px', borderRadius: '12px', flexShrink: 0,
            background: 'linear-gradient(135deg, var(--primary-accent), var(--secondary-accent))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '1rem', fontWeight: 900, color: '#020617',
            boxShadow: '0 0 20px rgba(0,229,255,0.3)',
          }}>
            {user?.name?.charAt(0)?.toUpperCase()}
          </div>
          <div style={{ overflow: 'hidden', flex: 1, minWidth: 0 }}>
            <p style={{ margin: 0, fontWeight: 700, fontSize: '0.85rem', color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {user?.name}
            </p>
            <p style={{ margin: 0, fontSize: '0.7rem', color: 'var(--primary-accent)', fontWeight: 600, textTransform: 'capitalize', opacity: 0.8 }}>
              {user?.role} · {user?.status}
            </p>
          </div>
          <Activity size={14} color="var(--primary-accent)" style={{ flexShrink: 0, opacity: 0.6 }} />
        </div>

        {/* Logout button */}
        <button
          onClick={handleLogout}
          style={{
            width: '100%',
            display: 'flex', alignItems: 'center', gap: '0.85rem',
            padding: '0.75rem 1rem',
            borderRadius: 'var(--radius-md)',
            background: 'rgba(255,42,109,0.04)',
            border: '1px solid rgba(255,42,109,0.12)',
            color: 'rgba(255,42,109,0.75)',
            cursor: 'pointer',
            fontSize: '0.88rem', fontWeight: 700,
            transition: 'all 0.25s ease',
            textAlign: 'left',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = 'rgba(255,42,109,0.12)';
            e.currentTarget.style.color = '#FF2A6D';
            e.currentTarget.style.borderColor = 'rgba(255,42,109,0.35)';
            e.currentTarget.style.boxShadow = '0 0 20px rgba(255,42,109,0.1)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = 'rgba(255,42,109,0.04)';
            e.currentTarget.style.color = 'rgba(255,42,109,0.75)';
            e.currentTarget.style.borderColor = 'rgba(255,42,109,0.12)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          <div style={{
            width: '30px', height: '30px', borderRadius: '9px', flexShrink: 0,
            background: 'rgba(255,42,109,0.1)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <LogOut size={15} />
          </div>
          Sign Out
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
