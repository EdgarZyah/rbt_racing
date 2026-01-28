import { useEffect, useState } from 'react';
import { X, Package, MapPin, CreditCard, User, Calendar, Image as ImageIcon, Loader2, Truck, Download, Save, ExternalLink } from 'lucide-react';
import { useOrder } from '../../hooks/useOrder';

export default function OrderDetailModal({ isOpen, onClose, orderId }) {
  const { getOrderById, updateResi } = useOrder(); // Tambahkan updateResi
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  
  // State untuk Input Resi
  const [resiInput, setResiInput] = useState('');
  const [submittingResi, setSubmittingResi] = useState(false);

  useEffect(() => {
    if (isOpen && orderId) {
      setLoading(true);
      getOrderById(orderId).then((result) => {
        if (result.success) {
          setOrder(result.data);
          // Set resi awal jika sudah ada
          if (result.data.resi) setResiInput(result.data.resi);
        } else {
          setOrder(null);
        }
        setLoading(false);
      });
    } else {
      setOrder(null);
      setResiInput('');
    }
  }, [isOpen, orderId, getOrderById]);

  // Handler Simpan Resi
  const handleSaveResi = async () => {
    if (!resiInput.trim()) return alert("Resi number cannot be empty");
    
    setSubmittingResi(true);
    const result = await updateResi(orderId, resiInput);
    setSubmittingResi(false);

    if (result.success) {
      alert("Order updated to SHIPPED successfully!");
      // Refresh data order lokal
      setOrder(prev => ({ ...prev, status: 'SHIPPED', resi: resiInput }));
    } else {
      alert("Failed: " + result.message);
    }
  };

  // Helper Download Gambar
  const handleDownloadImage = async (imageUrl, fileName) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName || 'download.webp';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Download failed", error);
    }
  };

  if (!isOpen) return null;

  const parseData = (data) => {
    try { return typeof data === 'string' ? JSON.parse(data) : data; } catch (e) { return {}; }
  };

  const BASE_URL = 'http://localhost:3000'; 

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl rounded-lg flex flex-col">
        
        {/* HEADER */}
        <div className="p-6 border-b border-zinc-100 flex justify-between items-center sticky top-0 bg-white z-10">
          <div>
            <h2 className="text-xl font-black italic uppercase tracking-tighter">Order Details</h2>
            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mt-1">ID: {orderId}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-zinc-100 rounded-full transition"><X size={20} /></button>
        </div>

        {/* CONTENT */}
        <div className="p-8">
          {loading ? (
            <div className="py-20 flex flex-col items-center justify-center gap-4 text-zinc-300">
              <Loader2 className="animate-spin" size={32} />
              <span className="text-xs font-bold uppercase tracking-widest">Loading Data...</span>
            </div>
          ) : order ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* KOLOM KIRI: INFO UTAMA */}
              <div className="lg:col-span-2 space-y-8">
                
                {/* STATUS BAR */}
                <div className="flex items-center justify-between bg-zinc-50 p-4 border border-zinc-100">
                  <div className="flex items-center gap-3">
                    <div className="bg-white p-2 border border-zinc-200"><Calendar size={16} /></div>
                    <div>
                      <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">Order Date</p>
                      <p className="text-xs font-black uppercase">{new Date(order.createdAt).toLocaleString('id-ID')}</p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 text-[10px] font-black uppercase tracking-widest border ${
                    order.status === 'PAID' ? 'bg-black text-white border-black' : 
                    order.status === 'SHIPPED' ? 'bg-blue-600 text-white border-blue-600' :
                    'bg-white text-zinc-400 border-zinc-200'
                  }`}>
                    {order.status}
                  </span>
                </div>

                {/* AREA ADMIN: INPUT RESI (Hanya muncul jika PAID atau SHIPPED) */}
                {(order.status === 'PAID' || order.status === 'SHIPPED') && (
                  <div className="bg-blue-50 border border-blue-100 p-6 rounded-lg">
                    <h3 className="text-xs font-black uppercase tracking-widest mb-4 flex items-center gap-2 text-blue-700">
                      <Truck size={16}/> Shipping Management
                    </h3>
                    <div className="flex gap-3 items-end">
                      <div className="flex-1">
                        <label className="text-[9px] font-bold text-blue-400 uppercase tracking-widest mb-1 block">Tracking Number (Resi)</label>
                        <input 
                          type="text" 
                          value={resiInput}
                          onChange={(e) => setResiInput(e.target.value)}
                          placeholder="Input JNE/JNT Resi..."
                          className="w-full p-3 text-sm font-bold border border-blue-200 rounded focus:outline-none focus:border-blue-500 uppercase"
                        />
                      </div>
                      <button 
                        onClick={handleSaveResi}
                        disabled={submittingResi}
                        className="bg-blue-600 text-white px-6 py-3 rounded font-bold text-xs uppercase tracking-widest hover:bg-blue-700 transition flex items-center gap-2 disabled:opacity-50"
                      >
                        {submittingResi ? <Loader2 className="animate-spin" size={14}/> : <Save size={14}/>}
                        {order.status === 'SHIPPED' ? 'Update' : 'Ship'}
                      </button>
                    </div>
                  </div>
                )}

                {/* ITEMS */}
                <div>
                  <h3 className="text-xs font-black uppercase tracking-widest mb-4 flex items-center gap-2"><Package size={14}/> Items</h3>
                  <div className="border border-zinc-100 divide-y divide-zinc-50">
                    {order.items?.map((item) => {
                      const snapshot = parseData(item.productSnapshot);
                      return (
                        <div key={item.id} className="p-4 flex gap-4">
                          <div className="w-16 h-16 bg-zinc-50 border border-zinc-100 flex-shrink-0">
                            {snapshot.image && <img src={`${BASE_URL}${snapshot.image}`} className="w-full h-full object-cover"/>}
                          </div>
                          <div className="flex-1">
                            <p className="text-xs font-black uppercase">{snapshot.name}</p>
                            <p className="text-[10px] text-zinc-400">Qty: {item.quantity}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* ADDRESS INFO */}
                <div className="bg-zinc-50 p-4 border border-zinc-100">
                  <h4 className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest mb-3 flex items-center gap-2"><MapPin size={12}/> Shipping Address</h4>
                  {(() => {
                    const addr = parseData(order.shippingAddress);
                    return (
                      <>
                        <p className="text-xs font-black uppercase">{addr.receiverName}</p>
                        <p className="text-[10px] text-zinc-500 mt-1">{addr.fullAddress}, {addr.city}</p>
                        <p className="text-[10px] font-bold mt-2 text-zinc-400">Phone: {addr.phoneNumber}</p>
                      </>
                    );
                  })()}
                </div>
              </div>

              {/* KOLOM KANAN */}
              <div className="space-y-8">
                
                {/* BUKTI BAYAR + DOWNLOAD */}
                <div className="border border-zinc-200 p-4">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xs font-black uppercase tracking-widest flex items-center gap-2"><CreditCard size={14}/> Payment Proof</h3>
                    {order.paymentProof && (
                      <button 
                        onClick={() => handleDownloadImage(`${BASE_URL}/uploads/${order.paymentProof}`, `proof-${orderId}.webp`)}
                        className="text-[9px] font-bold bg-zinc-100 px-2 py-1 flex items-center gap-1 hover:bg-black hover:text-white transition"
                      >
                        <Download size={10}/> Save
                      </button>
                    )}
                  </div>
                  
                  {order.paymentProof ? (
                    <div className="relative group border border-zinc-100 bg-zinc-50 aspect-[3/4]">
                      <img 
                        src={`${BASE_URL}/uploads/${order.paymentProof}`} 
                        alt="Bukti Bayar" 
                        className="w-full h-full object-contain cursor-zoom-in"
                        onClick={() => window.open(`${BASE_URL}/uploads/${order.paymentProof}`, '_blank')}
                      />
                    </div>
                  ) : (
                    <div className="aspect-video bg-zinc-50 border border-dashed border-zinc-200 flex flex-col items-center justify-center text-zinc-400">
                      <ImageIcon size={24} className="mb-2 opacity-50"/>
                      <span className="text-[9px] font-bold uppercase tracking-widest">No Proof Uploaded</span>
                    </div>
                  )}
                </div>

                {/* SUMMARY */}
                <div className="bg-zinc-900 text-white p-6">
                  <h3 className="text-xs font-black uppercase tracking-widest mb-6 border-b border-zinc-800 pb-2">Summary</h3>
                  <div className="space-y-3 text-xs mb-6">
                    <div className="flex justify-between text-zinc-400"><span>Shipping</span><span>Rp {order.shippingCost?.toLocaleString('id-ID')}</span></div>
                  </div>
                  <div className="flex justify-between items-end border-t border-zinc-800 pt-4">
                    <span className="text-xs font-bold uppercase text-zinc-400">Total</span>
                    <span className="text-xl font-black italic tracking-tighter">Rp {order.totalAmount.toLocaleString('id-ID')}</span>
                  </div>
                </div>

              </div>
            </div>
          ) : <div className="text-center py-20 text-zinc-400">Failed to load data.</div>}
        </div>
      </div>
    </div>
  );
}