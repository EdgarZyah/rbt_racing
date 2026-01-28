import React, { useState, useEffect } from 'react';
import Table from '../../components/commons/Table';
import { Eye, FileText, Search, Loader2 } from 'lucide-react';
import { useOrder } from '../../hooks/useOrder';
import OrderDetailModal from '../../components/admin/OrderDetailModal'; 

export default function OrderList() {
  const { orders, loading, getOrders } = useOrder();
  const [currentStatus, setCurrentStatus] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  
  // State untuk kontrol Modal Detail
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);

  useEffect(() => {
    getOrders();
  }, [getOrders]);

  const headers = ["Order ID", "Customer", "Date", "Total Amount", "Status", "Actions"];

  const filteredOrders = orders.filter(order => {
    const matchesStatus = currentStatus === 'ALL' || order.status === currentStatus;
    
    const orderId = order.id ? String(order.id).toLowerCase() : "";
    // Mengakses username dari relasi User (pastikan backend mengirim include: [User])
    const username = order.User?.username ? String(order.User.username).toLowerCase() : "Guest";
    const query = searchQuery.toLowerCase();

    const matchesSearch = orderId.includes(query) || username.includes(query);
    
    return matchesStatus && matchesSearch;
  });

  const handleOpenDetail = (id) => {
    setSelectedOrderId(id);
    setIsModalOpen(true);
  };

  const renderRow = (order) => (
    <tr key={order.id} className="border-b border-zinc-50 hover:bg-zinc-50/50 transition duration-300">
      <td className="px-6 py-5 font-black text-[11px] tracking-tighter">{order.id}</td>
      <td className="px-6 py-5">
        <p className="text-[10px] font-black uppercase tracking-widest text-zinc-600">
          {order.User?.username || 'UNKNOWN'}
        </p>
        <p className="text-[9px] text-zinc-400">{order.User?.email}</p>
      </td>
      <td className="px-6 py-5 text-[10px] font-bold text-zinc-400 uppercase">
        {order.createdAt ? new Date(order.createdAt).toLocaleDateString('id-ID') : '-'}
      </td>
      <td className="px-6 py-5 text-xs font-black italic tracking-tighter">
        Rp {order.totalAmount?.toLocaleString('id-ID')}
      </td>
      <td className="px-6 py-5">
        <span className={`px-3 py-1 text-[9px] font-black uppercase tracking-widest italic border ${
          order.status === 'PAID' ? 'bg-black text-white border-black' :
          order.status === 'SHIPPED' ? 'bg-blue-600 text-white border-blue-600' :
          order.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700 border-yellow-200' :
          'bg-red-50 text-red-500 border-red-100'
        }`}>
          {order.status}
        </span>
      </td>
      <td className="px-6 py-5">
        <div className="flex space-x-3">
          <button 
            onClick={() => handleOpenDetail(order.id)}
            className="text-zinc-400 hover:text-black transition"
            title="View Details"
          >
            <Eye size={16} strokeWidth={1.5} />
          </button>
        </div>
      </td>
    </tr>
  );

  return (
    <div className="p-10 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
        <div>
          <h1 className="text-4xl font-black italic tracking-tighter uppercase leading-none">Transactions</h1>
          <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.3em] mt-3">Monitor and manage orders</p>
        </div>
        
        <div className="relative w-full md:w-72">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-300" size={14} />
          <input 
            type="text" 
            placeholder="ORDER ID / CUSTOMER..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-zinc-50 border border-zinc-200 py-3 pl-10 pr-4 text-[9px] font-black tracking-widest uppercase focus:border-black outline-none transition"
          />
        </div>
      </div>

      <div className="flex space-x-8 mb-8 border-b border-zinc-100">
        {['ALL', 'PENDING', 'PAID', 'SHIPPED', 'CANCELLED'].map((status) => (
          <button
            key={status}
            onClick={() => setCurrentStatus(status)}
            className={`pb-4 text-[10px] font-black uppercase tracking-[0.2em] transition-all relative ${
              currentStatus === status ? 'text-black' : 'text-zinc-300 hover:text-zinc-500'
            }`}
          >
            {status}
            {currentStatus === status && (
              <div className="absolute bottom-0 left-0 w-full h-0.5 bg-black animate-in slide-in-from-left duration-300"></div>
            )}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="py-20 flex justify-center items-center">
          <Loader2 className="animate-spin text-zinc-200" size={32} />
        </div>
      ) : (
        <Table 
          headers={headers} 
          data={filteredOrders} 
          renderRow={renderRow} 
        />
      )}

      {/* Modal Detail untuk Admin (Pastikan component ini ada) */}
      <OrderDetailModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        orderId={selectedOrderId}
      />
    </div>
  );
}