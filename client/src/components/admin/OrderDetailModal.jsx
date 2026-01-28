import { useEffect, useState } from 'react';
import { 
  X, Package, MapPin, CreditCard, Calendar, 
  Loader2, Truck, Download, Save, 
  Image as ImageIcon, CheckCircle2
} from 'lucide-react';
import { useOrder } from '../../hooks/useOrder';
import ConfirmModal from '../commons/ConfirmModal';
import Notification from '../commons/Notification';

export default function OrderDetailModal({ isOpen, onClose, orderId }) {
  const { getOrderById, updateResi } = useOrder();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [resiInput, setResiInput] = useState('');
  const [submittingResi, setSubmittingResi] = useState(false);

  // State untuk Modal & Notif
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [notif, setNotif] = useState({ show: false, message: '', type: 'success' });

  useEffect(() => {
    if (isOpen && orderId) {
      setLoading(true);
      getOrderById(orderId).then((result) => {
        if (result.success) {
          setOrder(result.data);
          if (result.data.resi) setResiInput(result.data.resi);
        }
        setLoading(false);
      });
    }
  }, [isOpen, orderId, getOrderById]);

  // Handler pemicu modal konfirmasi
  const triggerConfirm = (e) => {
    e.preventDefault();
    if (!resiInput.trim()) return alert("Resi number cannot be empty");
    setIsConfirmOpen(true);
  };

  // Handler Eksekusi Simpan Resi
  const handleSaveResi = async () => {
    setIsConfirmOpen(false);
    setSubmittingResi(true);
    const result = await updateResi(orderId, resiInput);
    setSubmittingResi(false);

    if (result.success) {
      setOrder(prev => ({ ...prev, status: 'SHIPPED', resi: resiInput }));
      setNotif({ show: true, message: 'Waybill Transmitted & Status Updated', type: 'success' });
    } else {
      setNotif({ show: true, message: result.message, type: 'error' });
    }
  };

  const handleDownloadImage = async (imageUrl, fileName) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url; link.download = fileName || 'proof.webp';
      document.body.appendChild(link); link.click();
      document.body.removeChild(link);
    } catch (e) { console.error("Download failed", e); }
  };

  if (!isOpen) return null;
  const parseData = (data) => { try { return typeof data === 'string' ? JSON.parse(data) : data; } catch (e) { return {}; } };
  const BASE_URL = 'http://localhost:3000'; 

  // Variabel Helper untuk State Tombol
  const isAlreadyShipped = order?.status === 'SHIPPED';

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-0 lg:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full lg:max-w-4xl h-full lg:h-auto lg:max-h-[90vh] overflow-y-auto shadow-2xl lg:rounded-lg flex flex-col no-scrollbar">
        
        {/* HEADER */}
        <div className="p-5 lg:p-6 border-b border-zinc-100 flex justify-between items-center sticky top-0 bg-white z-20">
          <div className="text-left">
            <h2 className="text-lg lg:text-xl font-black italic uppercase tracking-tighter">Order Manifest</h2>
            <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">ID: {orderId}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-zinc-100 rounded-full transition"><X size={20} /></button>
        </div>

        {/* CONTENT */}
        <div className="p-5 lg:p-8">
          {loading ? (
            <div className="py-20 flex flex-col items-center justify-center gap-4 text-zinc-300">
              <Loader2 className="animate-spin" size={32} />
              <span className="text-[9px] font-black uppercase">Loading Manifest...</span>
            </div>
          ) : order ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              <div className="lg:col-span-2 space-y-8">
                {/* STATUS & DATE */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-zinc-50 p-4 border border-zinc-100 gap-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-white p-2 border border-zinc-200"><Calendar size={16} /></div>
                    <div className="text-left">
                      <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">Order Timestamp</p>
                      <p className="text-[10px] lg:text-xs font-black uppercase">{new Date(order.createdAt).toLocaleString('id-ID')}</p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 text-[10px] font-black uppercase tracking-widest border text-center ${
                    order.status === 'PAID' ? 'bg-black text-white border-black' : 
                    order.status === 'SHIPPED' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-zinc-400 border-zinc-200'
                  }`}>{order.status}</span>
                </div>

                {/* LOGISTICS (ADMIN ACTION) */}
                {(order.status === 'PAID' || order.status === 'SHIPPED') && (
                  <div className={`p-5 lg:p-6 rounded-sm text-left border ${isAlreadyShipped ? 'bg-zinc-50 border-zinc-100' : 'bg-blue-50 border-blue-100'}`}>
                    <h3 className={`text-xs font-black uppercase tracking-widest mb-4 flex items-center gap-2 ${isAlreadyShipped ? 'text-zinc-400' : 'text-blue-700'}`}>
                      <Truck size={16}/> Shipping Management
                    </h3>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <div className="flex-1">
                        <label className={`text-[8px] font-black uppercase tracking-[0.2em] mb-1 block ${isAlreadyShipped ? 'text-zinc-300' : 'text-blue-400'}`}>
                          Tracking Number (Resi)
                        </label>
                        <input 
                          type="text" value={resiInput} 
                          onChange={(e) => setResiInput(e.target.value)}
                          disabled={isAlreadyShipped}
                          placeholder="INPUT NO. RESI..."
                          className={`w-full p-3 text-xs font-black border rounded-sm outline-none uppercase transition-all ${
                            isAlreadyShipped 
                            ? 'bg-zinc-100 border-zinc-200 text-zinc-400 cursor-not-allowed' 
                            : 'bg-white border-blue-200 focus:border-blue-500'
                          }`}
                        />
                      </div>
                      <button 
                        onClick={triggerConfirm} 
                        disabled={submittingResi || isAlreadyShipped}
                        className={`px-6 py-4 sm:py-0 rounded-sm font-black text-[10px] uppercase tracking-widest transition flex items-center justify-center gap-2 shadow-sm ${
                          isAlreadyShipped 
                          ? 'bg-zinc-200 text-zinc-400 cursor-not-allowed' 
                          : 'bg-blue-600 text-white hover:bg-blue-700 active:translate-y-0.5'
                        }`}
                      >
                        {submittingResi ? <Loader2 className="animate-spin" size={14}/> : isAlreadyShipped ? <CheckCircle2 size={14}/> : <Save size={14}/>}
                        <span>{isAlreadyShipped ? 'DISPATCHED' : 'SUBMIT RESI'}</span>
                      </button>
                    </div>
                    {isAlreadyShipped && (
                      <p className="mt-3 text-[9px] font-bold text-zinc-400 uppercase italic">* resi has been locked after shipment</p>
                    )}
                  </div>
                )}

                {/* ITEMS TABLE */}
                <div className="text-left">
                  <h3 className="text-xs font-black uppercase tracking-widest mb-4 flex items-center gap-2"><Package size={14}/> Purchased Units</h3>
                  <div className="border border-zinc-100 overflow-x-auto no-scrollbar">
                    <div className="min-w-[400px] divide-y divide-zinc-50">
                      {order.items?.map((item) => {
                        const snapshot = parseData(item.productSnapshot);
                        return (
                          <div key={item.id} className="p-4 flex gap-4 items-center">
                            <div className="w-14 h-14 bg-zinc-50 border border-zinc-100 shrink-0 overflow-hidden">
                              {snapshot.image && <img src={`${BASE_URL}${snapshot.image}`} className="w-full h-full object-cover" alt="Thumb"/>}
                            </div>
                            <div className="flex-1">
                              <p className="text-[11px] font-black uppercase tracking-tight">{snapshot.name}</p>
                              <p className="text-[9px] font-bold text-zinc-400 uppercase italic">
                                {snapshot.variant ? Object.entries(snapshot.variant).map(([k, v]) => `${k}: ${v}`).join(' | ') : 'No Variant'}
                              </p>
                            </div>
                            <div className="text-right">
                               <p className="text-[10px] font-black uppercase">Qty: {item.quantity}</p>
                               <p className="text-[10px] font-bold text-zinc-400">@ Rp {item.priceAtPurchase?.toLocaleString('id-ID')}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* ADDRESS BOX */}
                <div className="bg-zinc-50 p-4 border border-zinc-100 text-left">
                  <h4 className="text-[9px] font-black text-zinc-300 uppercase tracking-widest mb-3 flex items-center gap-2"><MapPin size={12}/> Shipping Coordinates</h4>
                  {(() => {
                    const addr = parseData(order.shippingAddress);
                    return (
                      <div className="space-y-1">
                        <p className="text-xs font-black uppercase">{addr.receiverName}</p>
                        <p className="text-[10px] text-zinc-500 font-medium leading-relaxed uppercase">{addr.fullAddress}, {addr.city}</p>
                        <p className="text-[10px] font-black text-zinc-400 tracking-tighter">TEL: {addr.phoneNumber}</p>
                      </div>
                    );
                  })()}
                </div>
              </div>

              {/* KOLOM KANAN */}
              <div className="space-y-6">
                <div className="border border-zinc-200 p-4 text-left">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xs font-black uppercase tracking-widest flex items-center gap-2"><CreditCard size={14}/> Payment Proof</h3>
                    {order.paymentProof && (
                      <button 
                        onClick={() => handleDownloadImage(`${BASE_URL}/uploads/${order.paymentProof}`, `RBT-${orderId}.webp`)}
                        className="text-[9px] font-bold bg-zinc-100 px-2 py-1 flex items-center gap-1 hover:bg-black hover:text-white transition"
                      >
                        <Download size={10}/> SAVE
                      </button>
                    )}
                  </div>
                  {order.paymentProof ? (
                    <div className="relative group border border-zinc-100 bg-zinc-50 aspect-[3/4] overflow-hidden">
                      <img src={`${BASE_URL}/uploads/${order.paymentProof}`} alt="Proof" className="w-full h-full object-contain cursor-zoom-in active:scale-110 transition-transform duration-500" onClick={() => window.open(`${BASE_URL}/uploads/${order.paymentProof}`, '_blank')} />
                    </div>
                  ) : (
                    <div className="aspect-[3/4] bg-zinc-50 border border-dashed border-zinc-200 flex flex-col items-center justify-center text-zinc-300">
                      <ImageIcon size={24} className="mb-2 opacity-20"/>
                      <span className="text-[9px] font-black uppercase tracking-widest">No Asset Uploaded</span>
                    </div>
                  )}
                </div>

                <div className="bg-black text-white p-6 rounded-sm text-left shadow-xl">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.3em] mb-6 border-b border-zinc-800 pb-2 text-zinc-500">Economic Summary</h3>
                  <div className="space-y-3 text-[11px] mb-6">
                    <div className="flex justify-between text-zinc-400 uppercase font-bold"><span>Logistic</span><span>Rp {order.shippingCost?.toLocaleString('id-ID')}</span></div>
                    <div className="flex justify-between text-zinc-400 uppercase font-bold"><span>Subtotal</span><span>Rp {(order.totalAmount - order.shippingCost)?.toLocaleString('id-ID')}</span></div>
                  </div>
                  <div className="flex justify-between items-end border-t border-zinc-800 pt-4">
                    <span className="text-[10px] font-black uppercase text-zinc-500">Total Payable</span>
                    <span className="text-2xl font-black italic tracking-tighter">Rp {order.totalAmount?.toLocaleString('id-ID')}</span>
                  </div>
                </div>
              </div>
            </div>
          ) : <div className="text-center py-20 text-zinc-400 uppercase font-black text-xs">Access denied or data missing.</div>}
        </div>
      </div>

      {/* MODAL KONFIRMASI INPUT RESI */}
      <ConfirmModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleSaveResi}
        title="Confirm Shipment"
        message={`Are you sure the waybill number ${resiInput} is correct? This cannot be undone and mark the order as SHIPPED.`}
      />

      {/* NOTIFIKASI BERHASIL/GAGAL */}
      <Notification
        show={notif.show}
        type={notif.type}
        message={notif.message}
        onClose={() => setNotif({ ...notif, show: false })}
      />
    </div>
  );
}