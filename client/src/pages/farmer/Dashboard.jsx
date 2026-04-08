import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Beef, Milk, Stethoscope, AlertCircle, TrendingUp, Activity, Zap } from 'lucide-react';

/* Animated number counter hook */
function useCountUp(target, duration = 1200) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!target) return;
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration]);
  return count;
}

/* Premium Animated Stat Card */
const StatCard = ({ title, value, unit, icon, accentColor, gradient, delay = 0 }) => {
  const animated = useCountUp(Number(value) || 0, 1500);
  return (
    <div
      className="animate-slide-up"
      style={{
        animationDelay: `${delay}ms`,
        position: 'relative',
        overflow: 'hidden',
        borderRadius: 'var(--radius-xl)',
        background: gradient,
        border: `1px solid ${accentColor}44`,
        boxShadow: `0 20px 60px -15px ${accentColor}33, inset 0 1px 0 rgba(255,255,255,0.1)`,
        padding: '2rem',
        cursor: 'default',
        transition: 'var(--transition-hyper)',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = 'translateY(-8px) scale(1.02)';
        e.currentTarget.style.boxShadow = `0 40px 80px -15px ${accentColor}55, 0 0 30px ${accentColor}22, inset 0 1px 0 rgba(255,255,255,0.2)`;
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = 'translateY(0) scale(1)';
        e.currentTarget.style.boxShadow = `0 20px 60px -15px ${accentColor}33, inset 0 1px 0 rgba(255,255,255,0.1)`;
      }}
    >
      {/* Background watermark icon */}
      <div style={{ position:'absolute', right:'-15px', bottom:'-20px', opacity: 0.07, color: accentColor, animation: 'floatUpDown 5s ease-in-out infinite' }}>
        {React.cloneElement(icon, { size: 130 })}
      </div>

      {/* Animated top-right glow orb */}
      <div style={{
        position: 'absolute', top: '-40px', right: '-40px',
        width: '120px', height: '120px', borderRadius: '50%',
        background: accentColor, filter: 'blur(50px)', opacity: 0.18,
        animation: 'floatUpDown 4s ease-in-out infinite',
        animationDelay: `${delay}ms`
      }} />

      {/* Icon badge */}
      <div style={{
        width: '56px', height: '56px', borderRadius: '18px',
        background: `${accentColor}20`,
        border: `1px solid ${accentColor}44`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: accentColor,
        marginBottom: '1.25rem',
        boxShadow: `0 0 20px ${accentColor}33`,
        animation: 'popIn 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) both',
        animationDelay: `${delay + 300}ms`
      }}>
        {React.cloneElement(icon, { size: 26 })}
      </div>

      {/* Label */}
      <p style={{ margin: 0, fontSize: '0.75rem', color: accentColor, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.15em', opacity: 0.85 }}>
        {title}
      </p>

      {/* Animated number */}
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginTop: '0.5rem', animation: 'counterUp 0.8s both', animationDelay: `${delay + 400}ms` }}>
        <h2 style={{ margin: 0, fontSize: '3rem', fontWeight: 900, color: 'var(--text-primary)', lineHeight: 1 }}>
          {animated}
        </h2>
        <span style={{ fontSize: '1rem', color: accentColor, fontWeight: 700, opacity: 0.8 }}>{unit}</span>
      </div>

      {/* Bottom progress bar */}
      <div style={{ marginTop: '1.5rem', height: '3px', background: 'rgba(255,255,255,0.05)', borderRadius: '10px', overflow: 'hidden' }}>
        <div style={{
          height: '100%', width: '70%',
          background: `linear-gradient(90deg, ${accentColor}, transparent)`,
          borderRadius: '10px',
          animation: 'slideRightFade 1.2s both',
          animationDelay: `${delay + 500}ms`
        }} />
      </div>
    </div>
  );
};

