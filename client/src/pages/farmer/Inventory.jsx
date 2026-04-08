import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Package, Plus, AlertTriangle, Edit2, Trash2, Shovel, Pill, Box } from 'lucide-react';
import Modal from '../../components/Modal';

const Inventory = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  
  const [formData, setFormData] = useState({
    name: '', category: 'Feed', quantity: '', unit: '', reorderLevel: 10, supplier: '', notes: ''
  });

  const fetchInventory = useCallback(async () => {
    try {
      const res = await axios.get('/inventory');
      setItems(res.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching inventory:', err);
    }
  }, []);

  useEffect(() => {
    fetchInventory();
  }, [fetchInventory]);

  const handleOpenModal = (item = null) => {
    if (item) {
      setCurrentItem(item);
      setFormData(item);
    } else {
      setCurrentItem(null);
      setFormData({ name: '', category: 'Feed', quantity: '', unit: '', reorderLevel: 10, supplier: '', notes: '' });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (currentItem) {
        await axios.put(`/inventory/${currentItem._id}`, formData);
      } else {
        await axios.post('/inventory', formData);
      }
      setIsModalOpen(false);
      fetchInventory();
    } catch (err) {
      alert('Error saving item');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to remove this item?')) {
      try {
        await axios.delete(`/inventory/${id}`);
        fetchInventory();
      } catch (err) {
        alert('Error deleting item');
      }
    }
  };

  const getCategoryIcon = (cat) => {
    switch(cat) {
      case 'Feed': return <Shovel size={18} />;
      case 'Medicine': return <Pill size={18} />;
      case 'Supplies': return <Box size={18} />;
      default: return <Package size={18} />;
    }
  };

  return (
    <div style={{ animation: 'fadeIn 0.5s ease' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ margin: 0 }}>Inventory Management</h1>
        <button onClick={() => handleOpenModal()} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Plus size={20} /> Add Item
        </button>
      </div>

      <div className="glass-card" style={{ padding: 0 }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: '#f8f9fa' }}>
              <th style={{ padding: '1rem' }}>Item Name</th>
              <th style={{ padding: '1rem' }}>Category</th>
              <th style={{ padding: '1rem' }}>Stock</th>
              <th style={{ padding: '1rem' }}>Status</th>
              <th style={{ padding: '1rem' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="5" style={{ padding: '2rem', textAlign: 'center' }}>Loading inventory...</td></tr>
            ) : items.map(item => (
              <tr key={item._id} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '1rem', fontWeight: 600 }}>{item.name}</td>
                <td style={{ padding: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    {getCategoryIcon(item.category)} {item.category}
                  </div>
                </td>
                <td style={{ padding: '1rem' }}>{item.quantity} {item.unit}</td>
                <td style={{ padding: '1rem' }}>
                  {item.quantity <= item.reorderLevel ? (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#e67e22', fontWeight: 600, fontSize: '0.85rem' }}>
                      <AlertTriangle size={14} /> Low Stock
                    </span>
                  ) : (
                    <span style={{ color: '#27ae60', fontSize: '0.85rem' }}>In Stock</span>
                  )}
                </td>
                <td style={{ padding: '1rem', display: 'flex', gap: '0.5rem' }}>
                  <button onClick={() => handleOpenModal(item)} style={{ background: '#f1f8f1', color: '#1a472a', padding: '0.5rem', borderRadius: '4px' }}>
                    <Edit2 size={16} />
                  </button>
                  <button onClick={() => handleDelete(item._id)} style={{ background: '#fff1f1', color: '#b91c1c', padding: '0.5rem', borderRadius: '4px' }}>
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={currentItem ? 'Edit Item' : 'Add Item'}>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Item Name *</label>
            <input value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} placeholder="e.g. Maize Germ" required />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="input-group">
              <label>Category *</label>
              <select value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})}>
                <option value="Feed">Feed</option>
                <option value="Medicine">Medicine</option>
                <option value="Supplies">Supplies</option>
                <option value="Tools">Tools</option>
              </select>
            </div>
            <div className="input-group">
              <label>Current Quantity *</label>
              <input type="number" value={formData.quantity} onChange={(e) => setFormData({...formData, quantity: e.target.value})} required />
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="input-group">
              <label>Unit (kg, L, etc) *</label>
              <input value={formData.unit} onChange={(e) => setFormData({...formData, unit: e.target.value})} placeholder="kg" required />
            </div>
            <div className="input-group">
              <label>Reorder Level *</label>
              <input type="number" value={formData.reorderLevel} onChange={(e) => setFormData({...formData, reorderLevel: e.target.value})} required />
            </div>
          </div>
          <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
            {currentItem ? 'Update Item' : 'Add to Inventory'}
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default Inventory;
