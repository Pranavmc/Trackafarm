import React from 'react';

const Logo = ({ size = 'default' }) => {
  const isLarge = size === 'large';
  const isCompact = size === 'compact';
  const iconSize = isLarge ? '56px' : isCompact ? '30px' : '36px';
  const textSize = isLarge ? '2.8rem' : isCompact ? '1.32rem' : '1.5rem';
  const gap = isLarge ? '1rem' : isCompact ? '0.6rem' : '0.8rem';
  
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap, cursor: 'pointer' }}>
      <div style={{ position: 'relative', width: iconSize, height: iconSize }}>
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'var(--primary-accent)',
          filter: isCompact ? 'blur(9px)' : 'blur(16px)',
          opacity: isCompact ? 0.45 : 0.6,
          animation: isCompact ? 'none' : 'logoPulse 2s infinite alternate'
        }}></div>
        
        <svg viewBox="0 0 100 100" style={{ position: 'relative', zIndex: 1, width: '100%', height: '100%', animation: isCompact ? 'none' : 'logoFloat 4s ease-in-out infinite' }}>
          <defs>
            <linearGradient id="logoGradCore" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#00E5FF" />
              <stop offset="50%" stopColor="#7B2CBF" />
              <stop offset="100%" stopColor="#FF2A6D" />
            </linearGradient>
            <linearGradient id="logoGradRing" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#00E5FF">
                <animate attributeName="stop-color" values="#00E5FF;#FF2A6D;#00E5FF" dur="4s" repeatCount="indefinite" />
              </stop>
              <stop offset="100%" stopColor="#7B2CBF" />
            </linearGradient>
          </defs>
          
          {/* Hexagon Outer Data Ring */}
          <polygon points="50,5 90,25 90,75 50,95 10,75 10,25" fill="none" stroke="url(#logoGradCore)" strokeWidth="3" strokeOpacity="0.5">
             {!isCompact && <animateTransform attributeName="transform" type="rotate" from="0 50 50" to="360 50 50" dur="25s" repeatCount="indefinite" />}
          </polygon>
          
          {/* Inner Data Nodes Rotating Reverse */}
          <circle cx="50" cy="50" r="32" fill="none" stroke="url(#logoGradRing)" strokeWidth="4" strokeDasharray="12 12">
            {!isCompact && <animateTransform attributeName="transform" type="rotate" from="360 50 50" to="0 50 50" dur="15s" repeatCount="indefinite" />}
          </circle>

          {/* Organic Core (Leaf/Farm) */}
          <path d="M50 20 C75 20, 85 45, 50 85 C15 45, 25 20, 50 20 Z" fill="url(#logoGradCore)" opacity="0.9">
            {!isCompact && <animate attributeName="fill-opacity" values="0.7;1;0.7" dur="3s" repeatCount="indefinite"/>}
          </path>

          {/* Heartbeat Center Data Dot */}
          <circle cx="50" cy="50" r="6" fill="#ffffff" filter="drop-shadow(0 0 6px #00E5FF)">
            {!isCompact && <animate attributeName="r" values="5;9;5" dur="1.2s" repeatCount="indefinite"/>}
          </circle>
        </svg>
      </div>

      <h2 style={{
        margin: 0,
        fontSize: textSize,
        fontWeight: 900,
        letterSpacing: '-0.04em',
        background: 'linear-gradient(90deg, #00E5FF, #7B2CBF, #FF2A6D, #00E5FF)',
        backgroundSize: '300% auto',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        animation: isCompact ? 'none' : 'logoShine 4s linear infinite',
      }}>
        Tracka<span style={{ fontWeight: 400, color: 'var(--text-primary)', WebkitTextFillColor: 'initial' }}>Farm</span>
      </h2>
      
      <style>{`
        @keyframes logoShine { to { background-position: 300% center; } }
        @keyframes logoFloat { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-4px); } }
        @keyframes logoPulse { from { opacity: 0.3; transform: scale(0.9); } to { opacity: 0.7; transform: scale(1.1); } }
      `}</style>
    </div>
  );
};

export default Logo;
