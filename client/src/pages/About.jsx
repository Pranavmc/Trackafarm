import React from 'react';
import { Users, Target, Rocket, Award, Heart, ShieldCheck, Activity, Zap, Globe } from 'lucide-react';
import PublicPageShell from '../components/PublicPageShell';

const About = () => {
  const values = [
    { icon: <Award />, label: 'Excellence', color: 'var(--hud-cyan)' },
    { icon: <Heart />, label: 'Empathy', color: 'var(--hud-magenta)' },
    { icon: <Rocket />, label: 'Innovation', color: 'var(--primary-accent)' },
    { icon: <ShieldCheck />, label: 'Integrity', color: 'var(--secondary-accent)' },
  ];

  const stats = [
    { value: '12K+', label: 'Active Farms', tag: 'NODE_COUNT' },
    { value: '98.4%', label: 'Uptime SLA', tag: 'SYSTEM_STATUS' },
    { value: '4.2M', label: 'Animals Tracked', tag: 'BIO_ENTITIES' },
    { value: '40+', label: 'Countries', tag: 'GEO_COVERAGE' },
  ];

  return (
    <PublicPageShell accent="secondary">
      {/* Ambient Mesh Grid */}
      <div className="mesh-grid"></div>

      <main className="public-main public-stack">
        {/* HERO */}
        <section className="public-hero public-hero--center" style={{ position: 'relative' }}>
          <div className="scanline" style={{ opacity: 0.1 }}></div>
          <div className="section-badge animate-fade-in" style={{ color: 'var(--hud-cyan)', borderColor: 'rgba(0, 229, 255, 0.3)' }}>
            <Activity size={13} style={{ display: 'inline', marginRight: '0.5rem', verticalAlign: 'middle' }} />
            Our Journey
          </div>
          <h1 className="public-title animate-slide-up">
            Cultivating the <br />
            <span className="text-shimmer">Digital Frontier.</span>
          </h1>
          <p className="public-copy public-lead animate-slide-up delay-200" style={{ fontFamily: 'var(--title-font)' }}>
            TrackaFarm was born from a simple observation: the world's oldest industry deserves the world's most advanced technology.
            We are a team of data scientists, veterinarians, and lifelong farmers bridging the gap between traditional wisdom and modern intelligence.
          </p>
        </section>

        {/* TELEMETRY STATS */}
        <section style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 200px), 1fr))',
          gap: 'clamp(1.5rem, 3vw, 2rem)',
          padding: '2rem 0'
        }}>
          {stats.map((s, i) => (
            <div key={i} className="cyber-card animate-scale-in" style={{ padding: '2rem 1.5rem', textAlign: 'center', animationDelay: `${i * 100}ms` }}>
              <div className="hud-corner hud-corner--tl"></div>
              <div className="hud-corner hud-corner--br"></div>
              <div style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 900, letterSpacing: '-0.04em' }} className="text-shimmer">
                {s.value}
              </div>
              <div style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', fontWeight: 600, marginTop: '0.5rem' }}>{s.label}</div>
              <div style={{ fontSize: '0.55rem', color: 'var(--hud-cyan)', letterSpacing: '0.2em', marginTop: '1rem', opacity: 0.5, fontWeight: 800 }}>{s.tag}</div>
            </div>
          ))}
        </section>

        {/* MISSION & VISION */}
        <section style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 400px), 1fr))',
          gap: 'clamp(1.5rem, 3vw, 3rem)',
        }}>
          {[
            {
              icon: <Target size={40} />, color: 'var(--primary-accent)',
              title: 'Our Mission', tag: 'DIRECTIVE_01',
              text: 'To empower every livestock farmer with hyper-accurate, AI-driven insights that improve animal welfare, increase production efficiency, and ensure a sustainable future for global agriculture.'
            },
            {
              icon: <Users size={40} />, color: 'var(--hud-magenta)',
              title: 'Our Vision', tag: 'DIRECTIVE_02',
              text: "We envision a world where 'smart farming' is not a luxury, but a standard. A world where every farmer has a digital co-pilot helping them navigate the complexities of modern dairy management."
            }
          ].map((card, i) => (
            <div key={i} className="cyber-card public-card public-card--spacious animate-slide-up" style={{ animationDelay: `${i * 150}ms` }}>
              <div className="hud-corner hud-corner--tl"></div>
              <div className="hud-corner hud-corner--tr" style={{ opacity: 0.2 }}></div>
              <div className="hud-corner hud-corner--br"></div>
              <div className="scanline" style={{ animationDuration: '7s', opacity: 0.08 }}></div>
              <div style={{ color: card.color, marginBottom: '1.75rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                {card.icon}
                <span style={{ fontSize: '0.6rem', letterSpacing: '0.2em', fontWeight: 800, opacity: 0.5 }}>{card.tag}</span>
              </div>
              <h2 style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: 900, marginBottom: '1rem', letterSpacing: '0.02em' }}>
                {card.title}
              </h2>
              <p className="public-copy" style={{ fontSize: 'clamp(1rem, 2vw, 1.1rem)', lineHeight: 1.7 }}>
                {card.text}
              </p>
            </div>
          ))}
        </section>

        {/* CORE VALUES */}
        <section className="cyber-card" style={{ padding: 'clamp(3rem, 6vh, 6rem) clamp(1.5rem, 4vw, 4rem)', position: 'relative' }}>
          <div className="hud-corner hud-corner--tl"></div>
          <div className="hud-corner hud-corner--tr"></div>
          <div className="hud-corner hud-corner--bl"></div>
          <div className="hud-corner hud-corner--br"></div>
          <div className="scanline" style={{ opacity: 0.08 }}></div>

          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <div className="section-badge" style={{ color: 'var(--hud-magenta)', borderColor: 'rgba(255, 42, 109, 0.3)', marginBottom: '1.5rem' }}>
              SYSTEM_PRINCIPLES
            </div>
            <h2 className="public-title public-title--section">Core Values</h2>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 'clamp(2rem, 5vw, 5rem)' }}>
            {values.map((v, i) => (
              <div key={i} className="animate-scale-in" style={{ flex: '1 1 120px', textAlign: 'center', animationDelay: `${i * 120}ms` }}>
                <div style={{
                  width: '72px', height: '72px', borderRadius: '22px',
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: `1px solid ${v.color}33`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: v.color, margin: '0 auto 1.5rem',
                  boxShadow: `0 0 25px ${v.color}15`,
                  transition: 'var(--transition-hyper)'
                }}>
                  {React.cloneElement(v.icon, { size: 30 })}
                </div>
                <h4 style={{ fontSize: '1rem', fontWeight: 800, letterSpacing: '0.05em' }}>{v.label}</h4>
                <div style={{ fontSize: '0.55rem', color: v.color, letterSpacing: '0.2em', marginTop: '0.5rem', opacity: 0.5, fontWeight: 800 }}>
                  CORE_{i + 1}
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="public-footer" style={{
        padding: 'clamp(4rem, 8vh, 6rem) 2rem',
        borderTop: '1px solid var(--glass-border)',
        textAlign: 'center',
        position: 'relative'
      }}>
        <div className="scanline" style={{ top: 0, opacity: 0.1 }}></div>
        <p style={{ fontSize: '0.75rem', letterSpacing: '0.1em', opacity: 0.5 }}>
          © 2024 TRACKAFARM INTELLIGENCE SYSTEMS // [ ALL_RIGHTS_RESERVED ]
        </p>
      </footer>
    </PublicPageShell>
  );
};

export default About;
