// client/src/pages/customer/Order.jsx
import React, { useState, useEffect } from 'react';
import Table from '../../components/commons/Table';
import { Eye, Loader2 } from 'lucide-react';
import { useOrder } from '../../hooks/useOrder';

export default function Order() {
  const { orders, loading, getUserOrders } = useOrder();
  const [filter, setFilter] = useState('ALL');

  useEffect(() => {
    getUserOrders();
  }, [getUserOrders]);

  const headers = ["Order ID", "Date", "Total", "Status", "Actions"];

  const filteredOrders = orders.filter(o => filter === 'ALL' || o.status === filter);

  const renderRow = (order) => (
    <tr key={order.id} className="border-b border-zinc-50 hover:bg-zinc-50 transition">
      <td className="px-6 py-5 font-black text-[11px] tracking-tighter">{order.id}</td>
      <td className="px-6 py-5 text-[10px] font-bold text-zinc-400 uppercase">
        {new Date(order.createdAt).toLocaleDateString()}
      </td>
      <td className="px-6 py-5 text-xs font-black italic tracking-tighter">
        Rp {order.totalAmount.toLocaleString('id-ID')}
      </td>
      <td className="px-6 py-5">
        <span className={`px-3 py-1 text-[9px] font-black uppercase tracking-widest italic border ${
          order.status === 'PAID' || order.status === 'DELIVERED' ? 'bg-zinc-900 text-white border-black' : 'bg-white text-zinc-300 border-zinc-100'
        }`}>
          {order.status}
        </span>
      </td>
      <td className="px-6 py-5">
        <button className="text-zinc-400 hover:text-black transition">
          <Eye size={16} strokeWidth={1.5} />
        </button>
      </td>
    </tr>
  );

  if (loading) return <div className="p-12 flex justify-center"><Loader2 className="animate-spin text-zinc-300" /></div>;

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 animate-in fade-in duration-700">
      {/* ... Header and filter buttons ... */}
      <Table headers={headers} data={filteredOrders} renderRow={renderRow} />
    </div>
  );
}