import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  Sprout, 
  UserPlus, 
  Mail, 
  Phone, 
  Lock, 
  ShieldCheck, 
  Building, 
  MapPin, 
  Send, 
  Hash 
} from 'lucide-react';
import PublicNavbar from '../components/PublicNavbar';

const Register = () => {
  const [step, setStep] = useState(1); // 1: Details, 2: OTP
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    farmName: '',
    location: '',
    role: 'farmer',
    otp: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const { register, requestOtp } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRequestOtp = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      // Use email if available, otherwise phone
      const identifier = formData.email || formData.phone;
      const type = formData.email ? 'email' : 'phone';
      if (!identifier) throw new Error('Email or Phone is required');
      
      await requestOtp(identifier, type);
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFinalRegister = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register(formData);
      setSuccess(true);
      setTimeout(() => navigate('/login'), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Verification failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="auth-container">
        <PublicNavbar />
        <div className="liquid-bg">
          <div className="blob"></div>
          <div className="blob blob-2"></div>
        </div>
        <div className="glass-card auth-form" style={{ textAlign: 'center', padding: '3.5rem', borderRadius: 'var(--radius-xl)' }}>
          <div style={{ background: 'var(--sky-glow)', width: '90px', height: '90px', borderRadius: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2.5rem', border: '1px solid var(--glass-border)' }}>
            <ShieldCheck size={64} color="var(--primary-accent)" />
          </div>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '1.5rem', letterSpacing: '-0.03em' }}>Welcome Aboard!</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '3rem', fontSize: '1.1rem', lineHeight: '1.8' }}>
            Your registration is received. **Admin approval** is pending. You will be able to log in once your credentials are verified.
          </p>
          <Link to="/login" className="btn-primary" style={{ display: 'inline-block', width: '100%', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem' }}>Return to Login</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-container">
      <PublicNavbar />
      <div className="liquid-bg">
        <div className="blob"></div>
        <div className="blob blob-2"></div>
      </div>

      <div className="glass-card auth-form" style={{ padding: '3.5rem', borderRadius: 'var(--radius-xl)' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <div style={{ background: 'var(--sky-glow)', width: '72px', height: '72px', borderRadius: '22px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', border: '1px solid var(--glass-border)' }}>
            <Sprout size={44} color="var(--primary-accent)" />
          </div>
          <h2 className="text-gradient" style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '0.75rem', letterSpacing: '-0.03em' }}>{step === 1 ? 'Start Your Farm' : 'Verify Humanity'}</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>{step === 1 ? 'Enter your farm details to register' : `Enter the code sent to ${formData.email || formData.phone}`}</p>
        </div>

        {error && <div style={{ background: 'rgba(255, 42, 109, 0.1)', border: '1px solid rgba(255, 42, 109, 0.3)', color: '#FF2A6D', padding: '1.25rem', borderRadius: '16px', marginBottom: '2rem', textAlign: 'center', fontWeight: '700', fontSize: '0.95rem' }}>{error}</div>}

        {step === 1 ? (
          <form onSubmit={handleRequestOtp}>
            <div className="auth-grid auth-grid-split">
              <div className="input-group">
                <label>Full Name</label>
                <input type="text" name="name" placeholder="John Doe" required onChange={handleChange} />
              </div>
              <div className="input-group">
                <label>Role</label>
                <select name="role" onChange={handleChange}>
                  <option value="farmer">Farmer</option>
                  <option value="vet">Veterinarian</option>
                  <option value="cooperative">Cooperative</option>
                </select>
              </div>
            </div>

            <div className="auth-grid">
              <div className="input-group">
                <label>Email Address</label>
                <input type="email" name="email" placeholder="john@example.com" required onChange={handleChange} />
              </div>
              <div className="input-group">
                <label>Phone Number</label>
                <input type="text" name="phone" placeholder="+1 (555) 000-0000" required onChange={handleChange} />
              </div>
            </div>

            <div className="auth-grid">
              <div className="input-group">
                <label>Farm Name</label>
                <input type="text" name="farmName" placeholder="Green Meadows" onChange={handleChange} />
              </div>
              <div className="input-group">
                <label>Location</label>
                <input type="text" name="location" placeholder="Texas, USA" onChange={handleChange} />
              </div>
            </div>

            <div className="input-group" style={{ marginBottom: '2.5rem' }}>
              <label>Set Secure Password</label>
              <input type="password" name="password" placeholder="••••••••" required onChange={handleChange} />
            </div>

            <button type="submit" className="btn-primary" style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', height: '64px', fontSize: '1.1rem' }} disabled={loading}>
              {loading ? 'Sending OTP...' : <><Send size={22} /> Send Verification Code</>}
            </button>
          </form>
        ) : (
          <form onSubmit={handleFinalRegister}>
            <div className="input-group" style={{ marginBottom: '2.5rem' }}>
              <label>Verification Code</label>
              <input 
                name="otp" 
                placeholder="0 0 0 0 0 0" 
                maxLength="6"
                required 
                onChange={handleChange}
                style={{ textAlign: 'center', fontSize: '2rem', letterSpacing: '0.4rem', fontWeight: 900, height: '80px' }}
              />
            </div>
            <button type="submit" className="btn-primary" style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', height: '64px', fontSize: '1.1rem' }} disabled={loading}>
              {loading ? 'Verifying...' : <><UserPlus size={24} /> Verify & Complete Setup</>}
            </button>
            <button 
              type="button" 
              onClick={() => setStep(1)} 
              style={{ width: '100%', background: 'transparent', border: 'none', color: 'var(--text-secondary)', marginTop: '1.5rem', cursor: 'pointer', fontWeight: 600 }}
            >
              Back to edit details
            </button>
          </form>
        )}

        <p style={{ textAlign: 'center', marginTop: '3rem', color: 'var(--text-secondary)', fontSize: '1.05rem' }}>
          Already have an account? <Link to="/login" style={{ color: 'var(--primary-accent)', fontWeight: 800 }}>Login here</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
