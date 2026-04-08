import React, { useState, useEffect } from 'react';
import { Package, Truck, Edit, Trash2, PlusCircle, CheckCircle } from 'lucide-react';
import api from '../../lib/api';

const SellerDashboard = () => {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // New product form state
  const [showAdd, setShowAdd] = useState(false);
  const [name, setName] = useState('');
  const [price, setPrice] = useState(0);
  const [image, setImage] = useState('');
  const [brand, setBrand] = useState('');
  const [category, setCategory] = useState('Agriculture');
  const [subcategory, setSubcategory] = useState('Seeds');
  const [countInStock, setCountInStock] = useState(0);
  const [description, setDescription] = useState('');

  useEffect(() => {
    fetchSellerData();
  }, []);

  const fetchSellerData = async () => {
    try {
      setLoading(true);
      const [prodRes, ordRes] = await Promise.all([
        api.get('/products/seller'),
        api.get('/orders/sellerorders')
      ]);
      setProducts(prodRes.data);
      setOrders(ordRes.data);
    } catch (error) {
       console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const createProduct = async (e) => {
    e.preventDefault();
    try {
      await api.post('/products', {
        name, price, image: image || 'https://via.placeholder.com/300', brand, category, subcategory, countInStock, description
      });
      setShowAdd(false);
      fetchSellerData();
      alert('Product created');
    } catch {
      alert('Error creating product');
    }
  };

  const deleteProduct = async (id) => {
    if (window.confirm('Delete product?')) {
      try {
        await api.delete(`/products/${id}`);
        fetchSellerData();
      } catch {
        alert('Error deleting product');
      }
    }
  };

  const updateOrderStatus = async (id, status) => {
    try {
      await api.put(`/orders/${id}/status`, { status });
      fetchSellerData();
    } catch {
      alert('Failed to update status');
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 text-gray-200 text-left">
      <div className="flex justify-between items-center mb-6 bg-white/5 p-4 rounded-xl backdrop-blur-md border border-white/20">
        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-300">
          Seller Dashboard
        </h1>
        <button 
          onClick={() => setShowAdd(!showAdd)}
          className="bg-blue-600/80 hover:bg-blue-500 text-white px-4 py-2 flex items-center gap-2 rounded-lg transition-all shadow-[0_0_15px_rgba(37,99,235,0.5)]"
        >
          <PlusCircle className="w-5 h-5" /> Add New Product
        </button>
      </div>

      {showAdd && (
        <div className="bg-white/5 border border-white/10 p-6 rounded-xl shadow-xl space-y-4 mb-6 relative">
           <h2 className="text-xl font-bold border-b border-white/10 pb-2">Create Product</h2>
           <form onSubmit={createProduct} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input type="text" placeholder="Product Name" value={name} onChange={e => setName(e.target.value)} required className="bg-black/20 border border-white/10 rounded p-2 text-white" />
              <input type="number" placeholder="Price" value={price} onChange={e => setPrice(e.target.value)} required className="bg-black/20 border border-white/10 rounded p-2 text-white" />
              <input type="text" placeholder="Image URL (mock cloudinary)" value={image} onChange={e => setImage(e.target.value)} className="bg-black/20 border border-white/10 rounded p-2 text-white" />
              <input type="text" placeholder="Brand" value={brand} onChange={e => setBrand(e.target.value)} className="bg-black/20 border border-white/10 rounded p-2 text-white" />
              <select value={category} onChange={e => setCategory(e.target.value)} className="bg-black/20 border border-white/10 rounded p-2 text-white">
                 <option value="Agriculture">Agriculture</option>
                 <option value="Animal Husbandry">Animal Husbandry</option>
              </select>
              <input type="text" placeholder="Subcategory (e.g. Seeds, Feed)" value={subcategory} onChange={e => setSubcategory(e.target.value)} className="bg-black/20 border border-white/10 rounded p-2 text-white" />
              <input type="number" placeholder="Count In Stock" value={countInStock} onChange={e => setCountInStock(e.target.value)} className="bg-black/20 border border-white/10 rounded p-2 text-white" />
              <input type="text" placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} className="bg-black/20 border border-white/10 rounded p-2 text-white" />
              <div className="md:col-span-2 flex justify-end">
                 <button type="submit" className="bg-green-600/80 hover:bg-green-500 text-white px-6 py-2 rounded-lg font-bold">Save Product</button>
              </div>
           </form>
        </div>
      )}

      {loading ? (
        <div className="text-white">Loading data...</div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
           <div className="bg-white/5 border border-white/10 p-6 rounded-xl shadow-xl flex flex-col h-[500px]">
              <h2 className="text-xl font-bold border-b border-white/10 pb-2 mb-4 flex items-center gap-2 text-blue-400">
                <Package className="w-5 h-5" /> My Products
              </h2>
              <div className="overflow-y-auto flex-1 space-y-4 pr-2">
                 {products.length === 0 ? <p className="text-gray-400">No products yet.</p> : products.map(product => (
                    <div key={product._id} className="bg-black/20 p-4 rounded-lg flex items-center gap-4">
                       <img src={product.image} alt={product.name} className="w-16 h-16 object-cover rounded" />
                       <div className="flex-1">
                          <p className="font-semibold text-lg">{product.name}</p>
                          <p className="text-sm text-green-400">${product.price}</p>
                          <p className="text-xs text-gray-400">Stock: {product.countInStock}</p>
                       </div>
                       <button onClick={() => deleteProduct(product._id)} className="p-2 bg-red-500/20 hover:bg-red-500/auto text-red-500 rounded"><Trash2 className="w-4 h-4" /></button>
                    </div>
                 ))}
              </div>
           </div>

           <div className="bg-white/5 border border-white/10 p-6 rounded-xl shadow-xl flex flex-col h-[500px]">
              <h2 className="text-xl font-bold border-b border-white/10 pb-2 mb-4 flex items-center gap-2 text-green-400">
                <Truck className="w-5 h-5" /> Recent Orders
              </h2>
              <div className="overflow-y-auto flex-1 space-y-4 pr-2">
                 {orders.length === 0 ? <p className="text-gray-400">No orders yet.</p> : orders.map(order => (
                    <div key={order._id} className="bg-black/20 p-4 rounded-lg flex flex-col gap-2">
                       <div className="flex justify-between items-start">
                         <div>
                           <p className="font-semibold text-sm">Order: #{order._id.substring(18)}</p>
                           <p className="text-xs text-gray-400">Customer: {order.user.name}</p>
                         </div>
                         <p className="font-bold text-blue-400">${order.totalPrice.toFixed(2)}</p>
                       </div>
                       
                       <div className="flex items-center gap-2 mt-2">
                         <span className={`text-xs px-2 py-1 rounded ${order.isPaid ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                           {order.isPaid ? 'Paid' : 'Unpaid'}
                         </span>
                         <select 
                           value={order.status}
                           onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                           className="text-xs bg-black/40 border border-white/10 rounded p-1 text-white outline-none"
                         >
                           <option value="Pending">Pending</option>
                           <option value="Confirmed">Confirmed</option>
                           <option value="Shipped">Shipped</option>
                           <option value="Delivered">Delivered</option>
                           <option value="Cancelled">Cancelled</option>
                         </select>
                       </div>
                    </div>
                 ))}
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default SellerDashboard;
