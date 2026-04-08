import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Shovel, Plus, Droplets, Package, AlertTriangle, TrendingDown, ArrowUpCircle } from 'lucide-react';
import Modal from '../../components/Modal';

const FeedLog = () => {
  const [logs, setLogs] = useState([]);
  const [animals, setAnimals] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [milkStats, setMilkStats] = useState({ totalLiters: 0 });
  const [loading, setLoading] = useState(true);
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [isRestockModalOpen, setIsRestockModalOpen] = useState(false);
  
  const [formData, setFormData] = useState({
    animalId: '', feedType: 'Silage', feedQuantityKg: '', waterLiters: '', cost: '', date: new Date().toISOString().split('T')[0]
  });

  const [restockData, setRestockData] = useState({
    feedType: 'Silage', quantityKg: '', unitCost: ''
  });

  const fetchData = React.useCallback(async () => {
    try {
      const [logsRes, animalsRes, invRes, milkRes] = await Promise.all([
        axios.get('/feed'),
        axios.get('/animals'),
        axios.get('/feed/inventory'),
        axios.get('/milk/stats?period=30')
      ]);
      setLogs(logsRes.data);
      setAnimals(animalsRes.data);
      setInventory(invRes.data);
      setMilkStats(milkRes.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching feed data:', err);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSubmitLog = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/feed', formData);
      setIsLogModalOpen(false);
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || 'Error saving log');
    }
  };

  const handleRestock = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/feed/inventory/restock', restockData);
      setIsRestockModalOpen(false);
      setRestockData({ feedType: 'Silage', quantityKg: '', unitCost: '' });
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || 'Error restocking');
    }
  };

  const getStockColor = (item) => {
    if (item.quantityKg <= 0) return 'var(--tertiary-accent)';
    if (item.quantityKg <= item.lowStockThreshold) return 'var(--secondary-accent)';
    return 'var(--primary-accent)';
  };

  return (
    <div style={{ animation: 'slideUpFade 0.6s both' }}>
      {/* Header Area */}
      <div className="animate-slide-down" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '3rem' }}>
        <div>
          <p style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.2em', color: 'var(--primary-accent)', marginBottom: '0.4rem', opacity: 0.8 }}>📦 Resource Logistics</p>
          <h1 className="text-shimmer" style={{ fontSize: 'clamp(1.8rem, 3vw, 2.8rem)', fontWeight: 900, marginBottom: '0.4rem' }}>Feed & Resource Hub</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Monitor inventory levels, log daily feeding, and optimize nutrition.</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button onClick={() => setIsRestockModalOpen(true)} className="btn-primary" style={{ background: 'transparent', border: '1px solid var(--secondary-accent)', color: 'var(--secondary-accent)', display: 'flex', alignItems: 'center', gap: '0.6rem', boxShadow: 'none' }}>
            <ArrowUpCircle size={18} /> Restock Inventory
          </button>
          <button onClick={() => setIsLogModalOpen(true)} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Plus size={20} /> Log Daily Intake
          </button>
        </div>
      </div>

      {/* Analytics & Correlation Section */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem', marginBottom: '4rem' }}>
        <div className="glass-panel animate-slide-up delay-100" style={{ background: 'linear-gradient(135deg, rgba(0, 229, 255, 0.1) 0%, transparent 100%)', border: '1px solid rgba(0, 229, 255, 0.2)', padding: '2rem' }}>
          <p style={{ color: 'var(--primary-accent)', fontSize: '0.85rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Feed Conversion Ratio (FCR)</p>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginTop: '1rem' }}>
            <h2 style={{ fontSize: '3.5rem', fontWeight: 900, margin: 0 }}>
              {milkStats.totalLiters > 0 ? (logs.reduce((acc, l) => acc + l.feedQuantityKg, 0) / milkStats.totalLiters).toFixed(2) : '0.00'}
            </h2>
            <span style={{ fontSize: '1.25rem', opacity: 0.6, fontWeight: 600 }}>kg/L</span>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '1rem', lineHeight: 1.5 }}>
            Amount of feed required to produce 1 Liter of milk. <br/>
            <span style={{ color: 'var(--primary-accent)', fontWeight: 700 }}>Lower ratio = Higher efficiency.</span>
          </p>
        </div>

        <div className="glass-card animate-slide-up delay-200" style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', padding: '2rem' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', textTransform: 'uppercase', marginBottom: '0.5rem' }}>30D Feed Consumed</div>
            <div style={{ fontSize: '2rem', fontWeight: 900 }}>{logs.reduce((acc, l) => acc + l.feedQuantityKg, 0).toLocaleString()} <span style={{ fontSize: '1rem', opacity: 0.5 }}>kg</span></div>
          </div>
          <div style={{ width: '1px', height: '60px', background: 'var(--glass-border)' }}></div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', textTransform: 'uppercase', marginBottom: '0.5rem' }}>30D Milk Produced</div>
            <div style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--primary-accent)' }}>{milkStats.totalLiters?.toLocaleString()} <span style={{ fontSize: '1rem', opacity: 0.5 }}>L</span></div>
          </div>
          <div style={{ width: '1px', height: '60px', background: 'var(--glass-border)' }}></div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Resource ROI</div>
            <div style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--secondary-accent)' }}>+12.4%</div>
          </div>
        </div>
      </div>

      {/* Inventory Silo Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '4rem' }}>
        {inventory.length > 0 ? inventory.map((item, idx) => {
          const delayClass = `delay-${Math.min((idx + 3) * 100, 1000)}`;
          return (
          <div key={idx} className={`glass-card animate-scale-in ${delayClass}`} style={{ 
            padding: '1.5rem', 
            border: item.quantityKg <= item.lowStockThreshold ? `1px solid ${getStockColor(item)}` : '1px solid var(--glass-border)',
            boxShadow: item.quantityKg <= item.lowStockThreshold ? `0 0 20px -5px ${getStockColor(item)}` : 'var(--card-shadow)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <div style={{ color: getStockColor(item), display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Package size={20} />
                <span style={{ fontWeight: 800, fontSize: '0.9rem', textTransform: 'uppercase' }}>{item.feedType}</span>
              </div>
              {item.quantityKg <= item.lowStockThreshold && (
                <div style={{ color: getStockColor(item), animation: 'pulse 1.5s infinite' }}>
                  <AlertTriangle size={18} />
                </div>
              )}
            </div>
            
            <div style={{ marginBottom: '1rem' }}>
              <div style={{ fontSize: '2rem', fontWeight: 900, marginBottom: '0.25rem' }}>
                {item.quantityKg.toLocaleString()} <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 400 }}>kg</span>
              </div>
              <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '10px', overflow: 'hidden' }}>
                <div style={{ 
                  width: `${Math.min(100, (item.quantityKg / (item.lowStockThreshold * 5)) * 100)}%`, 
                  height: '100%', 
                  background: getStockColor(item),
                  boxShadow: `0 0 10px ${getStockColor(item)}`
                }}></div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              <span>Threshold: {item.lowStockThreshold}kg</span>
              <span>{item.quantityKg <= item.lowStockThreshold ? 'LOW STOCK' : 'OPTIMAL'}</span>
            </div>
          </div>
        )}) : (
          <div className="glass-panel" style={{ gridColumn: '1 / -1', padding: '3rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
            No inventory records found. Start by restocking your silo.
          </div>
        )}
      </div>

      {/* Consumption History Table */}
      <div className="glass-card animate-slide-up delay-400" style={{ padding: 0, overflow: 'hidden' }}>
        <h3 style={{ padding: '2rem', borderBottom: '1px solid var(--glass-border)', fontSize: '1.5rem', margin: 0 }}>Recent Intake Activity</h3>
        <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0 }}>
          <thead>
            <tr style={{ textAlign: 'left', color: 'var(--text-secondary)', textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.1em' }}>
              <th style={{ padding: '1.5rem 2rem' }}>Date</th>
              <th style={{ padding: '1.5rem' }}>Animal Identity</th>
              <th style={{ padding: '1.5rem' }}>Resource Type</th>
              <th style={{ padding: '1.5rem' }}>Feed Quantity</th>
              <th style={{ padding: '1.5rem' }}>Water Intake</th>
              <th style={{ padding: '1.5rem 2rem', textAlign: 'right' }}>Resource Cost</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="6" style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-secondary)' }}>Loading logs...</td></tr>
            ) : logs.length === 0 ? (
              <tr><td colSpan="6" style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-secondary)' }}>No resource logs recorded.</td></tr>
            ) : logs.map((log, index) => {
              const delayClass = `delay-${Math.min((index + 5) * 100, 1000)}`;
              return (
              <tr key={log._id} className={`glass-panel-hover animate-slide-right ${delayClass}`} style={{ transition: '0.3s', animationFillMode: 'both' }}>
                <td style={{ padding: '1.5rem 2rem' }}>
                  <div style={{ fontWeight: 700 }}>{new Date(log.date).toLocaleDateString()}</div>
                </td>
                <td style={{ padding: '1.5rem' }}>
                  <div style={{ fontWeight: 800, color: 'var(--primary-accent)' }}>{log.animalId?.tagId}</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{log.animalId?.name}</div>
                </td>
                <td style={{ padding: '1.5rem' }}>{log.feedType}</td>
                <td style={{ padding: '1.5rem', fontWeight: 600 }}>{log.feedQuantityKg} <span style={{ opacity: 0.5 }}>kg</span></td>
                <td style={{ padding: '1.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Droplets size={16} color="var(--primary-accent)" style={{ opacity: 0.8 }} />
                    <span style={{ fontWeight: 600 }}>{log.waterLiters}</span> <span style={{ opacity: 0.5 }}>L</span>
                  </div>
                </td>
                <td style={{ padding: '1.5rem 2rem', textAlign: 'right', fontWeight: 800, color: 'var(--secondary-accent)' }}>
                  {log.cost ? `₹${log.cost.toLocaleString()}` : '—'}
                </td>
              </tr>
            );
          })}
          </tbody>
        </table>
      </div>

      {/* Log Intake Modal */}
      <Modal isOpen={isLogModalOpen} onClose={() => setIsLogModalOpen(false)} title="Log Resource Intake">
        <form onSubmit={handleSubmitLog}>
          <div className="input-group">
            <label>Select Animal *</label>
            <select value={formData.animalId} onChange={(e) => setFormData({...formData, animalId: e.target.value})} required>
              <option value="">Choose a cow...</option>
              {animals.map(a => <option key={a._id} value={a._id}>{a.tagId} - {a.name}</option>)}
            </select>
          </div>
          <div className="input-group">
            <label>Feed Type *</label>
            <select value={formData.feedType} onChange={(e) => setFormData({...formData, feedType: e.target.value})} required>
              <option value="Silage">Silage</option>
              <option value="Hay">Hay</option>
              <option value="Dairy Meal">Dairy Meal</option>
              <option value="Concentrate">Concentrate</option>
              <option value="Green Fodder">Green Fodder</option>
              <option value="Grains">Grains</option>
            </select>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="input-group">
              <label>Quantity (kg) *</label>
              <input type="number" step="0.1" value={formData.feedQuantityKg} onChange={(e) => setFormData({...formData, feedQuantityKg: e.target.value})} placeholder="5.0" required />
            </div>
            <div className="input-group">
              <label>Water (Liters)</label>
              <input type="number" step="0.1" value={formData.waterLiters} onChange={(e) => setFormData({...formData, waterLiters: e.target.value})} placeholder="40.0" />
            </div>
          </div>
          <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
            Deduct from Silo & Save Log
          </button>
        </form>
      </Modal>

      {/* Restock Inventory Modal */}
      <Modal isOpen={isRestockModalOpen} onClose={() => setIsRestockModalOpen(false)} title="Restock Silo Inventory">
        <form onSubmit={handleRestock}>
          <div className="input-group">
            <label>Feed Type *</label>
            <select value={restockData.feedType} onChange={(e) => setRestockData({...restockData, feedType: e.target.value})} required>
              <option value="Silage">Silage</option>
              <option value="Hay">Hay</option>
              <option value="Dairy Meal">Dairy Meal</option>
              <option value="Concentrate">Concentrate</option>
              <option value="Green Fodder">Green Fodder</option>
              <option value="Grains">Grains</option>
            </select>
          </div>
          <div className="input-group">
            <label>Arrival Quantity (kg) *</label>
            <input type="number" value={restockData.quantityKg} onChange={(e) => setRestockData({...restockData, quantityKg: e.target.value})} placeholder="e.g. 1000" required />
          </div>
          <div className="input-group">
            <label>Unit Cost (₹/kg)</label>
            <input type="number" step="0.1" value={restockData.unitCost} onChange={(e) => setRestockData({...restockData, unitCost: e.target.value})} placeholder="Optional cost tracking" />
          </div>
          <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '1rem', background: 'var(--secondary-accent)' }}>
            Confirm Silo Restock
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default FeedLog;
