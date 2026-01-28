import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag, Box, MapPin, AlertCircle, Loader2, ShieldAlert } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAddress } from '../hooks/useAddress';
import { useAuth } from '../context/AuthContext'; 
import ShippingModal from '../components/cart/ShippingModal';

export default function Cart() {
  const navigate = useNavigate();
  const { user } = useAuth(); 
  const { cartItems, removeFromCart, updateQuantity } = useCart();
  const { addresses, getAddresses, loading: loadingAddress } = useAddress();
  
  const [isShippingModalOpen, setShippingModalOpen] = useState(false);

  useEffect(() => {
    getAddresses();
  }, [getAddresses]);

  const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const mainAddress = addresses.find(addr => addr.isMain) || addresses[0];

  const handleCheckoutClick = () => {
    // 1. Validasi Verifikasi Email
    if (user && !user.isVerified) {
      alert("Akun Anda belum diverifikasi. Silakan verifikasi email Anda untuk melakukan transaksi.");
      navigate('/customer'); // Dialihkan ke dashboard untuk resend link
      return;
    }

    // 2. Validasi Alamat
    if (!mainAddress) {
      const confirmNav = confirm("No shipping address set. Go to Address Book?");
      if (confirmNav) navigate('/customer/address');
      return;
    }

    setShippingModalOpen(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-16 animate-in fade-in duration-700">
      {/* Banner Peringatan: Redirect ke Dashboard */}
      {user && !user.isVerified && (
        <div className="mb-8 bg-red-50 border border-red-200 p-4 flex items-center justify-between">
          <div className="flex items-center gap-3 text-red-600">
            <ShieldAlert size={20} />
            <p className="text-xs font-bold uppercase tracking-widest">Akun belum diverifikasi. Checkout dinonaktifkan.</p>
          </div>
          <Link to="/customer" className="text-[10px] font-black uppercase underline text-red-600 hover:text-red-800">Verifikasi Sekarang</Link>
        </div>
      )}

      <h1 className="text-4xl font-black italic tracking-tighter uppercase mb-12 border-b border-zinc-100 pb-8">
        Your Cart <span className="text-zinc-300 ml-2">({cartItems.length})</span>
      </h1>

      {cartItems.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
          <div className="lg:col-span-2 space-y-8">
            {cartItems.map((item) => (
              <div key={item.cartId} className="flex flex-col sm:flex-row gap-6 pb-8 border-b border-zinc-50">
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
                    </div>
                    <button onClick={() => removeFromCart(item.cartId)} className="text-zinc-300 hover:text-red-500 transition p-2">
                      <Trash2 size={16} strokeWidth={1.5} />
                    </button>
                  </div>
                  <div className="mt-8 flex justify-between items-center">
                    <div className="flex items-center border border-zinc-200">
                      <button onClick={() => updateQuantity(item.cartId, 'minus')} disabled={item.quantity <= 1} className="p-3 hover:bg-zinc-50 transition border-r border-zinc-200 text-zinc-500 disabled:opacity-30">
                        <Minus size={12} />
                      </button>
                      <div className="w-12 text-center"><span className="text-xs font-black">{item.quantity}</span></div>
                      <button onClick={() => updateQuantity(item.cartId, 'plus')} disabled={item.quantity >= (item.stock || 999)} className="p-3 hover:bg-zinc-50 transition border-l border-zinc-200 text-zinc-500 disabled:opacity-30">
                        <Plus size={12} />
                      </button>
                    </div>
                    <p className="text-sm font-black tracking-tighter">Rp {(item.price * item.quantity).toLocaleString('id-ID')}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-zinc-50 p-8 h-fit border border-zinc-100 sticky top-24">
            <h2 className="text-[10px] font-black uppercase tracking-[0.3em] mb-8 border-b border-zinc-200 pb-4">Order Summary</h2>
            
            <div className="mb-8">
              {loadingAddress ? (
                <div className="flex items-center gap-2 text-zinc-400 py-4">
                  <Loader2 className="animate-spin" size={16}/> <span className="text-xs">Loading address...</span>
                </div>
              ) : mainAddress ? (
                <div className="bg-white border border-zinc-200 p-4 relative group">
                  <div className="flex items-center gap-2 mb-3 text-zinc-400">
                    <MapPin size={14} />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Delivering To</span>
                  </div>
                  <p className="text-xs font-black uppercase mb-1">{mainAddress.receiverName}</p>
                  <p className="text-[10px] text-zinc-500 leading-relaxed line-clamp-2">
                    {mainAddress.fullAddress}, {mainAddress.district}, {mainAddress.city}
                  </p>
                  <Link to="/customer/address" className="absolute top-4 right-4 text-[9px] font-bold uppercase text-black hover:underline bg-zinc-100 px-2 py-1">Change</Link>
                </div>
              ) : (
                <div className="bg-red-50 border border-red-100 p-4 text-center">
                  <AlertCircle size={20} className="mx-auto text-red-400 mb-2"/>
                  <p className="text-xs font-bold text-red-500 uppercase mb-3">Shipping Address Missing</p>
                  <Link to="/customer/address" className="block w-full bg-red-500 text-white py-2 text-[10px] font-black uppercase tracking-widest hover:bg-red-600 transition">Set Address Now</Link>
                </div>
              )}
            </div>

            <div className="space-y-4 text-xs mb-8 border-t border-zinc-200 pt-6">
              <div className="flex justify-between text-zinc-500 italic">
                <span>Subtotal</span>
                <span>Rp {subtotal.toLocaleString('id-ID')}</span>
              </div>
              <div className="flex justify-between font-black pt-6 border-t border-zinc-200 text-lg tracking-tighter">
                <span>TOTAL</span>
                <span>Rp {subtotal.toLocaleString('id-ID')}</span>
              </div>
            </div>

            <button 
              onClick={handleCheckoutClick}
              disabled={!mainAddress}
              className={`w-full py-4 flex items-center justify-center group transition duration-300 shadow-xl ${user?.isVerified === false ? 'bg-zinc-300 cursor-not-allowed' : 'bg-black hover:bg-zinc-800 text-white'}`}
            >
              <span className="text-xs font-bold uppercase tracking-[0.2em]">Checkout</span>
              <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      ) : (
        <div className="py-32 text-center bg-zinc-50 border border-dashed border-zinc-200">
          <ShoppingBag size={32} className="mx-auto text-zinc-300 mb-6" strokeWidth={1.5} />
          <p className="text-zinc-400 uppercase text-xs font-bold tracking-widest mb-8">Your armory cache is empty</p>
          <Link to="/product" className="bg-black text-white px-8 py-3 text-[10px] font-black uppercase tracking-[0.2em] hover:bg-zinc-800 transition shadow-lg">Deploy New Gear</Link>
        </div>
      )}

      {mainAddress && (
        <ShippingModal 
          isOpen={isShippingModalOpen} 
          onClose={() => setShippingModalOpen(false)}
          cartItems={cartItems}
          userAddress={mainAddress} 
        />
      )}
    </div>
  );
}