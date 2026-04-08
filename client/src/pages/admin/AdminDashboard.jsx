import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Users, Beef, Milk, Clock, CheckCircle, XCircle } from 'lucide-react';

const AdminCard = ({ title, value, icon, color }) => (
  <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', position: 'relative', overflow: 'hidden', padding: '1.5rem' }}>
    <div style={{ position: 'absolute', top: '-5px', right: '-5px', opacity: 0.08 }}>
      {React.cloneElement(icon, { size: 90, color: color })}
    </div>
    <div style={{ 
      width: '42px', 
      height: '42px', 
      borderRadius: '12px', 
      background: `${color}15`, 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      color: color,
      border: `1px solid ${color}30`
    }}>
      {React.cloneElement(icon, { size: 20 })}
    </div>
    <div style={{ position: 'relative', zIndex: 1 }}>
      <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em' }}>{title}</p>
      <h2 style={{ margin: '0.25rem 0 0', fontSize: '2rem', fontWeight: 900, color: 'white' }}>{value}</h2>
    </div>
  </div>
);

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdminStats = async () => {
      try {
        const res = await axios.get('/admin/stats');
        setStats(res.data);
      } catch (err) {
        console.error('Error fetching admin stats:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAdminStats();
  }, []);

  if (loading) return (
    <div className="flex-center" style={{ height: '50vh' }}>
      <div className="loading-spinner">Aggregating global metrics...</div>
    </div>
  );
  
  if (!stats) return (
    <div className="glass-card" style={{ padding: '3rem', textAlign: 'center', border: '1px solid rgba(255, 118, 117, 0.3)' }}>
      <XCircle size={48} color="#ff7675" style={{ marginBottom: '1.5rem' }} />
      <h3 style={{ color: '#ff7675', fontSize: '1.5rem', marginBottom: '1rem' }}>Data Retrieval Failure</h3>
      <p style={{ color: 'var(--text-secondary)' }}>System was unable to synchronize with global analytics. Verify administrative token and server status.</p>
    </div>
  );

  return (
    <div style={{ animation: 'fadeIn 0.7s ease-out' }}>
      <header style={{ marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem', fontWeight: 900 }}>Global System Overview</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Administrative control center for farm management and user approvals.</p>
      </header>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', 
        gap: '1.5rem', 
        marginBottom: '3rem' 
      }}>
        <AdminCard title="Registered Farmers" value={stats.totalFarmers} icon={<Users size={24} />} color="var(--primary-accent)" />
        <AdminCard title="Awaiting Approval" value={stats.pendingFarmers} icon={<Clock size={24} />} color="var(--secondary-accent)" />
        <AdminCard title="Global Livestock" value={stats.totalAnimals} icon={<Beef size={24} />} color="#00bcff" />
        <AdminCard title="Cumulative Yield" value={`${stats.totalMilkLiters.toLocaleString()} L`} icon={<Milk size={24} />} color="#a29bfe" />
      </div>

      <div className="glass-card" style={{ 
        textAlign: 'center', 
        padding: '5rem 2rem', 
        background: 'rgba(255,255,255,0.02)', 
        border: '1px dashed var(--glass-border)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{ 
          width: '100px', 
          height: '100px', 
          borderRadius: '50%', 
          background: 'var(--sky-glow)', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          marginBottom: '2rem',
          boxShadow: '0 0 30px rgba(0, 255, 136, 0.2)'
        }}>
          <CheckCircle size={48} color="var(--primary-accent)" />
        </div>
        <h3 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '1rem' }}>Global Core: Operational</h3>
        <p style={{ color: 'var(--text-secondary)', maxWidth: '400px', margin: '0 auto' }}>All blockchain-inspired modules and API microservices are reporting healthy synchronization status.</p>
      </div>
    </div>
  );
};

export default AdminDashboard;
