import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  Sprout, 
  Mail, 
  Phone, 
  Lock, 
  UserCheck,
  ChevronRight,
  ShieldCheck,
  Globe,
  Zap
} from 'lucide-react';
import PublicNavbar from '../components/PublicNavbar';
import Logo from '../components/Logo';

const Login = () => {
  const [method, setMethod] = useState('email'); // 'email' or 'phone'
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await login(identifier, password);
      
      const from = location.state?.from?.pathname;
      if (from) {
        navigate(from, { replace: true });
      } else if (user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid credentials. Access Denied.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      display: 'flex', 
      minHeight: '100vh', 
      backgroundColor: 'var(--bg-main)',
      overflow: 'hidden'
    }}>
      <PublicNavbar />
      {/* LEFT PANEL: CINEMATIC HERO */}
      <div style={{ 
        flex: '1.2', 
        position: 'relative', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        padding: '4rem',
        overflow: 'hidden'
      }}>
        {/* Background Image with Parallax-ready feel */}
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'url("https://images.unsplash.com/photo-1544473244-f68953185392?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'brightness(0.3) saturate(1.2)',
          transform: 'scale(1.1)',
          transition: 'transform 20s linear'
        }} />

        {/* Liquid Bloom Overlay */}
        <div className="liquid-bg" style={{ opacity: 0.4 }}>
          <div className="blob" style={{ background: 'var(--primary-accent)', width: '600px', height: '600px' }}></div>
        </div>

        {/* Content Overlay */}
        <div style={{ position: 'relative', zIndex: 10, textAlign: 'left', maxWidth: '600px' }}>
          <div style={{ marginBottom: '3rem' }}>
            <Logo size="large" />
          </div>

          <h2 style={{ fontSize: '4.5rem', fontWeight: 900, lineHeight: 0.9, marginBottom: '2rem', letterSpacing: '-0.06em' }}>
            The Commander's <br/> <span style={{ color: 'var(--primary-accent)' }}>Portal.</span>
          </h2>
          
          <p style={{ fontSize: '1.25rem', color: 'rgba(255, 255, 255, 0.6)', lineHeight: 1.6, marginBottom: '4rem', maxWidth: '500px' }}>
            Step back into your digital ecosystem. Monitor yields, animal health, 
            and AI forecasts with real-time hyper-intelligence.
          </p>

          <div style={{ display: 'flex', gap: '3rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', opacity: 0.8 }}>
              <div style={{ color: 'var(--primary-accent)' }}><ShieldCheck size={24} /></div>
              <span style={{ fontWeight: 700, fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Secure Access</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', opacity: 0.8 }}>
              <div style={{ color: 'var(--tertiary-accent)' }}><Zap size={24} /></div>
              <span style={{ fontWeight: 700, fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>AI Optimized</span>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT PANEL: LOGIN TERMINAL */}
      <div style={{ 
        flex: '0.8', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        padding: '2rem'
      }}>
        <div className="glass-card" style={{ 
          width: '100%', 
          maxWidth: '520px', 
          padding: '4rem', 
          borderRadius: '40px',
          boxShadow: '0 50px 100px -20px rgba(0,0,0,0.5)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* Internal Glow Decals */}
          <div style={{ position: 'absolute', top: '-10%', right: '-10%', width: '200px', height: '200px', background: 'var(--primary-accent)', filter: 'blur(100px)', opacity: 0.1 }}></div>
          
          <div style={{ marginBottom: '3.5rem' }}>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '1rem', letterSpacing: '-0.04em' }}>Welcome Back</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>Initiating authentication sequence...</p>
          </div>

          {error && (
            <div style={{ 
              background: 'rgba(255, 42, 109, 0.08)', 
              border: '1px solid rgba(255, 42, 109, 0.2)', 
              color: '#FF2A6D', 
              padding: '1.25rem', 
              borderRadius: '20px', 
              marginBottom: '2.5rem', 
              textAlign: 'center', 
              fontWeight: 700,
              fontSize: '0.95rem'
            }}>
              {error}
            </div>
          )}

          {/* Identifier Toggle */}
          <div style={{ 
            display: 'flex', 
            background: 'rgba(255, 255, 255, 0.03)', 
            padding: '0.5rem', 
            borderRadius: '24px', 
            border: '1px solid var(--glass-border)',
            marginBottom: '3rem'
          }}>
            <button 
              onClick={() => setMethod('email')}
              style={{ 
                flex: 1, padding: '1rem', borderRadius: '18px', border: 'none',
                background: method === 'email' ? 'var(--primary-accent)' : 'transparent',
                color: method === 'email' ? '#000' : 'var(--text-secondary)',
                fontWeight: 800, cursor: 'pointer', transition: '0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem'
              }}
            >
              <Mail size={18} /> EMAIL
            </button>
            <button 
              onClick={() => setMethod('phone')}
              style={{ 
                flex: 1, padding: '1rem', borderRadius: '18px', border: 'none',
                background: method === 'phone' ? 'var(--primary-accent)' : 'transparent',
                color: method === 'phone' ? '#000' : 'var(--text-secondary)',
                fontWeight: 800, cursor: 'pointer', transition: '0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem'
              }}
            >
              <Phone size={18} /> MOBILE
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="input-group" style={{ marginBottom: '2rem' }}>
              <label style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: 700, marginBottom: '0.75rem', display: 'block' }}>
                {method === 'email' ? 'IDENTITY EMAIL' : 'MOBILE IDENTIFIER'}
              </label>
              <div style={{ position: 'relative' }}>
                <input 
                  type={method === 'email' ? 'email' : 'text'} 
                  placeholder={method === 'email' ? 'commander@trackafarm.ai' : '+91 XXXXX XXXXX'} 
                  required 
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  style={{ 
                    height: '74px', 
                    borderRadius: '22px', 
                    paddingLeft: '4rem', 
                    fontSize: '1.1rem',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '2px solid transparent',
                    transition: '0.3s'
                  }}
                  onFocus={(e) => e.target.style.borderColor = 'var(--primary-accent)'}
                  onBlur={(e) => e.target.style.borderColor = 'transparent'}
                />
                <div style={{ position: 'absolute', left: '1.5rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--primary-accent)' }}>
                  {method === 'email' ? <Mail size={24} /> : <Phone size={24} />}
                </div>
              </div>
            </div>

            <div className="input-group" style={{ marginBottom: '4rem' }}>
              <label style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: 700, marginBottom: '0.75rem', display: 'block' }}>SECURITY KEY</label>
              <div style={{ position: 'relative' }}>
                <input 
                  type="password" 
                  placeholder="••••••••••••" 
                  required 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{ 
                    height: '74px', 
                    borderRadius: '22px', 
                    paddingLeft: '4rem', 
                    fontSize: '1.1rem',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '2px solid transparent',
                    transition: '0.3s'
                  }}
                  onFocus={(e) => e.target.style.borderColor = 'var(--primary-accent)'}
                  onBlur={(e) => e.target.style.borderColor = 'transparent'}
                />
                <div style={{ position: 'absolute', left: '1.5rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--primary-accent)' }}>
                  <Lock size={24} />
                </div>
              </div>
            </div>

            <button type="submit" className="btn-primary" style={{ 
              width: '100%', 
              height: '78px', 
              fontSize: '1.25rem', 
              borderRadius: '24px', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              gap: '1rem',
              boxShadow: '0 20px 40px -10px var(--sky-glow)'
            }} disabled={loading}>
              {loading ? (
                <>Synchronizing...</>
              ) : (
                <><UserCheck size={26} /> AUTHENTICATE <ChevronRight size={22} /></>
              )}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: '4rem', color: 'var(--text-secondary)', fontSize: '1.1rem' }}>
            Unauthorized? <Link to="/register" style={{ color: 'var(--primary-accent)', fontWeight: 900, textDecoration: 'none' }}>Initialize Account</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
