import React, { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { Sun, Moon, Menu, X, Activity } from 'lucide-react';

const Layout = () => {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', position: 'relative' }}>
      {/* HUD Background Layers */}
      <div className="mesh-grid"></div>
      <div className="liquid-bg">
        <div className="blob"></div>
        <div className="blob blob-2"></div>
      </div>
      
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div className="sidebar-overlay" onClick={() => setIsSidebarOpen(false)} />
      )}

      <Sidebar 
        isMobileOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)}
        style={{ animation: 'slideRightFade 0.8s both' }} 
      />

      <main className="main-content animate-fade-in">
        <header className="animate-slide-down" style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          marginBottom: '2.5rem',
          padding: 'clamp(0.75rem, 2vw, 1.25rem) clamp(1rem, 4vw, 2rem)',
          background: 'var(--glass-bg)',
          backdropFilter: 'var(--glass-blur)',
          border: '1px solid var(--hud-border)',
          borderRadius: 'var(--radius-lg)',
          boxShadow: '0 0 30px rgba(0, 229, 255, 0.05), var(--card-shadow)',
          position: 'relative',
          zIndex: 1100,
          overflow: 'hidden'
        }}>
          {/* Header Scanline */}
          <div className="scanline" style={{ opacity: 0.08 }}></div>
          {/* HUD Corners */}
          <div className="hud-corner hud-corner--tl"></div>
          <div className="hud-corner hud-corner--br"></div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'clamp(0.75rem, 2vw, 1.5rem)' }}>
            {/* Mobile Toggle Button */}
            <button 
              className="mobile-toggle"
              onClick={toggleSidebar}
              style={{
                display: 'none', // Shown via CSS in globals.css if needed, or inline check below
                background: 'var(--glass-white)',
                border: '1px solid var(--glass-border)',
                width: 'clamp(38px, 6vw, 45px)',
                height: 'clamp(38px, 6vw, 45px)',
                borderRadius: '10px',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--primary-accent)',
                cursor: 'pointer',
              }}
            >
              {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.1rem' }}>
              <h1 style={{ fontSize: 'clamp(0.95rem, 4vw, 1.6rem)', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.1rem', whiteSpace: 'nowrap' }}>
                Welcome, {user?.name?.split(' ')[0]}
              </h1>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ 
                  fontSize: 'clamp(0.55rem, 1.5vw, 0.65rem)', 
                  fontWeight: 900, 
                  textTransform: 'uppercase', 
                  letterSpacing: '0.15em',
                  color: 'var(--hud-cyan)',
                  background: 'rgba(0, 229, 255, 0.08)',
                  padding: '0.2rem 0.65rem',
                  borderRadius: '6px',
                  border: '1px solid rgba(0, 229, 255, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem'
                }}>
                  <Activity size={9} />
                  {user?.role}_NODE
                </div>
              </div>
            </div>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: 'clamp(0.5rem, 2vw, 1rem)' }}>
            <button 
              onClick={toggleTheme}
              style={{
                background: 'var(--glass-white)',
                border: '1px solid var(--glass-border)',
                width: 'clamp(34px, 5vw, 40px)',
                height: 'clamp(34px, 5vw, 40px)',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--primary-accent)',
                cursor: 'pointer',
                transition: 'var(--transition-smooth)'
              }}
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            <Link to={user?.role === 'admin' ? '/admin/profile' : '/dashboard/profile'}>
              <div style={{ 
                width: 'clamp(38px, 6vw, 45px)', 
                height: 'clamp(38px, 6vw, 45px)', 
                borderRadius: '12px', 
                background: 'linear-gradient(135deg, var(--hud-cyan), var(--secondary-accent))',
                color: '#020617',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 900,
                fontSize: 'clamp(1rem, 2.5vw, 1.2rem)',
                boxShadow: '0 4px 20px rgba(0, 229, 255, 0.3)',
                cursor: 'pointer',
                transition: 'var(--transition-hyper)'
              }}>
                {user?.name?.charAt(0)}
              </div>
            </Link>
          </div>
        </header>

        {/* CSS to show toggle only on mobile */}
        <style>{`
          @media (max-width: 1024px) {
            .mobile-toggle { display: flex !important; }
            header h1 { font-size: clamp(1.1rem, 4vw, 1.4rem) !important; }
          }
        `}</style>

        <div key={location.pathname} style={{ animation: 'slideUpFade 0.6s cubic-bezier(0.19, 1, 0.22, 1) both' }}>
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;
