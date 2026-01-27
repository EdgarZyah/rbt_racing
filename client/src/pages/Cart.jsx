import { Link } from 'react-router-dom';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag, Box } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function Cart() {
  const { cartItems, removeFromCart, updateQuantity } = useCart();

  // Hitung subtotal
  const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  return (
    <div className="max-w-7xl mx-auto px-6 py-16 animate-in fade-in duration-700">
      <h1 className="text-4xl font-black italic tracking-tighter uppercase mb-12 border-b border-zinc-100 pb-8">
        Your Cart <span className="text-zinc-300 ml-2">({cartItems.length})</span>
      </h1>

      {cartItems.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
          {/* Daftar Item */}
          <div className="lg:col-span-2 space-y-8">
            {cartItems.map((item) => (
              // PENTING: Gunakan cartId sebagai key
              <div key={item.cartId} className="flex flex-col sm:flex-row gap-6 pb-8 border-b border-zinc-50">
                
                {/* Image */}
                <div className="w-full sm:w-32 aspect-square bg-zinc-50 border border-zinc-100 flex-shrink-0 overflow-hidden flex items-center justify-center">
                  {item.image ? (
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  ) : (
                    <Box className="text-zinc-200" size={32} />
                  )}
                </div>
                
                <div className="flex-grow">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-sm font-black uppercase tracking-tight">{item.name}</h3>
                      <p className="text-[10px] text-zinc-400 uppercase italic font-bold mb-2">{item.category || 'Gear'}</p>
                      
                      {/* Tampilkan Varian */}
                      {item.selectedVariants && Object.keys(item.selectedVariants).length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-2">
                          {Object.entries(item.selectedVariants).map(([key, value]) => (
                            <span key={key} className="text-[9px] uppercase font-bold px-2 py-1 bg-zinc-100 text-zinc-600 border border-zinc-200">
                              {value}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Hapus menggunakan cartId */}
                    <button 
                      onClick={() => removeFromCart(item.cartId)}
                      className="text-zinc-300 hover:text-red-500 transition p-2"
                      title="Remove Item"
                    >
                      <Trash2 size={16} strokeWidth={1.5} />
                    </button>
                  </div>

                  <div className="mt-8 flex justify-between items-center">
                    
                    {/* QUANTITY INPUT */}
                    <div className="flex items-center border border-zinc-200">
                      <button 
                        onClick={() => updateQuantity(item.cartId, 'minus')}
                        disabled={item.quantity <= 1}
                        className="p-3 hover:bg-zinc-50 transition border-r border-zinc-200 text-zinc-500 disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        <Minus size={12} />
                      </button>
                      
                      <div className="w-12 text-center">
                        <span className="text-xs font-black">{item.quantity}</span>
                      </div>
                      
                      <button 
                        onClick={() => updateQuantity(item.cartId, 'plus')}
                        disabled={item.quantity >= (item.stock || 999)}
                        className="p-3 hover:bg-zinc-50 transition border-l border-zinc-200 text-zinc-500 disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        <Plus size={12} />
                      </button>
                    </div>

                    <p className="text-sm font-black tracking-tighter">
                      Rp {(item.price * item.quantity).toLocaleString('id-ID')}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Ringkasan Pesanan */}
          <div className="bg-zinc-50 p-8 h-fit border border-zinc-100 sticky top-24">
            <h2 className="text-[10px] font-black uppercase tracking-[0.3em] mb-8 border-b border-zinc-200 pb-4">Order Summary</h2>
            
            <div className="space-y-4 text-xs mb-8">
              <div className="flex justify-between text-zinc-500 italic">
                <span>Subtotal</span>
                <span>Rp {subtotal.toLocaleString('id-ID')}</span>
              </div>
              <div className="flex justify-between text-zinc-500 italic">
                <span>Shipping</span>
                <span className="uppercase text-[9px] font-bold tracking-widest text-zinc-400">Calculated later</span>
              </div>
              <div className="flex justify-between font-black pt-6 border-t border-zinc-200 text-lg tracking-tighter">
                <span>TOTAL</span>
                <span>Rp {subtotal.toLocaleString('id-ID')}</span>
              </div>
            </div>

            <Link to="/payment" className="w-full bg-black text-white py-4 flex items-center justify-center group hover:bg-zinc-800 transition duration-300 shadow-xl">
              <span className="text-xs font-bold uppercase tracking-[0.2em]">Checkout</span>
              <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
            
            <p className="text-[9px] text-center text-zinc-400 mt-6 uppercase tracking-widest flex items-center justify-center gap-2">
               Secure checkout guaranteed
            </p>
          </div>
        </div>
      ) : (
        <div className="py-32 text-center bg-zinc-50 border border-dashed border-zinc-200 flex flex-col items-center justify-center">
          <div className="p-6 bg-zinc-100 rounded-full mb-6">
             <ShoppingBag size={32} className="text-zinc-300" strokeWidth={1.5} />
          </div>
          <p className="text-zinc-400 uppercase text-xs font-bold tracking-widest mb-8">Your armory cache is empty</p>
          <Link to="/product" className="bg-black text-white px-8 py-3 text-[10px] font-black uppercase tracking-[0.2em] hover:bg-zinc-800 transition shadow-lg">
            Deploy New Gear
          </Link>
        </div>
      )}
    </div>
  );
}