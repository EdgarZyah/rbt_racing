// client/src/pages/Payment.jsx
import React from 'react';
import { useCart } from '../context/CartContext';
import { CheckCircle, Download } from 'lucide-react';

export default function Payment() {
  const { cartItems } = useCart();
  const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  return (
    <div className="max-w-3xl mx-auto px-6 py-16 animate-in fade-in duration-700">
      <div className="bg-white border border-zinc-200 p-8 md:p-12 text-center">
        <h1 className="text-2xl font-black italic tracking-tighter uppercase mb-2">Checkout Success</h1>
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400 mb-10">Scan the QRIS code below to complete payment</p>
        
        {/* QRIS Placeholder */}
        <div className="max-w-[280px] mx-auto bg-zinc-50 p-6 border border-zinc-100 mb-8">
          <div className="aspect-square bg-white border-4 border-black flex items-center justify-center relative">
             <div className="w-full h-full bg-[url('https://upload.wikimedia.org/wikipedia/commons/d/d0/QR_code_for_mobile_English_Wikipedia.svg')] bg-contain bg-center bg-no-repeat opacity-90 p-2"></div>
          </div>
          <div className="mt-4 flex justify-between items-center text-[10px] font-black italic uppercase">
            <span>RBT_RACING_OFFICIAL</span>
            <span className="text-zinc-300">NMID: 102938475</span>
          </div>
        </div>

        <div className="border-t border-zinc-100 pt-8 mb-8 text-left">
          <div className="flex justify-between items-center mb-2">
            <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Total Amount</span>
            <span className="text-xl font-light italic tracking-tighter">Rp {subtotal.toLocaleString('id-ID')}</span>
          </div>
          <p className="text-[9px] text-zinc-400 italic font-medium">*Silakan upload bukti transfer pada menu pesanan setelah melakukan scan.</p>
        </div>

        <button className="w-full bg-black text-white py-4 text-[10px] font-bold uppercase tracking-[0.2em] flex items-center justify-center space-x-3 hover:bg-zinc-800 transition">
          <Download size={14} />
          <span>Save QR Code</span>
        </button>
      </div>
    </div>
  );
}