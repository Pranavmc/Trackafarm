import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FileText, Download, FileSpreadsheet, Filter, CheckCircle2 } from 'lucide-react';
import api from '../../lib/api';

const Reports = () => {
  const [animals, setAnimals] = useState([]);
  const [filters, setFilters] = useState({
    type: 'milk',
    startDate: '',
    endDate: '',
    animalId: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchAnimals = async () => {
      try {
        const res = await axios.get('/animals');
        setAnimals(res.data);
      } catch (err) {
        console.error('Error fetching animals:', err);
      }
    };
    fetchAnimals();
  }, []);

  const handleDownload = async (format) => {
    setLoading(true);
    try {
      const { type, startDate, endDate, animalId } = filters;
      const query = `type=${type}&startDate=${startDate}&endDate=${endDate}&animalId=${animalId}`;
      const baseUrl = api.defaults.baseURL || '/api';
      const url = `${baseUrl}/reports/${format}?${query}`;
      
      const response = await axios({
        url,
        method: 'GET',
        responseType: 'blob',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      const blob = new Blob([response.data], { type: format === 'pdf' ? 'application/pdf' : 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = `${type}_report_${new Date().toISOString().split('T')[0]}.${format === 'pdf' ? 'pdf' : 'xlsx'}`;
      link.click();
    } catch (err) {
      console.error(err);
      alert('Error generating report. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ animation: 'fadeIn 0.7s ease-out' }}>
      <div style={{ marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Data Export & Reports</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Generate professional audits and financial records for your farm operations.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(400px, 1.5fr) 1fr', gap: '2.5rem' }}>
        <div className="glass-card">
          <h3 style={{ marginBottom: '2.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '1.25rem', color: 'var(--primary-accent)' }}>
            <Filter size={24} /> Configure Report Parameters
          </h3>
          
          <div className="input-group">
            <label>Report Classification</label>
            <select value={filters.type} onChange={(e) => setFilters({...filters, type: e.target.value})}>
              <option value="milk">Milk Production Analytics</option>
              <option value="vet">Veterinary Medical History</option>
              <option value="feed">Feed & Resource Logs</option>
            </select>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <div className="input-group">
              <label>Temporal Range Start</label>
              <input type="date" value={filters.startDate} onChange={(e) => setFilters({...filters, startDate: e.target.value})} />
            </div>
            <div className="input-group">
              <label>Temporal Range End</label>
              <input type="date" value={filters.endDate} onChange={(e) => setFilters({...filters, endDate: e.target.value})} />
            </div>
          </div>

          <div className="input-group" style={{ marginBottom: '0' }}>
            <label>Subject Animal (Optional filter)</label>
            <select value={filters.animalId} onChange={(e) => setFilters({...filters, animalId: e.target.value})}>
              <option value="">All Farm Livestock</option>
              {animals.map(a => <option key={a._id} value={a._id}>{a.tagId} - {a.name || 'Unnamed'}</option>)}
            </select>
          </div>

          <div style={{ display: 'flex', gap: '1.5rem', marginTop: '3.5rem' }}>
            <button 
              onClick={() => handleDownload('pdf')} 
              className="btn-primary" 
              style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', height: '56px' }}
              disabled={loading}
            >
              <FileText size={20} /> Generate PDF
            </button>
            <button 
              onClick={() => handleDownload('excel')} 
              style={{ 
                flex: 1, 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                gap: '0.75rem', 
                height: '56px',
                background: 'var(--glass-white)',
                border: '1px solid var(--glass-border)',
                color: 'var(--primary-accent)',
                borderRadius: 'var(--radius-lg)',
                fontWeight: 800,
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                cursor: 'pointer',
                transition: 'var(--transition-smooth)'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.background = 'rgba(0, 255, 136, 0.1)';
                e.currentTarget.style.borderColor = 'rgba(0, 255, 136, 0.3)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = 'var(--glass-white)';
                e.currentTarget.style.borderColor = 'var(--glass-border)';
              }}
              disabled={loading}
            >
              <FileSpreadsheet size={20} /> Export Excel
            </button>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <div className="glass-card" style={{ borderLeft: '4px solid var(--primary-accent)', padding: '2rem' }}>
            <h4 style={{ marginBottom: '1.5rem', fontSize: '1.1rem', color: 'var(--text-primary)' }}>Report Specification</h4>
            <ul style={{ listStyle: 'none', color: 'var(--text-secondary)', fontSize: '0.95rem', padding: 0 }}>
              <li style={{ marginBottom: '1.25rem', display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                <CheckCircle2 size={20} color="var(--primary-accent)" style={{ flexShrink: 0, marginTop: '2px' }} /> 
                <span style={{ lineHeight: '1.4' }}>Complete transaction history logs</span>
              </li>
              <li style={{ marginBottom: '1.25rem', display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                <CheckCircle2 size={20} color="var(--primary-accent)" style={{ flexShrink: 0, marginTop: '2px' }} /> 
                <span style={{ lineHeight: '1.4' }}>Aggregated production metrics</span>
              </li>
              <li style={{ marginBottom: '1.25rem', display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                <CheckCircle2 size={20} color="var(--primary-accent)" style={{ flexShrink: 0, marginTop: '2px' }} /> 
                <span style={{ lineHeight: '1.4' }}>Professional corporate branding</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                <CheckCircle2 size={20} color="var(--primary-accent)" style={{ flexShrink: 0, marginTop: '2px' }} /> 
                <span style={{ lineHeight: '1.4' }}>Audit-compliant formatting</span>
              </li>
            </ul>
          </div>
          <div className="glass-card" style={{ 
            textAlign: 'center', 
            padding: '3rem 2rem', 
            border: '1px dashed rgba(0, 255, 136, 0.3)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'var(--forest-glow)'
          }}>
            <div style={{ 
              width: '80px', 
              height: '80px', 
              borderRadius: '50%', 
              background: 'var(--bg-main)', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              marginBottom: '1.5rem',
              boxShadow: '0 10px 30px rgba(0,255,136,0.2)'
            }}>
              <Download size={32} color="var(--primary-accent)" />
            </div>
            <p style={{ color: 'var(--text-primary)', lineHeight: '1.6', fontWeight: 500 }}>
              Select your filters above <br /> and system will compile <br /> your secure download.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
