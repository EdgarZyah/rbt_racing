import { useState, useEffect } from 'react';
import { X, Truck, MapPin, Store, Loader2, CheckCircle, ArrowRight, Receipt } from 'lucide-react';
import { useShipping } from '../../hooks/useShipping';
import { useOrder } from '../../hooks/useOrder';
import { useNavigate } from 'react-router-dom';

export default function ShippingModal({ isOpen, onClose, cartItems, userAddress }) {
  const navigate = useNavigate();
  
  // Hooks
  const { calculateShipping, shippingCosts, loadingCost, getShopAddress, shopAddress } = useShipping();
  const { createOrder, loading: loadingOrder } = useOrder();
  
  const [selectedService, setSelectedService] = useState(null);

  // Kalkulasi Harga
  const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const shippingCost = selectedService ? selectedService.cost : 0;
  const grandTotal = subtotal + shippingCost;

  // 1. Ambil Alamat Toko saat mount
  useEffect(() => {
    if (isOpen) getShopAddress();
  }, [isOpen]);

  // 2. Hitung Ongkir Otomatis (Saat modal terbuka & ada alamat user)
  useEffect(() => {
    if (isOpen && userAddress?.districtId) {
      calculateShipping({
        destination: userAddress.districtId,
        items: cartItems.map(item => ({ id: item.id, quantity: item.quantity })),
        // Default courier (all) handled by hook/backend
      });
      setSelectedService(null);
    }
  }, [isOpen, userAddress]);

  // --- LOGIC CHECKOUT ---
  const handleProceed = async () => {
    if (!selectedService) return alert("Please select a shipping service!");
    
    // Payload untuk Backend (Controller: createOrder)
    const orderPayload = {
      items: cartItems, 
      shippingAddress: userAddress, 
      shippingCourier: selectedService.code || selectedService.name, 
      shippingService: selectedService.service, 
      shippingCost: selectedService.cost, 
      shippingEtc: selectedService.etd 
    };

    // Eksekusi
    const result = await createOrder(orderPayload);

    if (result.success) {
      // SINKRONISASI: Kirim orderId ke Payment.jsx via state
      navigate(`/payment`, { 
        state: { 
          orderId: result.data.id // Pastikan backend mengembalikan object order di dalam properti 'data'
        } 
      });
      onClose(); // Tutup modal agar tidak menumpuk
    } else {
      alert(result.message || "Order creation failed.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-5xl h-[85vh] shadow-2xl flex flex-col md:flex-row rounded-lg overflow-hidden">
        
        {/* KIRI: DETAIL PENGIRIMAN & INVOICE */}
        <div className="w-full md:w-5/12 bg-zinc-50 border-r border-zinc-200 flex flex-col">
          <div className="p-8 border-b border-zinc-200">
            <h2 className="text-xl font-black italic uppercase tracking-tighter mb-6">Shipment Details</h2>
            
            <div className="space-y-6 relative">
              <div className="absolute left-3 top-8 bottom-8 w-0.5 bg-zinc-300 border-l border-dashed border-zinc-400"></div>

              {/* Origin */}
              <div className="relative pl-10">
                <div className="absolute left-0 top-1 p-1.5 bg-black text-white rounded-full shadow-md z-10">
                  <Store size={12} />
                </div>
                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">Origin</p>
                <p className="text-sm font-black uppercase">{shopAddress?.shopName || 'HQ'}</p>
                <p className="text-xs text-zinc-500 mt-1 line-clamp-1">
                  {shopAddress ? `${shopAddress.city}, ${shopAddress.province}` : 'Loading...'}
                </p>
              </div>

              {/* Destination */}
              <div className="relative pl-10">
                <div className="absolute left-0 top-1 p-1.5 bg-white border border-black text-black rounded-full shadow-md z-10">
                  <MapPin size={12} />
                </div>
                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">Destination</p>
                <p className="text-sm font-black uppercase">{userAddress.receiverName}</p>
                <p className="text-xs text-zinc-500 mt-1 line-clamp-2 leading-relaxed">
                   {userAddress.fullAddress}, {userAddress.city}
                </p>
              </div>
            </div>
          </div>

          {/* Invoice */}
          <div className="flex-1 p-8 flex flex-col justify-end bg-zinc-100/50">
             <div className="flex items-center gap-2 mb-4 text-zinc-400">
                <Receipt size={16}/>
                <span className="text-xs font-bold uppercase tracking-widest">Payment Summary</span>
             </div>
             
             <div className="space-y-3 pb-6 border-b border-zinc-200 text-sm">
                <div className="flex justify-between text-zinc-600">
                   <span>Item Subtotal ({cartItems.length})</span>
                   <span className="font-medium">Rp {subtotal.toLocaleString('id-ID')}</span>
                </div>
                <div className="flex justify-between text-zinc-600">
                   <span>Shipping Cost</span>
                   <span className="font-medium">
                     {selectedService ? `Rp ${shippingCost.toLocaleString('id-ID')}` : '-'}
                   </span>
                </div>
             </div>

             <div className="pt-6">
                <div className="flex justify-between items-end mb-1">
                   <span className="text-sm font-black uppercase">Total Amount</span>
                   <span className="text-2xl font-black italic tracking-tighter">
                      Rp {grandTotal.toLocaleString('id-ID')}
                   </span>
                </div>
                {selectedService && (
                   <p className="text-[10px] text-right text-zinc-400 uppercase font-bold tracking-widest">
                      via {selectedService.code?.toUpperCase()} {selectedService.service}
                   </p>
                )}
             </div>
          </div>
        </div>

        {/* KANAN: PILIHAN KURIR */}
        <div className="w-full md:w-7/12 flex flex-col relative bg-white">
          <div className="p-6 border-b border-zinc-100 flex justify-between items-center bg-white z-10">
            <div>
               <h3 className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
                 <Truck size={16}/> Select Shipping Method
               </h3>
               <p className="text-[10px] text-zinc-400 mt-1 font-bold">Sorted by Best Price</p>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-zinc-100 rounded-full transition">
              <X size={20} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar bg-zinc-50/30">
            {loadingCost ? (
              <div className="h-full flex flex-col items-center justify-center text-zinc-300 gap-4">
                <Loader2 className="animate-spin" size={40} />
                <span className="text-xs font-bold uppercase tracking-widest">Finding best rates...</span>
              </div>
            ) : shippingCosts.length > 0 ? (
              shippingCosts.map((item, idx) => {
                const isSelected = selectedService?.service === item.service && selectedService?.code === item.code;
                
                return (
                  <div 
                    key={`${item.code}-${item.service}-${idx}`}
                    onClick={() => setSelectedService(item)}
                    className={`
                      relative p-5 border rounded-lg cursor-pointer transition-all duration-200 group
                      flex justify-between items-center
                      ${isSelected 
                        ? 'border-black bg-black text-white shadow-xl scale-[1.01]' 
                        : 'border-zinc-200 bg-white hover:border-black hover:shadow-md'}
                    `}
                  >
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-3">
                         <span className={`text-[10px] font-black uppercase px-2 py-1 rounded tracking-widest ${
                            isSelected ? 'bg-white text-black' : 'bg-zinc-100 text-zinc-600'
                         }`}>
                           {item.code || item.name}
                         </span>
                         <span className="font-black text-sm uppercase">{item.service}</span>
                      </div>
                      <p className={`text-[10px] mt-1 font-medium ${isSelected ? 'text-zinc-400' : 'text-zinc-500'}`}>
                        {item.description} • Est: {item.etd || '3-5'} Days
                      </p>
                    </div>

                    <div className="text-right">
                       <p className="font-black text-base">Rp {item.cost.toLocaleString('id-ID')}</p>
                       {isSelected && <CheckCircle size={16} className="ml-auto mt-2 text-white"/>}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-zinc-400">
                 <Truck size={40} className="mb-4 opacity-20"/>
                 <p className="text-xs font-bold uppercase">No shipping services available.</p>
              </div>
            )}
          </div>

          <div className="p-6 border-t border-zinc-100 bg-white z-10">
            <button 
              onClick={handleProceed}
              disabled={!selectedService || loadingOrder}
              className="w-full bg-black text-white h-14 flex items-center justify-between px-8 hover:bg-zinc-800 transition disabled:opacity-50 disabled:cursor-not-allowed group shadow-lg rounded-sm"
            >
              <span className="text-xs font-bold uppercase tracking-[0.2em]">
                 {loadingOrder ? 'Processing...' : (selectedService ? 'Pay Now' : 'Select Service')}
              </span>
              
              <div className="flex items-center gap-3">
                 {loadingOrder ? (
                   <Loader2 className="animate-spin" size={18}/>
                 ) : (
                   <>
                     <span className="text-sm font-black italic">
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