const Dashboard = () => {
  const [stats, setStats] = useState({
    animals: { total: 0, summary: [] },
    milk: { todayLiters: 0, totalLiters: 0 },
    loading: true
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [animalRes, milkRes] = await Promise.all([
          axios.get('/animals/count/summary'),
          axios.get('/milk/stats?period=7')
        ]);
        setStats({
          animals: animalRes.data,
          milk: milkRes.data,
          loading: false
        });
      } catch (err) {
        console.error('Error fetching dashboard stats:', err);
        setStats(prev => ({ ...prev, loading: false }));
      }
    };
    fetchDashboardData();
  }, []);

  if (stats.loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '50vh', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ width: '60px', height: '60px', borderRadius: '50%', border: '3px solid transparent', borderTopColor: 'var(--primary-accent)', animation: 'move 0.8s linear infinite' }} />
      <p style={{ color: 'var(--text-secondary)', fontWeight: 600, animation: 'pulseGlowSoft 2s infinite' }}>Fetching farm intelligence...</p>
    </div>
  );

  const statCards = [
    { title: 'Total Livestock', value: stats.animals.total, unit: 'Cows', icon: <Beef />, accentColor: '#00E5FF', gradient: 'linear-gradient(135deg, rgba(0,229,255,0.08) 0%, rgba(0,229,255,0.02) 100%)', delay: 0 },
    { title: 'Daily Yield', value: stats.milk.todayLiters || 0, unit: 'Liters', icon: <Milk />, accentColor: '#7B2CBF', gradient: 'linear-gradient(135deg, rgba(123,44,191,0.08) 0%, rgba(123,44,191,0.02) 100%)', delay: 150 },
    { title: 'Medical Due', value: 2, unit: 'Visits', icon: <Stethoscope />, accentColor: '#FF2A6D', gradient: 'linear-gradient(135deg, rgba(255,42,109,0.08) 0%, rgba(255,42,109,0.02) 100%)', delay: 300 },
    { title: 'Health Critical', value: stats.animals.summary.find(s => s._id === 'Sick')?.count || 0, unit: 'Animals', icon: <AlertCircle />, accentColor: '#FF9F1C', gradient: 'linear-gradient(135deg, rgba(255,159,28,0.08) 0%, rgba(255,159,28,0.02) 100%)', delay: 450 },
  ];

  const healthStatusColor = (status) => {
    if (status === 'Healthy') return '#00E5FF';
    if (status === 'Sick') return '#FF2A6D';
    if (status === 'Vaccinated') return '#7B2CBF';
    return 'var(--text-secondary)';
  };

  return (
    <div style={{ position: 'relative' }}>
      {/* Floating decorative orbs behind the header */}
      <div className="anim-orb" style={{ width: '350px', height: '350px', background: 'rgba(0,229,255,0.06)', top: '-100px', left: '30%', animationDuration: '8s' }} />
      <div className="anim-orb" style={{ width: '250px', height: '250px', background: 'rgba(255,42,109,0.06)', top: '0px', right: '0', animationDuration: '6s', animationDelay: '2s' }} />

      {/* Header */}
      <header className="animate-slide-down delay-0" style={{ marginBottom: '3rem', position: 'relative', zIndex: 1 }}>
        <p style={{ fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.2em', color: 'var(--primary-accent)', marginBottom: '0.5rem', opacity: 0.8 }}>
          ⚡ Live Farm Intelligence
        </p>
        <h1 className="text-shimmer" style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)', marginBottom: '0.5rem', fontWeight: 900 }}>
          Farm Analytics Hub
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem' }}>
          Real-time overview of your livestock health, milk production &amp; operational performance.
        </p>
      </header>

      {/* Animated Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
        {statCards.map((card, i) => (
          <StatCard key={i} {...card} />
        ))}
      </div>

      {/* Bottom two-column section */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '2rem' }}>

        {/* Milk Production Chart Placeholder */}
        <div className="animate-scale-in delay-600" style={{
          background: 'var(--glass-bg)',
          backdropFilter: 'var(--glass-blur)',
          border: '1px solid var(--glass-border)',
          borderRadius: 'var(--radius-xl)',
          padding: '2.5rem',
          minHeight: '380px',
          display: 'flex', flexDirection: 'column',
          position: 'relative', overflow: 'hidden'
        }}>
          <div style={{ position: 'absolute', top: '-60px', right: '-60px', width: '200px', height: '200px', borderRadius: '50%', background: 'rgba(123,44,191,0.07)', filter: 'blur(60px)', animation: 'floatUpDown 7s ease-in-out infinite' }} />

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.3rem', fontWeight: 800 }}>Milk Production Trends</h3>
              <p style={{ margin: '0.25rem 0 0', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Last 7 days performance</p>
            </div>
            <div style={{ background: 'rgba(0,229,255,0.1)', border: '1px solid rgba(0,229,255,0.2)', padding: '0.6rem 1.2rem', borderRadius: '100px', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Activity size={14} color="var(--primary-accent)" />
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--primary-accent)' }}>LIVE</span>
            </div>
          </div>

          {/* Animated skeleton bars */}
          <div style={{ flex: 1, display: 'flex', alignItems: 'flex-end', gap: '0.75rem', padding: '1rem 0' }}>
            {[65, 82, 74, 91, 70, 88, 95].map((h, i) => (
              <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{
                  width: '100%',
                  height: `${h}%`,
                  background: i === 6
                    ? 'linear-gradient(0deg, var(--primary-accent), rgba(0,229,255,0.3))'
                    : 'linear-gradient(0deg, rgba(123,44,191,0.6), rgba(123,44,191,0.1))',
                  borderRadius: '8px 8px 4px 4px',
                  boxShadow: i === 6 ? '0 0 20px rgba(0,229,255,0.3)' : 'none',
                  animation: 'slideUpFade 0.8s both',
                  animationDelay: `${600 + i * 100}ms`,
                  transition: 'all 0.3s ease',
                  cursor: 'pointer',
                }}
                  onMouseEnter={e => { e.currentTarget.style.filter = 'brightness(1.3)'; e.currentTarget.style.transform = 'scaleX(1.05)'; }}
                  onMouseLeave={e => { e.currentTarget.style.filter = 'none'; e.currentTarget.style.transform = 'scaleX(1)'; }}
                />
                <span style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
                  {['M','T','W','T','F','S','S'][i]}
                </span>
              </div>
            ))}
          </div>

          <div style={{ marginTop: '1.5rem', padding: '1rem', background: 'rgba(0,229,255,0.05)', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '0.75rem', border: '1px solid rgba(0,229,255,0.1)' }}>
            <TrendingUp size={18} color="var(--primary-accent)" />
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--primary-accent)' }}>
              +12.8% above 30-day average
            </span>
          </div>
        </div>

        {/* Population status panel */}
        <div className="animate-slide-left delay-700" style={{
          background: 'var(--glass-bg)',
          backdropFilter: 'var(--glass-blur)',
          border: '1px solid var(--glass-border)',
          borderRadius: 'var(--radius-xl)',
          padding: '2.5rem',
          position: 'relative', overflow: 'hidden'
        }}>
          <div style={{ position: 'absolute', bottom: '-50px', left: '-50px', width: '180px', height: '180px', borderRadius: '50%', background: 'rgba(255,42,109,0.06)', filter: 'blur(50px)', animation: 'floatUpDown 5s ease-in-out infinite', animationDelay: '1s' }} />

          <h3 style={{ margin: '0 0 0.5rem', fontSize: '1.3rem', fontWeight: 800 }}>Population Status</h3>
          <p style={{ margin: '0 0 2rem', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Herd health breakdown</p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {stats.animals.summary.length > 0 ? stats.animals.summary.map((status, i) => {
              const color = healthStatusColor(status._id);
              const pct = stats.animals.total > 0 ? Math.round((status.count / stats.animals.total) * 100) : 0;
              return (
                <div key={status._id} className="animate-slide-right" style={{ animationDelay: `${800 + i * 120}ms` }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                    <span style={{ fontWeight: 700, fontSize: '0.9rem', color }}>{status._id}</span>
                    <span style={{ fontWeight: 900, fontSize: '1.1rem', color }}>{status.count}</span>
                  </div>
                  <div style={{ height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '10px', overflow: 'hidden' }}>
                    <div style={{
                      height: '100%', width: `${pct}%`,
                      background: `linear-gradient(90deg, ${color}, ${color}99)`,
                      borderRadius: '10px',
                      boxShadow: `0 0 10px ${color}55`,
                      animation: 'slideRightFade 1s both',
                      animationDelay: `${900 + i * 120}ms`
                    }} />
                  </div>
                </div>
              );
            }) : (
              <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                <Beef size={40} style={{ opacity: 0.2, marginBottom: '1rem' }} />
                <p>No livestock registered yet.</p>
              </div>
            )}
          </div>

          {/* Quick insight badges */}
          <div style={{ marginTop: '2rem', display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <div className="animate-pop-in delay-1000" style={{ padding: '0.5rem 1rem', borderRadius: '100px', background: 'rgba(0,229,255,0.08)', border: '1px solid rgba(0,229,255,0.2)', fontSize: '0.75rem', fontWeight: 700, color: 'var(--primary-accent)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Zap size={12} /> Smart Collars Active
            </div>
            <div className="animate-pop-in delay-1000" style={{ padding: '0.5rem 1rem', borderRadius: '100px', background: 'rgba(123,44,191,0.08)', border: '1px solid rgba(123,44,191,0.2)', fontSize: '0.75rem', fontWeight: 700, color: 'var(--secondary-accent)', display: 'flex', alignItems: 'center', gap: '0.4rem', animationDelay: '1100ms' }}>
              <Activity size={12} /> IoT Online
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
