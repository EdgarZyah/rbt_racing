import React, { useState, useEffect } from 'react';
import Table from '../../components/commons/Table';
import { Eye, Loader2, CreditCard } from 'lucide-react';
import { useOrder } from '../../hooks/useOrder';
import { useNavigate } from 'react-router-dom';

export default function Order() {
  const navigate = useNavigate();
  const { orders, loading, getUserOrders } = useOrder();
  const [filter, setFilter] = useState('ALL');

  useEffect(() => {
    getUserOrders();
  }, [getUserOrders]);

  const headers = ["Order ID", "Date", "Total", "Status", "Actions"];

  const filteredOrders = orders.filter(o => filter === 'ALL' || o.status === filter);

  // Helper untuk warna status
  const getStatusStyle = (status) => {
    switch (status) {
      case 'PAID': return 'bg-black text-white border-black';
      case 'PENDING': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'SHIPPED': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'CANCELLED': return 'bg-red-50 text-red-500 border-red-100';
      default: return 'bg-zinc-100 text-zinc-400 border-transparent';
    }
  };

  const renderRow = (order) => (
    <tr key={order.id} className="border-b border-zinc-50 hover:bg-zinc-50 transition">
      <td className="px-6 py-5 font-black text-[11px] tracking-tighter text-zinc-600">
        {order.id}
      </td>
      <td className="px-6 py-5 text-[10px] font-bold text-zinc-400 uppercase">
        {new Date(order.createdAt).toLocaleDateString('id-ID', {
          day: 'numeric', month: 'short', year: 'numeric'
        })}
      </td>
      <td className="px-6 py-5 text-xs font-black italic tracking-tighter">
        Rp {order.totalAmount.toLocaleString('id-ID')}
      </td>
      <td className="px-6 py-5">
        <span className={`px-3 py-1 text-[9px] font-black uppercase tracking-widest border ${getStatusStyle(order.status)}`}>
          {order.status}
        </span>
      </td>
      <td className="px-6 py-5">
        <div className="flex gap-2">
          {/* Tombol Pay Now jika Pending */}
          {order.status === 'PENDING' && (
            <button 
              onClick={() => navigate('/payment', { state: { orderId: order.id } })}
              className="flex items-center gap-1 text-[9px] font-bold bg-black text-white px-3 py-1 hover:bg-zinc-800 transition"
            >
              <CreditCard size={10} /> PAY
            </button>
          )}
          {/* Tombol Detail (Placeholder logic) */}
          <button className="text-zinc-400 hover:text-black transition p-1">
            <Eye size={16} strokeWidth={1.5} />
          </button>
        </div>
      </td>
    </tr>
  );

  if (loading) return <div className="p-12 flex justify-center"><Loader2 className="animate-spin text-zinc-300" /></div>;

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 animate-in fade-in duration-700">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-black italic uppercase tracking-tighter">My Orders</h1>
        
        {/* Filter Tabs */}
        <div className="flex gap-2">
          {['ALL', 'PENDING', 'PAID', 'SHIPPED'].map(f => (
            <button 
              key={f} 
              onClick={() => setFilter(f)}
              className={`text-[9px] font-bold uppercase px-3 py-1 border transition ${
                filter === f ? 'bg-black text-white border-black' : 'bg-white text-zinc-400 border-zinc-200 hover:border-black'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {orders.length > 0 ? (
        <Table headers={headers} data={filteredOrders} renderRow={renderRow} />
      ) : (
        <div className="text-center py-20 border border-dashed border-zinc-200 text-zinc-400 text-xs font-bold uppercase tracking-widest">
          No orders found
        </div>
      )}
    </div>
  );
}