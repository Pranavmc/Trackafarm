import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Plus, Search, Filter, Edit2, Trash2, Beef, Eye, Activity, Thermometer, Zap } from 'lucide-react';
import Modal from '../../components/Modal';

const Livestock = () => {
  const navigate = useNavigate();
  const [animals, setAnimals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentAnimal, setCurrentAnimal] = useState(null);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('');
  
  const [formData, setFormData] = useState({
    tagId: '', name: '', breed: '', healthStatus: 'Healthy', dob: '', color: '', notes: ''
  });

  const fetchAnimals = React.useCallback(async () => {
    try {
      const res = await axios.get(`/animals?search=${search}&healthStatus=${filter}`);
      setAnimals(res.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching animals:', err);
    }
  }, [search, filter]);

  useEffect(() => {
    fetchAnimals();
  }, [fetchAnimals]);

  const handleOpenModal = (animal = null) => {
    if (animal) {
      setCurrentAnimal(animal);
      setFormData({ ...animal, dob: animal.dob ? animal.dob.split('T')[0] : '' });
    } else {
      setCurrentAnimal(null);
      setFormData({ tagId: '', name: '', breed: '', healthStatus: 'Healthy', dob: '', color: '', notes: '' });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (currentAnimal) {
        await axios.put(`/animals/${currentAnimal._id}`, formData);
      } else {
        await axios.post('/animals', formData);
      }
      setIsModalOpen(false);
      fetchAnimals();
    } catch (err) {
      alert(err.response?.data?.message || 'Error saving animal');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to remove this animal?')) {
      try {
        await axios.delete(`/animals/${id}`);
        fetchAnimals();
      } catch (err) {
        console.error(err);
        alert('Error deleting animal');
      }
    }
  };

  return (
    <div style={{ animation: 'fadeIn 0.7s ease-out' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
        <div>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Livestock Registry</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Detailed records and health tracking for your cattle.</p>
        </div>
        <button onClick={() => handleOpenModal()} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', height: 'fit-content' }}>
          <Plus size={20} /> Register New Cow
        </button>
      </div>

      <div className="glass-card animate-slide-up delay-100" style={{ marginBottom: '2.5rem', display: 'flex', gap: '1.5rem', flexWrap: 'wrap', padding: '1.5rem' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: '300px' }}>
          <Search size={20} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)', opacity: 0.5 }} />
          <input 
            type="text" 
            placeholder="Search by Tag ID, Name or Breed..." 
            style={{ paddingLeft: '3.5rem', width: '100%', marginBottom: 0, height: '52px' }}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div style={{ position: 'relative', width: '240px' }}>
          <Filter size={20} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)', opacity: 0.5 }} />
          <select 
            style={{ paddingLeft: '3.5rem', width: '100%', marginBottom: 0, height: '52px' }}
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="">All Health Status</option>
            <option value="Healthy">Healthy</option>
            <option value="Vaccinated">Vaccinated</option>
            <option value="Under Treatment">Under Treatment</option>
            <option value="Sick">Sick</option>
          </select>
        </div>
      </div>

      <div className="glass-card animate-scale-in delay-200" style={{ overflow: 'hidden', padding: 0 }}>
        <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0 }}>
          <thead>
            <tr>
              <th style={{ padding: '1.5rem 2rem' }}>Tag ID</th>
              <th style={{ padding: '1.5rem' }}>Name & Breed</th>
              <th style={{ padding: '1.5rem' }}>Health Status</th>
              <th style={{ padding: '1.5rem' }}>Live Telemetry</th>
              <th style={{ padding: '1.5rem' }}>Birth Date</th>
              <th style={{ padding: '1.5rem 2rem', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="5" style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-secondary)' }}>Fetching cattle records...</td></tr>
            ) : animals.length === 0 ? (
              <tr><td colSpan="5" style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-secondary)' }}>No livestock records found.</td></tr>
            ) : animals.map((animal, index) => {
              const delayClass = `delay-${Math.min((index + 3) * 100, 1000)}`;
              return (
              <tr key={animal._id} className={`animate-slide-up ${delayClass}`} style={{ animationFillMode: 'both' }}>
                <td style={{ padding: '1.25rem 2rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ background: 'var(--sky-glow)', padding: '0.75rem', borderRadius: '10px' }}>
                      <Beef size={20} color="var(--primary-accent)" />
                    </div>
                    <span style={{ fontWeight: 800, fontSize: '1.1rem' }}>{animal.tagId}</span>
                  </div>
                </td>
                <td style={{ padding: '1.25rem' }}>
                  <div style={{ fontWeight: 600 }}>{animal.name || 'Unnamed'}</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{animal.breed}</div>
                </td>
                <td style={{ padding: '1.25rem' }}>
                  <span style={{ 
                    padding: '0.5rem 1rem', 
                    borderRadius: '10px', 
                    fontSize: '0.8rem', 
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    background: animal.healthStatus === 'Healthy' ? 'rgba(0, 229, 255, 0.1)' : animal.healthStatus === 'Sick' ? 'rgba(255, 42, 109, 0.1)' : 'rgba(123, 44, 191, 0.1)',
                    color: animal.healthStatus === 'Healthy' ? 'var(--primary-accent)' : animal.healthStatus === 'Sick' ? 'var(--tertiary-accent)' : 'var(--secondary-accent)',
                    border: `1px solid ${animal.healthStatus === 'Healthy' ? 'rgba(0, 229, 255, 0.2)' : animal.healthStatus === 'Sick' ? 'rgba(255, 42, 109, 0.2)' : 'rgba(123, 44, 191, 0.2)'}`
                  }}>
                    {animal.healthStatus}
                  </span>
                </td>
                <td style={{ padding: '1.25rem' }}>
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <div title="Activity" style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.85rem', color: 'var(--primary-accent)' }}>
                      <Activity size={14} /> <span>{Math.floor(Math.random() * (95 - 40) + 40)}%</span>
                    </div>
                    <div title="Rumination" style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.85rem', color: 'var(--secondary-accent)' }}>
                      <Zap size={14} /> <span>{Math.floor(Math.random() * (600 - 400) + 400)}m</span>
                    </div>
                    <div title="Temperature" style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.85rem', color: '#ff7675' }}>
                      <Thermometer size={14} /> <span>38.{Math.floor(Math.random() * 9)}°C</span>
                    </div>
                  </div>
                </td>
                <td style={{ padding: '1.25rem', color: 'var(--text-secondary)' }}>
                  {animal.dob ? new Date(animal.dob).toLocaleDateString() : 'N/A'}
                </td>
                <td style={{ padding: '1.25rem 2rem', textAlign: 'right' }}>
                  <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
                    <button onClick={() => navigate(`/dashboard/livestock/${animal._id}`)} style={{ background: 'rgba(123, 44, 191, 0.1)', color: 'var(--secondary-accent)', padding: '0.6rem', borderRadius: '10px', border: '1px solid rgba(123, 44, 191, 0.2)', transition: '0.3s', cursor: 'pointer' }} onMouseOver={(e) => e.currentTarget.style.background = 'rgba(123, 44, 191, 0.2)'} onMouseOut={(e) => e.currentTarget.style.background = 'rgba(123, 44, 191, 0.1)'} title="View Profile">
                      <Eye size={16} />
                    </button>
                    <button onClick={() => handleOpenModal(animal)} style={{ background: 'rgba(0, 229, 255, 0.1)', color: 'var(--primary-accent)', padding: '0.6rem', borderRadius: '10px', border: '1px solid rgba(0, 229, 255, 0.2)', transition: '0.3s', cursor: 'pointer' }} onMouseOver={(e) => e.currentTarget.style.background = 'rgba(0, 229, 255, 0.2)'} onMouseOut={(e) => e.currentTarget.style.background = 'rgba(0, 229, 255, 0.1)'} title="Edit Base Info">
                      <Edit2 size={16} />
                    </button>
                    <button onClick={() => handleDelete(animal._id)} style={{ background: 'rgba(255, 42, 109, 0.1)', color: 'var(--tertiary-accent)', padding: '0.6rem', borderRadius: '10px', border: '1px solid rgba(255, 42, 109, 0.2)', transition: '0.3s', cursor: 'pointer' }} onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255, 42, 109, 0.2)'} onMouseOut={(e) => e.currentTarget.style.background = 'rgba(255, 42, 109, 0.1)'} title="Remove Cow">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
          </tbody>
        </table>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={currentAnimal ? 'Edit Cow' : 'Add New Cow'}>
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="input-group">
              <label>Tag ID *</label>
              <input value={formData.tagId} onChange={(e) => setFormData({...formData, tagId: e.target.value})} placeholder="COW001" required disabled={!!currentAnimal} />
            </div>
            <div className="input-group">
              <label>Name</label>
              <input value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} placeholder="Daisy" />
            </div>
          </div>
          <div className="input-group">
            <label>Breed *</label>
            <input value={formData.breed} onChange={(e) => setFormData({...formData, breed: e.target.value})} placeholder="Jersey / Holstein" required />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="input-group">
              <label>Health Status</label>
              <select value={formData.healthStatus} onChange={(e) => setFormData({...formData, healthStatus: e.target.value})}>
                <option value="Healthy">Healthy</option>
                <option value="Vaccinated">Vaccinated</option>
                <option value="Under Treatment">Under Treatment</option>
                <option value="Sick">Sick</option>
              </select>
            </div>
            <div className="input-group">
              <label>Date of Birth</label>
              <input type="date" value={formData.dob} onChange={(e) => setFormData({...formData, dob: e.target.value})} />
            </div>
          </div>
          <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
            {currentAnimal ? 'Update Animal' : 'Register Cow'}
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default Livestock;
