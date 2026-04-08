import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Stethoscope, Plus, Calendar, ShieldCheck, Activity } from 'lucide-react';
import Modal from '../../components/Modal';

const VetRecords = () => {
  const [records, setRecords] = useState([]);
  const [animals, setAnimals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [formData, setFormData] = useState({
    animalId: '', type: 'Vaccination', medicine: '', dosage: '', date: new Date().toISOString().split('T')[0], nextDueDate: '', veterinarianName: '', cost: 0, notes: '', status: 'Completed'
  });

  const fetchData = React.useCallback(async () => {
    try {
      const [recordsRes, animalsRes] = await Promise.all([
        axios.get('/vet'),
        axios.get('/animals')
      ]);
      setRecords(recordsRes.data);
      setAnimals(animalsRes.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching vet data:', err);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/vet', formData);
      setIsModalOpen(false);
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || 'Error saving record');
    }
  };

  const getUpcomingDues = () => {
    const today = new Date();
    return records.filter(r => r.nextDueDate && new Date(r.nextDueDate) > today);
  };

  return (
    <div style={{ animation: 'slideUpFade 0.6s both' }}>
      <div className="animate-slide-down" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '3rem' }}>
        <div>
          <p style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.2em', color: 'var(--primary-accent)', marginBottom: '0.4rem', opacity: 0.8 }}>🩺 Veterinary Clinic</p>
          <h1 className="text-shimmer" style={{ fontSize: 'clamp(1.8rem, 3vw, 2.8rem)', fontWeight: 900, marginBottom: '0.4rem' }}>Medical Registry</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Medical history, vaccinations, and upcoming health schedules.</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Plus size={20} /> Add Medical Entry
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2.5fr', gap: '2rem', marginBottom: '3rem' }}>
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '1.25rem' }}>
            <Calendar size={20} color="var(--primary-accent)" /> Upcoming Dues
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {getUpcomingDues().length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2rem', background: 'rgba(255,255,255,0.02)', borderRadius: '16px', border: '1px dashed var(--glass-border)' }}>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>All schedules clear.</p>
              </div>
            ) : getUpcomingDues().map(due => (
              <div key={due._id} style={{ 
                padding: '1.25rem', 
                background: 'rgba(255, 215, 0, 0.05)', 
                borderRadius: '16px', 
                borderLeft: '4px solid var(--secondary-accent)',
                borderTop: '1px solid var(--glass-border)',
                borderRight: '1px solid var(--glass-border)',
                borderBottom: '1px solid var(--glass-border)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span style={{ fontWeight: 800, color: 'white' }}>{due.type}</span>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--secondary-accent)', textTransform: 'uppercase' }}>Upcoming</span>
                </div>
                <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Tag: <span style={{ color: 'white', fontWeight: 600 }}>{due.animalId?.tagId}</span></div>
                <div style={{ fontSize: '0.85rem', color: 'var(--secondary-accent)', marginTop: '0.5rem', fontWeight: 600 }}>{new Date(due.nextDueDate).toLocaleDateString()}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-card" style={{ padding: 0, overflow: 'hidden' }}>
          <h3 style={{ padding: '1.5rem 2rem', borderBottom: '1px solid var(--glass-border)', fontSize: '1.25rem' }}>Health History</h3>
          <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0 }}>
            <thead>
              <tr>
                <th style={{ padding: '1.25rem 2rem' }}>Date & Type</th>
                <th style={{ padding: '1.25rem' }}>Animal Identity</th>
                <th style={{ padding: '1.25rem' }}>Medicine & Dosage</th>
                <th style={{ padding: '1.25rem' }}>Veterinarian</th>
                <th style={{ padding: '1.25rem 2rem', textAlign: 'right' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="5" style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-secondary)' }}>Loading history...</td></tr>
              ) : records.length === 0 ? (
                <tr><td colSpan="5" style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-secondary)' }}>No medical records available.</td></tr>
              ) : records.map((record, index) => {
                const delayClass = `delay-${Math.min((index + 5) * 100, 1000)}`;
                return (
                  <tr key={record._id} className={`animate-slide-up ${delayClass}`}>
                    <td style={{ padding: '1.25rem 2rem' }}>
                      <div style={{ fontWeight: 700 }}>{new Date(record.date).toLocaleDateString()}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{record.type}</div>
                    </td>
                    <td style={{ padding: '1.25rem' }}>
                      <div style={{ fontWeight: 800, color: 'var(--primary-accent)' }}>{record.animalId?.tagId}</div>
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{record.animalId?.name}</div>
                    </td>
                    <td style={{ padding: '1.25rem' }}>
                      <div style={{ fontWeight: 600 }}>{record.medicine || 'N/A'}</div>
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{record.dosage || '-'}</div>
                    </td>
                    <td style={{ padding: '1.25rem', color: 'var(--text-secondary)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Activity size={14} color="var(--primary-accent)" />
                        {record.veterinarianName || 'System Log'}
                      </div>
                    </td>
                    <td style={{ padding: '1.25rem 2rem', textAlign: 'right' }}>
                      <span style={{ 
                        padding: '0.5rem 1rem', 
                        borderRadius: '10px', 
                        fontSize: '0.8rem', 
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        background: record.status === 'Completed' ? 'rgba(0, 255, 136, 0.1)' : 'rgba(255, 215, 0, 0.1)',
                        color: record.status === 'Completed' ? 'var(--primary-accent)' : 'var(--secondary-accent)',
                        border: `1px solid ${record.status === 'Completed' ? 'rgba(0, 255, 136, 0.2)' : 'rgba(255, 215, 0, 0.2)'}`
                      }}>
                        {record.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add Veterinary Record">
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Select Animal *</label>
            <select value={formData.animalId} onChange={(e) => setFormData({...formData, animalId: e.target.value})} required>
              <option value="">Choose a cow...</option>
              {animals.map(a => <option key={a._id} value={a._id}>{a.tagId} - {a.name}</option>)}
            </select>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="input-group">
              <label>Record Type *</label>
              <select value={formData.type} onChange={(e) => setFormData({...formData, type: e.target.value})} required>
                <option value="Vaccination">Vaccination</option>
                <option value="Deworming">Deworming</option>
                <option value="Treatment">Treatment</option>
                <option value="Regular Checkup">Regular Checkup</option>
              </select>
            </div>
            <div className="input-group">
              <label>Status</label>
              <select value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value})}>
                <option value="Completed">Completed</option>
                <option value="Scheduled">Scheduled</option>
              </select>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="input-group">
              <label>Medicine / Vaccine</label>
              <input value={formData.medicine} onChange={(e) => setFormData({...formData, medicine: e.target.value})} placeholder="e.g. Ivermectin" />
            </div>
            <div className="input-group">
              <label>Dosage</label>
              <input value={formData.dosage} onChange={(e) => setFormData({...formData, dosage: e.target.value})} placeholder="e.g. 10ml" />
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="input-group">
              <label>Date *</label>
              <input type="date" value={formData.date} onChange={(e) => setFormData({...formData, date: e.target.value})} required />
            </div>
            <div className="input-group">
              <label>Next Due Date</label>
              <input type="date" value={formData.nextDueDate} onChange={(e) => setFormData({...formData, nextDueDate: e.target.value})} />
            </div>
          </div>
          <div className="input-group">
            <label>Veterinarian Name</label>
            <input value={formData.veterinarianName} onChange={(e) => setFormData({...formData, veterinarianName: e.target.value})} placeholder="Dr. Sharma" />
          </div>
          <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
            Save Vet Record
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default VetRecords;
