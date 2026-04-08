import React from 'react';
import PublicNavbar from './PublicNavbar';

const PublicPageShell = ({ children, accent = 'primary' }) => (
  <div className="public-page-shell">
    <div className="liquid-bg">
      <div
        className="blob"
        style={{
          background: accent === 'secondary' ? 'var(--tertiary-accent)' : 'var(--primary-accent)',
          width: '800px',
          height: '800px',
          opacity: 0.11,
        }}
      />
      <div
        className="blob blob-2"
        style={{
          background: accent === 'secondary' ? 'var(--primary-accent)' : 'var(--tertiary-accent)',
          width: '620px',
          height: '620px',
          opacity: 0.1,
        }}
      />
    </div>

    <PublicNavbar />
    {children}
  </div>
);

export default PublicPageShell;
