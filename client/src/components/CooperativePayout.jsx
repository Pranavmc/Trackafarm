import React, { useState, useRef } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Download, FileText, Printer, CheckCircle, Building } from 'lucide-react';

/**
 * CooperativePayout – a printable payout statement generator.
 * Props:
 *   transactions: array of transaction objects
 *   summary: { revenue, expenses, profit }
 *   farmerName: string
 *   farmName: string
 */
const CooperativePayout = ({ transactions = [], summary = {}, farmerName = '', farmName = '' }) => {
  const statementRef = useRef(null);
  const [generating, setGenerating] = useState(false);
  const [done, setDone] = useState(false);

  const period = `01 Mar 2026 – 31 Mar 2026`;
  const today = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' });
  const refNo = `TF-${Date.now().toString(36).toUpperCase()}`;

  const milkRevenue = transactions
    .filter(t => t.type === 'Revenue')
    .reduce((s, t) => s + (t.amount || 0), 0);

  const totalDeductions = transactions
    .filter(t => t.type === 'Expense' && ['Feed', 'Medicine', 'Labor'].includes(t.category))
    .reduce((s, t) => s + (t.amount || 0), 0);

  const netPayable = milkRevenue - totalDeductions;

  const handleDownloadPDF = async () => {
    if (!statementRef.current) return;
    setGenerating(true);
    try {
      const canvas = await html2canvas(statementRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
      });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`TrackaFarm_Payout_${farmerName.replace(/\s/g, '_')}_Mar2026.pdf`);
      setDone(true);
      setTimeout(() => setDone(false), 3000);
    } catch (err) {
      console.error('PDF generation error:', err);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div>
      {/* — Action bar — */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
        <div>
          <h3 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 900 }}>Cooperative Payout Statement</h3>
          <p style={{ margin: '0.25rem 0 0', color: 'var(--text-secondary)', fontSize: '0.88rem' }}>
            Official monthly statement for cooperative submission
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button
            onClick={handleDownloadPDF}
            disabled={generating}
            className="btn-primary"
            style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.85rem 1.75rem', fontSize: '0.9rem' }}
          >
            {done
              ? <><CheckCircle size={18} /> Downloaded!</>
              : generating
                ? <><span style={{ width: '16px', height: '16px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', display: 'inline-block', animation: 'move 0.7s linear infinite' }} /> Generating…</>
                : <><Download size={18} /> Export PDF</>
            }
          </button>
        </div>
      </div>

      {/* — Printable statement (white background for PDF capture) — */}
      <div
        ref={statementRef}
        style={{
          background: '#ffffff',
          color: '#0f172a',
          borderRadius: '16px',
          padding: '3rem',
          fontFamily: "'Inter', sans-serif",
          boxShadow: '0 4px 40px rgba(0,0,0,0.15)',
          border: '1px solid rgba(0,0,0,0.06)',
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', paddingBottom: '2rem', borderBottom: '2px solid #e2e8f0', marginBottom: '2rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'linear-gradient(135deg, #00E5FF, #7B2CBF)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Building size={22} color="#fff" />
              </div>
              <div>
                <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 900, color: '#0f172a' }}>TrackaFarm</h2>
                <p style={{ margin: 0, fontSize: '0.7rem', color: '#64748b', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Dairy Cooperative Management System</p>
              </div>
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <p style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800, color: '#0f172a' }}>PAYOUT STATEMENT</p>
            <p style={{ margin: '0.25rem 0', fontSize: '0.8rem', color: '#64748b' }}>Ref: <strong style={{ color: '#7B2CBF' }}>{refNo}</strong></p>
            <p style={{ margin: 0, fontSize: '0.8rem', color: '#64748b' }}>Issued: {today}</p>
          </div>
        </div>

        {/* Farmer Info */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
          <div style={{ background: '#f8fafc', borderRadius: '12px', padding: '1.25rem', border: '1px solid #e2e8f0' }}>
            <p style={{ margin: '0 0 0.75rem', fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.12em', color: '#94a3b8' }}>Farmer Details</p>
            <p style={{ margin: '0 0 0.25rem', fontWeight: 800, fontSize: '1rem', color: '#0f172a' }}>{farmerName || '—'}</p>
            <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748b' }}>{farmName || 'Farm Name Not Set'}</p>
            <p style={{ margin: '0.25rem 0 0', fontSize: '0.8rem', color: '#94a3b8' }}>Membership: Active</p>
          </div>
          <div style={{ background: '#f8fafc', borderRadius: '12px', padding: '1.25rem', border: '1px solid #e2e8f0' }}>
            <p style={{ margin: '0 0 0.75rem', fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.12em', color: '#94a3b8' }}>Statement Period</p>
            <p style={{ margin: '0 0 0.25rem', fontWeight: 800, fontSize: '1rem', color: '#0f172a' }}>{period}</p>
            <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748b' }}>Cooperative: TrackaFarm Dairy Ltd.</p>
            <p style={{ margin: '0.25rem 0 0', fontSize: '0.8rem', color: '#94a3b8' }}>Settlement: Bank Transfer</p>
          </div>
        </div>

        {/* Transaction Table */}
        <p style={{ margin: '0 0 0.75rem', fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.12em', color: '#94a3b8' }}>Transaction Breakdown</p>
        <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '2rem', fontSize: '0.85rem' }}>
          <thead>
            <tr style={{ background: '#f1f5f9' }}>
              <th style={{ padding: '0.85rem 1rem', textAlign: 'left', fontWeight: 700, color: '#475569', fontSize: '0.75rem', textTransform: 'uppercase' }}>Date</th>
              <th style={{ padding: '0.85rem 1rem', textAlign: 'left', fontWeight: 700, color: '#475569', fontSize: '0.75rem', textTransform: 'uppercase' }}>Description</th>
              <th style={{ padding: '0.85rem 1rem', textAlign: 'left', fontWeight: 700, color: '#475569', fontSize: '0.75rem', textTransform: 'uppercase' }}>Category</th>
              <th style={{ padding: '0.85rem 1rem', textAlign: 'left', fontWeight: 700, color: '#475569', fontSize: '0.75rem', textTransform: 'uppercase' }}>Type</th>
              <th style={{ padding: '0.85rem 1rem', textAlign: 'right', fontWeight: 700, color: '#475569', fontSize: '0.75rem', textTransform: 'uppercase' }}>Amount (₹)</th>
            </tr>
          </thead>
          <tbody>
            {transactions.length > 0 ? transactions.slice(0, 20).map((tx, i) => (
              <tr key={i} style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: '0.75rem 1rem', color: '#64748b' }}>{new Date(tx.date).toLocaleDateString('en-IN')}</td>
                <td style={{ padding: '0.75rem 1rem', color: '#0f172a', fontWeight: 500 }}>{tx.description || tx.category}</td>
                <td style={{ padding: '0.75rem 1rem', color: '#64748b' }}>{tx.category}</td>
                <td style={{ padding: '0.75rem 1rem' }}>
                  <span style={{
                    padding: '0.2rem 0.65rem', borderRadius: '100px', fontSize: '0.72rem', fontWeight: 700,
                    background: tx.type === 'Revenue' ? '#dcfce7' : '#fee2e2',
                    color: tx.type === 'Revenue' ? '#16a34a' : '#dc2626'
                  }}>
                    {tx.type}
                  </span>
                </td>
                <td style={{ padding: '0.75rem 1rem', textAlign: 'right', fontWeight: 700, color: tx.type === 'Revenue' ? '#16a34a' : '#dc2626' }}>
                  {tx.type === 'Revenue' ? '+' : '-'}₹{(tx.amount || 0).toLocaleString()}
                </td>
              </tr>
            )) : (
              <tr><td colSpan="5" style={{ padding: '2rem', textAlign: 'center', color: '#94a3b8' }}>No transactions recorded for this period.</td></tr>
            )}
          </tbody>
        </table>

        {/* Summary boxes */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', marginBottom: '2rem' }}>
          {[
            { label: 'Gross Revenue', value: milkRevenue, color: '#16a34a', bg: '#f0fdf4', border: '#86efac' },
            { label: 'Total Deductions', value: totalDeductions, color: '#dc2626', bg: '#fef2f2', border: '#fca5a5' },
            { label: 'Net Payable', value: netPayable, color: '#7B2CBF', bg: '#faf5ff', border: '#c4b5fd' },
          ].map(({ label, value, color, bg, border }) => (
            <div key={label} style={{ background: bg, border: `1px solid ${border}`, borderRadius: '12px', padding: '1.25rem', textAlign: 'center' }}>
              <p style={{ margin: '0 0 0.4rem', fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#94a3b8' }}>{label}</p>
              <p style={{ margin: 0, fontSize: '1.6rem', fontWeight: 900, color }}>₹{value.toLocaleString()}</p>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div>
            <p style={{ margin: 0, fontSize: '0.75rem', color: '#94a3b8', maxWidth: '380px', lineHeight: 1.6 }}>
              This statement is system-generated by TrackaFarm Dairy Management. For disputes, contact your cooperative manager within 7 days of issue date.
            </p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ borderTop: '2px solid #0f172a', paddingTop: '0.5rem', marginTop: '2.5rem', width: '160px' }}>
              <p style={{ margin: 0, fontSize: '0.75rem', fontWeight: 700, color: '#0f172a' }}>Authorised Signature</p>
              <p style={{ margin: 0, fontSize: '0.7rem', color: '#94a3b8' }}>TrackaFarm Cooperative</p>
            </div>
          </div>
        </div>

        {/* Official stamp strip */}
        <div style={{ marginTop: '1.5rem', padding: '0.75rem 1rem', background: 'linear-gradient(90deg, #00E5FF10, #7B2CBF10)', border: '1px solid #7B2CBF30', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <CheckCircle size={18} color="#7B2CBF" />
          <p style={{ margin: 0, fontSize: '0.78rem', fontWeight: 700, color: '#7B2CBF' }}>
            VERIFIED & GENERATED — TrackaFarm Dairy Cooperative Management System · {today}
          </p>
        </div>
      </div>
    </div>
  );
};

export default CooperativePayout;
