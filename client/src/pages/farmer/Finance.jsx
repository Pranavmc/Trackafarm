import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';
import { 
  TrendingUp, DollarSign, Plus, 
  FileText, ArrowDownRight, ArrowUpRight, 
  Wallet, LayoutList, FileCheck
} from 'lucide-react';
import Modal from '../../components/Modal';
import CooperativePayout from '../../components/CooperativePayout';

const Finance = () => {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [summary, setSummary] = useState({ revenue: 0, expenses: 0, profit: 0 });
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('ledger');
  
  const [formData, setFormData] = useState({
    type: 'Expense', category: 'Feed', amount: '', description: '', date: new Date().toISOString().split('T')[0]
  });

  const fetchData = React.useCallback(async () => {
    try {
      const [summaryRes, txRes] = await Promise.all([
        axios.get('/finance/summary'),
        axios.get('/finance/transactions')
      ]);
      setSummary(summaryRes.data);
      setTransactions(txRes.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching finance data:', err);
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/finance/transaction', formData);
      setIsModalOpen(false);
      setFormData({ type: 'Expense', category: 'Feed', amount: '', description: '', date: new Date().toISOString().split('T')[0] });
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || 'Error saving transaction');
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'Feed': return <Plus size={16} />;
      case 'Milk Sale': return <TrendingUp size={16} />;
      default: return <FileText size={16} />;
    }
  };

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '50vh', flexDirection: 'column', gap: '1rem' }}>
      <div style={{ width: '50px', height: '50px', borderRadius: '50%', border: '3px solid transparent', borderTopColor: 'var(--primary-accent)', animation: 'move 0.8s linear infinite' }} />
      <p style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>Loading financial data...</p>
    </div>
  );

  const tabs = [
    { id: 'ledger',  label: 'Ledger', icon: <LayoutList size={16} /> },
    { id: 'payout',  label: 'Cooperative Payout', icon: <FileCheck size={16} /> },
  ];

  return (
    <div>
      {/* ── Header ── */}
      <div className="animate-slide-down" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2.5rem' }}>
        <div>
          <p style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.2em', color: 'var(--primary-accent)', marginBottom: '0.4rem', opacity: 0.8 }}>💰 Financial Hub</p>
          <h1 className="text-shimmer" style={{ fontSize: 'clamp(1.8rem, 3vw, 2.8rem)', fontWeight: 900, marginBottom: '0.4rem' }}>Financial Ledger</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Unified Profit &amp; Loss tracking and cooperative payout monitoring.</p>
        </div>
        {activeTab === 'ledger' && (
          <button onClick={() => setIsModalOpen(true)} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Plus size={20} /> Record Transaction
          </button>
        )}
      </div>

      {/* ── Tabs ── */}
      <div className="animate-slide-up delay-100" style={{ display: 'flex', gap: '0.5rem', marginBottom: '2.5rem', background: 'var(--glass-bg)', backdropFilter: 'var(--glass-blur)', border: '1px solid var(--glass-border)', borderRadius: 'var(--radius-lg)', padding: '0.5rem' }}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.6rem',
              padding: '0.85rem 1.5rem', borderRadius: 'var(--radius-md)',
              border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: '0.9rem',
              transition: 'all 0.3s ease',
              background: activeTab === tab.id
                ? 'linear-gradient(135deg, rgba(0,229,255,0.15), rgba(123,44,191,0.1))'
                : 'transparent',
              color: activeTab === tab.id ? 'var(--primary-accent)' : 'var(--text-secondary)',
              boxShadow: activeTab === tab.id ? 'inset 0 0 0 1px rgba(0,229,255,0.25)' : 'none',
            }}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* ── Ledger Tab ── */}
      {activeTab === 'ledger' && (
        <div key="ledger" style={{ animation: 'slideUpFade 0.5s both' }}>
          {/* Summary Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
            {[
              { label: 'Gross Revenue', value: summary.revenue, icon: <ArrowUpRight size={20} />, accent: 'var(--primary-accent)', bg: 'rgba(0,229,255,0.1)', delay: 100 },
              { label: 'Total Expenses', value: summary.expenses, icon: <ArrowDownRight size={20} />, accent: 'var(--tertiary-accent)', bg: 'rgba(255,42,109,0.1)', delay: 200 },
              { label: 'Net Profit / Loss', value: summary.profit, icon: <Wallet size={20} />, accent: summary.profit >= 0 ? 'var(--primary-accent)' : 'var(--tertiary-accent)', bg: summary.profit >= 0 ? 'rgba(0,229,255,0.05)' : 'rgba(255,42,109,0.05)', delay: 300 },
            ].map(({ label, value, icon, accent, bg, delay }) => (
              <div key={label} className={`glass-card animate-slide-up delay-${delay}`} style={{ borderLeft: `4px solid ${accent}`, background: bg }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', margin: 0 }}>{label}</p>
                  <div style={{ background: `${accent}18`, padding: '0.5rem', borderRadius: '10px', color: accent }}>{icon}</div>
                </div>
                <h2 style={{ fontSize: '2.5rem', fontWeight: 900, marginTop: '1rem', margin: '1rem 0 0', color: label === 'Net Profit / Loss' ? accent : 'var(--text-primary)' }}>
                  ₹{(value || 0).toLocaleString()}
                </h2>
              </div>
            ))}
          </div>

          {/* Transaction Table */}
          <div className="glass-card animate-scale-in delay-400" style={{ padding: 0, overflow: 'hidden' }}>
            <h3 style={{ padding: '2rem', borderBottom: '1px solid var(--glass-border)', fontSize: '1.3rem', margin: 0, display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <FileText size={20} color="var(--primary-accent)" /> Transaction History
            </h3>
            <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0 }}>
              <thead>
                <tr style={{ textAlign: 'left', color: 'var(--text-secondary)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  <th style={{ padding: '1.25rem 2rem' }}>Date</th>
                  <th style={{ padding: '1.25rem' }}>Category</th>
                  <th style={{ padding: '1.25rem' }}>Description</th>
                  <th style={{ padding: '1.25rem' }}>Type</th>
                  <th style={{ padding: '1.25rem 2rem', textAlign: 'right' }}>Amount</th>
                </tr>
              </thead>
              <tbody>
                {transactions.length === 0 ? (
                  <tr><td colSpan="5" style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-secondary)' }}>No transactions found for this period.</td></tr>
                ) : transactions.map((tx, index) => {
                  const dl = `delay-${Math.min((index + 5) * 100, 1000)}`;
                  return (
                    <tr key={tx._id} className={`animate-slide-up ${dl}`} style={{ borderBottom: '1px solid var(--glass-border)' }}>
                      <td style={{ padding: '1.5rem 2rem', fontWeight: 700 }}>{new Date(tx.date).toLocaleDateString()}</td>
                      <td style={{ padding: '1.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                          <div style={{ background: 'rgba(255,255,255,0.05)', padding: '0.4rem', borderRadius: '8px' }}>{getCategoryIcon(tx.category)}</div>
                          {tx.category}
                        </div>
                      </td>
                      <td style={{ padding: '1.5rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{tx.description || '—'}</td>
                      <td style={{ padding: '1.5rem' }}>
                        <span style={{
                          padding: '0.35rem 0.9rem', borderRadius: '100px', fontSize: '0.72rem', fontWeight: 800,
                          background: tx.type === 'Revenue' ? 'rgba(0,229,255,0.1)' : 'rgba(255,42,109,0.1)',
                          color: tx.type === 'Revenue' ? 'var(--primary-accent)' : 'var(--tertiary-accent)'
                        }}>{tx.type.toUpperCase()}</span>
                      </td>
                      <td style={{ padding: '1.5rem 2rem', textAlign: 'right', fontWeight: 900, fontSize: '1.05rem', color: tx.type === 'Revenue' ? 'var(--primary-accent)' : 'var(--text-primary)' }}>
                        {tx.type === 'Revenue' ? `+₹${tx.amount.toLocaleString()}` : `-₹${tx.amount.toLocaleString()}`}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── Cooperative Payout Tab ── */}
      {activeTab === 'payout' && (
        <div key="payout" style={{ animation: 'slideUpFade 0.5s both' }}>
          <CooperativePayout
            transactions={transactions}
            summary={summary}
            farmerName={user?.name}
            farmName={user?.farmName}
          />
        </div>
      )}

      {/* ── Record Transaction Modal ── */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Record Transaction">
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Transaction Type *</label>
            <select value={formData.type} onChange={(e) => setFormData({...formData, type: e.target.value})}>
              <option value="Expense">Expense</option>
              <option value="Revenue">Revenue</option>
            </select>
          </div>
          <div className="input-group">
            <label>Category *</label>
            <select value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})}>
              {formData.type === 'Expense' ? (
                <>
                  <option value="Feed">Feed Inventory</option>
                  <option value="Medicine">Medicine/Vet</option>
                  <option value="Labor">Labor Costs</option>
                  <option value="Utility">Utilities</option>
                  <option value="Other">Other Expense</option>
                </>
              ) : (
                <>
                  <option value="Milk Sale">Milk Harvest Sale</option>
                  <option value="Animal Sale">Livestock Sale</option>
                  <option value="Other">Other Revenue</option>
                </>
              )}
            </select>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="input-group">
              <label>Amount (₹) *</label>
              <input type="number" required value={formData.amount} onChange={(e) => setFormData({...formData, amount: e.target.value})} placeholder="0.00" />
            </div>
            <div className="input-group">
              <label>Date</label>
              <input type="date" value={formData.date} onChange={(e) => setFormData({...formData, date: e.target.value})} />
            </div>
          </div>
          <div className="input-group">
            <label>Description</label>
            <textarea value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} placeholder="Details (Supplier name, cow ID, etc.)" />
          </div>
          <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '1rem' }}>Confirm Entry</button>
        </form>
      </Modal>
    </div>
  );
};

export default Finance;
