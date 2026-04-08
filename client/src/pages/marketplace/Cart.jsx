import React, { useState } from 'react';
import { useCart } from '../../contexts/CartContext';
import { useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, CreditCard } from 'lucide-react';
import api from '../../lib/api';

const Cart = () => {
  const { cartItems, removeFromCart, addToCart, paymentMethod, savePaymentMethod, shippingAddress, saveShippingAddress, clearCart } = useCart();
  const navigate = useNavigate();
  const [address, setAddress] = useState(shippingAddress.address || '');
  const [city, setCity] = useState(shippingAddress.city || '');
  const [postalCode, setPostalCode] = useState(shippingAddress.postalCode || '');
  const [country, setCountry] = useState(shippingAddress.country || '');
  
  const itemsPrice = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);
  const taxPrice = itemsPrice * 0.18; // 18% GST
  const shippingPrice = itemsPrice > 100 ? 0 : 10;
  const totalPrice = itemsPrice + taxPrice + shippingPrice;

  const handleCheckout = async () => {
    saveShippingAddress({ address, city, postalCode, country });
    
    try {
      const { data } = await api.post(
        '/orders',
        {
          orderItems: cartItems,
          shippingAddress: { address, city, postalCode, country },
          paymentMethod,
          itemsPrice,
          taxPrice,
          shippingPrice,
          totalPrice,
        }
      );

      clearCart();
      navigate(`/dashboard/orders/${data._id}`);
    } catch (error) {
      console.error(error);
      alert('Order placed failed!');
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 text-gray-200 text-left">
      <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-300">
        Shopping Cart
      </h1>

      {cartItems.length === 0 ? (
        <div className="bg-white/5 p-6 rounded-xl border border-white/10 text-center">
          <p className="text-xl">Your cart is empty.</p>
          <button onClick={() => navigate('/dashboard/marketplace')} className="mt-4 text-blue-400 underline">Go back to Marketplace</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
           <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item) => (
                <div key={item.product} className="flex items-center gap-4 bg-white/5 p-4 rounded-xl border border-white/10 backdrop-blur-sm shadow-xl">
                  <img src={item.image} alt={item.name} className="w-24 h-24 object-cover rounded-lg" />
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold">{item.name}</h3>
                    <p className="text-green-400 font-bold">${item.price.toFixed(2)}</p>
                  </div>
                  <div className="flex items-center space-x-2 bg-black/20 rounded-lg p-1">
                     <button onClick={() => addToCart(item, Math.max(1, item.qty - 1))} className="p-1 hover:bg-white/10 rounded"><Minus className="h-4 w-4" /></button>
                     <span className="w-8 text-center">{item.qty}</span>
                     <button onClick={() => addToCart(item, item.qty + 1)} className="p-1 hover:bg-white/10 rounded"><Plus className="h-4 w-4" /></button>
                  </div>
                  <button onClick={() => removeFromCart(item.product)} className="p-2 text-red-400 hover:bg-red-400/20 rounded-lg transition-colors">
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              ))}
           </div>

           <div className="space-y-4">
              <div className="bg-white/5 p-6 rounded-xl border border-white/10 backdrop-blur-sm shadow-xl">
                 <h2 className="text-xl font-semibold mb-4 border-b border-white/10 pb-2">Order Summary</h2>
                 <div className="space-y-2 text-sm">
                    <div className="flex justify-between"><span>Items</span><span>${itemsPrice.toFixed(2)}</span></div>
                    <div className="flex justify-between"><span>Shipping</span><span>${shippingPrice.toFixed(2)}</span></div>
                    <div className="flex justify-between"><span>Tax (GST)</span><span>${taxPrice.toFixed(2)}</span></div>
                    <div className="flex justify-between font-bold text-lg pt-2 border-t border-white/10">
                       <span>Total</span>
                       <span className="text-green-400">${totalPrice.toFixed(2)}</span>
                    </div>
                 </div>
              </div>

              <div className="bg-white/5 p-6 rounded-xl border border-white/10 backdrop-blur-sm shadow-xl space-y-4">
                 <h2 className="text-xl font-semibold border-b border-white/10 pb-2">Shipping Details</h2>
                 <input className="w-full bg-black/20 border border-white/10 rounded p-2 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Address" value={address} onChange={e => setAddress(e.target.value)} />
                 <input className="w-full bg-black/20 border border-white/10 rounded p-2 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="City" value={city} onChange={e => setCity(e.target.value)} />
                 <input className="w-full bg-black/20 border border-white/10 rounded p-2 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Postal Code" value={postalCode} onChange={e => setPostalCode(e.target.value)} />
                 <input className="w-full bg-black/20 border border-white/10 rounded p-2 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Country" value={country} onChange={e => setCountry(e.target.value)} />
              </div>

              <div className="bg-white/5 p-6 rounded-xl border border-white/10 backdrop-blur-sm shadow-xl space-y-4">
                 <h2 className="text-xl font-semibold border-b border-white/10 pb-2">Payment Option</h2>
                 <select value={paymentMethod} onChange={(e) => savePaymentMethod(e.target.value)} className="w-full bg-black/20 border border-white/10 rounded p-2 focus:ring-2 focus:ring-blue-500 outline-none">
                    <option value="UPI">UPI</option>
                    <option value="Card">Credit/Debit Card</option>
                    <option value="Net Banking">Net Banking</option>
                 </select>
                 
                 <button 
                  onClick={handleCheckout}
                  disabled={cartItems.length === 0 || !address || !city || !postalCode || !country}
                  className="w-full py-3 bg-blue-600 hover:bg-blue-500 flex justify-center items-center gap-2 rounded-lg font-bold text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_15px_rgba(37,99,235,0.4)]"
                 >
                   <CreditCard className="w-5 h-5" />
                   Checkout securely
                 </button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
