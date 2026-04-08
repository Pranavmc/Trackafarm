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
      {/* Hyper-Background Layer */}
      <div className="liquid-bg">
        <div className="blob" style={{ background: 'var(--primary-accent)', width: '800px', height: '800px', opacity: 0.12 }}></div>
        <div className="blob blob-2" style={{ background: 'var(--tertiary-accent)', width: '600px', height: '600px', opacity: 0.1 }}></div>
      </div>

      <PublicNavbar />

      {/* HERO SECTION */}
      <header style={{ 
        minHeight: '100vh',
        display: 'flex', 
        flexDirection: 'column', 
        justifyContent: 'center', 
        alignItems: 'center', 
        textAlign: 'center', 
        padding: '12rem 5% 8rem',
        position: 'relative'
      }}>
        <div className="glass-card" style={{ 
          marginBottom: '2.5rem', 
          padding: '0.6rem 2rem', 
          borderRadius: '100px', 
          fontSize: '0.9rem', 
          fontWeight: 800, 
          color: 'var(--primary-accent)', 
          border: '1px solid var(--primary-accent)',
          background: 'rgba(0, 255, 136, 0.05)',
          textTransform: 'uppercase',
          letterSpacing: '0.15em'
        }}>
          Industry 5.0 Agriculture
        </div>
        
        <h1 style={{ 
          fontSize: 'clamp(3rem, 8vw, 6.5rem)', 
          marginBottom: '2rem', 
          lineHeight: 0.95, 
          fontWeight: 900,
          letterSpacing: '-0.05em'
        }}>
          Precision Dairy <br/> 
          <span style={{ 
            color: 'transparent', 
            WebkitTextStroke: '2px var(--text-primary)',
            opacity: 0.8
          }}>Redefined.</span>
        </h1>

        <p style={{ 
          fontSize: '1.4rem', 
          color: 'var(--text-secondary)', 
          maxWidth: '850px', 
          margin: '0 auto 4rem',
          lineHeight: 1.5,
          fontWeight: 500
        }}>
          Empower your livestock management with deep-learning forecasting, 
          real-time health telemetry, and hyper-glass analytics.
        </p>

        <div style={{ display: 'flex', gap: '2rem' }}>
          <Link to="/register" className="btn-primary" style={{ 
            padding: '1.5rem 4rem', 
            fontSize: '1.25rem',
            borderRadius: '20px',
            boxShadow: '0 20px 50px -10px var(--forest-glow)',
            background: 'linear-gradient(135deg, var(--primary-accent) 0%, var(--secondary-accent) 100%)'
          }}>Start Free Trial</Link>
        </div>

        {/* Hero Interactive Media Area */}
        <div style={{ 
          marginTop: '6rem', 
          width: '100%', 
          maxWidth: '1200px',
          position: 'relative',
          padding: '1rem',
          background: 'var(--glass-border)',
          borderRadius: '40px',
          boxShadow: 'var(--shadow-glow)'
        }}>
           <div style={{
             position: 'relative',
             borderRadius: '30px',
             overflow: 'hidden',
             aspectRatio: '16/9',
             background: 'var(--bg-main)'
           }}>
             <img 
               src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80" 
               alt="Modern Farm" 
               style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.4 }}
             />
             <div style={{ 
               position: 'absolute', 
               inset: 0, 
               display: 'flex', 
               alignItems: 'center', 
               justifyContent: 'center',
               background: 'radial-gradient(circle, transparent 20%, var(--bg-main) 100%)'
             }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ 
                    width: '80px', 
                    height: '80px', 
                    borderRadius: '50%', 
                    background: 'var(--primary-accent)',
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    margin: '0 auto 1.5rem',
                    boxShadow: '0 0 30px var(--primary-accent)'
                  }}>
                    <Zap size={36} color="black" fill="black" />
                  </div>
                  <h3 style={{ fontSize: '1.5rem', fontWeight: 900 }}>Watch System Demo</h3>
                </div>
             </div>
           </div>
        </div>
      </header>

      {/* CORE FEATURES */}
      <section id="features" style={{ padding: '8rem 5%', backgroundColor: 'rgba(var(--text-primary-rgb), 0.02)' }}>
        <div style={{ textAlign: 'center', marginBottom: '6rem' }}>
          <h2 style={{ fontSize: '3.5rem', fontWeight: 900, letterSpacing: '-0.04em' }}>Intelligence in Every Byte.</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem' }}>State-of-the-art tools for the modern agriculturist.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '3rem' }}>
          {[
            { icon: <Activity />, title: 'Health Telemetry', desc: 'Real-time monitoring of bovine vitals and activity logs.' },
            { icon: <BarChart3 />, title: 'Yield Prediction', desc: 'AI-driven production forecasts with 98% arima-lite accuracy.' },
            { icon: <Globe />, title: 'Supply Chain', desc: 'Seamless integration with local dairy cooperatives.' },
            { icon: <ShieldCheck />, title: 'Vet Verified', desc: 'Digital certified medical records for every animal.' }
          ].map((feat, idx) => (
            <div key={idx} className="glass-card" style={{ padding: '3rem', borderRadius: 'var(--radius-xl)' }}>
              <div style={{ 
                width: '64px', 
                height: '64px', 
                borderRadius: '16px', 
                background: 'var(--forest-glow)', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                marginBottom: '2rem',
                color: 'var(--primary-accent)',
                border: '1px solid var(--glass-border)'
              }}>
                {React.cloneElement(feat.icon, { size: 32 })}
              </div>
              <h3 style={{ fontSize: '1.75rem', fontWeight: 900, marginBottom: '1rem' }}>{feat.title}</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', lineHeight: 1.6 }}>{feat.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ 
        padding: '6rem 5%', 
        textAlign: 'center', 
        borderTop: '1px solid var(--glass-border)',
        background: 'var(--bg-main)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '2rem' }}>
          <Logo size="large" />
        </div>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto 4rem' }}>
          Leading the digital transformation of the global dairy industry since 2024.
        </p>
        <div style={{ fontSize: '1rem', color: 'var(--text-secondary)' }}>
          © 2024 TrackaFarm Intelligence Systems. All Rights Reserved.
        </div>
      </footer>
    </div>
  );
};

export default Landing;
