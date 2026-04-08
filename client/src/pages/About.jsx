import React from 'react';
import { Users, Target, Rocket, Award, Heart, ShieldCheck } from 'lucide-react';
import PublicPageShell from '../components/PublicPageShell';

const About = () => {
  return (
    <PublicPageShell accent="secondary">
      <main className="public-main public-stack">
        <section className="public-hero public-hero--center">
          <div className="section-badge">Our Journey</div>
          <h1 className="public-title">
            Cultivating the <br/> <span style={{ color: 'var(--primary-accent)' }}>Digital Frontier.</span>
          </h1>
          <p className="public-copy public-lead">
            TrackaFarm was born from a simple observation: the world's oldest industry deserves the world's most advanced technology. 
            We are a team of data scientists, veterinarians, and lifelong farmers dedicated to bridging the gap between traditional wisdom and modern intelligence.
          </p>
        </section>

        <section className="public-grid public-grid--two">
          <div className="glass-card public-card public-card--spacious">
            <div style={{ color: 'var(--primary-accent)', marginBottom: '1.5rem' }}><Target size={48} /></div>
            <h2 className="public-section-title">Our Mission</h2>
            <p className="public-copy">
              To empower every livestock farmer with hyper-accurate, AI-driven insights that improve animal welfare, 
              increase production efficiency, and ensure a sustainable future for global agriculture.
            </p>
          </div>
          <div className="glass-card public-card public-card--spacious">
            <div style={{ color: 'var(--tertiary-accent)', marginBottom: '1.5rem' }}><Users size={48} /></div>
            <h2 className="public-section-title">Our Vision</h2>
            <p className="public-copy">
              We envision a world where 'smart farming' is not a luxury, but a standard. A world where every farmer 
              has a digital co-pilot helping them navigate the complexities of modern dairy management.
            </p>
          </div>
        </section>

        <section className="glass-card public-card public-card--centered">
          <h2 className="public-title public-title--section">Core Values</h2>
          <div className="public-grid public-grid--values">
              {[
                { icon: <Award />, label: 'Excellence' },
                { icon: <Heart />, label: 'Empathy' },
                { icon: <Rocket />, label: 'Innovation' },
                { icon: <ShieldCheck />, label: 'Integrity' }
              ].map((v, i) => (
                <div key={i} className="public-value">
                  <div style={{ color: 'var(--primary-accent)' }}>{React.cloneElement(v.icon, { size: 40 })}</div>
                  <h4>{v.label}</h4>
                </div>
              ))}
          </div>
        </section>
      </main>

      <footer className="public-footer">
        <p>© 2024 TrackaFarm Intelligence. Crafted for the modern farmer.</p>
      </footer>
    </PublicPageShell>
  );
};

export default About;
