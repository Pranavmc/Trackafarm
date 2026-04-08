import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, MessageSquare, Globe } from 'lucide-react';
import PublicPageShell from '../components/PublicPageShell';

const Contact = () => {
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
    setTimeout(() => setSent(false), 5000);
  };

  return (
    <PublicPageShell>
      <main className="public-main">
        <div className="public-grid public-grid--contact">
          <section className="public-stack">
            <div className="section-badge">Get In Touch</div>
            <h1 className="public-title">
              Connect with <br/> <span style={{ color: 'var(--primary-accent)' }}>The Experts.</span>
            </h1>
            <p className="public-copy public-lead">
              Have questions about integrating TrackaFarm into your operation?
              Our technical support and agricultural consultants are standing by.
            </p>

            <div className="public-info-list">
              {[
                { icon: <Mail />, title: 'Email Us', info: 'hello@trackafarm.com' },
                { icon: <Phone />, title: 'Call Center', info: '+1 (800) TRACKA-FARM' },
                { icon: <MapPin />, title: 'Headquarters', info: 'Bengaluru, India • Dairy Operations Hub' },
                { icon: <Globe />, title: 'Coverage', info: 'Remote onboarding for farms, vets, and cooperatives' }
              ].map((item, i) => (
                <div key={i} className="public-info-row">
                  <div className="public-info-row__icon">{item.icon}</div>
                  <div>
                    <h4>{item.title}</h4>
                    <p>{item.info}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section>
            <div className="glass-card public-card public-card--spacious">
              {sent ? (
                <div className="public-card__success">
                  <div style={{ color: 'var(--primary-accent)', marginBottom: '2rem' }}><Send size={64} /></div>
                  <h2 className="public-section-title">Message Transmitted!</h2>
                  <p className="public-copy">We've received your inquiry and will respond within 24 hours.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div className="public-grid public-grid--form">
                    <div className="input-group">
                      <label>Full Name</label>
                      <input placeholder="John Doe" required />
                    </div>
                    <div className="input-group">
                      <label>Email Address</label>
                      <input type="email" placeholder="john@example.com" required />
                    </div>
                  </div>
                  <div className="input-group">
                    <label>Subject</label>
                    <input placeholder="How can we help?" required />
                  </div>
                  <div className="input-group">
                    <label>Message Details</label>
                    <textarea placeholder="Tell us about your farm requirements..." required />
                  </div>
                  <button type="submit" className="btn-primary public-form__submit">
                    <MessageSquare size={22} /> Initiate Consultation
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
