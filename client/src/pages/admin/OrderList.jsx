// client/src/pages/admin/OrderList.jsx
import React, { useState, useEffect } from 'react';
import Table from '../../components/commons/Table';
import { Eye, Search, Loader2, Calendar, User as UserIcon, RotateCw } from 'lucide-react'; // Tambah RotateCw
import { useOrder } from '../../hooks/useOrder';
import OrderDetailModal from '../../components/admin/OrderDetailModal'; 

export default function OrderList() {
  const { orders, loading, getOrders } = useOrder();
  const [currentStatus, setCurrentStatus] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);

  useEffect(() => { getOrders(); }, [getOrders]);

  // Fungsi khusus untuk refresh manual
  const handleRefresh = () => {
    getOrders();
  };

  const filteredOrders = orders.filter(order => {
    const matchesStatus = currentStatus === 'ALL' || order.status === currentStatus;
    const orderId = String(order.id || "").toLowerCase();
    const username = String(order.User?.username || "Guest").toLowerCase();
    return matchesStatus && (orderId.includes(searchQuery.toLowerCase()) || username.includes(searchQuery.toLowerCase()));
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'PAID': return 'bg-black text-white border-black';
      case 'SHIPPED': return 'bg-blue-600 text-white border-blue-600';
      case 'PENDING': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      default: return 'bg-red-50 text-red-500 border-red-100';
    }
  };

  const headers = ["Order ID", "Customer", "Date", "Total", "Status", "Actions"];
  const renderRow = (order) => (
    <tr key={order.id} className="border-b border-zinc-50 hover:bg-zinc-50/50 transition">
      <td className="px-6 py-5 font-black text-[11px] tracking-tighter">{order.id}</td>
      <td className="px-6 py-5 text-left">
        <p className="text-[10px] font-black uppercase tracking-widest text-zinc-600">{order.User?.username || 'GUEST'}</p>
        <p className="text-[9px] text-zinc-400">{order.User?.email}</p>
      </td>
      <td className="px-6 py-5 text-[10px] font-bold text-zinc-400 uppercase">{new Date(order.createdAt).toLocaleDateString('id-ID')}</td>
      <td className="px-6 py-5 text-xs font-black italic tracking-tighter">Rp {order.totalAmount?.toLocaleString('id-ID')}</td>
      <td className="px-6 py-5"><span className={`px-3 py-1 text-[9px] font-black uppercase italic border ${getStatusColor(order.status)}`}>{order.status}</span></td>
      <td className="px-6 py-5">
        <button onClick={() => { setSelectedOrderId(order.id); setIsModalOpen(true); }} className="text-zinc-400 hover:text-black transition active:scale-90"><Eye size={16}/></button>
      </td>
    </tr>
  );

  return (
    <div className="p-4 md:p-10">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-10 gap-6">
        <div className="text-left">
          <h1 className="text-3xl md:text-4xl font-black italic uppercase tracking-tighter leading-none">Transactions</h1>
          <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.3em] mt-3">Monitoring Transactions</p>
        </div>

        <div className="flex items-center gap-3 w-full lg:w-auto">
          {/* Tombol Refresh */}
          <button 
            onClick={handleRefresh}
            disabled={loading}
            className="p-3 bg-white border border-zinc-200 text-zinc-400 hover:text-black hover:border-black transition-all active:rotate-180 duration-500 disabled:opacity-50 shadow-sm"
            title="Refresh Data"
          >
            <RotateCw size={16} className={loading ? "animate-spin" : ""} />
          </button>

          <div className="relative flex-1 lg:w-72">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-300" size={14} />
            <input 
              type="text" 
              placeholder="REF ID / CUSTOMER..." 
              value={searchQuery} 
              onChange={(e) => setSearchQuery(e.target.value)} 
              className="w-full bg-zinc-50 border border-zinc-200 py-3.5 pl-10 pr-4 text-[9px] font-black tracking-widest uppercase focus:border-black outline-none transition" 
            />
          </div>
        </div>
      </div>

      {/* Status Filter Tabs */}
      <div className="flex space-x-6 mb-8 border-b border-zinc-100 overflow-x-auto no-scrollbar pb-1">
        {['ALL', 'PENDING', 'PAID', 'SHIPPED', 'CANCELLED'].map((status) => (
          <button key={status} onClick={() => setCurrentStatus(status)} className={`pb-4 text-[10px] font-black uppercase tracking-[0.2em] transition-all relative shrink-0 ${currentStatus === status ? 'text-black' : 'text-zinc-300 hover:text-zinc-500'}`}>
            {status}
            {currentStatus === status && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-black"></div>}
          </button>
        ))}
      </div>

      {loading && orders.length === 0 ? (
        <div className="py-20 flex justify-center"><Loader2 className="animate-spin text-zinc-200" size={32} /></div>
      ) : (
        <>
          <div className="hidden lg:block bg-white border border-zinc-100 overflow-x-auto">
            <Table headers={headers} data={filteredOrders} renderRow={renderRow} />
          </div>
          
          {/* Mobile View */}
          <div className="lg:hidden space-y-4">
            {filteredOrders.map(order => (
              <div key={order.id} className="bg-white border border-zinc-100 p-5 space-y-4 shadow-sm text-left">
                <div className="flex justify-between items-start border-b border-zinc-50 pb-3">
                  <div>
                    <p className="text-[11px] font-black uppercase tracking-tighter">{order.id}</p>
                    <p className="text-[9px] font-bold text-zinc-400 mt-0.5 uppercase tracking-widest italic">{order.User?.username || 'Guest'}</p>
                  </div>
                  <span className={`px-2 py-1 text-[8px] font-black border italic uppercase ${getStatusColor(order.status)}`}>{order.status}</span>
                </div>
                <div className="flex justify-between items-end">
                   <div>
                      <p className="text-[9px] font-black text-zinc-300 uppercase tracking-widest mb-1">Final Amount</p>
                      <p className="text-sm font-black italic tracking-tighter">Rp {order.totalAmount?.toLocaleString('id-ID')}</p>
                   </div>
                   <button onClick={() => { setSelectedOrderId(order.id); setIsModalOpen(true); }} className="bg-zinc-50 p-2.5 border border-zinc-100 hover:bg-black hover:text-white transition active:scale-90"><Eye size={16}/></button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      <OrderDetailModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} orderId={selectedOrderId} />
    </div>
  );
}