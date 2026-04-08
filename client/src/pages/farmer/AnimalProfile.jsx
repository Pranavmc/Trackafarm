import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, Activity, Heart, Calendar, Plus, Syringe, Baby } from 'lucide-react';
import Modal from '../../components/Modal';

const AnimalProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [animal, setAnimal] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Modals state
  const [activeTab, setActiveTab] = useState('health'); // 'health' or 'reproduction'
  const [isHealthModalOpen, setIsHealthModalOpen] = useState(false);
  const [isReproductionModalOpen, setIsReproductionModalOpen] = useState(false);
  
  const [healthForm, setHealthForm] = useState({ eventType: 'Vaccination', date: new Date().toISOString().split('T')[0], medicine: '', dosage: '', nextDueDate: '', withdrawalPeriodEnd: '', notes: '' });
  const [reproForm, setReproForm] = useState({ eventType: 'Insemination', date: new Date().toISOString().split('T')[0], bullId: '', expectedCalvingDate: '', result: '', notes: '' });

  const fetchAnimal = React.useCallback(async () => {
    try {
      const res = await axios.get(`/animals/${id}`);
      setAnimal(res.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      navigate('/dashboard/livestock');
    }
  }, [id, navigate]);

  useEffect(() => {
    fetchAnimal();
  }, [fetchAnimal]);

  const handleHealthSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`/animals/${id}/health-event`, healthForm);
      setIsHealthModalOpen(false);
      fetchAnimal();
    } catch (err) {
      alert(err.response?.data?.message || 'Error saving health event');
    }
  };

  const handleReproSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`/animals/${id}/reproduction-event`, reproForm);
      setIsReproductionModalOpen(false);
      fetchAnimal();
    } catch (err) {
      alert(err.response?.data?.message || 'Error saving reproduction event');
    }
  };

  if (loading) return <div className="loading-spinner">Loading Profile...</div>;

  return (
    <div style={{ animation: 'fadeIn 0.7s ease-out' }}>
      <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', marginBottom: '2rem' }}>
        <ArrowLeft size={18} /> Back to Herd
      </button>

      {/* Main Profile Header */}
      <div className="glass-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
            <h1 style={{ fontSize: '3rem', margin: 0, lineHeight: 1 }}>{animal.tagId}</h1>
            <span style={{ 
              padding: '0.5rem 1rem', borderRadius: '12px', fontSize: '0.85rem', fontWeight: 800, textTransform: 'uppercase',
              background: animal.healthStatus === 'Healthy' ? 'rgba(0, 229, 255, 0.1)' : animal.healthStatus === 'Sick' ? 'rgba(255, 42, 109, 0.1)' : 'rgba(123, 44, 191, 0.1)',
              color: animal.healthStatus === 'Healthy' ? 'var(--primary-accent)' : animal.healthStatus === 'Sick' ? 'var(--tertiary-accent)' : 'var(--secondary-accent)',
              border: `1px solid ${animal.healthStatus === 'Healthy' ? 'rgba(0, 229, 255, 0.2)' : animal.healthStatus === 'Sick' ? 'rgba(255, 42, 109, 0.2)' : 'rgba(123, 44, 191, 0.2)'}`
            }}>
              {animal.healthStatus}
            </span>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem' }}>{animal.name ? `${animal.name} - ` : ''}{animal.breed} &bull; {animal.gender}</p>
        </div>
        
        {animal.currentPregnancy?.isPregnant && (
          <div className="glass-panel" style={{ padding: '1.5rem', border: '1px solid rgba(123, 44, 191, 0.3)', background: 'linear-gradient(135deg, rgba(123, 44, 191, 0.1) 0%, transparent 100%)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--secondary-accent)', fontWeight: 800, marginBottom: '0.5rem', textTransform: 'uppercase' }}>
              <Baby size={20} /> PREGNANT
            </div>
            <p style={{ color: 'var(--text-primary)', margin: 0 }}>Due: {new Date(animal.currentPregnancy.expectedCalvingDate).toLocaleDateString()}</p>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
        <button 
          onClick={() => setActiveTab('health')}
          style={{ flex: 1, padding: '1rem', borderRadius: 'var(--radius-md)', border: 'none', background: activeTab === 'health' ? 'var(--primary-accent)' : 'rgba(255,255,255,0.03)', color: activeTab === 'health' ? '#000' : 'var(--text-secondary)', fontWeight: 800, cursor: 'pointer', transition: '0.3s' }}
        >
          <Syringe size={18} style={{ verticalAlign: 'middle', marginRight: '0.5rem' }}/> HEALTH & VACCINES
        </button>
        {animal.gender === 'Female' && (
          <button 
            onClick={() => setActiveTab('reproduction')}
            style={{ flex: 1, padding: '1rem', borderRadius: 'var(--radius-md)', border: 'none', background: activeTab === 'reproduction' ? 'var(--secondary-accent)' : 'rgba(255,255,255,0.03)', color: activeTab === 'reproduction' ? '#fff' : 'var(--text-secondary)', fontWeight: 800, cursor: 'pointer', transition: '0.3s' }}
          >
            <Heart size={18} style={{ verticalAlign: 'middle', marginRight: '0.5rem' }}/> REPRODUCTION LIFECYCLE
          </button>
        )}
      </div>

      {/* Health Tab Content */}
      {activeTab === 'health' && (
        <div className="glass-card" style={{ padding: 0 }}>
          <div style={{ padding: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--glass-border)' }}>
            <h3 style={{ fontSize: '1.5rem', margin: 0 }}>Medical History</h3>
            <button onClick={() => setIsHealthModalOpen(true)} className="btn-primary" style={{ padding: '0.8rem 1.5rem', fontSize: '0.9rem' }}>
              <Plus size={16} style={{ marginRight: '0.5rem' }}/> Log Medical Event
            </button>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ textAlign: 'left', color: 'var(--text-secondary)' }}>
                <th style={{ padding: '1.5rem 2rem' }}>Date</th>
                <th style={{ padding: '1.5rem' }}>Event Type</th>
                <th style={{ padding: '1.5rem' }}>Medicine & Dosage</th>
                <th style={{ padding: '1.5rem' }}>Next Due / Safe Milk Date</th>
              </tr>
            </thead>
            <tbody>
              {animal.healthEvents && animal.healthEvents.length > 0 ? animal.healthEvents.map((ev, i) => (
                <tr key={i} className="glass-panel" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <td style={{ padding: '1.5rem 2rem', fontWeight: 700 }}>{new Date(ev.date).toLocaleDateString()}</td>
                  <td style={{ padding: '1.5rem' }}>
                    <span style={{ color: ev.eventType === 'Vaccination' ? 'var(--primary-accent)' : 'var(--tertiary-accent)' }}>{ev.eventType}</span>
                  </td>
                  <td style={{ padding: '1.5rem' }}>{ev.medicine ? `${ev.medicine} (${ev.dosage})` : '-'}</td>
                  <td style={{ padding: '1.5rem', color: 'var(--text-secondary)' }}>
                    {ev.nextDueDate && <div>Next: {new Date(ev.nextDueDate).toLocaleDateString()}</div>}
                    {ev.withdrawalPeriodEnd && <div style={{ color: 'var(--tertiary-accent)' }}>Safe: {new Date(ev.withdrawalPeriodEnd).toLocaleDateString()}</div>}
                  </td>
                </tr>
              )) : <tr><td colSpan="4" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-secondary)' }}>No medical events recorded.</td></tr>}
            </tbody>
          </table>
        </div>
      )}

      {/* Reproduction Tab Content */}
      {activeTab === 'reproduction' && animal.gender === 'Female' && (
        <div className="glass-card" style={{ padding: 0 }}>
          <div style={{ padding: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--glass-border)' }}>
            <h3 style={{ fontSize: '1.5rem', margin: 0 }}>Breeding & Lifecycle</h3>
            <button onClick={() => setIsReproductionModalOpen(true)} className="btn-primary" style={{ background: 'var(--gradient-card)', color: 'var(--secondary-accent)', border: '1px solid var(--secondary-accent)', padding: '0.8rem 1.5rem', fontSize: '0.9rem', boxShadow: 'none' }}>
              <Plus size={16} style={{ marginRight: '0.5rem' }}/> Log Breeding Event
            </button>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ textAlign: 'left', color: 'var(--text-secondary)' }}>
                <th style={{ padding: '1.5rem 2rem' }}>Date</th>
                <th style={{ padding: '1.5rem' }}>Event Type</th>
                <th style={{ padding: '1.5rem' }}>Bull / Details</th>
                <th style={{ padding: '1.5rem' }}>Expected Calving Date</th>
              </tr>
            </thead>
            <tbody>
              {animal.reproductionEvents && animal.reproductionEvents.length > 0 ? animal.reproductionEvents.map((ev, i) => (
                <tr key={i} className="glass-panel" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <td style={{ padding: '1.5rem 2rem', fontWeight: 700 }}>{new Date(ev.date).toLocaleDateString()}</td>
                  <td style={{ padding: '1.5rem' }}>
                    <span style={{ color: 'var(--secondary-accent)' }}>{ev.eventType}</span>
                  </td>
                  <td style={{ padding: '1.5rem' }}>{ev.bullId ? `Bull: ${ev.bullId}` : ev.result ? `Result: ${ev.result}` : '-'}</td>
                  <td style={{ padding: '1.5rem', color: 'var(--text-primary)' }}>
                    {ev.expectedCalvingDate ? new Date(ev.expectedCalvingDate).toLocaleDateString() : '-'}
                  </td>
                </tr>
              )) : <tr><td colSpan="4" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-secondary)' }}>No reproduction events recorded.</td></tr>}
            </tbody>
          </table>
        </div>
      )}

      {/* Health Modal */}
      <Modal isOpen={isHealthModalOpen} onClose={() => setIsHealthModalOpen(false)} title="Log Medical Event">
        <form onSubmit={handleHealthSubmit}>
          <div className="input-group">
            <label>Event Type *</label>
            <select value={healthForm.eventType} onChange={(e) => setHealthForm({...healthForm, eventType: e.target.value})}>
              <option value="Vaccination">Vaccination</option>
              <option value="Treatment">Medical Treatment</option>
              <option value="Checkup">Routine Checkup</option>
              <option value="Deworming">Deworming</option>
            </select>
          </div>
          <div className="input-group">
            <label>Date *</label>
            <input type="date" value={healthForm.date} onChange={(e) => setHealthForm({...healthForm, date: e.target.value})} required />
          </div>
          <div className="auth-grid">
            <div className="input-group">
              <label>Medicine / Vaccine Name</label>
              <input type="text" value={healthForm.medicine} onChange={(e) => setHealthForm({...healthForm, medicine: e.target.value})} />
            </div>
            <div className="input-group">
              <label>Dosage</label>
              <input type="text" value={healthForm.dosage} onChange={(e) => setHealthForm({...healthForm, dosage: e.target.value})} placeholder="e.g. 5ml" />
            </div>
          </div>
          <div className="auth-grid">
            <div className="input-group">
              <label>Next Due Date</label>
              <input type="date" value={healthForm.nextDueDate} onChange={(e) => setHealthForm({...healthForm, nextDueDate: e.target.value})} />
            </div>
            <div className="input-group">
              <label>Milk Withdrawal Ends</label>
              <input type="date" value={healthForm.withdrawalPeriodEnd} onChange={(e) => setHealthForm({...healthForm, withdrawalPeriodEnd: e.target.value})} />
            </div>
          </div>
          <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '1rem' }}>Save Event</button>
        </form>
      </Modal>

      {/* Reproduction Modal */}
      <Modal isOpen={isReproductionModalOpen} onClose={() => setIsReproductionModalOpen(false)} title="Log Reproduction Event">
        <form onSubmit={handleReproSubmit}>
          <div className="input-group">
            <label>Event Type *</label>
            <select value={reproForm.eventType} onChange={(e) => setReproForm({...reproForm, eventType: e.target.value})}>
              <option value="Insemination">Artificial Insemination</option>
              <option value="Pregnancy Check">Pregnancy Check</option>
              <option value="Calving">Calving (Birth)</option>
              <option value="Dry Off">Dry Off</option>
              <option value="Abortion">Abortion / Loss</option>
            </select>
          </div>
          <div className="input-group">
            <label>Date *</label>
            <input type="date" value={reproForm.date} onChange={(e) => setReproForm({...reproForm, date: e.target.value})} required />
          </div>
          {reproForm.eventType === 'Insemination' && (
            <div className="input-group">
              <label>Bull ID / Straw ID</label>
              <input type="text" value={reproForm.bullId} onChange={(e) => setReproForm({...reproForm, bullId: e.target.value})} />
            </div>
          )}
          {reproForm.eventType === 'Pregnancy Check' && (
            <div className="input-group">
              <label>Check Result</label>
              <select value={reproForm.result} onChange={(e) => setReproForm({...reproForm, result: e.target.value})}>
                <option value="">Select Result...</option>
                <option value="Positive">Positive (Pregnant)</option>
                <option value="Negative">Negative (Open)</option>
              </select>
            </div>
          )}
          <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '1rem', background: 'var(--secondary-accent)' }}>Save Event</button>
        </form>
      </Modal>
    </div>
  );
};

export default AnimalProfile;
