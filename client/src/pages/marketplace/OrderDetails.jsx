import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Download, CreditCard, CheckCircle2, Package, Truck, Home } from 'lucide-react';
import api from '../../lib/api';

const OrderDetails = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const { data } = await api.get(`/orders/order/${id}`);
        setOrder(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  const handlePayment = async () => {
    try {
      setPaying(true);
      // Simulate payment processing abstracting razorpay/stripe
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      await api.put(`/orders/${id}/pay`, {
        id: `pay_${Date.now()}`,
        status: 'COMPLETED',
        update_time: new Date().toISOString(),
        email_address: order.user.email
      });
      
      alert('Payment successful!');
      const { data } = await api.get(`/orders/order/${id}`);
      setOrder(data);
    } catch {
      alert('Payment failed');
    } finally {
      setPaying(false);
    }
  };

  const downloadInvoice = async () => {
    try {
      const response = await api.get(`/orders/${id}/invoice`, {
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `invoice-${id}.pdf`);
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.error('Invoice download failed', error);
      alert('Could not download invoice. Admin/Seller/Buyer only.');
    }
  };

  if (loading) return <div className="p-6 text-white text-center">Loading order...</div>;
  if (!order) return <div className="p-6 text-white text-center">Order not found.</div>;

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6 text-gray-200 text-left">
      <div className="flex justify-between items-center mb-6">
         <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-300">
           Order #{order._id.substring(18)}
         </h1>
         <button onClick={() => navigate('/dashboard/marketplace')} className="text-blue-400 hover:underline">
            Back to Shop
         </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <div className="md:col-span-2 space-y-6">
            <div className="bg-white/5 border border-white/10 p-6 rounded-xl shadow-xl space-y-4">
              <h2 className="text-xl font-semibold flex items-center gap-2 border-b border-white/10 pb-2">
                <Package className="w-5 h-5 text-blue-400" /> Options
              </h2>
               {order.orderItems.map(item => (
                 <div key={item.product} className="flex gap-4 items-center">
                   <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded" />
                   <div className="flex-1">
                      <p className="font-semibold">{item.name}</p>
                      <p className="text-sm text-gray-400">Qty: {item.qty}</p>
                   </div>
                   <p className="font-bold text-green-400">${(item.price * item.qty).toFixed(2)}</p>
                 </div>
               ))}
            </div>

            <div className="bg-white/5 border border-white/10 p-6 rounded-xl shadow-xl space-y-4">
              <h2 className="text-xl font-semibold flex items-center gap-2 border-b border-white/10 pb-2">
                <Truck className="w-5 h-5 text-green-400" /> Shipping & Delivery
              </h2>
               <div className="text-sm space-y-1">
                 <p className="flex items-center gap-2"><Home className="w-4 h-4" /> {order.shippingAddress.address}, {order.shippingAddress.city}, {order.shippingAddress.postalCode}, {order.shippingAddress.country}</p>
               </div>
               <div className={`mt-4 p-3 rounded-lg flex items-center gap-2 ${order.isDelivered ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                 {order.isDelivered ? <CheckCircle2 className="w-5 h-5" /> : <Package className="w-5 h-5" />}
                 {order.isDelivered ? `Delivered at ${new Date(order.deliveredAt).toLocaleString()}` : 'Not Delivered'}
               </div>
               <p className="text-sm">Status: <strong className="text-blue-400">{order.status}</strong></p>
            </div>
         </div>

         <div className="space-y-6">
            <div className="bg-white/5 border border-white/10 p-6 rounded-xl shadow-xl space-y-4">
               <h2 className="text-xl font-semibold mb-2 border-b border-white/10 pb-2">Order Summary</h2>
               <div className="space-y-2 text-sm border-b border-white/10 pb-4">
                  <div className="flex justify-between"><span>Items</span><span>${(order.totalPrice - order.taxPrice - order.shippingPrice).toFixed(2)}</span></div>
                  <div className="flex justify-between"><span>Shipping</span><span>${order.shippingPrice.toFixed(2)}</span></div>
                  <div className="flex justify-between"><span>Tax</span><span>${order.taxPrice.toFixed(2)}</span></div>
                  <div className="flex justify-between font-bold text-lg pt-2 mt-2 border-t border-white/10 text-white">
                     <span>Total</span><span>${order.totalPrice.toFixed(2)}</span>
                  </div>
               </div>

               <div className={`mt-4 p-3 rounded-lg flex items-center gap-2 ${order.isPaid ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                 {order.isPaid ? (
                   <>
                     <CheckCircle2 className="w-5 h-5" />
                     <span>Paid at {new Date(order.paidAt).toLocaleDateString()}</span>
                   </>
                 ) : 'Not Paid'}
               </div>

               {!order.isPaid && (
                 <button 
                  onClick={handlePayment}
                  disabled={paying}
                  className="w-full mt-4 py-3 bg-blue-600 hover:bg-blue-500 flex justify-center items-center gap-2 rounded-lg font-bold text-white transition-all shadow-[0_0_15px_rgba(37,99,235,0.4)] disabled:opacity-50"
                 >
                   <CreditCard className="w-5 h-5" />
                   {paying ? 'Processing...' : `Pay ${order.paymentMethod}`}
                 </button>
               )}
            </div>

            <div className="bg-white/5 border border-white/10 p-6 rounded-xl shadow-xl">
               <button 
                 onClick={downloadInvoice}
                 className="w-full py-3 bg-cyan-600/50 hover:bg-cyan-600 flex justify-center items-center gap-2 rounded-lg font-bold text-white"
               >
                 <Download className="w-5 h-5" /> Download Invoice PDF
               </button>
            </div>
         </div>
      </div>
    </div>
  );
};

export default OrderDetails;
