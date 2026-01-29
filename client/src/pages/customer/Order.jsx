// client/src/pages/customer/Order.jsx
import React, { useState, useEffect } from 'react';
import Table from '../../components/commons/Table';
import { Eye, Loader2, CreditCard, ChevronRight, Calendar, X, Box, MapPin, Truck, Phone, User } from 'lucide-react';
import { useOrder } from '../../hooks/useOrder';
import { useNavigate } from 'react-router-dom';

export default function Order() {
  const navigate = useNavigate();
  const { orders, loading, getUserOrders } = useOrder();
  const [filter, setFilter] = useState('ALL');
  
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    getUserOrders();
  }, [getUserOrders]);

  const filteredOrders = orders.filter(o => filter === 'ALL' || o.status === filter);
  
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredOrders.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);

  const getStatusStyle = (status) => {
    switch (status) {
      case 'PAID': return 'bg-black text-white border-black';
      case 'PENDING': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'SHIPPED': return 'bg-blue-600 text-white border-blue-700';
      case 'CANCELLED': return 'bg-red-50 text-red-500 border-red-100';
      default: return 'bg-zinc-100 text-zinc-400 border-transparent';
    }
  };

  const handleOpenDetail = (order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const headers = ["Order ID", "Date", "Total", "Status", "Actions"];

  const renderRow = (order) => (
    <tr key={order.id} className="border-b border-zinc-50 hover:bg-zinc-50 transition">
      <td className="px-6 py-5 font-black text-[11px] tracking-tighter text-zinc-600 text-left">{order.id}</td>
      <td className="px-6 py-5 text-[10px] font-bold text-zinc-400 uppercase text-left">
        {new Date(order.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
      </td>
      <td className="px-6 py-5 text-xs font-black italic tracking-tighter text-left">Rp {order.totalAmount.toLocaleString('id-ID')}</td>
      <td className="px-6 py-5 text-left">
        <span className={`px-3 py-1 text-[9px] font-black uppercase tracking-widest border italic ${getStatusStyle(order.status)}`}>
          {order.status}
        </span>
      </td>
      <td className="px-6 py-5 text-left">
        <div className="flex gap-2">
          {order.status === 'PENDING' && (
            <button onClick={() => navigate('/payment', { state: { orderId: order.id } })} className="flex items-center gap-1 text-[9px] font-black bg-black text-white px-3 py-1 hover:bg-zinc-800 transition uppercase tracking-widest active:scale-95">
              <CreditCard size={10} /> PAY
            </button>
          )}
          <button onClick={() => handleOpenDetail(order)} className="text-zinc-400 hover:text-black transition p-1 active:scale-90"><Eye size={16} /></button>
        </div>
      </td>
    </tr>
  );

  if (loading) return <div className="p-12 flex justify-center"><Loader2 className="animate-spin text-zinc-300" size={32} /></div>;

  return (
    <div className="w-full mx-auto px-4 sm:px-6 py-8 lg:py-12 overflow-x-hidden">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8">
        <h1 className="text-2xl lg:text-3xl font-black italic uppercase tracking-tighter leading-none text-left">My Orders</h1>
        
        <div className="flex gap-2 overflow-x-auto pb-2 lg:pb-0 no-scrollbar max-w-full">
          {['ALL', 'PENDING', 'PAID', 'SHIPPED', 'CANCELLED'].map(f => (
            <button 
              key={f} 
              onClick={() => { setFilter(f); setCurrentPage(1); }}
              className={`text-[9px] font-black uppercase px-4 py-2 border transition shrink-0 tracking-widest active:scale-95 ${
                filter === f ? 'bg-black text-white border-black shadow-lg' : 'bg-white text-zinc-400 border-zinc-100 hover:border-black'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {orders.length > 0 ? (
        <>
          <div className="hidden lg:block overflow-x-auto border border-zinc-100">
            <Table headers={headers} data={currentItems} renderRow={renderRow} />
          </div>

          <div className="lg:hidden space-y-4 overflow-x-auto pb-4 no-scrollbar">
            <div className="min-w-full flex flex-col gap-4">
              {currentItems.map(order => (
                <div key={order.id} className="border border-zinc-100 p-5 bg-white space-y-4 shadow-sm active:scale-[0.98] transition-transform text-left min-w-[280px]">
                  <div className="flex justify-between items-start text-left">
                    <div className="text-left">
                      <p className="text-[11px] font-black tracking-tighter text-zinc-800 uppercase">{order.id}</p>
                      <div className="flex items-center gap-1 text-zinc-400 mt-1">
                        <Calendar size={10} />
                        <span className="text-[9px] font-bold uppercase">{new Date(order.createdAt).toLocaleDateString('id-ID')}</span>
                      </div>
                    </div>
                    <span className={`px-2 py-1 text-[8px] font-black uppercase tracking-widest border italic ${getStatusStyle(order.status)}`}>
                      {order.status}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-end border-t border-zinc-50 pt-4 text-left">
                    <div className="text-left">
                      <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">Grand Total</p>
                      <p className="text-sm font-black italic tracking-tighter">Rp {order.totalAmount.toLocaleString('id-ID')}</p>
                    </div>
                    <div className="flex gap-2">
                      {order.status === 'PENDING' && (
                        <button onClick={() => navigate('/payment', { state: { orderId: order.id } })} className="bg-black text-white px-4 py-2 text-[9px] font-black uppercase tracking-[0.2em] flex items-center gap-2 active:scale-95">
                          PAY <ChevronRight size={12} />
                        </button>
                      )}
                      <button onClick={() => handleOpenDetail(order)} className="border border-zinc-200 p-2 text-zinc-400 active:scale-90"><Eye size={16} /></button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-12 overflow-x-auto no-scrollbar py-2">
              <button 
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 text-[10px] font-black border border-zinc-200 disabled:opacity-30 uppercase tracking-widest"
              >
                Prev
              </button>
              <div className="flex gap-1">
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`w-8 h-8 text-[10px] font-black border transition ${
                      currentPage === i + 1 ? 'bg-black text-white border-black' : 'bg-white text-zinc-400 border-zinc-200'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
              <button 
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 text-[10px] font-black border border-zinc-200 disabled:opacity-30 uppercase tracking-widest"
              >
                Next
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-20 border border-dashed border-zinc-100 text-zinc-300 text-[10px] font-black uppercase tracking-[0.3em]">
          No Transaction history found
        </div>
      )}

      {/* DETAIL MODAL */}
      {isModalOpen && selectedOrder && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
          <div className="relative bg-white w-full max-w-2xl max-h-[90vh] flex flex-col animate-in zoom-in duration-300 shadow-2xl">
            
            <div className="sticky top-0 bg-white border-b border-zinc-100 p-6 flex justify-between items-center z-10 shrink-0">
              <div className="text-left">
                <h2 className="text-xl font-black italic uppercase tracking-tighter leading-none">{selectedOrder.id}</h2>
                <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest mt-1">Transaction Manifest</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-zinc-100 transition"><X size={20}/></button>
            </div>

            <div className="flex-grow overflow-y-auto p-6 space-y-8 no-scrollbar">
              <div className="space-y-4">
                <h3 className="text-[10px] font-black uppercase tracking-widest text-zinc-400 border-b border-zinc-50 pb-2 flex items-center gap-2">
                  <Box size={14} /> Purchased Item
                </h3>
                <div className="max-h-64 overflow-y-auto overflow-x-auto pr-2 space-y-4 no-scrollbar">
                  {selectedOrder.items?.map((item, idx) => {
                    const snapshot = JSON.parse(item.productSnapshot || '{}');
                    return (
                      <div key={idx} className="flex gap-4 items-center py-2 border-b border-zinc-50 last:border-0 min-w-[300px]">
                        <div className="w-16 h-16 bg-zinc-50 flex-shrink-0 flex items-center justify-center border border-zinc-100">
                          {snapshot.image ? (
                            <img src={snapshot.image} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <Box className="text-zinc-200" size={24} />
                          )}
                        </div>
                        <div className="flex-grow text-left">
                          <p className="text-[11px] font-black uppercase tracking-tight">{snapshot.name}</p>
                          <p className="text-[9px] font-bold text-zinc-400 uppercase italic">
                            {Object.entries(snapshot.variant || {}).map(([k, v]) => `${k}: ${v}`).join(' | ')}
                          </p>
                          <p className="text-[10px] font-black mt-1">
                            {item.quantity} x <span className="text-zinc-400 italic font-medium">Rp {item.priceAtPurchase.toLocaleString('id-ID')}</span>
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Logistics & Payment */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-zinc-50 p-6 text-left">
                <div className="space-y-3">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-zinc-400 flex items-center gap-2">
                    <Truck size={14} /> Logistics
                  </h4>
                  <p className="text-[11px] font-black uppercase">{selectedOrder.shippingService}</p>
                  <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-tight">
                    Resi: <span className="text-black">{selectedOrder.resi || 'NOT ASSIGNED'}</span>
                  </p>
                </div>
                
                {/* Updated Destination Info */}
                <div className="space-y-3">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-zinc-400 flex items-center gap-2">
                    <MapPin size={14} /> Destination
                  </h4>
                  <div className="text-[10px] text-zinc-600 space-y-1">
                    {(() => {
                      const addr = typeof selectedOrder.shippingAddress === 'string' 
                        ? JSON.parse(selectedOrder.shippingAddress) 
                        : selectedOrder.shippingAddress;
                      
                      return (
                        <>
                          <div className="flex items-center gap-1 mb-1">
                            <User size={10} className="text-black" />
                            <p className="font-black uppercase text-black">{addr?.receiverName || 'Guest'}</p>
                          </div>
                          <div className="flex items-center gap-1 mb-2">
                            <Phone size={10} className="text-black" />
                            <p className="font-bold">{addr?.phoneNumber || '-'}</p>
                          </div>
                          <p className="leading-relaxed uppercase font-medium border-t border-zinc-200 pt-2">
                            {addr?.fullAddress}
                          </p>
                          <p className="uppercase font-bold text-zinc-500">
                            {addr?.subDistrict}, {addr?.district}
                          </p>
                          <p className="uppercase font-bold text-zinc-500">
                            {addr?.city}, {addr?.province}
                          </p>
                          <p className="font-black text-black">
                            {addr?.postalCode}
                          </p>
                        </>
                      );
                    })()}
                  </div>
                </div>
              </div>

              {/* Pembungkus Rincian */}
                <div className="space-y-3 bg-zinc-50 p-6 border border-zinc-100 shadow-inner">
                  <div className="flex items-center gap-2 mb-4 border-b border-zinc-200 pb-2">
                    <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Payment Breakdown</span>
                  </div>

                  {/* 1. Subtotal */}
                  <div className="flex justify-between items-center text-[11px] font-bold uppercase tracking-tight text-zinc-500">
                    <span>Item Subtotal ({selectedOrder.items?.length} Items)</span>
                    <span>
                      Rp {(selectedOrder.totalAmount - selectedOrder.shippingCost).toLocaleString('id-ID')}
                    </span>
                  </div>

                  {/* 2. Shipping Cost */}
                  <div className="flex justify-between items-center text-[11px] font-bold uppercase tracking-tight text-zinc-500">
                    <div className="flex items-center gap-1">
                      <span>Shipping Fee</span>
                      <span className="text-[9px] bg-zinc-200 px-1 text-zinc-600 rounded">{selectedOrder.shippingService}</span>
                    </div>
                    <span>Rp {selectedOrder.shippingCost?.toLocaleString('id-ID')}</span>
                  </div>

                  {/* Garis Pemisah Tambahan */}
                  <div className="h-px bg-zinc-200 my-2 border-dashed border-t"></div>

                  {/* 3. Grand Total */}
                  <div className="flex justify-between items-end pt-2">
                    <span className="text-xs font-black uppercase tracking-tighter">Grand Total</span>
                    <span className="text-2xl font-black italic tracking-tighter text-black">
                      Rp {selectedOrder.totalAmount?.toLocaleString('id-ID')}
                    </span>
                  </div>
                </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}