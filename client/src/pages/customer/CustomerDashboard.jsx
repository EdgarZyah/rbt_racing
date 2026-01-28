// client/src/pages/customer/CustomerDashboard.jsx
import React, { useState } from 'react';
import { ShoppingBag, User, ArrowRight, MailWarning, Loader2, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import ConfirmModal from '../../components/commons/ConfirmModal';

export default function CustomerDashboard() {
  const { user, resendVerification } = useAuth();
  const [isResending, setIsResending] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);

  const handleResendLink = async () => {
    const userEmail = user?.email;
    if (!userEmail) {
      alert("Sesi tidak ditemukan. Harap login ulang.");
      return;
    }
    setIsResending(true);
    const result = await resendVerification(userEmail); 
    if (result.success) setShowInfoModal(true);
    else alert(result.message);
    setIsResending(false);
  };

  return (
    <div className="w-full mx-auto px-4 sm:px-6 py-8 lg:py-12">
      
      {/* 1. BANNER PERINGATAN VERIFIKASI */}
      {user && !user.isVerified && (
        <div className="mb-8 lg:mb-12 bg-black text-white p-4 lg:p-6 border-l-4 border-red-600 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-start sm:items-center gap-4 text-left">
            <MailWarning className="text-red-600 shrink-0" size={24} />
            <div>
              <h3 className="text-[11px] font-black uppercase tracking-[0.2em] mb-1 text-red-500">Aktivasi Diperlukan</h3>
              <p className="text-[10px] text-zinc-400 uppercase tracking-widest leading-relaxed">
                Email <strong className="text-zinc-200 break-all">{user.email}</strong> belum diverifikasi.
              </p>
            </div>
          </div>
          
          <button 
            onClick={handleResendLink}
            disabled={isResending}
            className="w-full sm:w-auto bg-white text-black px-6 py-3 text-[10px] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-zinc-200 transition-all active:scale-95 disabled:opacity-50"
          >
            {isResending ? (
              <> <Loader2 size={14} className="animate-spin" /> Transmitting... </>
            ) : (
              <> Resend Link <ArrowRight size={14} /> </>
            )}
          </button>
        </div>
      )}

      {/* 2. HEADER */}
      <div className="mb-10 lg:mb-12 text-left">
        <h1 className="text-3xl lg:text-4xl font-black italic tracking-tighter uppercase leading-none">My Account</h1>
        <p className="text-[9px] lg:text-[10px] font-bold text-zinc-400 uppercase tracking-widest mt-2">
          Welcome back, <span className="text-black">{user?.email?.split('@')[0]}</span>
        </p>
      </div>

      {/* 3. MENU DASHBOARD */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-8 mb-16">
        <Link to="/customer/orders" className="border border-zinc-100 p-6 lg:p-8 hover:bg-zinc-50 transition group flex flex-col items-start active:scale-[0.98]">
          <ShoppingBag size={24} className="mb-6 text-zinc-300 group-hover:text-black transition" />
          <h3 className="text-xs font-black uppercase tracking-widest mb-1">My Orders</h3>
          <p className="text-[10px] text-zinc-400 uppercase tracking-tight">Check your order status</p>
        </Link>
        <Link to="/customer/profile" className="border border-zinc-100 p-6 lg:p-8 hover:bg-zinc-50 transition group flex flex-col items-start active:scale-[0.98]">
          <User size={24} className="mb-6 text-zinc-300 group-hover:text-black transition" />
          <h3 className="text-xs font-black uppercase tracking-widest mb-1">Profile Identity</h3>
          <p className="text-[10px] text-zinc-400 uppercase tracking-tight">Edit your personal info</p>
        </Link>
      </div>

      <ConfirmModal
        isOpen={showInfoModal}
        onClose={() => setShowInfoModal(false)}
        title="Email Transmitted"
        message={
          <div className="text-center py-4">
            <CheckCircle size={48} className="text-green-500 mx-auto mb-4" />
            <p className="text-[10px] font-black uppercase tracking-widest leading-relaxed">
              Link Berhasil Dikirim ke <br/> <span className="text-black font-black">{user?.email}</span>
            </p>
          </div>
        }
        confirmText="Acknowledged"
        showCancel={false}
        onConfirm={() => setShowInfoModal(false)}
      />
    </div>
  );
}