import React, { useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  Beef, Milk, Stethoscope, Package, ShoppingBag, 
  Zap, BarChart3, ChevronLeft, ShieldCheck, 
  Activity, Globe, Cpu, Layers, HardDrive, 
  Settings, CheckCircle2, ArrowRight
} from 'lucide-react';
import PublicNavbar from '../components/PublicNavbar';

const moduleData = {
  livestock: {
    title: 'Livestock Management',
    tagline: 'Precision Herd Intelligence & Lifecycle Tracking',
    icon: <Beef />,
    color: '#00E5FF',
    image: 'https://images.unsplash.com/photo-1547005327-ef75a6961556?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    description: 'TrackaFarm’s Livestock Management module provides an end-to-end digital twin system for every animal on your farm. By leveraging IoT smart collars and RFID technology, we provide real-time telemetry on location, behavior, and physiological markers.',
    features: [
      { title: 'Digital Profiles', desc: 'Comprehensive records including pedigree, birth details, and physical traits.' },
      { title: 'Live Telemetry', desc: 'Real-time health monitoring through synchronized wearable sensors.' },
      { title: 'Lineage Mapping', desc: 'Advanced genetic tracking to prevent inbreeding and optimize traits.' },
      { title: 'Movement Analytics', desc: 'Grazing pattern visualization for better pasture management.' }
    ],
    techSpecsCount: '15+',
    usersActive: '2.5k',
    reliability: '99.9%'
  },
  milk: {
    title: 'Milk Production',
    tagline: 'High-Yield Forecasting & Quality Assurance',
    icon: <Milk />,
    color: '#7B2CBF',
    image: 'https://images.unsplash.com/photo-1550989460-0adf9ea622e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    description: 'Our Milk Production module combines hardware automation with deep-learning algorithms to monitor yield trends and predict future outputs with unprecedented accuracy. Ensure the highest quality standards with integrated fat and protein analysis telemetry.',
    features: [
      { title: 'Yield Prediction', desc: 'ML-driven forecasts based on historical performance and nutrition.' },
      { title: 'Quality Scanning', desc: 'Real-time analysis of somatic cell counts and nutrient levels.' },
      { title: 'Bulk Tank Monitor', desc: 'Smart storage tracking with temperature and volume alerts.' },
      { title: 'Feeding Correlation', desc: 'Analyze how different feed mixes impact daily milk output.' }
    ],
    techSpecsCount: '10+',
    usersActive: '1.8k',
    reliability: '99.8%'
  },
  vet: {
    title: 'Health & Vet Records',
    tagline: 'Predictive Medical Monitoring & Bio-Security',
    icon: <Stethoscope />,
    color: '#FF2A6D',
    image: 'https://images.unsplash.com/photo-1582213726894-44840bc52230?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    description: 'The Vet Records module serves as a digital hospital for your livestock. It automates vaccination schedules, records medical interventions, and uses behavioral AI to detect early signs of illness before they become clinical issues.',
    features: [
      { title: 'AI Health Alerts', desc: 'Early detection of lameness, mastitis, and heat stress via sensors.' },
      { title: 'Digital EMR', desc: 'Paperless, HIPAA-compliant (for livestock) medical history.' },
      { title: 'Medication Logs', desc: 'Strict tracking of withdrawal periods for milk and meat safety.' },
      { title: 'Tele-Vet Connect', desc: 'Instant data sharing with your local veterinary professionals.' }
    ],
    techSpecsCount: '25+',
    usersActive: '4.2k',
    reliability: '99.99%'
  },
  feed: {
    title: 'Feed Inventory',
    tagline: 'Optimized Resource Allocation & Supply Chain',
    icon: <Package />,
    color: '#FF9F1C',
    image: 'https://images.unsplash.com/photo-1594751414454-0466be8be976?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    description: 'Maximize conversion ratios with our Feed Inventory system. We track grain, silage, and supplement levels in real-time, correlating inventory levels with animal growth and production rates to eliminate waste.',
    features: [
      { title: 'Stock Forecasting', desc: 'Predict when you will run out of feed based on consumption.' },
      { title: 'Nutritional Mixes', desc: 'Database of TMR (Total Mixed Ration) recipes for different animal groups.' },
      { title: 'Waste Analytics', desc: 'Identify bunk-sorting behaviors and reduce feed localized waste.' },
      { title: 'Price Telemetry', desc: 'Monitor market prices for feed and order at optimal timings.' }
    ],
    techSpecsCount: '12+',
    usersActive: '1.2k',
    reliability: '99.7%'
  },
  marketplace: {
    title: 'Agro-Marketplace',
    tagline: 'Decentralized Trading & Secure Transacting',
    icon: <ShoppingBag />,
    color: '#00D1FF',
    image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    description: 'The TrackaFarm Marketplace connects producers directly with consumers and distributors. Featuring a blockchain-backed provenance system, buyers can verify the entire lifecycle of the livestock or products they purchase.',
    features: [
      { title: 'Livestock Auction', desc: 'Secure digital bidding for breeding stock and dairy animals.' },
      { title: 'Product Showcase', desc: 'High-visibility listings for raw milk, processed dairy, and by-products.' },
      { title: 'Safe Payments', desc: 'Integrated escrow and various digital payment gateways.' },
      { title: 'Verified Reviews', desc: 'Reputation system for farmers, cooperatives, and buyers.' }
    ],
    techSpecsCount: '30+',
    usersActive: '8.5k',
    reliability: '99.95%'
  },
  strategy: {
    title: 'Strategy Hub',
    tagline: 'Cognitive Agri-Business Decision Support',
    icon: <Zap />,
    color: '#00FFA3',
    image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    description: 'Harness the power of AI to steer your farm’s future. The Strategy Hub pulls data from all other modules to provide high-level business intelligence, scenario modeling, and risk assessment for your agricultural enterprise.',
    features: [
      { title: 'Scenario Modeling', desc: 'Simulate "what-if" scenarios for herd expansion or market shifts.' },
      { title: 'Profitability Maps', desc: 'Heat-maps of your farm operations to identify cost-centers.' },
      { title: 'Climate Adaptation', desc: 'Strategy adjustments based on local seasonal weather forecasts.' },
      { title: 'Financial Goals', desc: 'Track your progress against yearly ROI and growth targets.' }
    ],
    techSpecsCount: '50+',
    usersActive: '500+',
    reliability: '99.9%'
  },
  finance: {
    title: 'Financial Analytics',
    tagline: 'Enterprise-Grade Accounting & ROI Telemetry',
    icon: <BarChart3 />,
    color: '#FF4D00',
    image: 'https://images.unsplash.com/photo-1554224155-1696413575b9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    description: 'The Financial Analytics module simplifies complex farm accounting. It automatically categorizes expenses from feed, labor, and medical modules, providing a real-time view of your cash flow and net profitability.',
    features: [
      { title: 'Expense Tracking', desc: 'Automatic collation of all input costs across the platform.' },
      { title: 'Revenue Reports', desc: 'Granular breakdown of income from milk, livestock, and sales.' },
      { title: 'Tax Readiness', desc: 'One-click export of data for agricultural tax filings.' },
      { title: 'Asset Evaluation', desc: 'Live valuation of your herd based on current market trends.' }
    ],
    techSpecsCount: '20+',
    usersActive: '3.1k',
    reliability: '99.98%'
  }
};

const ModuleDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const module = moduleData[id];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  if (!module) {
    return (
      <div className="flex-center" style={{ minHeight: '100vh', flexDirection: 'column', gap: '2rem' }}>
        <h2 style={{ fontSize: '2rem' }}>Module not found.</h2>
        <Link to="/modules" className="btn-primary">Back to Modules</Link>
      </div>
    );
  }

  return (
    <div className="public-page-shell" style={{ overflow: 'visible' }}>
      <div className="liquid-bg">
        <div className="blob" style={{ background: module.color, width: '100vw', height: '100vw', opacity: 0.05, top: '-20%', left: '-10%' }}></div>
        <div className="blob-2" style={{ background: 'var(--blob-2)', width: '80vw', height: '80vw', opacity: 0.05 }}></div>
      </div>

      <PublicNavbar />

      <main className="public-main" style={{ padding: 'clamp(6rem, 12vh, 8rem) 0 0' }}>
        {/* Navigation Breadcrumb */}
        <nav className="animate-fade-in" style={{ marginBottom: 'clamp(2rem, 4vh, 3rem)' }}>
          <button 
            onClick={() => navigate('/modules')} 
            style={{ 
              background: 'none', border: 'none', color: module.color, 
              display: 'flex', alignItems: 'center', gap: '0.5rem', 
              fontWeight: 800, cursor: 'pointer', fontSize: '0.9rem',
              textTransform: 'uppercase', letterSpacing: '0.1em'
            }}
          >
            <ChevronLeft size={20} /> Back to Architecture
          </button>
        </nav>

        {/* Hero Section */}
        <section style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 500px), 1fr))', 
          gap: 'clamp(2rem, 5vw, 4rem)', 
          alignItems: 'center', 
          marginBottom: 'clamp(4rem, 10vh, 8rem)' 
        }}>
          <div className="animate-slide-right">
            <div className="section-badge" style={{ borderColor: `${module.color}44`, background: `${module.color}11`, color: module.color, marginBottom: '2rem' }}>
              Module Specification
            </div>
            <h1 className="public-title" style={{ marginBottom: '1.5rem', lineHeight: 1.1 }}>
              {module.title}
            </h1>
            <p style={{ 
              fontSize: 'clamp(1.2rem, 3vw, 1.8rem)', 
              color: 'var(--text-secondary)', 
              fontWeight: 500, 
              marginBottom: '2.5rem',
              lineHeight: 1.3
            }}>
              {module.tagline}
            </p>
            <p className="public-copy" style={{ fontSize: 'clamp(1rem, 2vw, 1.25rem)', maxWidth: '100%', marginBottom: '3rem' }}>
              {module.description}
            </p>
            
            <div style={{ display: 'flex', gap: 'clamp(1rem, 3vw, 2rem)', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontSize: 'clamp(1.5rem, 4vw, 2.5rem)', fontWeight: 900, color: 'var(--text-primary)' }}>{module.usersActive}</span>
                    <span style={{ color: module.color, fontWeight: 700, fontSize: '0.75rem', textTransform: 'uppercase' }}>Active Hubs</span>
                </div>
                <div style={{ width: '1px', background: 'var(--glass-border)' }}></div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontSize: 'clamp(1.5rem, 4vw, 2.5rem)', fontWeight: 900, color: 'var(--text-primary)' }}>{module.techSpecsCount}</span>
                    <span style={{ color: module.color, fontWeight: 700, fontSize: '0.75rem', textTransform: 'uppercase' }}>Sub-Systems</span>
                </div>
                <div style={{ width: '1px', background: 'var(--glass-border)' }}></div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontSize: 'clamp(1.5rem, 4vw, 2.5rem)', fontWeight: 900, color: 'var(--text-primary)' }}>{module.reliability}</span>
                    <span style={{ color: module.color, fontWeight: 700, fontSize: '0.75rem', textTransform: 'uppercase' }}>Uptime SLA</span>
                </div>
            </div>
          </div>

          <div className="animate-scale-in delay-300" style={{ position: 'relative' }}>
            <div className="glass-card" style={{ padding: '0.8rem', borderRadius: 'clamp(20px, 4vw, 40px)', overflow: 'hidden' }}>
              <img 
                src={module.image} 
                alt={module.title} 
                style={{ width: '100%', borderRadius: 'clamp(15px, 3vw, 32px)', display: 'block', height: 'clamp(300px, 60vh, 600px)', objectFit: 'cover' }}
              />
              <div style={{ 
                position: 'absolute', inset: '0.8rem', 
                background: `linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 40%)`, 
                borderRadius: 'clamp(15px, 3vw, 32px)' 
              }}></div>
            </div>
            
            {/* Floating module icon */}
            <div className="animate-float" style={{ 
                position: 'absolute', top: '-15px', right: '-15px', 
                width: 'clamp(60px, 12vw, 100px)', height: 'clamp(60px, 12vw, 100px)', borderRadius: '50%', 
                background: module.color, color: 'black', 
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: `0 20px 40px ${module.color}44`,
                zIndex: 10
            }}>
                {React.cloneElement(module.icon, { size: 32 })}
            </div>
          </div>
        </section>

        {/* Detailed Features Grid */}
        <section style={{ marginBottom: 'clamp(4rem, 10vh, 8rem)' }}>
            <div style={{ textAlign: 'center', marginBottom: 'clamp(3rem, 6vh, 5rem)' }}>
                <h2 className="public-title--section" style={{ marginBottom: '1.5rem' }}>Core Sub-Systems.</h2>
                <p className="public-copy">Deep-dive into the technical capabilities of the {module.title} module.</p>
            </div>

            <div className="public-grid" style={{ 
              gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 450px), 1fr))', 
              gap: 'clamp(1.5rem, 3vw, 2.5rem)' 
            }}>
              {module.features.map((feature, i) => (
                <div key={i} className="glass-card animate-slide-up" style={{ animationDelay: `${400 + i * 150}ms`, padding: 'clamp(1.5rem, 4vw, 3.5rem)' }}>
                    <div style={{ color: module.color, marginBottom: '2rem' }}>
                        <CheckCircle2 size={32} />
                    </div>
                    <h3 style={{ fontSize: 'clamp(1.2rem, 3vw, 2rem)', fontWeight: 900, marginBottom: '1.25rem' }}>{feature.title}</h3>
                    <p className="public-copy" style={{ fontSize: 'clamp(0.95rem, 2vw, 1.15rem)' }}>{feature.desc}</p>
                </div>
              ))}
            </div>
        </section>

        {/* CTA Section */}
        <section className="glass-card animate-scale-in" style={{ 
            background: `linear-gradient(135deg, ${module.color}11, transparent)`,
            border: `1px solid ${module.color}44`,
            textAlign: 'center',
            padding: 'clamp(3rem, 8vh, 6rem) clamp(1rem, 4vw, 4rem)',
            marginBottom: 'clamp(5rem, 12vh, 10rem)',
            position: 'relative',
            overflow: 'hidden'
        }}>
            <div className="anim-orb" style={{ width: '40vw', height: '40vw', background: module.color, opacity: 0.08, top: '-20vw', left: '30%' }} />
            
            <h2 style={{ fontSize: 'clamp(2rem, 6vw, 3.5rem)', fontWeight: 900, marginBottom: '1.5rem' }}>Ready to Scale Your Farm?</h2>
            <p className="public-copy" style={{ maxWidth: '700px', margin: '0 auto 3rem', fontSize: 'clamp(1rem, 2vw, 1.2rem)' }}>
                Join thousands of modern agriculturists using TrackaFarm to drive efficiency, 
                productivity, and digital transformation.
            </p>
            
            <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                <Link to="/register" className="btn-primary" style={{ background: `linear-gradient(135deg, ${module.color}, #7B2CBF)`, padding: '1.2rem 3rem', fontSize: 'clamp(1rem, 2vw, 1.25rem)' }}>
                    Register for {module.title}
                </Link>
                <Link to="/contact" style={{ 
                    padding: '1.2rem 3rem', borderRadius: '100px', 
                    border: '1px solid var(--glass-border)', 
                    color: 'var(--text-primary)', fontWeight: 700, 
                    display: 'flex', alignItems: 'center', gap: '0.75rem',
                    textDecoration: 'none',
                    fontSize: 'clamp(0.9rem, 2vw, 1rem)'
                }}>
                    Talk to Expert <ArrowRight size={20} />
                </Link>
            </div>
        </section>
      </main>

      <footer style={{ 
        padding: 'clamp(3rem, 8vh, 6rem) 5%', 
        textAlign: 'center', 
        borderTop: '1px solid var(--glass-border)',
        background: 'var(--bg-main)'
      }}>
        <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
          © 2024 TrackaFarm Intelligence Systems. All Module Specs are subject to local configuration.
        </div>
      </footer>
    </div>
  );
};

export default ModuleDetail;
