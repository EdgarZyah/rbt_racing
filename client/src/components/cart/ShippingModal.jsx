import { useState, useEffect } from 'react';
import { X, Truck, MapPin, Store, Loader2, CheckCircle, ArrowRight, Receipt } from 'lucide-react';
import { useShipping } from '../../hooks/useShipping';
import { useOrder } from '../../hooks/useOrder';
import { useNavigate } from 'react-router-dom';

export default function ShippingModal({ isOpen, onClose, cartItems, userAddress }) {
  const navigate = useNavigate();
  const { calculateShipping, shippingCosts, loadingCost, getShopAddress, shopAddress } = useShipping();
  const { createOrder, loading: loadingOrder } = useOrder();
  const [selectedService, setSelectedService] = useState(null);

  const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const shippingCost = selectedService ? selectedService.cost : 0;
  const grandTotal = subtotal + shippingCost;

  useEffect(() => {
    if (isOpen) getShopAddress();
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && userAddress?.districtId) {
      calculateShipping({
        destination: userAddress.districtId,
        items: cartItems.map(item => ({ id: item.id, quantity: item.quantity })),
      });
      setSelectedService(null);
    }
  }, [isOpen, userAddress]);

  const handleProceed = async () => {
    if (!selectedService) return alert("Please select a shipping service!");
    
    const orderPayload = {
      items: cartItems, 
      shippingAddress: userAddress, 
      shippingCourier: selectedService.code || selectedService.name, 
      shippingService: selectedService.service, 
      shippingCost: selectedService.cost, 
      shippingEtc: selectedService.etd 
    };

    const result = await createOrder(orderPayload);
    if (result.success) {
      navigate(`/payment`, { state: { orderId: result.data.id } });
      onClose();
    } else {
      alert(result.message || "Order creation failed.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center p-0 md:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      {/* Container Modal */}
      <div className="bg-white w-full max-w-5xl h-[95vh] md:h-[85vh] shadow-2xl flex flex-col md:flex-row overflow-hidden">
        
        {/* KIRI: DETAIL PENGIRIMAN & INVOICE */}
        <div className="w-full md:w-5/12 bg-zinc-50 border-b md:border-b-0 md:border-r border-zinc-200 flex flex-col shrink-0">
          {/* Header Mobile Only */}
          <div className="md:hidden flex justify-between items-center p-4 border-b border-zinc-200 bg-white">
            <h2 className="text-sm font-black uppercase italic tracking-tighter">Checkout Details</h2>
            <button onClick={onClose} className="p-2 bg-zinc-100 rounded-full"><X size={18} /></button>
          </div>

          <div className="p-6 md:p-8 overflow-y-auto">
            <h2 className="hidden md:block text-xl font-black italic uppercase tracking-tighter mb-6">Shipment Details</h2>
            
            <div className="space-y-6 relative">
              <div className="absolute left-3 top-8 bottom-8 w-0.5 bg-zinc-300 border-l border-dashed border-zinc-400"></div>

              {/* Origin */}
              <div className="relative pl-10">
                <div className="absolute left-0 top-1 p-1.5 bg-black text-white rounded-full shadow-md z-10">
                  <Store size={12} />
                </div>
                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">Origin</p>
                <p className="text-xs md:text-sm font-black uppercase">{shopAddress?.shopName || 'HQ'}</p>
                <p className="text-[11px] text-zinc-500 mt-1 line-clamp-1 italic">
                  {shopAddress ? `${shopAddress.city}, ${shopAddress.province}` : 'Loading...'}
                </p>
              </div>

              {/* Destination */}
              <div className="relative pl-10">
                <div className="absolute left-0 top-1 p-1.5 bg-white border border-black text-black rounded-full shadow-md z-10">
                  <MapPin size={12} />
                </div>
                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">Destination</p>
                <p className="text-xs md:text-sm font-black uppercase">{userAddress.receiverName}</p>
                <p className="text-[11px] text-zinc-500 mt-1 leading-relaxed italic">
                   {userAddress.city}
                </p>
              </div>
            </div>
          </div>

          {/* Invoice - Tetap di bawah pada desktop, menyambung pada mobile */}
          <div className="mt-auto p-6 md:p-8 bg-zinc-100/80 border-t border-zinc-200">
             <div className="flex items-center gap-2 mb-4 text-zinc-400">
                <Receipt size={14}/>
                <span className="text-[10px] font-bold uppercase tracking-widest">Order Summary</span>
             </div>
             
             <div className="space-y-2 pb-4 border-b border-zinc-200 text-xs">
                <div className="flex justify-between text-zinc-600">
                   <span>Items ({cartItems.length})</span>
                   <span className="font-bold">Rp {subtotal.toLocaleString('id-ID')}</span>
                </div>
                <div className="flex justify-between text-zinc-600">
                   <span>Shipping</span>
                   <span className="font-bold">
                     {selectedService ? `Rp ${shippingCost.toLocaleString('id-ID')}` : '-'}
                   </span>
                </div>
             </div>

             <div className="pt-4">
                <div className="flex justify-between items-end">
                   <span className="text-xs font-black uppercase">Total</span>
                   <span className="text-xl md:text-2xl font-black italic tracking-tighter text-black">
                      Rp {grandTotal.toLocaleString('id-ID')}
                   </span>
                </div>
             </div>
          </div>
        </div>

        {/* KANAN: PILIHAN KURIR */}
        <div className="w-full md:w-7/12 flex flex-col relative bg-white overflow-hidden">
          {/* Header Kurir - Desktop Only */}
          <div className="hidden md:flex p-6 border-b border-zinc-100 justify-between items-center bg-white z-10">
            <div>
               <h3 className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
                 <Truck size={16}/> Shipping Method
               </h3>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-zinc-100 rounded-full transition">
              <X size={20} />
            </button>
          </div>

          {/* List Kurir - Scrollable */}
          <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-3 bg-zinc-50/30 custom-scrollbar">
            <p className="md:hidden text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-2">Pilih Kurir:</p>
            {loadingCost ? (
              <div className="h-40 md:h-full flex flex-col items-center justify-center text-zinc-300 gap-4">
                <Loader2 className="animate-spin" size={32} />
                <span className="text-[10px] font-bold uppercase tracking-widest">Calculating rates...</span>
              </div>
            ) : shippingCosts.length > 0 ? (
              shippingCosts.map((item, idx) => {
                const isSelected = selectedService?.service === item.service && selectedService?.code === item.code;
                
                return (
                  <div 
                    key={`${item.code}-${item.service}-${idx}`}
                    onClick={() => setSelectedService(item)}
                    className={`
                      relative p-4 md:p-5 border rounded-xl cursor-pointer transition-all duration-200
                      flex justify-between items-center group
                      ${isSelected 
                        ? 'border-black bg-black text-white shadow-xl ring-2 ring-black ring-offset-2' 
                        : 'border-zinc-200 bg-white hover:border-black'}
                    `}
                  >
                    <div className="flex flex-col gap-1 pr-4">
                      <div className="flex items-center gap-2">
                         <span className={`text-[9px] font-black uppercase px-1.5 py-0.5 rounded tracking-tighter ${
                            isSelected ? 'bg-white text-black' : 'bg-zinc-100 text-zinc-600'
                         }`}>
                           {item.code?.toUpperCase()}
                         </span>
                         <span className="font-black text-xs md:text-sm uppercase tracking-tight">{item.service}</span>
                      </div>
                      <p className={`text-[10px] mt-1 ${isSelected ? 'text-zinc-400' : 'text-zinc-500'}`}>
                        Est: {item.etd || '3-5'} Days
                      </p>
                    </div>

                    <div className="text-right shrink-0">
                       <p className="font-black text-sm md:text-base italic">Rp {item.cost.toLocaleString('id-ID')}</p>
                       {isSelected && <CheckCircle size={14} className="ml-auto mt-2 text-white animate-in zoom-in"/>}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="h-40 flex flex-col items-center justify-center text-zinc-400">
                 <Truck size={32} className="mb-2 opacity-20"/>
                 <p className="text-[10px] font-bold uppercase tracking-widest">No service found.</p>
              </div>
            )}
          </div>

          {/* Action Button - Sticky Bottom */}
          <div className="p-4 md:p-6 border-t border-zinc-100 bg-white z-20">
            <button 
              onClick={handleProceed}
              disabled={!selectedService || loadingOrder}
              className="w-full bg-black text-white h-14 md:h-16 flex items-center justify-between px-6 md:px-8 hover:bg-zinc-800 transition active:scale-[0.98] disabled:opacity-50 group shadow-2xl rounded-xl"
            >
              <span className="text-xs font-black uppercase tracking-[0.2em]">
                 {loadingOrder ? 'Processing...' : 'Complete Payment'}
              </span>
              
              <div className="flex items-center gap-3">
                 {loadingOrder ? (
                   <Loader2 className="animate-spin" size={18}/>
                 ) : (
                   <>
                     <span className="text-sm font-black italic tracking-tighter border-l border-zinc-700 pl-3">
                        Rp {grandTotal.toLocaleString('id-ID')}
                     </span>
                     <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform"/>
                   </>
                 )}
              </div>
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}