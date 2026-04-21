import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Sprout, 
  BarChart3, 
  ShieldCheck, 
  Zap, 
  ArrowRight, 
  Globe, 
  Cpu, 
  Activity 
} from 'lucide-react';
import PublicNavbar from '../components/PublicNavbar';
import Logo from '../components/Logo';

const Landing = () => {
  return (
    <div className="landing-page" style={{ minHeight: '100vh', position: 'relative', overflowX: 'hidden' }}>
      {/* HUD Mesh Grid Overlay */}
      <div className="mesh-grid"></div>
      
      {/* Hyper-Background Layer */}
      <div className="liquid-bg">
        <div className="blob" style={{ background: 'var(--primary-accent)', width: '80vw', height: '80vw', opacity: 0.12 }}></div>
        <div className="blob blob-2" style={{ background: 'var(--tertiary-accent)', width: '60vw', height: '60vw', opacity: 0.1 }}></div>
      </div>

      <PublicNavbar />

      {/* Hero Section HUD Decorations */}
      <div className="hud-corner hud-corner--tl" style={{ position: 'fixed', top: '2rem', left: '2rem', zIndex: 1, opacity: 0.2 }}></div>
      <div className="hud-corner hud-corner--br" style={{ position: 'fixed', bottom: '2rem', right: '2rem', zIndex: 1, opacity: 0.2 }}></div>

      {/* HERO SECTION */}
      <header style={{ 
        minHeight: '100vh',
        display: 'flex', 
        flexDirection: 'column', 
        justifyContent: 'center', 
        alignItems: 'center', 
        textAlign: 'center', 
        padding: 'clamp(8rem, 15vh, 12rem) 5% 6rem',
        position: 'relative'
      }}>
        <div className="scanline" style={{ opacity: 0.1 }}></div>
        
        <div className="glass-card animate-fade-in" style={{ 
          marginBottom: '2.5rem', 
          padding: '0.6rem 2rem', 
          borderRadius: '100px', 
          fontSize: 'clamp(0.7rem, 2vw, 0.9rem)', 
          fontWeight: 800, 
          color: 'var(--hud-cyan)', 
          border: '1px solid var(--hud-border)',
          background: 'rgba(0, 229, 255, 0.05)',
          textTransform: 'uppercase',
          letterSpacing: '0.2em',
          display: 'flex',
          alignItems: 'center',
          gap: '1rem'
        }}>
          <Activity size={14} className="animate-pulse" />
          <span>Industry 5.0 Agriculture</span>
        </div>
        
        <h1 className="animate-slide-up" style={{ 
          fontSize: 'clamp(2.5rem, 10vw, 6.5rem)', 
          marginBottom: '2rem', 
          lineHeight: 0.95, 
          fontWeight: 900,
          letterSpacing: '-0.05em'
        }}>
          Precision Dairy <br/> 
          <span className="text-shimmer">Redefined.</span>
        </h1>

        <p className="animate-slide-up delay-200" style={{ 
          fontSize: 'clamp(1rem, 3vw, 1.4rem)', 
          color: 'var(--text-secondary)', 
          maxWidth: '850px', 
          margin: '0 auto 4rem',
          lineHeight: 1.5,
          fontWeight: 500,
          padding: '0 1rem',
          fontFamily: 'var(--title-font)'
        }}>
          Empower your livestock management with deep-learning forecasting,
          real-time health telemetry, and hyper-glass analytics.
        </p>

        <div className="animate-slide-up delay-300" style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', justifyContent: 'center' }}>
          <Link to="/register" className="btn-primary animate-pulse-glow" style={{ 
            padding: 'max(1rem, 2vw) max(2.5rem, 5vw)', 
            fontSize: 'max(1rem, 1.25vw)',
            borderRadius: '20px'
          }}>Get Started — Free</Link>
        </div>

        {/* Hero Interactive Media Area */}
        <div className="animate-scale-in delay-500 cyber-card" style={{ 
          marginTop: 'clamp(4rem, 8vh, 6rem)', 
          width: '100%', 
          maxWidth: '1200px',
          position: 'relative',
          padding: 'clamp(0.5rem, 2vw, 1rem)',
          background: 'rgba(255, 255, 255, 0.02)',
        }}>
          {/* Internal HUD elements */}
          <div className="hud-corner hud-corner--tl"></div>
          <div className="hud-corner hud-corner--tr"></div>
          <div className="hud-corner hud-corner--bl"></div>
          <div className="hud-corner hud-corner--br"></div>
          
          <div style={{ 
            aspectRatio: '16/9', 
            background: 'rgba(0, 0, 0, 0.4)', 
            borderRadius: 'clamp(15px, 3vw, 30px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
            position: 'relative'
          }}>
            <div className="scanline" style={{ animationDuration: '4s', opacity: 0.2 }}></div>
            <img 
              src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80" 
              alt="Modern Farm" 
              style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.3 }}
            />
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'radial-gradient(circle, transparent 20%, var(--bg-main) 100%)' }}>
              <div style={{ textAlign: 'center', zIndex: 2 }}>
                <div style={{ color: 'var(--hud-cyan)', fontSize: '0.8rem', letterSpacing: '0.2em', marginBottom: '1rem', opacity: 0.5 }}>SYSTEM ONLINE</div>
                <div className="animate-pulse-glow" style={{ 
                  width: 'clamp(50px, 10vw, 80px)', 
                  height: 'clamp(50px, 10vw, 80px)', 
                  borderRadius: '50%', 
                  background: 'var(--hud-cyan)',
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  margin: '0 auto 1.5rem',
                  boxShadow: '0 0 30px var(--hud-cyan)'
                }}>
                  <Zap size={32} color="#02040a" fill="#02040a" />
                </div>
                <h3 style={{ fontSize: 'clamp(1rem, 3vw, 1.5rem)', fontWeight: 900, letterSpacing: '0.05em' }}>Watch Demo</h3>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* CORE FEATURES */}
      <section id="features" style={{ padding: 'clamp(4rem, 10vh, 10rem) 5%', position: 'relative' }}>
        <div style={{ textAlign: 'center', marginBottom: 'clamp(3rem, 8vh, 8rem)' }}>
          <div className="section-badge" style={{ marginBottom: '1.5rem' }}>Core Intelligence</div>
          <h2 className="public-title public-title--section">Intelligence in <span className="text-shimmer">Every Byte.</span></h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: 'clamp(0.9rem, 2vw, 1.2rem)', marginTop: '1rem' }}>State-of-the-art tools for the modern agriculturist.</p>
        </div>

        <div className="public-grid" style={{ 
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', 
          gap: 'clamp(1.5rem, 3vw, 3rem)' 
        }}>
          {[
            { icon: <Activity />, title: 'Health Telemetry', desc: 'Real-time monitoring of bovine vitals and activity logs.', color: 'var(--hud-cyan)' },
            { icon: <BarChart3 />, title: 'Yield Prediction', desc: 'Deep-learning models visualizing complex production data.', color: 'var(--primary-accent)' },
            { icon: <Globe />, title: 'Supply Chain', desc: 'Seamless integration with local dairy cooperatives.', color: 'var(--secondary-accent)' },
            { icon: <ShieldCheck />, title: 'Vault Protocol', desc: 'Digital certified medical records for every animal.', color: 'var(--hud-magenta)' }
          ].map((feat, idx) => (
            <div key={idx} className="cyber-card animate-slide-up" style={{ padding: 'clamp(2rem, 5vw, 3.5rem)', animationDelay: `${idx * 150}ms` }}>
              <div className="hud-corner hud-corner--tl"></div>
              <div className="hud-corner hud-corner--br"></div>
              <div style={{ 
                width: 'clamp(56px, 8vw, 72px)', 
                height: 'clamp(56px, 8vw, 72px)', 
                borderRadius: '18px', 
                background: 'rgba(255, 255, 255, 0.03)', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                marginBottom: '2rem',
                color: feat.color,
                border: '1px solid var(--glass-border)',
                boxShadow: `0 0 20px ${feat.color}20`
              }}>
                {React.cloneElement(feat.icon, { size: 30 })}
              </div>
              <h3 style={{ fontSize: 'clamp(1.5rem, 3vw, 1.8rem)', fontWeight: 900, marginBottom: '1rem', letterSpacing: '0.02em' }}>{feat.title}</h3>
              <p className="public-copy" style={{ fontSize: '1rem' }}>{feat.desc}</p>
              <div style={{ marginTop: '2.5rem', opacity: 0.4, fontSize: '0.65rem', letterSpacing: '0.2em', fontWeight: 800 }}>ACTIVE_NODE_0{idx + 1}</div>
            </div>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ 
        padding: 'clamp(4rem, 10vh, 12rem) 5% 4rem', 
        textAlign: 'center', 
        borderTop: '1px solid var(--glass-border)',
        position: 'relative',
        background: 'rgba(0, 0, 0, 0.2)'
      }}>
        <div className="scanline" style={{ top: 0, opacity: 0.1 }}></div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '2rem' }}>
          <Logo size="large" />
        </div>
        <p style={{ color: 'var(--text-secondary)', fontSize: 'clamp(1rem, 2vw, 1.2rem)', maxWidth: '700px', margin: '0 auto 4rem', fontWeight: 500 }}>
          Leading the digital transformation of the global dairy industry since 2024.
        </p>
        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', opacity: 0.5, letterSpacing: '0.1em' }}>
          © 2024 TRACKAFARM INTELLIGENCE SYSTEMS // [ ALL_RIGHTS_RESERVED ]
        </div>
      </footer>
    </div>
  );
};

export default Landing;
