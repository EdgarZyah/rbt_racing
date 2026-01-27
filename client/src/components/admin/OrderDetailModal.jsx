import React, { useEffect, useState } from 'react';
import { X, User, MapPin, CreditCard, Package, Loader2 } from 'lucide-react';
import { useOrder } from '../../hooks/useOrder';

export default function OrderDetailModal({ isOpen, onClose, orderId }) {
  const { getOrderById } = useOrder();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && orderId) {
      const fetchDetail = async () => {
        setLoading(true);
        const data = await getOrderById(orderId);
        setOrder(data);
        setLoading(false);
      };
      fetchDetail();
    }
  }, [isOpen, orderId, getOrderById]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md animate-in fade-in duration-300" onClick={onClose} />
      
      {/* Modal Container */}
      <div className="relative bg-white w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl animate-in zoom-in-95 duration-300">
        
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-zinc-100 p-6 md:p-8 flex justify-between items-center z-10">
          <div>
            <h2 className="text-2xl font-black italic tracking-tighter uppercase">Transaction Receipt</h2>
            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mt-1">ID: {orderId}</p>
          </div>
          <button onClick={onClose} className="text-zinc-300 hover:text-black transition">
            <X size={24} />
          </button>
        </div>

        {loading ? (
          <div className="py-32 flex flex-col items-center justify-center space-y-4">
            <Loader2 className="animate-spin text-zinc-200" size={40} />
            <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Retrieving Data...</p>
          </div>
        ) : order && (
          <div className="p-6 md:p-8 space-y-12">
            
            {/* Grid 1: Customer & Logistics */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              {/* Customer Info */}
              <div className="space-y-4">
                <div className="flex items-center space-x-2 text-zinc-300">
                  <User size={14} />
                  <span className="text-[9px] font-black uppercase tracking-widest">Client Identity</span>
                </div>
                <div className="bg-zinc-50 p-6 border border-zinc-100">
                  <p className="text-lg font-black italic uppercase tracking-tight">{order.User?.username}</p>
                  <p className="text-[11px] font-bold text-zinc-400 mt-1">{order.User?.email}</p>
                </div>
              </div>

              {/* Shipping & Payment */}
              <div className="space-y-4">
                <div className="flex items-center space-x-2 text-zinc-300">
                  <MapPin size={14} />
                  <span className="text-[9px] font-black uppercase tracking-widest">Logistic Destination</span>
                </div>
                <div className="bg-zinc-50 p-6 border border-zinc-100">
                  <p className="text-[10px] font-bold uppercase leading-relaxed">{order.shippingAddress || 'No Address Provided'}</p>
                  <div className="mt-4 pt-4 border-t border-zinc-200 flex items-center justify-between">
                    <span className="text-[9px] font-black text-zinc-400 uppercase tracking-widest">Method</span>
                    <span className="text-[10px] font-black uppercase italic italic flex items-center gap-2">
                      <CreditCard size={12} /> {order.paymentMethod}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Grid 2: Items Table */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2 text-zinc-300">
                <Package size={14} />
                <span className="text-[9px] font-black uppercase tracking-widest">Manifest Items</span>
              </div>
              <div className="border border-zinc-100">
                <table className="w-full text-left">
                  <thead className="bg-zinc-50 text-[9px] font-black uppercase tracking-widest text-zinc-400 border-b border-zinc-100">
                    <tr>
                      <th className="px-6 py-4">Component</th>
                      <th className="px-6 py-4 text-center">Qty</th>
                      <th className="px-6 py-4 text-right">Unit Price</th>
                      <th className="px-6 py-4 text-right">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-50">
                    {order.items?.map((item, idx) => (
                      <tr key={idx} className="text-[11px]">
                        <td className="px-6 py-4 flex items-center space-x-4">
                          <div className="w-10 h-10 bg-zinc-100 border border-zinc-100 grayscale shrink-0">
                            {item.Product?.imageUrl && (
                              <img src={`http://localhost:3000${item.Product.imageUrl}`} className="w-full h-full object-cover" alt="" />
                            )}
                          </div>
                          <div>
                            <p className="font-black uppercase italic">{item.Product?.name}</p>
                            <p className="text-[9px] text-zinc-400 font-bold uppercase mt-1">
                              {item.selectedVariants ? Object.entries(JSON.parse(item.selectedVariants)).map(([k, v]) => `${k}: ${v}`).join(' | ') : '-'}
                            </p>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-center font-bold">{item.quantity}</td>
                        <td className="px-6 py-4 text-right font-bold text-zinc-400">Rp {item.priceAtPurchase?.toLocaleString()}</td>
                        <td className="px-6 py-4 text-right font-black">Rp {(item.priceAtPurchase * item.quantity).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Footer Summary */}
            <div className="bg-black text-white p-8 flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="text-center md:text-left">
                <p className="text-[9px] font-black uppercase tracking-[0.4em] text-zinc-500 mb-1">Transaction Status</p>
                <p className="text-xl font-black italic tracking-tighter uppercase">{order.status}</p>
              </div>
              <div className="text-center md:text-right">
                <p className="text-[9px] font-black uppercase tracking-[0.4em] text-zinc-500 mb-1">Grand Total</p>
                <p className="text-4xl font-black italic tracking-tighter">Rp {order.totalAmount?.toLocaleString('id-ID')}</p>
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}