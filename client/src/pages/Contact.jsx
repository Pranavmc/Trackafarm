import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, MessageSquare, Globe, Activity, Terminal, Zap } from 'lucide-react';
import PublicPageShell from '../components/PublicPageShell';

const Contact = () => {
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSent(true);
    }, 1500);
    setTimeout(() => setSent(false), 6000);
  };

  const contactNodes = [
    { icon: <Mail />, title: 'Email Us', info: 'hello@trackafarm.com', color: 'var(--hud-cyan)' },
    { icon: <Phone />, title: 'Call Center', info: '+1 (800) TRACKA-FARM', color: 'var(--primary-accent)' },
    { icon: <MapPin />, title: 'Headquarters', info: 'Bengaluru, India • Dairy Operations Hub', color: 'var(--hud-magenta)' },
    { icon: <Globe />, title: 'Coverage', info: 'Remote onboarding for farms, vets & cooperatives', color: 'var(--secondary-accent)' },
  ];

  return (
    <PublicPageShell>
      {/* Ambient Mesh Grid */}
      <div className="mesh-grid"></div>

      <main className="public-main">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 440px), 1fr))',
          gap: 'clamp(2rem, 5vw, 5rem)',
          alignItems: 'start'
        }}>
          {/* LEFT COLUMN — Info */}
          <section className="public-stack" style={{ position: 'relative' }}>
            <div className="scanline" style={{ opacity: 0.1 }}></div>
            <div className="section-badge animate-fade-in" style={{ color: 'var(--hud-cyan)', borderColor: 'rgba(0, 229, 255, 0.3)' }}>
              <Terminal size={12} style={{ display: 'inline', marginRight: '0.5rem', verticalAlign: 'middle' }} />
              GET IN TOUCH
            </div>
            <h1 className="public-title animate-slide-up">
              Connect with <br />
              <span className="text-shimmer">The Experts.</span>
            </h1>
            <p className="public-copy public-lead animate-slide-up delay-200" style={{ fontFamily: 'var(--title-font)' }}>
              Have questions about integrating TrackaFarm into your operation?
              Our <span style={{ color: 'var(--hud-cyan)' }}>technical support</span> and agricultural consultants are standing by.
            </p>

            <div style={{ marginTop: '3rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {contactNodes.map((item, i) => (
                <div key={i} className="cyber-card animate-slide-up" style={{
                  padding: '1.5rem 2rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1.5rem',
                  animationDelay: `${i * 100}ms`
                }}>
                  <div className="hud-corner hud-corner--tl"></div>
                  <div className="hud-corner hud-corner--br"></div>
                  <div style={{
                    width: '48px', height: '48px', borderRadius: '14px',
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: `1px solid ${item.color}33`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: item.color, flexShrink: 0,
                    boxShadow: `0 0 20px ${item.color}15`
                  }}>
                    {React.cloneElement(item.icon, { size: 20 })}
                  </div>
                  <div>
                    <div style={{ fontSize: '0.6rem', color: item.color, letterSpacing: '0.2em', fontWeight: 900, marginBottom: '0.35rem' }}>{item.title}</div>
                    <div style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-primary)' }}>{item.info}</div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* RIGHT COLUMN — Form */}
          <section>
            <div className="cyber-card" style={{ padding: 'clamp(2rem, 5vw, 4rem)', position: 'relative' }}>
              <div className="hud-corner hud-corner--tl"></div>
              <div className="hud-corner hud-corner--tr" style={{ opacity: 0.3 }}></div>
              <div className="hud-corner hud-corner--bl" style={{ opacity: 0.3 }}></div>
              <div className="hud-corner hud-corner--br"></div>
              <div className="scanline" style={{ animationDuration: '9s', opacity: 0.08 }}></div>

              {sent ? (
                <div style={{ textAlign: 'center', padding: '4rem 0' }}>
                  <div style={{ color: 'var(--hud-cyan)', marginBottom: '2rem', display: 'flex', justifyContent: 'center' }}>
                    <div className="animate-pulse-glow" style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(0,229,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--hud-cyan)', boxShadow: '0 0 30px rgba(0,229,255,0.2)' }}>
                      <Send size={36} />
                    </div>
                  </div>
                  <div style={{ fontSize: '0.65rem', color: 'var(--hud-cyan)', letterSpacing: '0.15em', marginBottom: '1.5rem', fontWeight: 800 }}>MESSAGE RECEIVED</div>
                  <h2 style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: 900, marginBottom: '1rem' }}>Signal Received!</h2>
                  <p className="public-copy">We've received your inquiry and will respond within 24 hours.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div style={{ marginBottom: '2rem' }}>
                    <div style={{ fontSize: '0.6rem', color: 'var(--hud-cyan)', letterSpacing: '0.15em', fontWeight: 900, marginBottom: '1.5rem', opacity: 0.6 }}>GET IN TOUCH</div>
                    <h2 style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: 900, marginBottom: '0.5rem' }}>Send a Message</h2>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1.25rem', marginBottom: '1.25rem' }}>
                    <div className="input-group">
                      <label style={{ fontWeight: 700, fontSize: '0.8rem', marginBottom: '0.5rem', display: 'block' }}>Full Name</label>
                      <input placeholder="John Doe" required style={{ width: '100%' }} />
                    </div>
                    <div className="input-group">
                      <label style={{ fontWeight: 700, fontSize: '0.8rem', marginBottom: '0.5rem', display: 'block' }}>Email Address</label>
                      <input type="email" placeholder="john@example.com" required style={{ width: '100%' }} />
                    </div>
                  </div>
                  <div className="input-group" style={{ marginBottom: '1.25rem' }}>
                    <label style={{ fontWeight: 700, fontSize: '0.8rem', marginBottom: '0.5rem', display: 'block' }}>Subject</label>
                    <input placeholder="How can we help?" required style={{ width: '100%' }} />
                  </div>
                  <div className="input-group" style={{ marginBottom: '2rem' }}>
                    <label style={{ fontWeight: 700, fontSize: '0.8rem', marginBottom: '0.5rem', display: 'block' }}>Message</label>
                    <textarea placeholder="Tell us about your farm requirements..." required style={{ width: '100%', minHeight: '130px' }} />
                  </div>
                  <button type="submit" className="btn-primary" style={{ width: '100%', padding: '1.25rem', gap: '0.75rem', borderRadius: '15px', background: 'linear-gradient(135deg, var(--hud-cyan), var(--secondary-accent))' }}>
                    {loading
                      ? <><Activity size={18} className="animate-spin" /> Sending...</>
                      : <><MessageSquare size={18} /> Send Message</>
                    }
                  </button>
                </form>
              )}
            </div>
          </section>
        </div>
      </main>
    </PublicPageShell>
  );
};

export default Contact;
