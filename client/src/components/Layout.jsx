import React, { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { Sun, Moon, Menu, X } from 'lucide-react';

const Layout = () => {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', position: 'relative' }}>
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
          padding: '1.25rem 2rem',
          background: 'var(--glass-bg)',
          backdropFilter: 'var(--glass-blur)',
          border: '1px solid var(--glass-border)',
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--card-shadow)',
          position: 'relative',
          zIndex: 1100
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            {/* Mobile Toggle Button */}
            <button 
              className="mobile-toggle"
              onClick={toggleSidebar}
              style={{
                display: 'none', // Shown via CSS in globals.css if needed, or inline check below
                background: 'var(--glass-white)',
                border: '1px solid var(--glass-border)',
                width: '45px',
                height: '45px',
                borderRadius: '12px',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--primary-accent)',
                cursor: 'pointer',
              }}
            >
              {isSidebarOpen ? <X size={22} /> : <Menu size={22} />}
            </button>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
              <h1 style={{ fontSize: 'clamp(1rem, 4vw, 1.75rem)', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.25rem', whiteSpace: 'nowrap' }}>
                Welcome, {user?.name?.split(' ')[0]}
              </h1>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ 
                  fontSize: '0.65rem', 
                  fontWeight: 800, 
                  textTransform: 'uppercase', 
                  letterSpacing: '0.1em',
                  color: 'var(--primary-accent)',
                  background: 'var(--sky-glow)',
                  padding: '0.2rem 0.6rem',
                  borderRadius: '6px'
                }}>
                  {user?.role}
                </div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', display: 'none' }}>
                  <span className="text-gradient" style={{ fontWeight: 800 }}>{user?.farmName}</span>
                </p>
              </div>
            </div>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button 
              onClick={toggleTheme}
              style={{
                background: 'var(--glass-white)',
                border: '1px solid var(--glass-border)',
                width: '40px',
                height: '40px',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--primary-accent)',
                cursor: 'pointer',
                transition: 'var(--transition-smooth)'
              }}
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            <Link to={user?.role === 'admin' ? '/admin/profile' : '/dashboard/profile'}>
              <div style={{ 
                width: '45px', 
                height: '45px', 
                borderRadius: '12px', 
                background: 'var(--primary-accent)', 
                color: '#020617',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 900,
                fontSize: '1.2rem',
                boxShadow: '0 4px 15px var(--sky-glow)',
                cursor: 'pointer'
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
            header h1 { font-size: 1.25rem !important; }
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
