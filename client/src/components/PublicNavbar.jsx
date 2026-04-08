import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import Logo from './Logo';

const PublicNavbar = () => {
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

  return (
    <nav className="public-navbar">
      <Link to="/" className="public-navbar__brand">
        <Logo />
      </Link>

      <div className="public-navbar__actions">
        <button onClick={toggleTheme} className="public-navbar__icon-button" aria-label="Toggle theme">
          {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        {!isAuthPage && (
          <div className="public-navbar__links">
            <Link to="/about">About</Link>
            <a href="/#features">Features</a>
            <a href="/#tech">Technology</a>
            <Link to="/dashboard/marketplace" className="is-highlighted">Marketplace</Link>
            <Link to="/contact">Contact</Link>
          </div>
        )}
        
        {location.pathname !== '/login' && (
          <Link to="/login" className="public-navbar__login">Login</Link>
        )}
        
        {location.pathname !== '/register' && (
          <Link to="/register" className="btn-primary public-navbar__cta">Get Started</Link>
        )}

        {isAuthPage && (
          <Link to="/" className="public-navbar__home-link">Home</Link>
        )}
      </div>
    </nav>
  );
};

export default PublicNavbar;
