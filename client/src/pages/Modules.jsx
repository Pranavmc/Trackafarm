import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Beef, 
  Milk, 
  Stethoscope, 
  Package, 
  ShoppingBag, 
  TrendingUp, 
  BarChart3, 
  ArrowRight,
  Zap,
  Globe,
  Settings
} from 'lucide-react';
import PublicNavbar from '../components/PublicNavbar';

const modules = [
  {
    id: 'livestock',
    title: 'Livestock Management',
    desc: 'Complete lifecycle tracking for your herd with high-fidelity digital profiles and lineage history.',
    icon: <Beef />,
    color: '#00E5FF',
    delay: 100
  },
  {
    id: 'milk',
    title: 'Milk Production',
    desc: 'Real-time logging and deep-learning yield forecasting to optimize your daily dairy operations.',
    icon: <Milk />,
    color: '#7B2CBF',
    delay: 200
  },
  {
    id: 'vet',
    title: 'Health & Vet Records',
    desc: 'Certified medical tracking, vaccination schedules, and automated health alerts for every animal.',
    icon: <Stethoscope />,
    color: '#FF2A6D',
    delay: 300
  },
  {
    id: 'feed',
    title: 'Feed Inventory',
    desc: 'Smart stock management with consumption analytics and automated reordering suggestions.',
    icon: <Package />,
    color: '#FF9F1C',
    delay: 400
  },
  {
    id: 'marketplace',
    title: 'Agro-Marketplace',
    desc: 'Direct-to-consumer and B2B trading platform for livestock, dairy products, and farm supplies.',
    icon: <ShoppingBag />,
    color: '#00D1FF',
    delay: 500
  },
  {
    id: 'strategy',
    title: 'Strategy Hub',
    desc: 'AI-driven forecasting and strategic planning tools to maximize farm profitability and growth.',
    icon: <Zap />,
    color: '#00FFA3',
    delay: 600
  },
  {
    id: 'finance',
    title: 'Financial Analytics',
    desc: 'Comprehensive expense tracking, revenue reports, and financial health telemetry for your enterprise.',
    icon: <BarChart3 />,
    color: '#FF4D00',
    delay: 700
  }
];

const Modules = () => {
  return (
    <div className="public-page-shell" style={{ position: 'relative', overflowX: 'hidden' }}>
      {/* HUD Mesh Grid Overlay */}
      <div className="mesh-grid"></div>

      <div className="liquid-bg">
        <div className="blob" style={{ background: 'var(--blob-1)', width: '80vw', height: '80vw', opacity: 0.1 }}></div>
        <div className="blob blob-2" style={{ background: 'var(--blob-2)', width: '60vw', height: '60vw', opacity: 0.1 }}></div>
        <div className="blob blob-3" style={{ background: 'var(--blob-3)', width: '70vw', height: '70vw', opacity: 0.1 }}></div>
      </div>

      <PublicNavbar />

      <main className="public-main">
        <header className="public-hero animate-slide-down" style={{ position: 'relative' }}>
          <div className="scanline" style={{ opacity: 0.1 }}></div>
          <div className="section-badge animate-fade-in delay-100" style={{ color: 'var(--hud-cyan)', borderColor: 'rgba(0, 229, 255, 0.3)' }}>SYSTEM_ARCHITECTURE</div>
          <h1 className="public-title animate-slide-up delay-200">
            Modular Intelligence <br/>
            <span className="text-shimmer">For Modern Farms.</span>
          </h1>
          <p className="public-copy public-lead animate-slide-up delay-300" style={{ margin: 'clamp(1.5rem, 4vh, 2.5rem) auto', fontFamily: 'var(--title-font)' }}>
            Explore the specialized <span style={{ color: 'var(--hud-cyan)' }}>[ core_logic ]</span> components that make TrackaFarm the world's most 
            advanced precision agriculture platform.
          </p>
        </header>

        <div className="public-grid" style={{ 
          gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 340px), 1fr))', 
          gap: 'clamp(1.5rem, 3vw, 2.5rem)', 
          marginTop: 'clamp(3rem, 6vh, 4rem)' 
        }}>
          {modules.map((module) => (
            <Link 
              key={module.id} 
              to={`/modules/${module.id}`}
              className="cyber-card animate-scale-in"
              style={{ 
                animationDelay: `${module.delay}ms`,
                display: 'flex',
                flexDirection: 'column',
                textDecoration: 'none',
                height: '100%',
                padding: 'clamp(1.5rem, 4vw, 2.8rem)',
                background: 'rgba(255, 255, 255, 0.02)'
              }}
            >
              {/* HUD Elements */}
              <div className="hud-corner hud-corner--tl"></div>
              <div className="hud-corner hud-corner--tr" style={{ opacity: 0.2 }}></div>
              <div className="hud-corner hud-corner--br"></div>
              <div className="scanline" style={{ animationDuration: '6s', opacity: 0.1 }}></div>

              <div style={{
                width: 'clamp(56px, 8vw, 72px)',
                height: 'clamp(56px, 8vw, 72px)',
                borderRadius: '20px',
                background: 'rgba(255, 255, 255, 0.03)',
                border: `1px solid ${module.color}33`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: module.color,
                marginBottom: '2rem',
                boxShadow: `0 0 30px ${module.color}15`
              }}>
                {React.cloneElement(module.icon, { size: 30 })}
              </div>

              <h3 style={{ fontSize: 'clamp(1.5rem, 3vw, 1.8rem)', fontWeight: 900, marginBottom: '1rem', color: 'var(--text-primary)', letterSpacing: '0.02em' }}>
                {module.title}
              </h3>
              
              <p style={{ color: 'var(--text-secondary)', fontSize: 'clamp(0.95rem, 2vw, 1.05rem)', marginBottom: '2.5rem', flex: 1, lineHeight: 1.6 }}>
                {module.desc}
              </p>

              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.75rem', 
                color: module.color, 
                fontWeight: 800,
                fontSize: '0.8rem',
                textTransform: 'uppercase',
                letterSpacing: '0.15em'
              }}>
                <span style={{ opacity: 0.6 }}>Learn More</span> <ArrowRight size={16} />
              </div>

              {/* Sequential ID tag */}
              <div style={{
                position: 'absolute',
                top: '1.5rem',
                right: '1.5rem',
                fontSize: '0.6rem',
                fontFamily: 'monospace',
                color: module.color,
                opacity: 0.4,
                fontWeight: 900
              }}>
                TRK_{module.id.toUpperCase()}_0x{Math.floor(Math.random() * 1000)}
              </div>
            </Link>
          ))}
        </div>
      </main>

      <footer style={{ 
        padding: 'clamp(4rem, 10vh, 12rem) 5% 4rem', 
        textAlign: 'center', 
        borderTop: '1px solid var(--glass-border)',
        marginTop: 'clamp(6rem, 12vh, 8rem)',
        position: 'relative',
        background: 'rgba(0, 0, 0, 0.2)'
      }}>
        <div className="scanline" style={{ top: 0, opacity: 0.1 }}></div>
        <p style={{ color: 'var(--text-secondary)', fontSize: 'clamp(1rem, 2vw, 1.2rem)', maxWidth: '600px', margin: '0 auto 2.5rem', fontWeight: 500 }}>
          Looking for custom <span style={{ color: 'var(--hud-cyan)' }}>enterprise</span> integration?
        </p>
        <Link to="/contact" className="btn-primary animate-pulse-glow" style={{ padding: '1.2rem 3.5rem', borderRadius: '15px' }}>
          Contact Engineering Team
        </Link>
      </footer>
    </div>
  );
};

export default Modules;
