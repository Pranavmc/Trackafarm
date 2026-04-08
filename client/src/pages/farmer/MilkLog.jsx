import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Milk, Plus, Calendar, TrendingUp } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import Modal from '../../components/Modal';

const MilkLog = () => {
  const [records, setRecords] = useState([]);
  const [stats, setStats] = useState({ dailyStats: [], todayLiters: 0, totalLiters: 0 });
  const [animals, setAnimals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [formData, setFormData] = useState({
    animalId: '', quantity: '', session: 'Morning', date: new Date().toISOString().split('T')[0], pricePerLiter: 35
  });

  const fetchData = React.useCallback(async () => {
    try {
      const [recordsRes, statsRes, animalsRes] = await Promise.all([
        axios.get('/milk'),
        axios.get('/milk/stats?period=30'),
        axios.get('/animals')
      ]);
      setRecords(recordsRes.data.records);
      setStats(statsRes.data);
      setAnimals(animalsRes.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching milk data:', err);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/milk', formData);
      setIsModalOpen(false);
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || 'Error saving record');
    }
  };

  return (
    <div style={{ animation: 'slideUpFade 0.6s both' }}>
      <div className="animate-slide-down" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '3rem' }}>
        <div>
          <p style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.2em', color: 'var(--primary-accent)', marginBottom: '0.4rem', opacity: 0.8 }}>🥛 Harvest Intelligence</p>
          <h1 className="text-shimmer" style={{ fontSize: 'clamp(1.8rem, 3vw, 2.8rem)', fontWeight: 900, marginBottom: '0.4rem' }}>Milk Production</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Daily yield tracking and historical production analytics.</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Plus size={20} /> Log Daily Production
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem', marginBottom: '3rem' }}>
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '1.25rem' }}>
              <TrendingUp size={20} color="var(--primary-accent)" /> 30-Day Production Trend
            </h3>
          </div>
          <div style={{ height: '320px', width: '100%', padding: '1rem' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats.dailyStats}>
                <defs>
                  <linearGradient id="colorLiters" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--primary-accent)" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="var(--primary-accent)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="_id" fontSize={11} tickMargin={15} stroke="rgba(255,255,255,0.4)" />
                <YAxis fontSize={11} tickMargin={10} stroke="rgba(255,255,255,0.4)" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(10, 31, 19, 0.9)', 
                    borderRadius: '16px', 
                    border: '1px solid var(--glass-border)',
                    backdropFilter: 'blur(10px)',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
                    color: 'white'
                  }}
                  itemStyle={{ color: 'var(--primary-accent)', fontWeight: 700 }}
                />
                <Area type="monotone" dataKey="totalLiters" stroke="var(--primary-accent)" fillOpacity={1} fill="url(#colorLiters)" strokeWidth={4} dot={{ r: 4, fill: 'var(--primary-accent)' }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <div className="glass-panel" style={{ background: 'linear-gradient(135deg, rgba(0, 229, 255, 0.1) 0%, transparent 100%)', border: '1px solid rgba(0, 229, 255, 0.2)', padding: '2rem' }}>
            <p style={{ color: 'var(--primary-accent)', fontSize: '0.85rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Today's Total Yield</p>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginTop: '1rem' }}>
              <h2 style={{ fontSize: '3.5rem', fontWeight: 800, margin: 0 }}>{stats.todayLiters || 0}</h2>
              <span style={{ fontSize: '1.25rem', opacity: 0.6, fontWeight: 600 }}>Liters</span>
            </div>
            <div style={{ marginTop: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary-accent)', fontSize: '0.85rem', fontWeight: 600 }}>
              <div style={{ width: '8px', height: '8px', background: 'var(--primary-accent)', borderRadius: '50%', animation: 'pulse 1.5s infinite' }}></div>
              Live Synchronization
            </div>
          </div>
          <div className="glass-panel" style={{ background: 'linear-gradient(135deg, rgba(123, 44, 191, 0.1) 0%, transparent 100%)', border: '1px solid rgba(123, 44, 191, 0.2)', padding: '2rem' }}>
            <p style={{ color: 'var(--secondary-accent)', fontSize: '0.85rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Estimated Market Value</p>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginTop: '1rem' }}>
              <h2 style={{ fontSize: '3.5rem', fontWeight: 800, margin: 0 }}>₹{(stats.todayLiters * 35).toLocaleString()}</h2>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '1rem' }}>Calculated at avg ₹35/Liter</p>
          </div>
        </div>
      </div>

      <div className="glass-card" style={{ padding: 0, overflow: 'hidden' }}>
        <h3 style={{ padding: '1.5rem 2rem', borderBottom: '1px solid var(--glass-border)', fontSize: '1.25rem' }}>Recent Harvest Logs</h3>
        <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0 }}>
          <thead>
            <tr>
              <th style={{ padding: '1.25rem 2rem' }}>Date & Session</th>
              <th style={{ padding: '1.25rem' }}>Animal Identity</th>
              <th style={{ padding: '1.25rem' }}>Quantity</th>
              <th style={{ padding: '1.25rem' }}>Unit Price</th>
              <th style={{ padding: '1.25rem 2rem', textAlign: 'right' }}>Total Value</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="5" style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-secondary)' }}>Loading logs...</td></tr>
            ) : records.length === 0 ? (
              <tr><td colSpan="5" style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-secondary)' }}>No records for this period.</td></tr>
            ) : records.map((record, index) => {
              const delayClass = `delay-${Math.min((index + 5) * 100, 1000)}`;
              return (
                <tr key={record._id} className={`animate-slide-up ${delayClass}`} style={{ borderBottom: '1px solid var(--glass-border)', transition: '0.3s' }}>
                  <td style={{ padding: '1.25rem 2rem' }}>
                    <div style={{ fontWeight: 700 }}>{new Date(record.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{record.session} Session</div>
                  </td>
                  <td style={{ padding: '1.25rem' }}>
                    <div style={{ fontWeight: 800, color: 'var(--primary-accent)' }}>{record.animalId?.tagId}</div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{record.animalId?.name || 'Unnamed Cow'}</div>
                  </td>
                  <td style={{ padding: '1.25rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <div className="glass-panel" style={{ padding: '0.4rem', borderRadius: '6px' }}>
                        <Milk size={14} color="var(--primary-accent)" />
                      </div>
                      <span style={{ fontWeight: 800, fontSize: '1.1rem' }}>{record.quantity}</span>
                      <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>L</span>
                    </div>
                  </td>
                  <td style={{ padding: '1.25rem', color: 'var(--text-secondary)' }}>₹{record.pricePerLiter}/L</td>
                  <td style={{ padding: '1.25rem 2rem', textAlign: 'right', fontWeight: 800, color: 'var(--secondary-accent)' }}>
                    ₹{(record.quantity * record.pricePerLiter).toLocaleString()}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Log Milk Production">
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
              <label>Quantity (Liters) *</label>
              <input type="number" step="0.1" value={formData.quantity} onChange={(e) => setFormData({...formData, quantity: e.target.value})} placeholder="10.5" required />
            </div>
            <div className="input-group">
              <label>Session</label>
              <select value={formData.session} onChange={(e) => setFormData({...formData, session: e.target.value})}>
                <option value="Morning">Morning</option>
                <option value="Evening">Evening</option>
              </select>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="input-group">
              <label>Date</label>
              <input type="date" value={formData.date} onChange={(e) => setFormData({...formData, date: e.target.value})} />
            </div>
            <div className="input-group">
              <label>Price per Liter (₹)</label>
              <input type="number" value={formData.pricePerLiter} onChange={(e) => setFormData({...formData, pricePerLiter: e.target.value})} />
            </div>
          </div>
          <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
            Save Record
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default MilkLog;
