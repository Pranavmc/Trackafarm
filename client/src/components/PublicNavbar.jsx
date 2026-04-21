import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import Logo from './Logo';

const PublicNavbar = () => {
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'About', path: '/about' },
    { name: 'Modules', path: '/modules' },
    { name: 'Features', path: '/#features', type: 'anchor' },
    { name: 'Technology', path: '/#tech', type: 'anchor' },
    { name: 'Marketplace', path: '/dashboard/marketplace', highlighted: true },
    { name: 'Contact', path: '/contact' },
  ];
  const authNavLinks = navLinks.filter((link) => ['About', 'Modules', 'Contact'].includes(link.name));

  return (
    <>
      <nav className={`public-navbar ${isAuthPage ? 'public-navbar--auth' : ''} ${scrolled ? 'navbar-scrolled' : ''}`}>
        <div className="public-navbar__identity">
          <Link to="/" className="public-navbar__brand">
            <Logo size={isAuthPage ? 'default' : 'compact'} />
          </Link>
        </div>

        <div className="public-navbar__actions">
          <div className="public-navbar__links">
            {(isAuthPage ? authNavLinks : navLinks).map((link) => (
              link.type === 'anchor' ? (
                <a key={link.name} href={link.path} style={{ position: 'relative' }}>
                  {link.name}
                </a>
              ) : (
                <Link key={link.name} to={link.path} className={link.highlighted ? 'is-highlighted' : ''} style={{ position: 'relative' }}>
                  {link.name}
                  {link.highlighted && !isAuthPage && <div style={{ position: 'absolute', top: '-8px', right: '-12px', fontSize: '0.5rem', color: 'var(--hud-magenta)' }}>LIVE</div>}
                </Link>
              )
            ))}
          </div>

          <div className="public-navbar__utility">
            <button onClick={toggleTheme} className="public-navbar__icon-button" aria-label="Toggle theme" style={{ border: 'none', background: 'none' }}>
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {location.pathname !== '/login' && !isAuthPage && (
              <Link to="/login" className="public-navbar__login">
                Login
              </Link>
            )}
            
            {location.pathname !== '/register' && !isAuthPage && (
              <Link to="/register" className="btn-primary public-navbar__cta">
                Get Started
              </Link>
            )}

            {isAuthPage && (
              <Link to="/" className="public-navbar__home-link">Home</Link>
            )}
          </div>
        </div>
      </nav>

    </>
  );
};

export default PublicNavbar;
