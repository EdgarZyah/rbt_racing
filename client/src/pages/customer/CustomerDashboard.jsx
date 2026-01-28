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
    // Pastikan email user ada di state
    const userEmail = user?.email;

    if (!userEmail) {
      alert("Sesi tidak ditemukan. Harap login ulang.");
      return;
    }

    setIsResending(true);
    // Mengirim email user ke fungsi resendVerification di AuthContext
    const result = await resendVerification(userEmail); 
    
    if (result.success) {
      setShowInfoModal(true);
    } else {
      alert(result.message);
    }
    setIsResending(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 animate-in fade-in duration-700">
      
      {/* 1. BANNER PERINGATAN VERIFIKASI */}
      {user && !user.isVerified && (
        <div className="mb-12 bg-black text-white p-6 border-l-4 border-red-600 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <MailWarning className="text-red-600" size={24} />
            <div>
              <h3 className="text-[11px] font-black uppercase tracking-[0.2em] mb-1">Aktivasi Diperlukan</h3>
              <p className="text-[10px] text-zinc-400 uppercase tracking-widest leading-relaxed">
                Email <strong>{user.email}</strong> belum diverifikasi. Verifikasi akun untuk membuka fitur penuh.
              </p>
            </div>
          </div>
          
          <button 
            onClick={handleResendLink}
            disabled={isResending}
            className="group bg-white text-black px-6 py-3 text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-3 hover:bg-zinc-200 transition-all disabled:opacity-50"
          >
            {isResending ? (
              <> <Loader2 size={14} className="animate-spin" /> Transmitting... </>
            ) : (
              <> Resend Verification Link <ArrowRight size={14} /> </>
            )}
          </button>
        </div>
      )}

      {/* 2. HEADER */}
      <div className="mb-12">
        <h1 className="text-4xl font-black italic tracking-tighter uppercase">My Account</h1>
        <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mt-2">
          Welcome back, {user?.email?.split('@')[0]}
        </p>
      </div>

      {/* 3. MENU DASHBOARD */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
        <Link to="/customer/orders" className="border border-zinc-100 p-8 hover:bg-zinc-50 transition group">
          <ShoppingBag size={24} className="mb-6 text-zinc-300 group-hover:text-black transition" />
          <h3 className="text-xs font-black uppercase tracking-widest mb-1">Orders</h3>
          <p className="text-[10px] text-zinc-400 uppercase">Check your order status</p>
        </Link>
        <Link to="/customer/profile" className="border border-zinc-100 p-8 hover:bg-zinc-50 transition group">
          <User size={24} className="mb-6 text-zinc-300 group-hover:text-black transition" />
          <h3 className="text-xs font-black uppercase tracking-widest mb-1">Profile</h3>
          <p className="text-[10px] text-zinc-400 uppercase">Edit your personal info</p>
        </Link>
      </div>

      {/* 4. MODAL INFORMASI SUKSES */}
      <ConfirmModal
        isOpen={showInfoModal}
        onClose={() => setShowInfoModal(false)}
        title="Email Transmitted"
        message={
          <div className="text-center py-4">
            <CheckCircle size={48} className="text-green-500 mx-auto mb-4" />
            <p className="text-xs font-bold uppercase mb-2 tracking-widest">Link Berhasil Dikirim</p>
            <p className="text-[10px] text-zinc-500 uppercase leading-relaxed">
              Instruksi aktivasi baru telah dikirim ke <br /> <strong>{user?.email}</strong>. 
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